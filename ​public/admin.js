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

// Admin content manager: PDF uploads, mock-test publishing and recoverable trash.
async function api(path,options={}){const r=await fetch(path,{...options,headers:{...(options.headers||{}),Authorization:"Bearer "+token,...(options.body instanceof FormData?{}:{"Content-Type":"application/json"})}});const d=await r.json();if(!r.ok)throw Error(d.error||"Request failed");return d;}
async function loadContent(){if(!token)return;try{const [rr,tr,br]=await Promise.all([api("/api/admin/resources"),api("/api/admin/tests"),api("/api/admin/trash")]);
 $("#resourceList").innerHTML="<h4>Uploaded resources</h4>"+(rr.resources||[]).map(x=>`<div class="admin-row"><div><b>${esc(x.title)}</b><small>${esc(x.category)} · ${esc(x.status)} · <a href="${esc(x.url)}" target="_blank" rel="noopener">Open file</a></small></div><button data-rdel="${esc(x.id)}">Delete</button></div>`).join("")||"<p>No uploads yet.</p>";
 $("#testList").innerHTML="<h4>Saved mock tests</h4>"+(tr.tests||[]).map(x=>`<div class="admin-row"><div><b>${esc(x.title)}</b><small>${esc(x.exam)} · ${(x.questions||[]).length} questions · ${esc(x.status)}</small></div><button data-tdel="${esc(x.id)}">Delete</button></div>`).join("")||"<p>No admin tests yet.</p>";
 $("#trashList").innerHTML=(br.items||[]).map(x=>`<div class="admin-row"><div><b>${esc(x.item.title||"Deleted item")}</b><small>${esc(x.kind)} · deleted ${esc(x.item.deletedAt||"")}</small></div><div><button data-restore="${esc(x.item.id)}">Restore</button><button data-purge="${esc(x.item.id)}">Permanent delete</button></div></div>`).join("")||"<p>Trash is empty.</p>";
 document.querySelectorAll("[data-rdel]").forEach(b=>b.onclick=async()=>{if(confirm("Move this resource to Trash?")){await api("/api/admin/resources/"+b.dataset.rdel,{method:"DELETE"});loadContent();}});
 document.querySelectorAll("[data-tdel]").forEach(b=>b.onclick=async()=>{if(confirm("Move this mock test to Trash?")){await api("/api/admin/tests/"+b.dataset.tdel,{method:"DELETE"});loadContent();}});
 document.querySelectorAll("[data-restore]").forEach(b=>b.onclick=async()=>{await api("/api/admin/trash/"+b.dataset.restore+"/restore",{method:"POST"});loadContent();load();});
 document.querySelectorAll("[data-purge]").forEach(b=>b.onclick=async()=>{if(confirm("Permanently delete? This cannot be undone.")){await api("/api/admin/trash/"+b.dataset.purge,{method:"DELETE"});loadContent();}});
 }catch(e){$("#resourceList").textContent=e.message;}}
$("#resourceForm")?.addEventListener("submit",async e=>{e.preventDefault();const f=e.currentTarget;const m=$("#resourceMsg");msg(m,"Uploading…");try{const d=await api("/api/admin/resources",{method:"POST",body:new FormData(f)});msg(m,"Uploaded successfully. Published resources are now available in the student library.",true);f.reset();loadContent();}catch(x){msg(m,x.message);}});
$("#testForm")?.addEventListener("submit",async e=>{e.preventDefault();const f=e.currentTarget,m=$("#testMsg");const v=Object.fromEntries(new FormData(f));msg(m,"Saving mock test…");try{v.questions=JSON.parse(v.questions);await api("/api/admin/tests",{method:"POST",body:JSON.stringify(v)});msg(m,"Mock test saved. Published tests are available to students.",true);loadContent();}catch(x){msg(m,x.message);}});
const priorLoadContent=load;load=async function(){await priorLoadContent();await loadContent();};

// Advanced File Manager UI
let fmTimer=null;
async function loadFileManager(){if(!token)return;try{
 const q=encodeURIComponent($("#fmSearch")?.value||""),folder=encodeURIComponent($("#fmFolder")?.value||"");
 const d=await api(`/api/admin/file-manager?q=${q}&folder=${folder}`);
 const sel=$("#fmFolder"),current=sel.value;sel.innerHTML='<option value="">All folders</option>'+d.folders.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");sel.value=current;
 $("#fmList").innerHTML=(d.resources||[]).map(x=>`<div class="admin-row"><div><b>${esc(x.title)}</b><small>${esc(x.folder||"General")} · ${esc(x.category)} · ${Math.ceil((x.size||0)/1024)} KB · ${esc(x.status)}<br><a href="${esc(x.url)}" target="_blank" rel="noopener">Open file</a></small></div><div><button data-replace="${esc(x.id)}">Replace</button><button data-fmdelete="${esc(x.id)}">Trash</button><input hidden type="file" accept="application/pdf,image/jpeg,image/png,image/webp" data-replace-input="${esc(x.id)}"></div></div>`).join("")||"<p>No matching files.</p>";
 document.querySelectorAll("[data-fmdelete]").forEach(b=>b.onclick=async()=>{if(confirm("Move this file to Trash?")){await api("/api/admin/resources/"+b.dataset.fmdelete,{method:"DELETE"});loadContent();loadFileManager();}});
 document.querySelectorAll("[data-replace]").forEach(b=>b.onclick=()=>document.querySelector(`[data-replace-input="${b.dataset.replace}"]`).click());
 document.querySelectorAll("[data-replace-input]").forEach(inp=>inp.onchange=async()=>{if(!inp.files.length)return;const fd=new FormData();fd.append("file",inp.files[0]);try{await api(`/api/admin/resources/${inp.dataset.replace}/replace`,{method:"POST",body:fd});alert("File replaced successfully");loadContent();loadFileManager();}catch(e){alert(e.message)}});
 $("#fmUpdated").textContent="Last synced: "+new Date().toLocaleTimeString();
 }catch(e){$("#fmList").textContent=e.message;}}
$("#fmSearch")?.addEventListener("input",()=>loadFileManager());$("#fmFolder")?.addEventListener("change",()=>loadFileManager());
$("#bulkUploadForm")?.addEventListener("submit",async e=>{e.preventDefault();const f=e.currentTarget,files=$("#bulkFiles").files;if(!files.length)return;const fd=new FormData(f);if(files.length>20){msg($("#bulkMsg"),"Maximum 20 files per batch.");return;}msg($("#bulkMsg"),"Uploading "+files.length+" files…");try{const d=await api("/api/admin/resources/bulk",{method:"POST",body:fd});msg($("#bulkMsg"),d.count+" files uploaded successfully.",true);f.reset();loadContent();loadFileManager();}catch(x){msg($("#bulkMsg"),x.message);}});
$("#backupBtn")?.addEventListener("click",async()=>{try{const r=await fetch("/api/admin/backup",{headers:{Authorization:"Bearer "+token}});if(!r.ok){const e=await r.json();throw Error(e.error||"Backup failed");}const blob=await r.blob(),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="sarkari-job-universe-backup.json";a.click();URL.revokeObjectURL(url);}catch(e){alert(e.message)}});
const oldLoadFM=load;load=async function(){await oldLoadFM();await loadFileManager();};
if(typeof token!=="undefined")setInterval(()=>{if(token&&document.visibilityState==="visible")loadFileManager();},15000);
