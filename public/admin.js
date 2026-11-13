const $=s=>document.querySelector(s);let token="",jobs=[];
const fields=["title","organization","category","region","type","status","notificationNo","ageLimit","applicationFee","applyUrl","qualification","vacancies","lastDate","examDate","officialUrl","description"];
function msg(el,t,ok=false){el.textContent=t;el.className="form-msg"+(ok?" ok":"");}
function auth(){return {Authorization:"Bearer "+token,"Content-Type":"application/json"}}
$("#loginForm").addEventListener("submit",async e=>{e.preventDefault();msg($("#loginMsg"),"Signing in…");try{let r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:$("#adminPassword").value})}),d=await r.json();if(!r.ok)throw Error(d.error);token=d.token;$("#loginPanel").classList.add("hidden");$("#dashboard").classList.remove("hidden");load();}catch(x){msg($("#loginMsg"),x.message)}});
async function load(){try{let r=await fetch("/api/admin/jobs",{headers:auth()}),d=await r.json();if(!r.ok)throw Error(d.error);jobs=d.jobs;renderList()}catch(e){msg($("#saveMsg"),e.message)}}
function renderList(){$("#adminList").innerHTML=jobs.map(j=>`<div class="admin-row"><div><b>${esc(j.title)}</b><small>${esc(j.organization)} · ${esc(j.type)} · ${esc(j.status)}</small></div><div><button data-edit="${j.id}">Edit</button><button data-delete="${j.id}">Delete</button></div></div>`).join("")||"<p>No updates added yet.</p>";document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>edit(b.dataset.edit));document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>remove(b.dataset.delete));}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function clear(){ $("#jobForm").reset();$("#jobId").value="";$("#saveBtn").textContent="Publish update →";msg($("#saveMsg"),"");}
function edit(id){let j=jobs.find(x=>x.id===id);if(!j)return;$("#jobId").value=id;fields.forEach(k=>$("#"+k).value=j[k]??"");$("#saveBtn").textContent="Save changes →";$("#jobForm").scrollIntoView({behavior:"smooth"});}
$("#clearBtn").onclick=clear;
$("#jobForm").addEventListener("submit",async e=>{e.preventDefault();let data={};fields.forEach(k=>data[k]=$("#"+k).value);let id=$("#jobId").value;msg($("#saveMsg"),"Saving…");try{let r=await fetch(id?"/api/admin/jobs/"+encodeURIComponent(id):"/api/admin/jobs",{method:id?"PUT":"POST",headers:auth(),body:JSON.stringify(data)}),d=await r.json();if(!r.ok)throw Error(d.error);msg($("#saveMsg"),id?"Update saved.":"Update added.",true);clear();await load()}catch(x){msg($("#saveMsg"),x.message)}});
async function remove(id){if(!confirm("Delete this update?"))return;try{let r=await fetch("/api/admin/jobs/"+encodeURIComponent(id),{method:"DELETE",headers:auth()}),d=await r.json();if(!r.ok)throw Error(d.error);load()}catch(e){alert(e.message)}}
$("#logoutBtn").onclick=()=>{token="";$("#dashboard").classList.add("hidden");$("#loginPanel").classList.remove("hidden");$("#adminPassword").value="";};

async function loadQueue(){
 try{let r=await fetch("/api/admin/review-queue",{headers:auth()}),d=await r.json();if(!r.ok)throw Error(d.error);
 $("#reviewQueue").innerHTML=d.items.map(x=>`<div class="admin-row"><div><b>${esc(x.title)}</b><small>${esc(x.organization)} · Found ${esc(x.foundAt||"")}</small><br><a href="${esc(x.officialUrl)}" target="_blank" rel="noopener">Open source ↗</a></div><div><button data-approve="${esc(x.id)}">Approve & publish</button><button data-reject="${esc(x.id)}">Dismiss</button></div></div>`).join("")||"<p>No items waiting for review.</p>";
 document.querySelectorAll("[data-approve]").forEach(b=>b.onclick=async()=>{if(!confirm("Have you verified this notice on the official source? Publish it now?"))return;let item=d.items.find(x=>x.id===b.dataset.approve);let rr=await fetch("/api/admin/review-queue/"+encodeURIComponent(b.dataset.approve)+"/approve",{method:"POST",headers:auth(),body:JSON.stringify({title:item.title,organization:item.organization,officialUrl:item.officialUrl,description:item.description,status:"published"})});let dd=await rr.json();if(!rr.ok)return alert(dd.error);loadQueue();load();});
 document.querySelectorAll("[data-reject]").forEach(b=>b.onclick=async()=>{await fetch("/api/admin/review-queue/"+encodeURIComponent(b.dataset.reject),{method:"DELETE",headers:auth()});loadQueue();});
 }catch(e){$("#reviewQueue").textContent=e.message;}
}
const oldLoad=load;load=async function(){await oldLoad();await loadQueue();};
$("#checkFeedsBtn")?.addEventListener("click",async()=>{msg($("#saveMsg"),"Feed monitor runs automatically every 24 hours when feeds are configured. Restart service after changing Render environment variables.");await loadQueue();});
