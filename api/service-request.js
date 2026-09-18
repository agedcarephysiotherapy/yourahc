const rateMap = new Map();
const WINDOW = 60000;
const LIMIT = 8;
function clean(v,n=5000){return String(v??"").trim().slice(0,n)}
function emailOk(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function esc(v){return clean(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
module.exports=async(req,res)=>{
 if(req.method!=="POST") return res.status(405).json({ok:false,message:"Method not allowed."});
 const ip=clean(req.headers["x-forwarded-for"]||"unknown",100).split(",")[0]; const now=Date.now(); const e=rateMap.get(ip);
 if(!e||now-e.t>WINDOW) rateMap.set(ip,{t:now,c:1}); else {e.c++;if(e.c>LIMIT)return res.status(429).json({ok:false,message:"Too many requests. Please try again shortly."})}
 const d=req.body||{};
 if(clean(d.website)) return res.status(200).json({ok:true});
 if(Number(d.startedAt)&&now-Number(d.startedAt)<1500)return res.status(400).json({ok:false,message:"Please take a moment to complete the form."});
 const service=clean(d.service,100),name=clean(d.name,160),phone=clean(d.phone,60),email=clean(d.email,254),funding=clean(d.funding,80),message=clean(d.message,5000);
 if(!["Physiotherapy","Occupational Therapy"].includes(service)||!name||!phone||!funding||!["NDIS","Support at Home (SAH)","Private"].includes(funding)||d.consent!==true||d.consent==="false")return res.status(400).json({ok:false,message:"Please complete the required fields."});
 if(email&&!emailOk(email))return res.status(400).json({ok:false,message:"Please enter a valid email address."});
 const key=process.env.BREVO_API_KEY, to=process.env.YAHC_FORM_RECIPIENT||"contact@acphysio.com.au", sender=process.env.BREVO_SENDER_EMAIL||"contact@acphysio.com.au";
 if(!key)return res.status(500).json({ok:false,message:"The form is not configured yet. Please call us directly."});
 const html=`<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><h2 style="color:#176b63">New Your AHC service request</h2><table style="border-collapse:collapse;width:100%"><tr><td><b>Service</b></td><td>${esc(service)}</td></tr><tr><td><b>Name</b></td><td>${esc(name)}</td></tr><tr><td><b>Phone</b></td><td>${esc(phone)}</td></tr><tr><td><b>Email</b></td><td>${esc(email)||"Not provided"}</td></tr><tr><td><b>Funding</b></td><td>${esc(funding)}</td></tr><tr><td><b>Message</b></td><td>${esc(message)||"None"}</td></tr></table><p>Submitted through the Your AHC QR/service request page.</p></div>`;
 try{
  const r=await fetch("https://api.brevo.com/v3/smtp/email",{method:"POST",headers:{"api-key":key,"accept":"application/json","content-type":"application/json"},body:JSON.stringify({sender:{email:sender,name:"Your AHC"},to:[{email:to}],replyTo:email&&emailOk(email)?{email}:undefined,subject:"Your AHC Service Request – "+service,htmlContent:html,tags:["yourahc-website","service-request"]})});
  if(!r.ok)throw new Error(await r.text());
  return res.status(200).json({ok:true,message:"Thank you. Your request has been sent. Our team will contact you shortly."});
 }catch(err){console.error(err);return res.status(500).json({ok:false,message:"We could not send your request right now. Please call or email us directly."})}
};