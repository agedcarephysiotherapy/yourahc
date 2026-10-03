// Sends email notifications for YOUR AHC website form submissions:
//  1. an alert with the full submission to the team (NOTIFY_TO)
//  2. a short confirmation to the submitter, when they gave an email address
// Called by the website after the main form endpoint has accepted the submission.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const NOTIFY_TO = ["ashutoshporwal@gmail.com"];
const FROM_NAME = "YOUR Allied Health Care";
// Each provider sends from the domain authenticated in that account.
const FROM_BREVO = "support@yourahc.com.au";
const FROM_RESEND = "contact@acphysio.com.au";
const REPLY_TO = "support@yourahc.com.au";
const ALLOWED_ORIGINS = ["https://yourahc.com.au", "https://www.yourahc.com.au"];

const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;
const rate = new Map<string, { t: number; c: number }>();

const clean = (v: unknown, n = 5000) => String(v ?? "").trim().slice(0, n);
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function cors(origin: string | null) {
  const allow = origin && (ALLOWED_ORIGINS.includes(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin))
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, accept",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
  };
}

// Brevo is used when a Brevo key is configured; otherwise Resend.
// Keys come from function secrets (BREVO_API_KEY / RESEND_API_KEY) or Vault (brevo_api_key / resend_api_key).
async function secret(envName: string, vaultName: string): Promise<string | null> {
  const fromEnv = Deno.env.get(envName);
  if (fromEnv) return fromEnv;
  const url = Deno.env.get("SUPABASE_URL"), service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !service) return null;
  const r = await fetch(`${url}/rest/v1/rpc/get_form_notify_secret`, {
    method: "POST",
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" },
    body: JSON.stringify({ secret_name: vaultName }),
  });
  if (!r.ok) return null;
  const v = await r.json();
  return typeof v === "string" && v ? v : null;
}

type Mail = { to: string[]; subject: string; html: string; replyTo?: string; tags: string[] };
type Sender = (m: Mail) => Promise<void>;

async function mailer(): Promise<{ provider: string; send: Sender } | null> {
  const brevo = await secret("BREVO_API_KEY", "brevo_api_key");
  if (brevo) {
    return {
      provider: "brevo",
      send: async (m) => {
        const r = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "api-key": brevo, accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: { name: FROM_NAME, email: FROM_BREVO },
            to: m.to.map((email) => ({ email })),
            replyTo: m.replyTo ? { email: m.replyTo } : undefined,
            subject: m.subject, htmlContent: m.html, tags: m.tags,
          }),
        });
        if (!r.ok) throw new Error(`Brevo ${r.status}: ${await r.text()}`);
      },
    };
  }
  const resend = await secret("RESEND_API_KEY", "resend_api_key");
  if (resend) {
    return {
      provider: "resend",
      send: async (m) => {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: `${FROM_NAME} <${FROM_RESEND}>`, to: m.to, reply_to: m.replyTo,
            subject: m.subject, html: m.html, tags: m.tags.map((value, i) => ({ name: `t${i}`, value })),
          }),
        });
        if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
      },
    };
  }
  return null;
}

const shell = (title: string, body: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#1f2d2b"><h2 style="color:#176b63">${title}</h2>${body}<p style="color:#6b7a78;font-size:13px;margin-top:28px">YOUR Allied Health Care · Melbourne · ${REPLY_TO}</p></div>`;

const table = (rows: [string, string][]) =>
  `<table style="border-collapse:collapse;width:100%">${
    rows.map(([k, v]) =>
      `<tr><td style="padding:6px 10px;border-bottom:1px solid #e3ecea;font-weight:bold;vertical-align:top;width:170px">${esc(k)}</td><td style="padding:6px 10px;border-bottom:1px solid #e3ecea;white-space:pre-wrap">${esc(v) || "—"}</td></tr>`
    ).join("")
  }</table>`;

Deno.serve(async (req) => {
  const headers = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
  if (req.method !== "POST") return reply(405, { ok: false, message: "Method not allowed." });

  const ip = clean(req.headers.get("x-forwarded-for") || "unknown", 100).split(",")[0];
  const now = Date.now(), e = rate.get(ip);
  if (!e || now - e.t > WINDOW) rate.set(ip, { t: now, c: 1 });
  else if (++e.c > LIMIT) return reply(429, { ok: false, message: "Too many requests." });

  let d: Record<string, unknown>;
  try { d = await req.json(); } catch { return reply(400, { ok: false, message: "Invalid request." }); }
  if (clean(d.website)) return reply(200, { ok: true });

  const form = clean(d.form, 40);
  const name = clean(d.name, 120), email = clean(d.email, 254), phone = clean(d.phone, 60), message = clean(d.message, 5000);
  if (!name || !phone) return reply(400, { ok: false, message: "Missing required fields." });
  if (email && !emailOk(email)) return reply(400, { ok: false, message: "Invalid email." });

  let subject: string, heading: string, rows: [string, string][], what: string;
  if (form === "service-request") {
    const service = clean(d.service, 100), funding = clean(d.funding, 80);
    if (!["Physiotherapy", "Occupational Therapy"].includes(service)) return reply(400, { ok: false, message: "Invalid service." });
    subject = `New service request – ${service} – ${name}`;
    heading = "New YOUR AHC service request";
    rows = [["Service", service], ["Name", name], ["Phone", phone], ["Email", email], ["Funding", funding], ["Message", message]];
    what = `your ${service} service request`;
  } else if (form === "interest") {
    const services = (Array.isArray(d.services) ? d.services : []).map((s) => clean(s, 60))
      .filter((s) => ["Physiotherapy", "Occupational Therapy"].includes(s));
    if (!services.length) return reply(400, { ok: false, message: "Invalid services." });
    const suburb = clean(d.suburbPostcode, 120), codes = clean(d.codes, 80);
    subject = `New interest registration – ${name}`;
    heading = "New YOUR AHC interest registration";
    rows = [["Services", services.join(", ")], ["Name", name], ["Phone", phone], ["Email", email], ["Suburb / Postcode", suburb], ["Codes issued", codes], ["Message", message]];
    what = "your registration of interest";
  } else {
    return reply(400, { ok: false, message: "Unknown form." });
  }

  const mail = await mailer();
  if (!mail) { console.error("No email provider key configured"); return reply(500, { ok: false, message: "Notifications not configured." }); }

  const submitted = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
  const results = await Promise.allSettled([
    mail.send({
      to: NOTIFY_TO, subject, replyTo: email || undefined,
      html: shell(heading, table([...rows, ["Submitted", submitted]])),
      tags: ["yourahc-website", form],
    }),
    // Deliberately excludes the free-text message so this endpoint can't be used to relay arbitrary content.
    email ? mail.send({
      to: [email], replyTo: REPLY_TO,
      subject: "We've received your request – YOUR Allied Health Care",
      html: shell(`Thank you, ${esc(name.split(/\s+/)[0])}`,
        `<p>We've received ${esc(what)}. A member of our team will be in touch shortly on the phone number you provided.</p><p>If you need to reach us sooner, call <a href="tel:0450832833">0450 832 833</a> or reply to this email.</p><p>Kind regards,<br>YOUR Allied Health Care</p>`),
      tags: ["yourahc-website", `${form}-confirmation`],
    }) : Promise.resolve(),
  ]);
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  failed.forEach((f) => console.error(f.reason));
  if (results[0].status === "rejected") return reply(502, { ok: false, message: "Notification failed." });
  return reply(200, { ok: true, provider: mail.provider, confirmationSent: Boolean(email) && results[1].status === "fulfilled" });
});
