const chapters = [{"subject": "General Knowledge", "title": "Indian History: Ancient India", "id": "general-knowledge-1"}, {"subject": "General Knowledge", "title": "Indian History: Medieval India", "id": "general-knowledge-2"}, {"subject": "General Knowledge", "title": "Indian History: Modern India", "id": "general-knowledge-3"}, {"subject": "General Knowledge", "title": "Indian National Movement", "id": "general-knowledge-4"}, {"subject": "General Knowledge", "title": "Indian Constitution: Preamble & Features", "id": "general-knowledge-5"}, {"subject": "General Knowledge", "title": "Fundamental Rights and Duties", "id": "general-knowledge-6"}, {"subject": "General Knowledge", "title": "Parliament and Law-making", "id": "general-knowledge-7"}, {"subject": "General Knowledge", "title": "President, Prime Minister & Council", "id": "general-knowledge-8"}, {"subject": "General Knowledge", "title": "Judiciary and Constitutional Bodies", "id": "general-knowledge-9"}, {"subject": "General Knowledge", "title": "Indian Geography: Physical Features", "id": "general-knowledge-10"}, {"subject": "General Knowledge", "title": "Indian Geography: Rivers and Lakes", "id": "general-knowledge-11"}, {"subject": "General Knowledge", "title": "Climate, Soil and Agriculture", "id": "general-knowledge-12"}, {"subject": "General Knowledge", "title": "World Geography Basics", "id": "general-knowledge-13"}, {"subject": "General Knowledge", "title": "Indian Economy: Basic Concepts", "id": "general-knowledge-14"}, {"subject": "General Knowledge", "title": "Budget, Banking and RBI", "id": "general-knowledge-15"}, {"subject": "General Knowledge", "title": "Science: Physics Fundamentals", "id": "general-knowledge-16"}, {"subject": "General Knowledge", "title": "Science: Chemistry Fundamentals", "id": "general-knowledge-17"}, {"subject": "General Knowledge", "title": "Science: Biology Fundamentals", "id": "general-knowledge-18"}, {"subject": "General Knowledge", "title": "Environment and Ecology", "id": "general-knowledge-19"}, {"subject": "General Knowledge", "title": "Awards, Books, Sports and Important Days", "id": "general-knowledge-20"}, {"subject": "Mathematics", "title": "Number System", "id": "mathematics-1"}, {"subject": "Mathematics", "title": "Simplification and BODMAS", "id": "mathematics-2"}, {"subject": "Mathematics", "title": "HCF and LCM", "id": "mathematics-3"}, {"subject": "Mathematics", "title": "Fractions and Decimals", "id": "mathematics-4"}, {"subject": "Mathematics", "title": "Percentage", "id": "mathematics-5"}, {"subject": "Mathematics", "title": "Ratio and Proportion", "id": "mathematics-6"}, {"subject": "Mathematics", "title": "Average", "id": "mathematics-7"}, {"subject": "Mathematics", "title": "Profit and Loss", "id": "mathematics-8"}, {"subject": "Mathematics", "title": "Discount", "id": "mathematics-9"}, {"subject": "Mathematics", "title": "Simple Interest", "id": "mathematics-10"}, {"subject": "Mathematics", "title": "Compound Interest", "id": "mathematics-11"}, {"subject": "Mathematics", "title": "Time and Work", "id": "mathematics-12"}, {"subject": "Mathematics", "title": "Pipes and Cisterns", "id": "mathematics-13"}, {"subject": "Mathematics", "title": "Time, Speed and Distance", "id": "mathematics-14"}, {"subject": "Mathematics", "title": "Trains and Boats", "id": "mathematics-15"}, {"subject": "Mathematics", "title": "Mensuration: 2D", "id": "mathematics-16"}, {"subject": "Mathematics", "title": "Mensuration: 3D", "id": "mathematics-17"}, {"subject": "Mathematics", "title": "Algebra Basics", "id": "mathematics-18"}, {"subject": "Mathematics", "title": "Geometry and Triangles", "id": "mathematics-19"}, {"subject": "Mathematics", "title": "Data Interpretation", "id": "mathematics-20"}, {"subject": "Reasoning", "title": "Analogy", "id": "reasoning-1"}, {"subject": "Reasoning", "title": "Classification", "id": "reasoning-2"}, {"subject": "Reasoning", "title": "Number Series", "id": "reasoning-3"}, {"subject": "Reasoning", "title": "Alphabet Series", "id": "reasoning-4"}, {"subject": "Reasoning", "title": "Coding and Decoding", "id": "reasoning-5"}, {"subject": "Reasoning", "title": "Blood Relations", "id": "reasoning-6"}, {"subject": "Reasoning", "title": "Direction Sense", "id": "reasoning-7"}, {"subject": "Reasoning", "title": "Order and Ranking", "id": "reasoning-8"}, {"subject": "Reasoning", "title": "Word Arrangement", "id": "reasoning-9"}, {"subject": "Reasoning", "title": "Syllogism", "id": "reasoning-10"}, {"subject": "Reasoning", "title": "Venn Diagrams", "id": "reasoning-11"}, {"subject": "Reasoning", "title": "Statement and Conclusion", "id": "reasoning-12"}, {"subject": "Reasoning", "title": "Seating Arrangement", "id": "reasoning-13"}, {"subject": "Reasoning", "title": "Puzzle Test", "id": "reasoning-14"}, {"subject": "Reasoning", "title": "Calendar", "id": "reasoning-15"}, {"subject": "Reasoning", "title": "Clock", "id": "reasoning-16"}, {"subject": "Reasoning", "title": "Mirror and Water Images", "id": "reasoning-17"}, {"subject": "Reasoning", "title": "Paper Folding and Cutting", "id": "reasoning-18"}, {"subject": "Reasoning", "title": "Embedded Figures", "id": "reasoning-19"}, {"subject": "Reasoning", "title": "Non-verbal Reasoning", "id": "reasoning-20"}, {"subject": "English", "title": "Parts of Speech", "id": "english-1"}, {"subject": "English", "title": "Nouns and Pronouns", "id": "english-2"}, {"subject": "English", "title": "Verbs and Tenses", "id": "english-3"}, {"subject": "English", "title": "Subject-Verb Agreement", "id": "english-4"}, {"subject": "English", "title": "Articles and Determiners", "id": "english-5"}, {"subject": "English", "title": "Prepositions", "id": "english-6"}, {"subject": "English", "title": "Conjunctions", "id": "english-7"}, {"subject": "English", "title": "Active and Passive Voice", "id": "english-8"}, {"subject": "English", "title": "Direct and Indirect Speech", "id": "english-9"}, {"subject": "English", "title": "Error Spotting", "id": "english-10"}, {"subject": "English", "title": "Sentence Improvement", "id": "english-11"}, {"subject": "English", "title": "Fill in the Blanks", "id": "english-12"}, {"subject": "English", "title": "Synonyms and Antonyms", "id": "english-13"}, {"subject": "English", "title": "One-word Substitution", "id": "english-14"}, {"subject": "English", "title": "Idioms and Phrases", "id": "english-15"}, {"subject": "English", "title": "Spelling Correction", "id": "english-16"}, {"subject": "English", "title": "Cloze Test", "id": "english-17"}, {"subject": "English", "title": "Reading Comprehension", "id": "english-18"}, {"subject": "English", "title": "Para Jumbles", "id": "english-19"}, {"subject": "English", "title": "Vocabulary Practice", "id": "english-20"}, {"subject": "Jammu & Kashmir", "title": "J&K History", "id": "jammu-and-kashmir-1"}, {"subject": "Jammu & Kashmir", "title": "J&K Geography", "id": "jammu-and-kashmir-2"}, {"subject": "Jammu & Kashmir", "title": "Districts and Divisions", "id": "jammu-and-kashmir-3"}, {"subject": "Jammu & Kashmir", "title": "Rivers and Lakes of J&K", "id": "jammu-and-kashmir-4"}, {"subject": "Jammu & Kashmir", "title": "Mountains and Passes", "id": "jammu-and-kashmir-5"}, {"subject": "Jammu & Kashmir", "title": "Climate and Agriculture", "id": "jammu-and-kashmir-6"}, {"subject": "Jammu & Kashmir", "title": "National Parks and Wildlife", "id": "jammu-and-kashmir-7"}, {"subject": "Jammu & Kashmir", "title": "Culture, Languages and Festivals", "id": "jammu-and-kashmir-8"}, {"subject": "Jammu & Kashmir", "title": "Famous Personalities", "id": "jammu-and-kashmir-9"}, {"subject": "Jammu & Kashmir", "title": "J&K Administration and Economy", "id": "jammu-and-kashmir-10"}, {"subject": "Computer Awareness", "title": "Computer Fundamentals", "id": "computer-awareness-1"}, {"subject": "Computer Awareness", "title": "Hardware and Software", "id": "computer-awareness-2"}, {"subject": "Computer Awareness", "title": "Input and Output Devices", "id": "computer-awareness-3"}, {"subject": "Computer Awareness", "title": "Memory and Storage", "id": "computer-awareness-4"}, {"subject": "Computer Awareness", "title": "Operating Systems", "id": "computer-awareness-5"}, {"subject": "Computer Awareness", "title": "MS Word and Spreadsheet Basics", "id": "computer-awareness-6"}, {"subject": "Computer Awareness", "title": "Internet and Networking", "id": "computer-awareness-7"}, {"subject": "Computer Awareness", "title": "Email and Cyber Safety", "id": "computer-awareness-8"}, {"subject": "Computer Awareness", "title": "Digital Payments and UPI", "id": "computer-awareness-9"}, {"subject": "Computer Awareness", "title": "Computer Abbreviations", "id": "computer-awareness-10"}];
const $ = s => document.querySelector(s);
const today = new Date().toLocaleDateString("en-CA");
const planKey = "sju_daily_plan_v1";
let typingTimer=null,typingEnd=0,typingStarted=0,typingActive=false;
const escapeHTML = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function loadPlan(){
 const saved=JSON.parse(localStorage.getItem(planKey)||"{}");
 const values=saved.date===today?saved.done:[];
 document.querySelectorAll('#dailyPlan input').forEach(x=>x.checked=values.includes(x.value));
 updatePlan();
}
function updatePlan(){
 const checks=[...document.querySelectorAll('#dailyPlan input')],done=checks.filter(x=>x.checked).length;
 $("#doneCount").textContent=done+"/4";
 $("#planMessage").textContent=done===4?"Daily goals complete — excellent consistency!":`${done} of 4 goals completed. Keep your pace steady.`;
 localStorage.setItem(planKey,JSON.stringify({date:today,done:checks.filter(x=>x.checked).map(x=>x.value)}));
}
document.querySelectorAll('#dailyPlan input').forEach(x=>x.addEventListener('change',updatePlan));loadPlan();
const subjects=[...new Set(chapters.map(c=>c.subject))];
subjects.forEach(s=>$("#subjectFilter").insertAdjacentHTML("beforeend",`<option>${escapeHTML(s)}</option>`));
const syllabusKey="sju_syllabus_done_v1";
function getSyllabusDone(){try{return JSON.parse(localStorage.getItem(syllabusKey)||"[]");}catch{return [];}}
function updateSyllabusProgress(){
 const done=getSyllabusDone(),total=chapters.length,pct=Math.round(done.length/total*100);
 ["#syllabusCount","#chapterProgressText"].forEach(sel=>{const el=$(sel);if(el)el.textContent=`${done.length} / ${total} completed`;});
 ["#syllabusPercent"].forEach(sel=>{const el=$(sel);if(el)el.textContent=pct+"%";});
 ["#syllabusBar","#chapterProgressBar"].forEach(sel=>{const el=$(sel);if(el)el.style.width=pct+"%";});
}
function renderChapters(){
 const q=$("#chapterSearch").value.toLowerCase(),sub=$("#subjectFilter").value,done=getSyllabusDone();
 const items=chapters.filter(c=>(!sub||c.subject===sub)&&(!q||(c.title+" "+c.subject).toLowerCase().includes(q)));
 $("#chapterGrid").innerHTML=items.map(c=>`<div class="chapter"><label><input type="checkbox" data-syllabus="${escapeHTML(c.id)}" ${done.includes(c.id)?"checked":""}> Completed</label><button class="chapter-open" type="button" data-chapter="${escapeHTML(c.title)}"><small>${escapeHTML(c.subject)}</small><b>${escapeHTML(c.title)}</b></button></div>`).join("")||'<p>No chapters match your search.</p>';
 document.querySelectorAll("[data-chapter]").forEach(b=>b.addEventListener("click",()=>{ $("#qTopic").value=b.dataset.chapter; $("#quickquiz").scrollIntoView({behavior:"smooth"}); }));
 document.querySelectorAll("[data-syllabus]").forEach(box=>box.addEventListener("change",()=>{const next=new Set(getSyllabusDone());if(box.checked)next.add(box.dataset.syllabus);else next.delete(box.dataset.syllabus);localStorage.setItem(syllabusKey,JSON.stringify([...next]));updateSyllabusProgress();}));
 updateSyllabusProgress();
}
$("#chapterSearch").addEventListener("input",renderChapters);$("#subjectFilter").addEventListener("change",renderChapters);renderChapters();
$("#quickQuizForm").addEventListener("submit",async e=>{
 e.preventDefault(); const out=$("#quizOutput");out.innerHTML='<div class="study-panel">Preparing your practice set…</div>';
 try{
  const r=await fetch("/api/mock-test",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({exam:$("#qExam").value,topic:$("#qTopic").value,difficulty:$("#qLevel").value,count:Number($("#qCount").value)})});
  const d=await r.json();if(!r.ok)throw Error(d.error||"Could not create practice set");
  const qs=d.questions||[];let answers={};
  out.innerHTML=`<div class="pill-note">${escapeHTML(d.source||"Practice set")} · ${qs.length} questions</div><div id="quickQuestions">${qs.map((q,i)=>`<article class="quiz-q"><b>${i+1}. ${escapeHTML(q.question)}</b><div>${q.options.map((o,j)=>`<button type="button" data-q="${i}" data-a="${j}">${String.fromCharCode(65+j)}. ${escapeHTML(o)}</button>`).join("")}</div><div class="muted-small" id="explain-${i}"></div></article>`).join("")}</div><button class="btn primary" id="submitQuick" type="button">Check my answers</button><div id="quickScore"></div><p class="muted-small">${escapeHTML(d.note||"Review each explanation after submitting.")}</p>`;
  out.querySelectorAll("[data-q]").forEach(b=>b.addEventListener("click",()=>{answers[b.dataset.q]=Number(b.dataset.a);out.querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach(x=>x.classList.toggle("chosen",x===b));}));
  $("#submitQuick").addEventListener("click",()=>{
   let score=0;qs.forEach((q,i)=>{if(answers[i]===q.answerIndex)score++;$(`#explain-${i}`).textContent=`${answers[i]===q.answerIndex?"Correct.":"Correct answer: "+q.options[q.answerIndex]+". "} ${q.explanation||""}`;});
   $("#quickScore").innerHTML=`<div class="study-panel"><h2>Score: ${score}/${qs.length}</h2><p>${Math.round(score/qs.length*100)}% · ${score===qs.length?"Perfect set!":"Review the explanations and practise again."}</p></div>`;
   $("#submitQuick").disabled=true;
  });
 }catch(err){out.innerHTML=`<div class="study-panel">${escapeHTML(err.message)}</div>`;}
});
let passage="Government examinations reward steady preparation, clear understanding and careful time management. Read each question fully, practise the basics and review your mistakes. Consistent learning can improve confidence and help you use your exam time wisely. A regular routine with revision, mock tests and typing practice can make study sessions more effective.";
function resetTyping(){
 clearInterval(typingTimer);typingTimer=null;typingActive=false;typingStarted=0;typingEnd=0;
 $("#typingInput").value="";$("#typingInput").disabled=true;$("#typingPassage").textContent=passage;
 const mins=Number($("#typingDuration").value);$("#timeLeft").textContent=String(mins).padStart(2,"0")+":00";
 $("#wpm").textContent="0";$("#accuracy").textContent="100%";$("#typingProgress").style.width="0%";
 $("#typingResult").textContent="Press Start to begin your timed practice.";
}
function typingMetrics(){
 const typed=$("#typingInput").value,elapsed=Math.max(1,(Date.now()-typingStarted)/60000);
 let correct=0;for(let i=0;i<typed.length;i++)if(typed[i]===passage[i])correct++;
 const accuracy=typed.length?Math.round(correct/typed.length*100):100;
 $("#wpm").textContent=String(Math.round((typed.trim()?typed.trim().split(/\s+/).length:0)/elapsed));
 $("#accuracy").textContent=accuracy+"%";
}
function finishTyping(){
 clearInterval(typingTimer);typingActive=false;$("#typingInput").disabled=true;
 typingMetrics();
 $("#typingResult").textContent=`Session complete. ${$("#wpm").textContent} WPM · ${$("#accuracy").textContent} accuracy. Review your accuracy first, then repeat to build consistency.`;
 const plan=[...document.querySelectorAll('#dailyPlan input')];const t=plan.find(x=>x.value==="3");if(t&&!t.checked){t.checked=true;updatePlan();}
}
$("#typingStart").addEventListener("click",()=>{
 if(typingActive)return;
 resetTyping();const mins=Number($("#typingDuration").value);typingStarted=Date.now();typingEnd=typingStarted+mins*60000;typingActive=true;$("#typingInput").disabled=false;$("#typingInput").focus();
 $("#typingResult").textContent="Timer running — type the passage above. You can finish early by pressing Reset.";
 typingTimer=setInterval(()=>{const left=Math.max(0,typingEnd-Date.now()),sec=Math.ceil(left/1000);$("#timeLeft").textContent=String(Math.floor(sec/60)).padStart(2,"0")+":"+String(sec%60).padStart(2,"0");$("#typingProgress").style.width=((1-left/(mins*60000))*100)+"%";typingMetrics();if(left<=0)finishTyping();},500);
});
$("#typingInput").addEventListener("input",()=>{if(!typingActive)return;typingMetrics();if($("#typingInput").value.length>=passage.length)$("#typingResult").textContent="Passage completed. Continue practising accuracy until the timer ends, or reset for another session.";});
$("#typingReset").addEventListener("click",resetTyping);$("#typingDuration").addEventListener("change",resetTyping);resetTyping();

// Daily student benefits: date-based rotation, with content bundled locally.
const dailyQuestions = [
 {q:"Which part of the Indian Constitution contains the Fundamental Rights?",o:["Part II","Part III","Part IV","Part V"],a:1,e:"Fundamental Rights are set out in Part III (Articles 12–35)."},
 {q:"The headquarters of the Reserve Bank of India is in which city?",o:["New Delhi","Kolkata","Mumbai","Chennai"],a:2,e:"The RBI's central office is in Mumbai."},
 {q:"Which river is known as the 'Sorrow of Bihar'?",o:["Kosi","Narmada","Godavari","Tapi"],a:0,e:"The Kosi has historically caused severe flooding in Bihar."},
 {q:"Who was the chairman of the Drafting Committee of the Constituent Assembly?",o:["Rajendra Prasad","B. R. Ambedkar","Jawaharlal Nehru","Sardar Patel"],a:1,e:"Dr. B. R. Ambedkar chaired the Drafting Committee."},
 {q:"Which gas is most abundant in Earth's atmosphere?",o:["Oxygen","Carbon dioxide","Nitrogen","Hydrogen"],a:2,e:"Nitrogen makes up about 78% of dry air."},
 {q:"The 73rd Constitutional Amendment is associated with which institution?",o:["Municipalities","Panchayati Raj","Supreme Court","Election Commission"],a:1,e:"The 73rd Amendment gave constitutional status to Panchayati Raj institutions."},
 {q:"Where is the headquarters of the United Nations?",o:["Geneva","Paris","New York City","Vienna"],a:2,e:"The UN headquarters is in New York City."}
];
const dailyWords = [
 ["Abundant","Available in large quantities","Fresh water is abundant in this region.","Plentiful; ample"],
 ["Diligent","Showing careful and steady effort","A diligent student revises every day.","Hardworking; industrious"],
 ["Concise","Giving information clearly in few words","Write a concise answer in the exam.","Brief; succinct"],
 ["Resilient","Able to recover quickly from difficulty","Resilient learners keep trying after setbacks.","Tough; adaptable"],
 ["Impartial","Treating all sides fairly","A judge must remain impartial.","Fair; unbiased"],
 ["Inevitable","Certain to happen","Change is inevitable.","Unavoidable; certain"],
 ["Meticulous","Very careful about details","Check your form with meticulous care.","Thorough; precise"],
 ["Prudent","Showing good judgement and care","It is prudent to verify an official notice.","Wise; sensible"]
];
const dailyNotes = [
 ["Fundamental Rights","Part III of the Constitution (Articles 12–35) contains Fundamental Rights. The six broad categories include equality, freedom, protection against exploitation, freedom of religion, cultural and educational rights, and constitutional remedies.","Exam tip: Article 32 provides the right to move the Supreme Court for enforcement of Fundamental Rights."],
 ["Number System: Divisibility by 3","A number is divisible by 3 when the sum of its digits is divisible by 3. Example: 5,472 → 5+4+7+2 = 18, so 5,472 is divisible by 3.","Try it: Is 8,136 divisible by 3? Add its digits first."],
 ["Indian Geography: Tropic of Cancer","The Tropic of Cancer (23½° N approximately) passes through eight Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.","Memory tip: revise the states from west to east on an outline map."],
 ["English Grammar: Subject–Verb Agreement","A singular subject generally takes a singular verb, while a plural subject takes a plural verb. Example: 'She writes' and 'They write'. Words between the subject and verb do not change the subject's number.","Exam tip: identify the main subject before choosing the verb."],
 ["Percentage Shortcut","To find x% of y, calculate (x × y) ÷ 100. Example: 15% of 240 = 15 × 240 ÷ 100 = 36.","Shortcut: 10% of a number is one-tenth; 5% is half of 10%."],
 ["Indian Polity: Directive Principles","Directive Principles of State Policy are contained in Part IV (Articles 36–51). They guide the state in making laws and policies and are not enforceable by courts in the same way as Fundamental Rights.","Remember: Fundamental Rights = Part III; Directive Principles = Part IV."],
 ["Reasoning: Number Series","In a number series, check common differences first, then differences of differences, multiplication/division, squares, cubes or alternating patterns.","Exam tip: avoid assuming a pattern after checking only the first two terms."]
];
function dayIndex(length){const d=new Date();const start=new Date(d.getFullYear(),0,0);const day=Math.floor((d-start)/86400000);return day%length;}
function renderDailyBenefits(){
 const qi=dayIndex(dailyQuestions.length),wi=dayIndex(dailyWords.length),ni=dayIndex(dailyNotes.length);
 const qset=dailyQuestions[qi],word=dailyWords[wi],note=dailyNotes[ni];
 $("#affairsIntro").textContent=`Practice set ${qi+1} of ${dailyQuestions.length} · ${today}`;
 $("#affairsQuestions").innerHTML=`<div class="daily-question"><b>${escapeHTML(qset.q)}</b>${qset.o.map((v,i)=>`<button type="button" data-daily-answer="${i}">${String.fromCharCode(65+i)}. ${escapeHTML(v)}</button>`).join("")}<p class="muted-small" id="dailyExplanation"></p></div>`;
 $("#affairsQuestions").querySelectorAll("[data-daily-answer]").forEach(btn=>btn.addEventListener("click",()=>{
  const chosen=Number(btn.dataset.dailyAnswer);const all=$("#affairsQuestions").querySelectorAll("button");all.forEach((b,i)=>{b.disabled=true;if(i===qset.a)b.classList.add("correct");if(i===chosen&&chosen!==qset.a)b.classList.add("wrong");});
  $("#dailyExplanation").textContent=`${chosen===qset.a?"Correct!":"Not quite."} ${qset.e}`;$("#affairsScore").textContent=chosen===qset.a?"Well done — answer correct.":"Review the explanation and try another topic.";
 }));
 $("#dailyWord").textContent=word[0];$("#wordMeaning").textContent=word[1];$("#wordExample").textContent=`Example: ${word[2]}`;$("#wordSynonyms").textContent=`Synonyms: ${word[3]}`;
 $("#noteTitle").textContent=note[0];$("#noteBody").textContent=note[1];$("#noteTip").textContent=note[2];
}
renderDailyBenefits();


// Additional daily micro-lessons. These rotate through a local sample bank, not live news.
const dailyReasoning=[
 ["Number pattern","2, 6, 12, 20, 30, ?","42","The differences are +4, +6, +8, +10, then +12."],
 ["Odd one out","Apple, Mango, Carrot, Banana","Carrot","Carrot is generally classified as a vegetable; the others are fruits."],
 ["Direction sense","A person walks 4 km north, then 3 km east. In which direction is the starting point?","South-west","From the final position, the starting point lies south-west."],
 ["Alphabet series","A, C, F, J, O, ?","U","The letter gaps increase by 1: +2, +3, +4, +5, then +6."]
];
const dailyFormulas=[
 ["Average","Average = Sum of observations ÷ Number of observations","Example: (10 + 20 + 30) ÷ 3 = 20."],
 ["Simple Interest","SI = (Principal × Rate × Time) ÷ 100","Example: ₹1,000 at 5% for 2 years gives ₹100 SI."],
 ["Speed","Speed = Distance ÷ Time","Example: 120 km ÷ 2 hours = 60 km/h."],
 ["Percentage","Percentage = (Part ÷ Whole) × 100","Example: 45 out of 60 = 75%."],
 ["Profit percentage","Profit % = (Profit ÷ Cost Price) × 100","Example: CP ₹200, SP ₹250 → profit 25%." ]
];
const dailyFacts=[
 ["Indian Constitution","The Constitution of India was adopted on 26 November 1949 and came into effect on 26 January 1950."],
 ["Space science","The Indian Space Research Organisation (ISRO) was established in 1969."],
 ["Indian geography","The Tropic of Cancer passes through eight states in India."],
 ["Parliament","The Parliament of India consists of the President and two Houses: Lok Sabha and Rajya Sabha."]
];
const dailyGrammar=[
 ["Articles","Use 'an' before a vowel sound, not simply a vowel letter. Example: an honest person; a university."],
 ["Subject–verb agreement","A singular subject generally takes a singular verb: 'She writes'. A plural subject takes a plural verb: 'They write'."],
 ["Prepositions","Use 'since' for a starting point in time and 'for' for a duration: since Monday; for three days."],
 ["Tenses","Use the present perfect for an action connected to the present: 'I have finished my work'."]
];
function renderDailyExtras(){
 const i=dayIndex(dailyReasoning.length),r=dailyReasoning[i],f=dailyFormulas[dayIndex(dailyFormulas.length)],fact=dailyFacts[dayIndex(dailyFacts.length)],g=dailyGrammar[dayIndex(dailyGrammar.length)];
 $("#reasoningTitle").textContent="🧠 "+r[0];$("#reasoningPrompt").textContent=r[1];$("#reasoningAnswer").textContent="Answer: "+r[2]+" — "+r[3];
 $("#reasoningReveal").addEventListener("click",()=>{$("#reasoningAnswer").hidden=false;});
 $("#formulaTitle").textContent="➗ "+f[0];$("#formulaBody").textContent=f[1];$("#formulaExample").textContent=f[2];
 $("#factTitle").textContent="🌍 "+fact[0];$("#factBody").textContent=fact[1];$("#grammarTitle").textContent="✍️ "+g[0];$("#grammarBody").textContent=g[1];
}
renderDailyExtras();

// Local-only student tools. Entries remain in this browser unless its site data is cleared.
function readStore(key){try{return JSON.parse(localStorage.getItem(key)||"[]");}catch{return [];}}
function writeStore(key,value){localStorage.setItem(key,JSON.stringify(value));}
const appKey="sju_applications_v1",eventKey="sju_exam_events_v1",notesKey="sju_personal_notes_v1";
function renderApplications(){
 const list=readStore(appKey);$("#applicationList").replaceChildren();
 if(!list.length){$("#applicationList").textContent="No applications saved yet.";return;}
 list.forEach((item,i)=>{const row=document.createElement("div");row.className="tool-item";const info=document.createElement("div"),title=document.createElement("b"),meta=document.createElement("small"),del=document.createElement("button");title.textContent=item.exam;meta.textContent=`${item.date} · ${item.status}`;info.append(title,document.createElement("br"),meta);del.className="small-action";del.textContent="Delete";del.addEventListener("click",()=>{const a=readStore(appKey);a.splice(i,1);writeStore(appKey,a);renderApplications();});row.append(info,del);$("#applicationList").append(row);});
}
$("#applicationForm").addEventListener("submit",e=>{e.preventDefault();const a=readStore(appKey);a.unshift({exam:$("#appExam").value.trim(),date:$("#appDate").value,status:$("#appStatus").value});writeStore(appKey,a);e.target.reset();renderApplications();});renderApplications();
function safeExternalUrl(value){try{const u=new URL(value);return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return "";}}
function renderEvents(){
 const list=readStore(eventKey).sort((a,b)=>a.date.localeCompare(b.date));$("#eventList").replaceChildren();
 if(!list.length){$("#eventList").textContent="No personal reminders added yet.";return;}
 list.forEach((item,i)=>{const row=document.createElement("div");row.className="tool-item";const info=document.createElement("div"),title=document.createElement("b"),meta=document.createElement("small"),del=document.createElement("button");title.textContent=item.title;meta.textContent=item.date;info.append(title,document.createElement("br"),meta);const url=safeExternalUrl(item.url);if(url){const link=document.createElement("a");link.href=url;link.target="_blank";link.rel="noopener";link.textContent="Official notice ↗";info.append(document.createElement("br"),link);}del.className="small-action";del.textContent="Delete";del.addEventListener("click",()=>{const a=readStore(eventKey);a.splice(i,1);writeStore(eventKey,a);renderEvents();});row.append(info,del);$("#eventList").append(row);});
}
$("#eventForm").addEventListener("submit",e=>{e.preventDefault();const url=$("#eventUrl").value.trim();if(url&&!safeExternalUrl(url)){alert("Please enter a valid http or https official link.");return;}const a=readStore(eventKey);a.push({title:$("#eventTitle").value.trim(),date:$("#eventDate").value,url});writeStore(eventKey,a);e.target.reset();renderEvents();});renderEvents();
$("#eligibilityForm").addEventListener("submit",e=>{e.preventDefault();const age=Number($("#eligAge").value),min=Number($("#eligMin").value),max=Number($("#eligMax").value),relax=Number($("#eligRelax").value),edu=$("#eligEducation").value;const result=$("#eligibilityResult");if(max<min){result.textContent="Maximum age must be equal to or greater than minimum age.";return;}const upper=max+relax,ageOk=age>=min&&age<=upper;if(edu==="no"||!ageOk){result.textContent="Based only on the values entered, you do not meet all the entered criteria. Check the official notice for exact rules and cut-off date.";}else if(edu==="unknown"){result.textContent="Age is within the entered range, but education is unconfirmed. Verify the qualification and all other conditions in the official notice.";}else{result.textContent="Your entered age and education appear to match these entered criteria. This is not an official eligibility decision; verify every condition in the notification.";}});
function renderNotes(){
 const list=readStore(notesKey);$("#notesList").replaceChildren();if(!list.length){$("#notesList").textContent="No notes saved yet.";return;}
 list.forEach((item,i)=>{const row=document.createElement("div");row.className="tool-item";const info=document.createElement("div"),title=document.createElement("b"),body=document.createElement("p"),del=document.createElement("button");title.textContent=item.title;body.textContent=item.body;info.append(title,body);del.className="small-action";del.textContent="Delete";del.addEventListener("click",()=>{const a=readStore(notesKey);a.splice(i,1);writeStore(notesKey,a);renderNotes();});row.append(info,del);$("#notesList").append(row);});
}
$("#notesForm").addEventListener("submit",e=>{e.preventDefault();const a=readStore(notesKey);a.unshift({title:$("#noteHeading").value.trim(),body:$("#noteText").value.trim()});writeStore(notesKey,a);e.target.reset();renderNotes();});renderNotes();
const calcDefinitions={
 percentage:[{id:"calcA",label:"Percentage (%)",placeholder:"e.g. 15"},{id:"calcB",label:"Number",placeholder:"e.g. 240"}],
 average:[{id:"calcA",label:"Numbers (comma-separated)",placeholder:"e.g. 10, 20, 30"}],
 profit:[{id:"calcA",label:"Cost price",placeholder:"e.g. 200"},{id:"calcB",label:"Selling price",placeholder:"e.g. 250"}],
 interest:[{id:"calcA",label:"Principal",placeholder:"e.g. 1000"},{id:"calcB",label:"Annual rate (%)",placeholder:"e.g. 5"},{id:"calcC",label:"Time (years)",placeholder:"e.g. 2"}]
};
function renderCalcFields(){const type=$("#calcType").value,box=$("#calcFields");box.replaceChildren();calcDefinitions[type].forEach(field=>{const label=document.createElement("label"),input=document.createElement("input");label.textContent=field.label;input.id=field.id;input.placeholder=field.placeholder;input.type="text";input.inputMode="decimal";label.append(input);box.append(label);});$("#calcResult").textContent="Enter values and calculate.";}
$("#calcType").addEventListener("change",renderCalcFields);renderCalcFields();
$("#calculateBtn").addEventListener("click",()=>{const type=$("#calcType").value,read=id=>$("#"+id).value.trim(),num=id=>Number(read(id));let answer="";
 if(type==="percentage"){const a=num("calcA"),b=num("calcB");if(!read("calcA")||!read("calcB"))return $("#calcResult").textContent="Enter both values.";answer=`${a}% of ${b} = ${(a*b/100).toFixed(2)}`;}
 if(type==="average"){const values=read("calcA").split(",").map(x=>x.trim()).filter(Boolean).map(Number);if(!values.length||values.some(x=>!Number.isFinite(x)))return $("#calcResult").textContent="Enter valid numbers separated by commas.";answer=`Average = ${(values.reduce((a,b)=>a+b,0)/values.length).toFixed(2)} (count: ${values.length})`;}
 if(type==="profit"){const cp=num("calcA"),sp=num("calcB");if(!read("calcA")||!read("calcB")||cp<=0)return $("#calcResult").textContent="Enter a positive cost price and a selling price.";const diff=sp-cp;answer=diff>=0?`Profit = ${diff.toFixed(2)} · Profit % = ${(diff/cp*100).toFixed(2)}%`:`Loss = ${Math.abs(diff).toFixed(2)} · Loss % = ${(Math.abs(diff)/cp*100).toFixed(2)}%`;}
 if(type==="interest"){const p=num("calcA"),r=num("calcB"),t=num("calcC");if(!read("calcA")||!read("calcB")||!read("calcC")||p<0||r<0||t<0)return $("#calcResult").textContent="Enter valid non-negative values.";const si=p*r*t/100;answer=`Simple interest = ${si.toFixed(2)} · Total amount = ${(p+si).toFixed(2)}`;}
 $("#calcResult").textContent=answer;
});

// v3.4 student super-tools. Personal records are local to this browser.
const performanceKey="sju_exam_performance_v1",timetableKey="sju_smart_timetable_v1",libraryKey="sju_offline_library_v1";
const safeText=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// AI Study Assistant: the server keeps the API key private. Without a key it provides a useful study outline.
$("#askAssistant")?.addEventListener("click",async()=>{const q=$("#assistantQuestion").value.trim(),out=$("#assistantAnswer");if(!q){out.textContent="Please enter a question first.";return;}out.textContent="Preparing your explanation…";try{const r=await fetch("/api/study-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q})});const d=await r.json();out.textContent=d.answer||d.error||"No answer returned.";}catch{out.textContent="Could not connect. Check your internet connection and try again.";}});
$("#clearAssistant")?.addEventListener("click",()=>{$("#assistantQuestion").value="";$("#assistantAnswer").textContent="Your answer will appear here.";});
// Exam simulator using the existing secure mock-test endpoint.
let simQuestions=[],simAnswers={},simStarted=0,simDeadline=0,simTimer=null,simFinished=false;
function renderSimulator(){const box=$("#simArea");if(!simQuestions.length){box.textContent="Your test will appear here.";return;}const left=Math.max(0,Math.ceil((simDeadline-Date.now())/1000));box.innerHTML=`<div><b>${safeText($("#simExam").value)} practice test</b> · <b id="simClock">${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}</b></div><p>${Object.keys(simAnswers).length} / ${simQuestions.length} answered</p><div class="tool-actions">${simQuestions.map((q,i)=>`<button class="small-action" type="button" data-jump="${i}">Q${i+1}</button>`).join("")}</div>`+simQuestions.map((q,i)=>`<div class="quiz-q"><b>Q${i+1}. ${safeText(q.question)}</b>${(q.options||[]).map((o,j)=>`<button type="button" data-q="${i}" data-a="${j}" class="${simAnswers[i]===j?"chosen":""}" ${simFinished?"disabled":""}>${String.fromCharCode(65+j)}. ${safeText(o)}</button>`).join("")}${simFinished?`<p class="muted-small">Correct answer: ${safeText((q.options||[])[q.answerIndex]||"Not available")}. ${safeText(q.explanation||"")}</p>`:""}</div>`).join("")+(simFinished?`<div class="tool-result">Test submitted. Score: ${simAnswers.score||0}/${simQuestions.length} (${Math.round((simAnswers.score||0)/simQuestions.length*100)}%).</div>`:`<button class="btn primary" id="simSubmit" type="button">Submit test</button>`);
box.querySelectorAll("button[data-q]").forEach(b=>b.addEventListener("click",()=>{if(simFinished)return;simAnswers[Number(b.dataset.q)]=Number(b.dataset.a);renderSimulator();}));box.querySelectorAll("button[data-jump]").forEach(b=>b.addEventListener("click",()=>box.querySelectorAll(".quiz-q")[Number(b.dataset.jump)]?.scrollIntoView({behavior:"smooth",block:"start"})));$("#simSubmit")?.addEventListener("click",()=>finishSimulator(false));}
async function startSimulator(){clearInterval(simTimer);$("#simArea").textContent="Preparing your practice paper…";try{const r=await fetch("/api/mock-test",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({exam:$("#simExam").value,topic:$("#simTopic").value||"General Knowledge",difficulty:"Medium",count:Number($("#simCount").value)})});const d=await r.json();if(!r.ok||!Array.isArray(d.questions)||!d.questions.length)throw new Error(d.error||"Question set unavailable");simQuestions=d.questions;simAnswers={};simFinished=false;simStarted=Date.now();simDeadline=simStarted+Number($("#simDuration").value)*60000;renderSimulator();simTimer=setInterval(()=>{if(Date.now()>=simDeadline)finishSimulator(true);else{const c=$("#simClock");if(c){const n=Math.ceil((simDeadline-Date.now())/1000);c.textContent=`${Math.floor(n/60)}:${String(n%60).padStart(2,"0")}`;}}},500);}catch(e){$("#simArea").textContent="Unable to start test: "+e.message;}}
function finishSimulator(auto){if(simFinished||!simQuestions.length)return;simFinished=true;clearInterval(simTimer);let score=0;simQuestions.forEach((q,i)=>{if(simAnswers[i]===Number(q.answerIndex))score++;});simAnswers.score=score;const history=readStore(performanceKey);history.unshift({exam:$("#simExam").value,topic:$("#simTopic").value,score,total:simQuestions.length,percent:Math.round(score/simQuestions.length*100),date:new Date().toISOString(),durationSeconds:Math.round((Date.now()-simStarted)/1000)});writeStore(performanceKey,history.slice(0,100));renderSimulator();renderPerformance();if(auto)$("#simArea").insertAdjacentHTML("afterbegin","<p><b>Time is up — your test was submitted automatically.</b></p>");}
$("#simStart")?.addEventListener("click",startSimulator);
function renderPerformance(){const h=readStore(performanceKey),avg=h.length?Math.round(h.reduce((s,x)=>s+x.percent,0)/h.length):null,best=h.length?Math.max(...h.map(x=>x.percent)):null;$("#perfAttempts").textContent=h.length;$("#perfAverage").textContent=avg===null?"—":avg+"%";$("#perfBest").textContent=best===null?"—":best+"%";const box=$("#performanceHistory");box.replaceChildren();if(!h.length){box.textContent="Complete a simulator test to see your progress here.";return;}h.slice(0,8).forEach(x=>{const d=document.createElement("div");d.className="tool-item";const span=document.createElement("span");span.textContent=`${x.exam} · ${x.topic} — ${x.score}/${x.total} (${x.percent}%)`;const small=document.createElement("small");small.textContent=new Date(x.date).toLocaleDateString();d.append(span,small);box.append(d);});}renderPerformance();
// Published jobs feed and official admit/result links.
let cachedJobs=[];async function loadStudentJobs(){const box=$("#dailyJobs");box.textContent="Loading published updates…";try{const r=await fetch("/api/jobs");const d=await r.json();cachedJobs=Array.isArray(d.jobs)?d.jobs:[];renderStudentJobs();$("#jobsUpdated").textContent="Last checked: "+new Date(d.updatedAt||Date.now()).toLocaleString();}catch{box.textContent="Could not load updates. Please retry when connected.";}}
function renderStudentJobs(){const box=$("#dailyJobs"),filter=$("#jobFilter").value,list=cachedJobs.filter(x=>!filter||x.type===filter);box.replaceChildren();if(!list.length){box.textContent="No matching published updates. Check official portals for the latest notices.";return;}list.slice(0,30).forEach(j=>{const row=document.createElement("div");row.className="tool-item";const info=document.createElement("div"),title=document.createElement("b"),meta=document.createElement("small"),link=document.createElement("a");title.textContent=j.title;meta.textContent=`${j.organization||"Recruitment authority"} · ${j.type||"Update"} · ${j.region||"India"} · Last date: ${j.lastDate||"See notice"}`;link.href=safeExternalUrl(j.officialUrl)||"#";link.target="_blank";link.rel="noopener";link.textContent="Official notice ↗";info.append(title,document.createElement("br"),meta,document.createElement("br"),link);row.append(info);box.append(row);});}
$("#refreshJobs")?.addEventListener("click",loadStudentJobs);$("#jobFilter")?.addEventListener("change",renderStudentJobs);loadStudentJobs();
// Typing Pro switches the existing trainer between English and Hindi Unicode passages.
const typingEnglish=$("#typingPassage")?.textContent||"";const typingHindi="भारत का संविधान देश का सर्वोच्च कानून है। नियमित अभ्यास, सही योजना और समय का अच्छा उपयोग प्रतियोगी परीक्षाओं की तैयारी में मदद करता है। प्रत्येक प्रश्न को ध्यान से पढ़ें और अपनी गलतियों से सीखें।";
$("#typingProApply")?.addEventListener("click",()=>{const hi=$("#typingLanguage").value==="hi";passage=hi?typingHindi:typingEnglish;$("#typingPassage").textContent=passage;$("#typingInput").value="";$("#typingProInfo").textContent=hi?"Hindi Unicode passage applied. Ensure your device has a Hindi keyboard enabled.":"English passage applied.";$("#typingReset")?.click();});
// Smart timetable.
function renderTimetable(){const list=readStore(timetableKey).sort((a,b)=>a.time.localeCompare(b.time)),box=$("#timetableList");box.replaceChildren();if(!list.length){box.textContent="No study sessions planned yet.";return;}list.forEach((x,i)=>{const row=document.createElement("div");row.className="tool-item";const info=document.createElement("span");info.textContent=`${x.time} · ${x.task} (${x.duration})`;const del=document.createElement("button");del.className="small-action";del.textContent="Delete";del.addEventListener("click",()=>{const a=readStore(timetableKey);a.splice(i,1);writeStore(timetableKey,a);renderTimetable();});row.append(info,del);box.append(row);});}
$("#timetableForm")?.addEventListener("submit",e=>{e.preventDefault();const a=readStore(timetableKey);a.push({task:$("#timetableTask").value.trim(),time:$("#timetableTime").value,duration:$("#timetableDuration").value});writeStore(timetableKey,a);e.target.reset();renderTimetable();});renderTimetable();
// Offline study library, including JSON export.
function renderLibrary(){const a=readStore(libraryKey),box=$("#libraryList");box.replaceChildren();if(!a.length){box.textContent="Your saved library is empty.";return;}a.forEach((x,i)=>{const row=document.createElement("div");row.className="tool-item";const info=document.createElement("div"),title=document.createElement("b"),body=document.createElement("p"),del=document.createElement("button");title.textContent=x.title;body.textContent=x.body;info.append(title,body);del.className="small-action";del.textContent="Delete";del.addEventListener("click",()=>{const n=readStore(libraryKey);n.splice(i,1);writeStore(libraryKey,n);renderLibrary();});row.append(info,del);box.append(row);});}
$("#saveLibrary")?.addEventListener("click",()=>{const title=$("#libraryTitle").value.trim(),body=$("#libraryBody").value.trim();if(!title||!body){alert("Enter both a title and study content.");return;}const a=readStore(libraryKey);a.unshift({title,body,savedAt:new Date().toISOString()});writeStore(libraryKey,a);$("#libraryTitle").value="";$("#libraryBody").value="";renderLibrary();});
$("#exportLibrary")?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify(readStore(libraryKey),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="sju-offline-study-library.json";a.click();URL.revokeObjectURL(url);});renderLibrary();
// Read aloud via Web Speech API; gracefully report unsupported browsers.
$("#speakText")?.addEventListener("click",()=>{const text=$("#readAloudText").value.trim(),status=$("#speechStatus");if(!text){status.textContent="Enter some text to read first.";return;}if(!("speechSynthesis" in window)){status.textContent="Read aloud is not supported by this browser.";return;}speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(text);utter.lang=$("#readAloudLang").value;utter.onend=()=>status.textContent="Finished reading.";utter.onerror=()=>status.textContent="The selected device voice could not read this text.";speechSynthesis.speak(utter);status.textContent="Reading aloud…";});
$("#pauseSpeech")?.addEventListener("click",()=>{if(!("speechSynthesis" in window))return;if(speechSynthesis.paused)speechSynthesis.resume();else speechSynthesis.pause();});$("#stopSpeech")?.addEventListener("click",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();$("#speechStatus").textContent="Stopped.";});
// State-wise official recruitment portals; state links are starting points, not vacancy claims.
const statePortals={jk:[["JKSSB","https://jkssb.nic.in/"],["JKPSC","https://jkpsc.nic.in/"],["J&K Police","https://jkpolice.gov.in/"]],national:[["UPSC","https://upsc.gov.in/"],["SSC","https://ssc.gov.in/"],["Railway RRB","https://www.rrbcdg.gov.in/"],["IBPS","https://www.ibps.in/"],["National Career Service","https://www.ncs.gov.in/"]],up:[["UPPSC","https://uppsc.up.nic.in/"],["UPSSSC","https://upsssc.gov.in/"]],bihar:[["BPSC","https://bpsc.bih.nic.in/"],["BSSC","https://bssc.bihar.gov.in/"]],rajasthan:[["RPSC","https://rpsc.rajasthan.gov.in/"],["RSSB","https://rssb.rajasthan.gov.in/"]],haryana:[["HPSC","https://hpsc.gov.in/"],["HSSC","https://www.hssc.gov.in/"]],punjab:[["PPSC","https://ppsc.gov.in/"]],delhi:[["DSSSB","https://dsssb.delhi.gov.in/"],["Delhi Police","https://delhipolice.gov.in/"]],mp:[["MPPSC","https://mppsc.mp.gov.in/"],["MPESB","https://esb.mp.gov.in/"]],maharashtra:[["MPSC","https://mpsc.gov.in/"]]};
function renderStatePortals(){const box=$("#stateZoneLinks");box.replaceChildren();(statePortals[$("#stateZoneSelect").value]||[]).forEach(([name,url])=>{const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener";a.textContent=name+" official portal ↗";box.append(a);});}$("#stateZoneSelect")?.addEventListener("change",renderStatePortals);renderStatePortals();

// PWA/service-worker support is intentionally disabled; the hub runs as a normal website.


// Advanced Age Calculator: exact calendar age at a chosen reference/cut-off date.
function parseLocalDate(value){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value||"")) return null;
 const [y,m,d]=value.split("-").map(Number),dt=new Date(y,m-1,d);
 return dt.getFullYear()===y&&dt.getMonth()===m-1&&dt.getDate()===d?{y,m,d}:null;
}
function ageAtDate(birth,ref){
 if(ref.y<birth.y||(ref.y===birth.y&&(ref.m<birth.m||(ref.m===birth.m&&ref.d<birth.d))))return null;
 let y=ref.y-birth.y,m=ref.m-birth.m,d=ref.d-birth.d;
 if(d<0){m--;const prevMonth=new Date(ref.y,ref.m-1,0);d+=prevMonth.getDate();}
 if(m<0){y--;m+=12;}
 return {y,m,d};
}
function formatDateParts(p){return `${String(p.y).padStart(4,"0")}-${String(p.m).padStart(2,"0")}-${String(p.d).padStart(2,"0")}`;}
$("#ageAsOf").value=today;
$("#ageToday")?.addEventListener("click",()=>{$("#ageAsOf").value=today;$("#ageCalculate").click();});
$("#ageCalculate")?.addEventListener("click",()=>{
 const birth=parseLocalDate($("#ageDob").value),ref=parseLocalDate($("#ageAsOf").value||today),out=$("#ageResult");
 if(!birth){out.textContent="Please enter a valid date of birth.";return;}
 if(!ref){out.textContent="Please enter a valid calculation date.";return;}
 const age=ageAtDate(birth,ref);
 if(!age){out.textContent="The calculation date cannot be earlier than the date of birth.";return;}
 const nextYear=ref.m>birth.m||(ref.m===birth.m&&ref.d>=birth.d)?ref.y+1:ref.y;
 const nextDay=Math.min(birth.d,new Date(nextYear,birth.m,0).getDate());
 const next=new Date(nextYear,birth.m-1,nextDay);
 const refDate=new Date(ref.y,ref.m-1,ref.d);
 const days=Math.ceil((Date.UTC(next.getFullYear(),next.getMonth(),next.getDate())-Date.UTC(refDate.getFullYear(),refDate.getMonth(),refDate.getDate()))/86400000);
 const totalDays=Math.floor((Date.UTC(ref.y,ref.m-1,ref.d)-Date.UTC(birth.y,birth.m-1,birth.d))/86400000);
 out.textContent=`Age: ${age.y} years, ${age.m} months, ${age.d} days. Total completed days: ${totalDays.toLocaleString("en-IN")}. Next birthday: ${next.toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})} (${days} days from calculation date).`;
});
// Exam score calculator with validation against the total question count.
$("#marksCalculate")?.addEventListener("click",()=>{
 const total=Number($("#markTotal").value),correct=Number($("#markCorrect").value),wrong=Number($("#markWrong").value),positive=Number($("#markPositive").value),negative=Number($("#markNegative").value),out=$("#marksResult");
 if(![total,correct,wrong,positive,negative].every(Number.isFinite)||total<1||correct<0||wrong<0||positive<0||negative<0||!Number.isInteger(total)||!Number.isInteger(correct)||!Number.isInteger(wrong)||correct+wrong>total){out.textContent="Check the values: correct + wrong cannot exceed total questions, and marks cannot be negative.";return;}
 const unanswered=total-correct-wrong,score=correct*positive-wrong*negative,max=total*positive,pct=max?score/max*100:0;
 out.textContent=`Estimated score: ${score.toFixed(2)} / ${max.toFixed(2)} (${pct.toFixed(2)}%). Correct: ${correct}, wrong: ${wrong}, unanswered: ${unanswered}.`;
});
// Deadline countdown uses local calendar dates and never sends the event to the server.
$("#deadlineCalculate")?.addEventListener("click",()=>{
 const date=parseLocalDate($("#deadlineDate").value),out=$("#deadlineResult"),name=$("#deadlineName").value.trim()||"Your event";
 if(!date){out.textContent="Please choose a valid target date.";return;}
 const now=new Date(),todayLocal={y:now.getFullYear(),m:now.getMonth()+1,d:now.getDate()};
 const a=Date.UTC(todayLocal.y,todayLocal.m-1,todayLocal.d),b=Date.UTC(date.y,date.m-1,date.d),diff=Math.round((b-a)/86400000);
 out.textContent=diff>0?`${name}: ${diff} day(s) remaining.`:diff===0?`${name}: the date is today.`:`${name}: this date passed ${Math.abs(diff)} day(s) ago.`;
});
