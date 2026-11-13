const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;
const DATA_FILE = path.join(__dirname, "data", "jobs.json");
const QUEUE_FILE = path.join(__dirname, "data", "review-queue.json");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const FEEDS = (process.env.OFFICIAL_RSS_FEEDS || "").split(";").map(x=>x.trim()).filter(Boolean);

if (!ADMIN_PASSWORD || !SESSION_SECRET) {
  console.warn("Set ADMIN_PASSWORD and SESSION_SECRET in your hosting environment before using the admin panel.");
}
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({limit:"200kb"}));
app.use("/api/", rateLimit({windowMs: 15*60*1000, max: 300, standardHeaders:true, legacyHeaders:false}));
const loginLimiter=rateLimit({windowMs:15*60*1000,max:8,standardHeaders:true,legacyHeaders:false,message:{error:"Too many login attempts. Try again later."}});
app.use(express.static(path.join(__dirname,"public")));

function readJobs() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE,"utf8")); }
  catch { return []; }
}
function writeJobs(jobs) {
  fs.mkdirSync(path.dirname(DATA_FILE),{recursive:true});
  const tmp=DATA_FILE+".tmp"; fs.writeFileSync(tmp,JSON.stringify(jobs,null,2)); fs.renameSync(tmp,DATA_FILE);
}
function safeEqual(a,b) {
  const x=Buffer.from(String(a)), y=Buffer.from(String(b));
  return x.length===y.length && crypto.timingSafeEqual(x,y);
}
function sign(value) {
  return crypto.createHmac("sha256",SESSION_SECRET || "missing-secret").update(value).digest("hex");
}
function requireAdmin(req,res,next) {
  const token=(req.headers.authorization||"").replace(/^Bearer /,"");
  if(!token) return res.status(401).json({error:"Admin login required"});
  const parts=token.split(".");
  if(parts.length!==2 || !safeEqual(parts[1],sign(parts[0]))) return res.status(401).json({error:"Session expired. Sign in again."});
  try {
    const payload=JSON.parse(Buffer.from(parts[0],"base64url").toString());
    if(payload.exp<Date.now()) return res.status(401).json({error:"Session expired. Sign in again."});
  } catch { return res.status(401).json({error:"Invalid session"}); }
  next();
}
app.get("/api/health",(req,res)=>res.json({ok:true,service:"Sarkari Job Universe"}));
app.get("/robots.txt",(req,res)=>{res.type("text/plain").send("User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /api/\nSitemap: "+(process.env.SITE_URL||`${req.protocol}://${req.get("host")}`)+"/sitemap.xml\n");});
app.get("/sitemap.xml",(req,res)=>{const base=(process.env.SITE_URL||`${req.protocol}://${req.get("host")}`).replace(/\/$/,"");res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url><url><loc>${base}/mock-test.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url></urlset>`);});
app.get("/api/jobs",(req,res)=>{
  const jobs=readJobs().filter(j=>j.status==="published");
  res.json({jobs,updatedAt:new Date().toISOString()});
});
app.post("/api/admin/login",loginLimiter,(req,res)=>{
  if(!ADMIN_PASSWORD || !SESSION_SECRET) return res.status(503).json({error:"Admin is not configured. Set ADMIN_PASSWORD and SESSION_SECRET."});
  if(!safeEqual(req.body.password||"",ADMIN_PASSWORD)) return res.status(401).json({error:"Incorrect password"});
  const payload=Buffer.from(JSON.stringify({exp:Date.now()+8*60*60*1000})).toString("base64url");
  res.json({token:payload+"."+sign(payload),expiresIn:28800});
});
app.get("/api/admin/jobs",requireAdmin,(req,res)=>res.json({jobs:readJobs()}));
app.post("/api/admin/jobs",requireAdmin,(req,res)=>{
  const j=validateJob(req.body);
  if(j.error) return res.status(400).json({error:j.error});
  const jobs=readJobs(); jobs.unshift({...j.value,id:crypto.randomUUID(),createdAt:new Date().toISOString()});
  writeJobs(jobs); res.status(201).json({job:jobs[0]});
});
app.put("/api/admin/jobs/:id",requireAdmin,(req,res)=>{
  const j=validateJob(req.body); if(j.error) return res.status(400).json({error:j.error});
  const jobs=readJobs(), i=jobs.findIndex(x=>x.id===req.params.id);
  if(i<0) return res.status(404).json({error:"Job not found"});
  jobs[i]={...jobs[i],...j.value,updatedAt:new Date().toISOString()}; writeJobs(jobs); res.json({job:jobs[i]});
});
app.delete("/api/admin/jobs/:id",requireAdmin,(req,res)=>{
  const jobs=readJobs(), next=jobs.filter(x=>x.id!==req.params.id);
  if(next.length===jobs.length) return res.status(404).json({error:"Job not found"});
  writeJobs(next); res.json({ok:true});
});
function validateJob(b) {
  const title=String(b.title||"").trim(), organization=String(b.organization||"").trim();
  const url=String(b.officialUrl||"").trim();
  if(!title||!organization) return {error:"Title and organization are required"};
  try { const u=new URL(url); if(!["https:","http:"].includes(u.protocol)) throw 0; }
  catch { return {error:"Enter a valid official notification URL"}; }
  const allowed=["India","Jammu & Kashmir"];
  return {value:{
    title:title.slice(0,160),organization:organization.slice(0,120),
    category:String(b.category||"Other").slice(0,50),
    region:allowed.includes(b.region)?b.region:"India",
    notificationNo:String(b.notificationNo||"").slice(0,80), ageLimit:String(b.ageLimit||"See notification").slice(0,80), applicationFee:String(b.applicationFee||"See notification").slice(0,80), applyUrl:String(b.applyUrl||"").slice(0,500),
    qualification:String(b.qualification||"See notification").slice(0,100),
    vacancies:String(b.vacancies||"Not specified").slice(0,40),
    lastDate:String(b.lastDate||"").slice(0,30),
    examDate:String(b.examDate||"").slice(0,30),
    status:["published","draft"].includes(b.status)?b.status:"published",
    type:["Job","Admit Card","Result","Answer Key","Exam Date","Syllabus"].includes(b.type)?b.type:"Job",
    officialUrl:url.slice(0,500),description:String(b.description||"").slice(0,1200)
  }};
}
const seed=[
 {id:"sample-ssc-gd",title:"SSC Constable (GD) — check latest notice",organization:"Staff Selection Commission",category:"SSC",region:"India",qualification:"See official notification",vacancies:"As notified",lastDate:"Check official site",examDate:"To be announced",status:"published",type:"Job",officialUrl:"https://ssc.gov.in/",description:"Reference listing only. Check SSC for the current recruitment notice, eligibility, dates and application status."},
 {id:"sample-ssc",title:"SSC recruitment updates",organization:"Staff Selection Commission",category:"SSC",region:"India",qualification:"Varies by post",vacancies:"As notified",lastDate:"Check official site",examDate:"See exam calendar",status:"published",type:"Exam Date",officialUrl:"https://ssc.gov.in/",description:"Official SSC portal for CGL, CHSL, MTS, GD, CPO, Selection Post and other updates."},
 {id:"sample-jkssb",title:"JKSSB recruitment updates",organization:"Jammu & Kashmir Services Selection Board",category:"JKSSB",region:"Jammu & Kashmir",qualification:"Varies by post",vacancies:"As notified",lastDate:"Check official site",examDate:"Check notices",status:"published",type:"Job",officialUrl:"https://jkssb.nic.in/",description:"Reference listing only. Verify advertisement number, domicile rules, eligibility and dates on the JKSSB website."},
 {id:"sample-upsc",title:"UPSC recruitment and examination updates",organization:"Union Public Service Commission",category:"UPSC",region:"India",qualification:"Varies by examination",vacancies:"As notified",lastDate:"Check official site",examDate:"See calendar",status:"published",type:"Job",officialUrl:"https://upsc.gov.in/",description:"Official UPSC notifications, examination calendar, admit cards and results."},
 {id:"sample-railway",title:"Railway Recruitment Board updates",organization:"Railway Recruitment Boards",category:"Railway",region:"India",qualification:"Varies by post",vacancies:"As notified",lastDate:"Check official site",examDate:"Check regional RRB",status:"published",type:"Job",officialUrl:"https://www.rrbcdg.gov.in/",description:"Use the relevant RRB regional website for the official CEN, application, city intimation and result."},
 {id:"sample-ibps",title:"IBPS banking recruitment updates",organization:"Institute of Banking Personnel Selection",category:"Banking",region:"India",qualification:"Varies by post",vacancies:"As notified",lastDate:"Check official site",examDate:"See calendar",status:"published",type:"Job",officialUrl:"https://www.ibps.in/",description:"Official bank recruitment notifications, exam calendar, call letters and results."},
 {id:"sample-indianarmy",title:"Indian Army recruitment updates",organization:"Indian Army",category:"Defence",region:"India",qualification:"Varies by entry",vacancies:"As notified",lastDate:"Check official site",examDate:"Check official notice",status:"published",type:"Job",officialUrl:"https://joinindianarmy.nic.in/",description:"Official recruitment portal. Review age, eligibility, selection and medical standards in each notice."},
 {id:"sample-ncs",title:"National Career Service government opportunities",organization:"National Career Service",category:"Other",region:"India",qualification:"Varies by post",vacancies:"Varies",lastDate:"See listing",examDate:"Not applicable",status:"published",type:"Job",officialUrl:"https://www.ncs.gov.in/",description:"Government career and employment services portal."}
];
if(!fs.existsSync(DATA_FILE)) writeJobs(seed);

function readJson(file, fallback=[]) { try { return JSON.parse(fs.readFileSync(file,"utf8")); } catch { return fallback; } }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const tmp=file+".tmp"; fs.writeFileSync(tmp,JSON.stringify(value,null,2)); fs.renameSync(tmp,file);
}
function stripHtml(s){return String(s||"").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g," ").trim();}
function tag(xml,name){const m=xml.match(new RegExp("<"+name+"(?:\\s[^>]*)?>([\\s\\S]*?)</"+name+">","i"));return m?stripHtml(m[1]):"";}
async function checkOfficialFeeds(){
  if(!FEEDS.length) return {checked:0,added:0,message:"No official RSS feeds configured. Add verified RSS URLs in OFFICIAL_RSS_FEEDS."};
  let queue=readJson(QUEUE_FILE,[]), added=0, checked=0;
  for(const feedUrl of FEEDS){
    try{
      const u=new URL(feedUrl); if(!["https:","http:"].includes(u.protocol)) continue;
      const response=await fetch(u,{headers:{"User-Agent":"SarkariJobUniverseBot/1.0 (official notice monitor)"},signal:AbortSignal.timeout(12000)});
      if(!response.ok) continue;
      const xml=await response.text(); checked++;
      const items=[...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map(x=>x[0]).slice(0,30);
      for(const item of items){
        const title=tag(item,"title");
        const link=tag(item,"link") || ((item.match(/<link[^>]+href=["']([^"']+)/i)||[])[1]||"");
        const desc=tag(item,"description")||tag(item,"summary")||tag(item,"content");
        if(!title||!link) continue;
        let parsed; try{parsed=new URL(link,u.href)}catch{continue}
        if(!["https:","http:"].includes(parsed.protocol)) continue;
        const id=crypto.createHash("sha256").update(parsed.href).digest("hex").slice(0,20);
        if(queue.some(x=>x.id===id)||readJobs().some(x=>x.sourceUrl===parsed.href)) continue;
        queue.unshift({id,title:title.slice(0,160),organization:u.hostname,category:"Other",region:"India",type:/admit|call letter/i.test(title)?"Admit Card":/result/i.test(title)?"Result":/answer key/i.test(title)?"Answer Key":"Job",status:"pending",officialUrl:parsed.href,description:desc.slice(0,1000),sourceUrl:parsed.href,foundAt:new Date().toISOString(),sourceFeed:u.href});
        added++;
      }
    }catch(e){console.warn("Feed check failed:",feedUrl,e.message);}
  }
  writeJson(QUEUE_FILE,queue);
  return {checked,added,message:"New feed items are waiting for admin verification; nothing is auto-published."};
}
app.get("/api/automation/status",(req,res)=>res.json({enabled:FEEDS.length>0,feedsConfigured:FEEDS.length,lastRun:readJson(path.join(__dirname,"data","automation.json"),{}).lastRun||null,nextRun:FEEDS.length? "Within 24 hours":"Not scheduled",note:FEEDS.length?"Feed discoveries require admin review before publishing.":"Configure OFFICIAL_RSS_FEEDS with verified official RSS/Atom feed URLs."}));
app.get("/api/daily-question",(req,res)=>{
  const questions=[
    {q:"Which gas is most abundant in Earth's atmosphere?",options:["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],answer:1,explanation:"Nitrogen makes up about 78% of dry air."},
    {q:"What is the SI unit of force?",options:["Joule","Watt","Newton","Pascal"],answer:2,explanation:"Force is measured in newtons (N)."},
    {q:"Which part of a cell contains most of its genetic material?",options:["Cell wall","Nucleus","Cytoplasm","Ribosome"],answer:1,explanation:"The nucleus contains most of a eukaryotic cell's DNA."},
    {q:"Who appoints the Prime Minister of India?",options:["Chief Justice","President","Lok Sabha Speaker","Governor"],answer:1,explanation:"The President appoints the Prime Minister under the Constitution."},
    {q:"What is the capital of Jammu and Kashmir during the winter secretariat?",options:["Srinagar","Jammu","Leh","Kargil"],answer:1,explanation:"Jammu is the winter capital/seat of the seasonal secretariat."}
  ];
  const day=Math.floor(Date.now()/86400000); res.json({...questions[day%questions.length],date:new Date().toISOString().slice(0,10)});
});
app.post("/api/mock-test",async(req,res)=>{
  const topic=String(req.body.topic||"General Knowledge").slice(0,100);
  const exam=String(req.body.exam||"SSC GD").slice(0,80);
  const difficulty=["Easy","Medium","Hard"].includes(req.body.difficulty)?req.body.difficulty:"Medium";
  const count=Math.max(5,Math.min(20,Number(req.body.count)||10));
  if(OPENAI_API_KEY){
    try{
      const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:OPENAI_MODEL,temperature:0.4,response_format:{type:"json_object"},messages:[{role:"system",content:"Create accurate educational multiple-choice practice questions. Return JSON only: {questions:[{question,options:[four strings],answerIndex:0,explanation}]}. Exactly requested count. One correct answer. Do not invent current affairs."},{role:"user",content:`Create ${count} ${difficulty} difficulty ${exam} practice MCQs on ${topic}. Include concise explanations. Use English.`}]})});
      const d=await r.json(); if(!r.ok) throw Error(d.error?.message||"AI request failed");
      const parsed=JSON.parse(d.choices[0].message.content);
      if(!Array.isArray(parsed.questions)||parsed.questions.length<count) throw Error("AI returned an incomplete test");
      return res.json({source:"AI-generated",topic,exam,difficulty,questions:parsed.questions.slice(0,count).map(q=>({question:String(q.question),options:q.options.slice(0,4).map(String),answerIndex:Math.max(0,Math.min(3,Number(q.answerIndex)||0)),explanation:String(q.explanation||"")}))});
    }catch(e){console.error("AI mock test fallback:",e.message);}
  }
  const bank=[
    ["Which is the largest planet in our Solar System?",["Earth","Jupiter","Saturn","Mars"],1,"Jupiter is the largest planet."],
    ["What is the chemical symbol for Sodium?",["So","S","Na","N"],2,"Na comes from the Latin name natrium."],
    ["Which Article of the Indian Constitution deals with equality before law?",["Article 14","Article 19","Article 21","Article 32"],0,"Article 14 guarantees equality before law and equal protection of laws."],
    ["Who is known as the Father of the Indian Constitution?",["Mahatma Gandhi","B. R. Ambedkar","Jawaharlal Nehru","Sardar Patel"],1,"Dr. B. R. Ambedkar chaired the Drafting Committee."],
    ["What is 15% of 200?",["20","25","30","35"],2,"200 × 15/100 = 30."],
    ["Choose the correctly spelled word.",["Accomodation","Accommodation","Acommodation","Accommadation"],1,"Accommodation has double c and double m."],
    ["Which blood cells help fight infection?",["Red blood cells","White blood cells","Platelets","Plasma"],1,"White blood cells are part of the immune system."],
    ["The SI unit of electric current is:",["Volt","Ohm","Ampere","Watt"],2,"Electric current is measured in amperes."],
    ["Which river is often called the Dakshin Ganga?",["Narmada","Godavari","Krishna","Kaveri"],1,"The Godavari is also called the Dakshin Ganga."],
    ["A train travels 120 km in 2 hours. Its average speed is:",["40 km/h","50 km/h","60 km/h","80 km/h"],2,"Speed = distance ÷ time = 120 ÷ 2 = 60 km/h."]
  ];
  const offset=Math.floor(Math.random()*bank.length),questions=Array.from({length:count},(_,i)=>{const q=bank[(offset+i)%bank.length];return {question:q[0],options:q[1],answerIndex:q[2],explanation:q[3]};});
  res.json({source:"Built-in practice bank",topic,exam,difficulty,questions,note:OPENAI_API_KEY?"AI temporarily unavailable; using built-in questions.":"Add OPENAI_API_KEY on Render for topic-specific AI-generated tests."});
});
app.post("/api/study-assistant",async(req,res)=>{
  const question=String(req.body.question||"").trim().slice(0,2500);
  if(!question)return res.status(400).json({error:"Enter a study question."});
  if(OPENAI_API_KEY){
    try{
      const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:OPENAI_MODEL,temperature:0.3,messages:[{role:"system",content:"You are a careful Indian competitive-exam study tutor. Explain clearly for a student, use simple English or Hindi according to the question, show steps for calculations, distinguish stable facts from current affairs, and never invent official dates or vacancies. Keep the answer structured and concise."},{role:"user",content:question}]})});
      const d=await r.json();if(!r.ok)throw Error(d.error?.message||"AI request failed");
      const answer=d.choices?.[0]?.message?.content;if(!answer)throw Error("Empty AI response");
      return res.json({source:"AI study assistant",answer:String(answer).slice(0,12000)});
    }catch(e){console.error("Study assistant fallback:",e.message);}
  }
  res.json({source:"Offline study guide",answer:"Study guide (offline mode)\\n\\n1. Identify the exact concept and write its definition in one sentence.\\n2. Break it into 3–5 key points and note important terms.\\n3. Work through one example or previous-year style question.\\n4. Recall the points without looking, then check your notes.\\n5. Finish with 5 practice MCQs and review every incorrect answer.\\n\\nYour server does not currently have OPENAI_API_KEY configured, so personalised AI explanations are unavailable. Add the key privately in your hosting environment to enable AI answers. Do not paste API keys into this page."});
});
app.get("/api/admin/review-queue",requireAdmin,(req,res)=>res.json({items:readJson(QUEUE_FILE,[])}));
app.post("/api/admin/review-queue/:id/approve",requireAdmin,(req,res)=>{
  const queue=readJson(QUEUE_FILE,[]),i=queue.findIndex(x=>x.id===req.params.id);
  if(i<0)return res.status(404).json({error:"Queue item not found"});
  const item=queue.splice(i,1)[0],j=validateJob({...item,...req.body,status:"published"});
  if(j.error)return res.status(400).json({error:j.error});
  const jobs=readJobs(); jobs.unshift({...j.value,id:crypto.randomUUID(),createdAt:new Date().toISOString(),sourceUrl:item.sourceUrl});
  writeJobs(jobs);writeJson(QUEUE_FILE,queue);res.json({ok:true,job:jobs[0]});
});
app.delete("/api/admin/review-queue/:id",requireAdmin,(req,res)=>{const q=readJson(QUEUE_FILE,[]),n=q.filter(x=>x.id!==req.params.id);writeJson(QUEUE_FILE,n);res.json({ok:true});});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
async function dailyRun(){
  const result=await checkOfficialFeeds().catch(e=>({checked:0,added:0,message:e.message}));
  writeJson(path.join(__dirname,"data","automation.json"),{lastRun:new Date().toISOString(),...result});
  console.log("Daily official feed monitor:",result);
}
if(FEEDS.length){setTimeout(dailyRun,15000);setInterval(dailyRun,24*60*60*1000);}
app.listen(PORT,()=>console.log(`Sarkari Job Universe running on ${PORT}`));
