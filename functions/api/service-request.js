export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = { "content-type": "application/json; charset=utf-8" };
  try {
    const d = await request.json();
    const clean = (v,n=5000) => String(v ?? "").trim().slice(0,n);
    const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const esc = v => clean(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    if (clean(d.website)) return new Response(JSON.stringify({ok:true}),{status:200,headers});
    if (Number(d.startedAt) && Date.now()-Number(d.startedAt)<1500) return new Response(JSON.stringify({ok:false,message:"Please take a moment to complete the form."}),{status:400,headers});
    const service=clean(d.service,100),name=clean(d.name,160),phone=clean(d.phone,60),email=clean(d.email,254),funding=clean(d.funding,80),message=clean(d.message,5000);
    if (!["Physiotherapy","Occupational Therapy"].includes(service)||!name||!phone||!funding||!["NDIS","Support at Home (SAH)","Private"].includes(funding)||d.consent!==true) return new Response(JSON.stringify({ok:false,message:"Please complete the required fields."}),{status:400,headers});
    if (email && !emailOk(email)) return new Response(JSON.stringify({ok:false,message:"Please enter a valid email address."}),{status:400,headers});
    const key=env.BREVO_API_KEY, to=env.YAHC_FORM_RECIPIENT||"contact@acphysio.com.au", sender=env.BREVO_SENDER_EMAIL||"contact@acphysio.com.au";
    if(!key) return new Response(JSON.stringify({ok:false,message:"The form is not configured yet. Please call us directly."}),{status:500,headers});
    const html=`<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><h2 style="color:#176b63">New Your AHC service request</h2><p><b>Service:</b> ${esc(service)}</p><p><b>Name:</b> ${esc(name)}</p><p><b>Phone:</b> ${esc(phone)}</p><p><b>Email:</b> ${esc(email)||"Not provided"}</p><p><b>Funding:</b> ${esc(funding)}</p><p><b>Message:</b> ${esc(message)||"None"}</p><p>Submitted through the Your AHC service request page.</p></div>`;
    const brevo=await fetch("https://api.brevo.com/v3/smtp/email",{method:"POST",headers:{"api-key":key,"accept":"application/json","content-type":"application/json"},body:JSON.stringify({sender:{email:sender,name:"Your AHC"},to:[{email:to}],replyTo:email&&emailOk(email)?{email}:undefined,subject:"Your AHC Service Request – "+service,htmlContent:html,tags:["yourahc-website","service-request"]})});
    if(!brevo.ok){console.error("Brevo error",await brevo.text());return new Response(JSON.stringify({ok:false,message:"We could not send your request right now. Please call or email us directly."}),{status:500,headers});}
    return new Response(JSON.stringify({ok:true,message:"Thank you. Your request has been sent. Our team will contact you shortly."}),{status:200,headers});
  } catch(err){ console.error("Service request error",err); return new Response(JSON.stringify({ok:false,message:"We could not process your request. Please try again."}),{status:500,headers}); }
}