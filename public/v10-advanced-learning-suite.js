(() => {
  "use strict";
  const mount = document.getElementById("v10-advanced-learning-suite");
  if (!mount) return;

  let BANK = [
    {topic:"Indian Polity",q:"Which Article of the Constitution guarantees equality before the law?",o:["Article 14","Article 19","Article 21","Article 32"],a:0,e:"Article 14 guarantees equality before the law and equal protection of the laws."},
    {topic:"Indian Polity",q:"Fundamental Duties are listed in which part of the Constitution?",o:["Part III","Part IVA","Part V","Part IX"],a:1,e:"Fundamental Duties are listed in Part IVA, Article 51A."},
    {topic:"Indian History",q:"Who founded the Maurya Empire?",o:["Ashoka","Bindusara","Chandragupta Maurya","Harsha"],a:2,e:"Chandragupta Maurya founded the Maurya Empire with the guidance of Chanakya."},
    {topic:"Geography",q:"Which is the longest river in India by length within the country?",o:["Yamuna","Ganga","Godavari","Narmada"],a:1,e:"The Ganga is generally identified as India's longest river within the country."},
    {topic:"General Science",q:"What is the SI unit of electric current?",o:["Volt","Ohm","Ampere","Watt"],a:2,e:"The SI unit of electric current is the ampere (A)."},
    {topic:"Quantitative Aptitude",q:"What is 25% of 240?",o:["40","50","60","80"],a:2,e:"25% is one quarter; 240 ÷ 4 = 60."},
    {topic:"Reasoning",q:"Find the next number: 2, 6, 12, 20, 30, ?",o:["36","40","42","44"],a:2,e:"The differences are 4, 6, 8, 10; next difference is 12, so 42."},
    {topic:"English",q:"Choose the correctly spelt word.",o:["Accomodation","Accommodation","Acommodation","Acomodation"],a:1,e:"Accommodation is spelled with double c and double m."},
    {topic:"Jammu & Kashmir",q:"Which city is the summer capital of Jammu and Kashmir?",o:["Jammu","Srinagar","Leh","Kargil"],a:1,e:"Srinagar is the summer capital; Jammu is the winter capital."},
    {topic:"Computer Awareness",q:"What does CPU stand for?",o:["Central Processing Unit","Computer Personal Unit","Central Program Utility","Core Processing User"],a:0,e:"CPU stands for Central Processing Unit."}
  ];
  const FORMULAS = [
    ["Percentage","Percentage = (Part ÷ Whole) × 100","x% of y = (x × y) ÷ 100"],
    ["Profit & Loss","Profit = Selling Price − Cost Price","Profit % = (Profit ÷ Cost Price) × 100"],
    ["Simple Interest","SI = (P × R × T) ÷ 100","P = Principal, R = annual rate, T = years"],
    ["Average","Average = Sum of observations ÷ Number of observations","Total = Average × Count"],
    ["Speed, Distance & Time","Speed = Distance ÷ Time","Distance = Speed × Time"],
    ["Time & Work","If A finishes in x days, A's 1-day work = 1/x","Combined rate = sum of individual rates"],
    ["Area of a Circle","Area = πr²","Circumference = 2πr"],
    ["Pythagoras Theorem","Hypotenuse² = Base² + Perpendicular²","For a right-angled triangle"]
  ];
  let CA_SAMPLE = [
    {q:"Which institution publishes India's Monetary Policy decisions?",o:["SEBI","Reserve Bank of India","NITI Aayog","Finance Commission"],a:1,e:"The Reserve Bank of India (RBI) announces monetary policy decisions."},
    {q:"Which organisation conducts the Civil Services Examination?",o:["SSC","UPSC","IBPS","NTA"],a:1,e:"The Union Public Service Commission conducts the Civil Services Examination."},
    {q:"What does ISRO stand for?",o:["Indian Space Research Organisation","International Satellite Research Office","Indian Science Research Office","Institute of Space and Rocket Operations"],a:0,e:"ISRO stands for Indian Space Research Organisation."}
  ];
  const KEY = "sju_v10_learning_progress";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const today = new Date().toISOString().slice(0,10);

  mount.innerHTML = `
  <section class="v10-wrap" aria-labelledby="v10-title">
    <div class="v10-head">
      <span class="v10-kicker">✦ V10 ADVANCED STUDENT ZONE</span>
      <h2 id="v10-title">Learn smarter. <em>Prepare stronger.</em></h2>
      <p>Topic practice, revision formulas, current-affairs awareness and a simple daily study planner — in one place.</p>
    </div>
    <div class="v10-tabs" role="tablist" aria-label="Learning tools">
      <button class="v10-tab active" data-tab="practice" role="tab" aria-selected="true">Topic Practice</button>
      <button class="v10-tab" data-tab="affairs" role="tab" aria-selected="false">Current Affairs Quiz</button>
      <button class="v10-tab" data-tab="formula" role="tab" aria-selected="false">Formula & Tricks</button>
      <button class="v10-tab" data-tab="planner" role="tab" aria-selected="false">Study Planner</button>
    </div>
    <div class="v10-panel" data-panel="practice">
      <div class="v10-paneltop"><div><span class="v10-label">TOPIC-WISE PRACTICE</span><h3>Practice by subject</h3><p>Answer each MCQ and read its explanation immediately.</p></div>
      <select id="v10-topic" aria-label="Choose practice topic"><option value="All">All topics</option>${[...new Set(BANK.map(x=>x.topic))].map(t=>`<option>${esc(t)}</option>`).join("")}</select></div>
      <div id="v10-question" class="v10-question"></div>
      <div class="v10-actions"><button class="v10-btn secondary" id="v10-prev">Previous</button><span id="v10-progress" aria-live="polite"></span><button class="v10-btn" id="v10-next">Next question →</button></div>
    </div>
    <div class="v10-panel" data-panel="affairs" hidden>
      <div class="v10-paneltop"><div><span class="v10-label">CURRENT AFFAIRS & STATIC GK</span><h3>Daily revision quiz</h3><p>Short sample quiz for practice. For the latest news, always verify dates and facts from official sources.</p></div><select id="v10-ca-range" aria-label="Choose current affairs quiz period"><option value="daily">Daily Quiz (last 7 days)</option><option value="monthly">Monthly Quiz (last 30 days)</option></select></div>
      <div id="v10-ca-question" class="v10-question"></div>
      <div class="v10-actions"><button class="v10-btn secondary" id="v10-ca-reset">Restart quiz</button><span id="v10-ca-progress"></span><button class="v10-btn" id="v10-ca-next">Next →</button></div>
      <p class="v10-note" id="v10-ca-source-note">Quiz questions are built from current-affairs updates published on this portal. Always open the cited source to verify details.</p>
    </div>
    <div class="v10-panel" data-panel="formula" hidden>
      <div class="v10-paneltop"><div><span class="v10-label">QUICK REVISION</span><h3>Formulas & short tricks</h3><p>Concise notes for common competitive-exam topics.</p></div><input id="v10-formula-search" type="search" placeholder="Search formulas…" aria-label="Search formulas"></div>
      <div id="v10-formula-list" class="v10-formulas"></div>
    </div>
    <div class="v10-panel" data-panel="planner" hidden>
      <div class="v10-paneltop"><div><span class="v10-label">DAILY CONSISTENCY</span><h3>Your study checklist</h3><p>Tick off your goals. Progress is saved on this device.</p></div><span class="v10-pill" id="v10-goal-count">0 / 4 complete</span></div>
      <div class="v10-goals" id="v10-goals">
        <label><input type="checkbox" value="gk"> 20 minutes — General Knowledge</label>
        <label><input type="checkbox" value="math"> 20 minutes — Maths & Reasoning</label>
        <label><input type="checkbox" value="english"> 15 minutes — English</label>
        <label><input type="checkbox" value="revision"> 15 minutes — Revise mistakes</label>
      </div>
      <div class="v10-streak"><strong id="v10-day-progress">0%</strong><span>of today's study goals completed</span><div><i id="v10-progress-bar"></i></div></div>
    </div>
    <div class="v10-foot">Your practice progress is stored locally in this browser. It is not sent to the website or shared with other users.</div>
  </section>`;

  const style = document.createElement("style");
  style.textContent = `
  .v10-wrap{margin:34px auto;padding:clamp(18px,3vw,30px);max-width:1400px;border:1px solid #e5eaf3;border-radius:22px;background:linear-gradient(145deg,#f8fbff,#fff 60%);box-shadow:0 14px 40px #18233b0b;color:#18233b}
  .v10-head{margin-bottom:20px}.v10-kicker,.v10-label{font-size:10px;font-weight:800;letter-spacing:1.4px;color:#155eef}.v10-head h2{font-size:clamp(25px,3vw,36px);margin:9px 0}.v10-head h2 em{font-style:normal;color:#155eef}.v10-head p,.v10-paneltop p{color:#6e7890;line-height:1.6;font-size:13px;margin:5px 0}
  .v10-tabs{display:flex;gap:8px;flex-wrap:wrap;border-bottom:1px solid #e5eaf3;padding-bottom:13px}.v10-tab{border:1px solid #e1e7f1;background:#fff;border-radius:999px;padding:10px 15px;font-weight:700;color:#53617b;cursor:pointer}.v10-tab.active{background:#155eef;color:#fff;border-color:#155eef}
  .v10-panel{padding:22px 0 8px}.v10-panel[hidden]{display:none}.v10-paneltop{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}.v10-paneltop h3{font-size:21px;margin:5px 0}.v10-paneltop select,.v10-paneltop input{padding:11px 13px;border:1px solid #dce3ef;border-radius:10px;background:#fff;min-width:190px;max-width:100%;font:inherit}
  .v10-question{margin-top:18px;padding:20px;border:1px solid #e4eaf3;border-radius:15px;background:#fff}.v10-qmeta{font-size:11px;color:#155eef;font-weight:800;margin-bottom:10px}.v10-qtitle{font-weight:800;font-size:16px;line-height:1.5;margin:0 0 14px}.v10-option{display:block;width:100%;text-align:left;border:1px solid #e1e7f0;background:#fff;padding:12px 14px;border-radius:10px;margin:8px 0;color:#27344e;cursor:pointer;font:600 13px inherit}.v10-option:hover{border-color:#8bb2ff}.v10-option.correct{background:#eaf8f1;border-color:#4ab987;color:#12633e}.v10-option.wrong{background:#fff0f0;border-color:#e58c8c;color:#a52e2e}.v10-explain{margin-top:13px;padding:12px;border-radius:10px;background:#f2f7ff;color:#344766;font-size:13px;line-height:1.55}.v10-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;color:#6e7890;font-size:12px}.v10-btn{border:0;border-radius:10px;background:#155eef;color:white;padding:11px 15px;font-weight:800;cursor:pointer}.v10-btn.secondary{background:#edf2fa;color:#34415d}.v10-btn:disabled{opacity:.45;cursor:not-allowed}.v10-pill{background:#eaf1ff;color:#155eef;padding:8px 11px;border-radius:999px;font-size:11px;font-weight:800}.v10-note,.v10-foot{font-size:11px;color:#78849a;line-height:1.6}.v10-formulas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:17px}.v10-formula{padding:15px;border:1px solid #e4eaf3;border-radius:13px;background:#fff}.v10-formula b{display:block;margin-bottom:8px}.v10-formula p{margin:5px 0;color:#53617b;font-size:13px;line-height:1.5}.v10-goals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0}.v10-goals label{display:flex;align-items:center;gap:10px;padding:14px;border:1px solid #e4eaf3;border-radius:12px;background:#fff;font-size:13px;font-weight:700}.v10-goals input{width:18px;height:18px;accent-color:#155eef}.v10-streak{padding:15px;border-radius:13px;background:#f1f6ff}.v10-streak strong{font-size:25px;color:#155eef;margin-right:10px}.v10-streak span{font-size:12px;color:#68758e}.v10-streak div{height:8px;border-radius:99px;background:#dce7fa;margin-top:12px;overflow:hidden}.v10-streak i{display:block;height:100%;width:0;background:#155eef;border-radius:99px;transition:width .2s}
  .v10-foot{border-top:1px solid #e8edf5;padding-top:12px;margin-top:15px}
  @media(max-width:650px){.v10-formulas,.v10-goals{grid-template-columns:1fr}.v10-actions{flex-wrap:wrap}.v10-paneltop select,.v10-paneltop input{width:100%}.v10-wrap{margin:22px 12px;border-radius:16px}}
  `;
  document.head.appendChild(style);

  const tabs = [...mount.querySelectorAll(".v10-tab")];
  tabs.forEach(btn => btn.addEventListener("click", () => {
    tabs.forEach(t => { const active=t===btn; t.classList.toggle("active",active); t.setAttribute("aria-selected",String(active)); });
    mount.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== btn.dataset.tab);
  }));

  let topicIndex = 0, caIndex = 0, topicAnswered = state.topicAnswered && typeof state.topicAnswered === "object" ? state.topicAnswered : {}, caAnswered = {};
  const topicList = () => {
    const topic = mount.querySelector("#v10-topic").value;
    return BANK.map((q,i)=>({...q,index:i})).filter(q=>topic==="All"||q.topic===topic);
  };
  function refreshTopicOptions() {
    const select = mount.querySelector("#v10-topic");
    const current = select.value || "All";
    const topics = [...new Set(BANK.map(x => x.topic))].sort();
    select.innerHTML = `<option value="All">All topics (${BANK.length})</option>` +
      topics.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join("");
    select.value = topics.includes(current) ? current : "All";
  }

  async function loadQuestionBank() {
    try {
      const response = await fetch("/api/practice-questions?limit=5000", { cache: "no-store" });
      if (!response.ok) throw new Error("Practice question bank unavailable");
      const payload = await response.json();
      const remote = Array.isArray(payload.questions) ? payload.questions : [];
      const normalized = remote.map(q => ({
        topic: String(q.category || "General"),
        q: String(q.question || ""),
        o: Array.isArray(q.options) ? q.options.map(String) : [],
        a: Number(q.answer),
        e: String(q.explanation || "Review this topic and verify the answer.")
      })).filter(q => q.q && q.o.length >= 2 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length);
      if (normalized.length) {
        BANK = normalized;
        topicIndex = 0;
        topicAnswered = {};
        refreshTopicOptions();
        renderTopic();
        mount.querySelector("#v10-progress").textContent = `Loaded ${BANK.length} questions`;
      }
    } catch (_) {
      mount.querySelector("#v10-progress").textContent = `Starter practice set • ${BANK.length} questions`;
    }
  }

  function renderTopic() {
    const list=topicList();
    if(topicIndex>=list.length) topicIndex=0;
    const item=list[topicIndex];
    const chosen=topicAnswered[item.index];
    mount.querySelector("#v10-question").innerHTML = `<div class="v10-qmeta">${esc(item.topic)} • Question ${topicIndex+1} of ${list.length}</div><p class="v10-qtitle">${esc(item.q)}</p>${item.o.map((o,i)=>`<button class="v10-option ${chosen===undefined?"":i===item.a?"correct":i===chosen?"wrong":""}" data-choice="${i}" ${chosen===undefined?"":"disabled"}>${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join("")}${chosen===undefined?"":`<div class="v10-explain"><b>${chosen===item.a?"Correct!":"Not quite."}</b> ${esc(item.e)}</div>`}`;
    const correct = list.filter(q => topicAnswered[q.index] === q.a).length;
    const answered = list.filter(q => topicAnswered[q.index] !== undefined).length;
    mount.querySelector("#v10-progress").textContent=`${answered}/${list.length} answered • ${correct} correct`;
    mount.querySelector("#v10-prev").disabled=topicIndex===0;
    mount.querySelector("#v10-next").disabled=list.length<2;
    mount.querySelectorAll("#v10-question [data-choice]").forEach(b=>b.addEventListener("click",()=>{topicAnswered[item.index]=Number(b.dataset.choice);state.topicAnswered=topicAnswered;save();renderTopic();}));
  }
  mount.querySelector("#v10-topic").addEventListener("change",()=>{topicIndex=0;renderTopic();});
  mount.querySelector("#v10-prev").addEventListener("click",()=>{topicIndex=Math.max(0,topicIndex-1);renderTopic();});
  mount.querySelector("#v10-next").addEventListener("click",()=>{const l=topicList();topicIndex=(topicIndex+1)%l.length;renderTopic();});
  renderTopic();

  function buildCurrentAffairsQuiz(items, period) {
    const now = new Date();
    const days = period === "monthly" ? 30 : 7;
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - days);
    const recent = (Array.isArray(items) ? items : []).filter(item => {
      const date = new Date(item.date || item.createdAt || "");
      return !Number.isNaN(date.getTime()) && date >= cutoff && date <= new Date(now.getTime() + 86400000);
    }).sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));
    const sourceItems = recent.length ? recent : (Array.isArray(items) ? items : []);
    const built = sourceItems.map((item, index) => {
      const others = sourceItems.filter((_, i) => i !== index);
      const distractors = others.slice(0, 3).map(x => String(x.title || "Related update"));
      const options = [String(item.title || "Current affairs update"), ...distractors];
      const answerTitle = options[0];
      const shuffled = options.slice().sort(() => Math.random() - 0.5);
      const answer = shuffled.indexOf(answerTitle);
      return {
        q: "Which published update matches this summary?",
        o: shuffled,
        a: answer,
        e: `${String(item.summary || "Read the full update for context.")} Source: ${String(item.source || "See source link")}. Date: ${String(item.date || "Not specified")}.`
      };
    });
    return built.length ? built : CA_SAMPLE;
  }

  async function loadCurrentAffairsQuiz() {
    const note = mount.querySelector("#v10-ca-source-note");
    try {
      const response = await fetch("/api/current-affairs", { cache: "no-store" });
      if (!response.ok) throw new Error("Current affairs feed unavailable");
      const payload = await response.json();
      const items = Array.isArray(payload.items) ? payload.items : [];
      const period = mount.querySelector("#v10-ca-range").value;
      const days = period === "monthly" ? 30 : 7;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const count = items.filter(item => {
        const date = new Date(item.date || item.createdAt || "");
        return !Number.isNaN(date.getTime()) && date >= cutoff;
      }).length;
      CA_SAMPLE = buildCurrentAffairsQuiz(items, period);
      caIndex = 0;
      caAnswered = {};
      renderCA();
      if (note) note.textContent = count
        ? `Based on ${count} published update(s) in the selected ${period} period. Open each source link in Current Affairs to verify the original notice.`
        : "No update was published in the selected period; the quiz is using the available portal update list. Verify every item at its original source.";
    } catch (_) {
      CA_SAMPLE = CA_SAMPLE.length ? CA_SAMPLE : [];
      renderCA();
      if (note) note.textContent = "Live current-affairs data could not be loaded. Showing the built-in sample revision quiz instead.";
    }
  }

  function renderCA(){
    const q=CA_SAMPLE[caIndex], chosen=caAnswered[caIndex];
    mount.querySelector("#v10-ca-question").innerHTML=`<div class="v10-qmeta">Practice set • Question ${caIndex+1} of ${CA_SAMPLE.length}</div><p class="v10-qtitle">${esc(q.q)}</p>${q.o.map((o,i)=>`<button class="v10-option ${chosen===undefined?"":i===q.a?"correct":i===chosen?"wrong":""}" data-ca-choice="${i}" ${chosen===undefined?"":"disabled"}>${String.fromCharCode(65+i)}. ${esc(o)}</button>`).join("")}${chosen===undefined?"":`<div class="v10-explain"><b>${chosen===q.a?"Correct!":"Review this answer."}</b> ${esc(q.e)}</div>`}`;
    const correct = CA_SAMPLE.filter((item, index) => caAnswered[index] === item.a).length;
    mount.querySelector("#v10-ca-progress").textContent=`${Object.keys(caAnswered).length} / ${CA_SAMPLE.length} answered • ${correct} correct`;
    mount.querySelectorAll("[data-ca-choice]").forEach(b=>b.addEventListener("click",()=>{caAnswered[caIndex]=Number(b.dataset.caChoice);renderCA();}));
  }
  mount.querySelector("#v10-ca-next").addEventListener("click",()=>{caIndex=(caIndex+1)%CA_SAMPLE.length;renderCA();});
  mount.querySelector("#v10-ca-reset").addEventListener("click",()=>{caIndex=0;caAnswered={};renderCA();});
  mount.querySelector("#v10-ca-range").addEventListener("change", loadCurrentAffairsQuiz);
  renderCA();
  loadCurrentAffairsQuiz();

  function renderFormulas(){
    const q=mount.querySelector("#v10-formula-search").value.toLowerCase().trim();
    const items=FORMULAS.filter(x=>x.join(" ").toLowerCase().includes(q));
    mount.querySelector("#v10-formula-list").innerHTML=items.map(x=>`<article class="v10-formula"><b>${esc(x[0])}</b><p>${esc(x[1])}</p><p>${esc(x[2])}</p></article>`).join("")||'<p class="v10-note">No matching formula found.</p>';
  }
  mount.querySelector("#v10-formula-search").addEventListener("input",renderFormulas);
  renderFormulas();

  const goals=mount.querySelectorAll("#v10-goals input");
  if(state.date!==today){state.date=today;state.goals={};}
  function renderGoals(){
    const done=goals.length? [...goals].filter(x=>state.goals&&state.goals[x.value]).length:0;
    const pct=Math.round(done/goals.length*100);
    mount.querySelector("#v10-goal-count").textContent=`${done} / ${goals.length} complete`;
    mount.querySelector("#v10-day-progress").textContent=`${pct}%`;
    mount.querySelector("#v10-progress-bar").style.width=pct+"%";
    goals.forEach(x=>x.checked=!!(state.goals&&state.goals[x.value]));
  }
  goals.forEach(x=>x.addEventListener("change",()=>{state.goals=state.goals||{};state.goals[x.value]=x.checked;save();renderGoals();}));
  renderGoals();
  refreshTopicOptions();
  loadQuestionBank();
})();