(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const KEY='sju_typing_academy_30day_v1';
 const topics=[
  ['Home row & posture','Beginner','Set a relaxed posture; keep fingers on the home row.'],
  ['Left-hand home keys','Beginner','Practise reaching A, S, D and F without looking down.'],
  ['Right-hand home keys','Beginner','Practise J, K, L and semicolon with the right hand.'],
  ['Top row reach','Beginner','Reach the top row and return to the home position.'],
  ['Bottom row reach','Beginner','Reach the bottom row carefully and return to home row.'],
  ['Common short words','Beginner','Build a steady rhythm with frequent short words.'],
  ['Basic sentences','Beginner','Type complete sentences with spaces and full stops.'],
  ['Capital letters','Intermediate','Use Shift with the opposite hand for capital letters.'],
  ['Punctuation practice','Intermediate','Practise commas, full stops, colons and question marks.'],
  ['Numbers and dates','Intermediate','Type number sequences, dates, times and decimals.'],
  ['Mixed word patterns','Intermediate','Move between different letter combinations smoothly.'],
  ['Long sentences','Intermediate','Maintain accuracy across longer sentences.'],
  ['Paragraph rhythm','Intermediate','Use a consistent pace and avoid unnecessary pauses.'],
  ['Accuracy challenge','Intermediate','Prioritise correct characters over raw speed.'],
  ['Office vocabulary','Intermediate','Practise formal office and administration words.'],
  ['Exam passage I','Advanced','Complete a timed paragraph with punctuation.'],
  ['Exam passage II','Advanced','Improve sustained typing and reduce backspaces.'],
  ['Legal vocabulary','Advanced','Practise formal and legal terms accurately.'],
  ['Application data','Advanced','Practise application numbers, codes and dates.'],
  ['Long-form passage','Advanced','Keep a stable pace over multiple paragraphs.'],
  ['Weak-key review','Advanced','Repeat difficult letter patterns and review errors.'],
  ['Speed ladder','Advanced','Increase speed gradually while retaining accuracy.'],
  ['5-minute mock','Advanced','Attempt a five-minute exam-style simulation.'],
  ['10-minute mock','Advanced','Maintain concentration through a longer test.'],
  ['Advanced punctuation','Expert','Handle symbols, quotes and complex punctuation.'],
  ['Dense paragraph','Expert','Type dense text while keeping a steady rhythm.'],
    ['20-minute endurance','Expert','Maintain accuracy as fatigue increases.'],
  ['Full exam rehearsal','Expert','Use the duration and rules from your target notification.'],
  ['Final assessment','Expert','Review speed, accuracy and readiness for your target exam.']
 ];
 const english=['The student practises every day with relaxed hands and a steady rhythm. Accuracy comes first; speed improves through regular and careful practice.','Public services depend on clear records, correct information and responsible administration. Candidates should read instructions carefully and manage examination time wisely.','Application number 2026/JK/1048; date 23-11-2026; reporting time 10:30 AM; centre code 042; fee Rs. 250.00.','The competent authority shall verify the documents and communicate the decision in accordance with the applicable rules and regulations.'];
 const hindi=['विद्यार्थी प्रतिदिन अभ्यास करता है और अपनी उँगलियों को सही स्थान पर रखता है। शुरुआत में शुद्धता पर ध्यान दें, गति नियमित अभ्यास से बढ़ती है।','सार्वजनिक सेवाओं में सही अभिलेख, स्पष्ट जानकारी और जिम्मेदार प्रशासन का महत्वपूर्ण स्थान है। अभ्यर्थियों को निर्देश ध्यान से पढ़ने चाहिए।','आवेदन संख्या 2026/JK/1048; दिनांक 23-11-2026; समय 10:30 बजे; केंद्र कोड 042; शुल्क ₹250.00।','सक्षम प्राधिकारी सभी दस्तावेजों की जाँच करेगा और लागू नियमों के अनुसार आवश्यक सूचना जारी करेगा।'];
 function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'?x:{}}catch(e){return {}}}
 let state=load(), selected=1;
 function completed(lang){return Array.isArray(state[lang])?state[lang]:[]}
 function levelFor(day){return topics[day-1][1]}
 function getText(lang,day){const pool=lang==='hi'?hindi:english;return pool[(day-1)%pool.length]+'\n\n'+pool[(day)%pool.length]}
 function visibleDays(){const f=$('academyLevelFilter').value;return topics.map((t,i)=>({day:i+1,t})).filter(x=>f==='all'||x.t[1]===f)}
 function render(){const lang=$('academyLanguage').value,done=completed(lang),days=visibleDays();$('academyLessonSelect').innerHTML=days.map(x=>`<option value="${x.day}">Day ${x.day} — ${x.t[0]}</option>`).join('');if(!days.some(x=>x.day===selected))selected=days[0]?.day||1;$('academyLessonSelect').value=String(selected);const t=topics[selected-1];$('academyLessonTitle').textContent=`Day ${selected} — ${t[0]}`;$('academyLessonDesc').textContent=`${t[1]} level. ${t[2]}`;$('academyLessonText').textContent=getText(lang,selected);$('academyLessonStatus').textContent=done.includes(selected)?'Completed ✓ You can repeat this lesson any time.':'Not completed yet. Load the drill, finish a typing test, then mark this lesson complete.';$('academyMarkDone').textContent=done.includes(selected)?'Mark lesson incomplete':'Mark lesson complete';$('academyLessonList').innerHTML=days.map(x=>`<button type="button" class="tw-lesson${done.includes(x.day)?' done':''}" data-day="${x.day}" aria-current="${x.day===selected}">Day ${x.day} ${done.includes(x.day)?'✓':''}<small>${x.t[0]} · ${x.t[1]}</small></button>`).join('');const pct=Math.round(done.length/topics.length*100);$('academyCompleted').textContent=`${done.length} / ${topics.length}`;$('academyPercent').textContent=`${pct}%`;$('academyProgressBar').style.width=pct+'%';$('academyLevel').textContent=done.length<8?'Beginner':done.length<16?'Intermediate':done.length<25?'Advanced':'Expert';}
 function loadLesson(){const lang=$('academyLanguage').value, text=getText(lang,selected);$('typingLanguage').value=lang;$('typingMode').value='custom';$('customPassageWrap').style.display='grid';$('customPassage').value=text;$('typingDuration').value=selected>=23?'20':selected>=16?'10':'5';$('typingReset').click();$('typingResult').textContent=`Academy Day ${selected} loaded. Press Start test to practise.`;$('typingInput').focus();document.getElementById('typingInput').scrollIntoView({behavior:'smooth',block:'center'});}
 $('academyLanguage').addEventListener('change',()=>{selected=1;render()});$('academyLevelFilter').addEventListener('change',render);$('academyLessonSelect').addEventListener('change',e=>{selected=Number(e.target.value);render()});$('academyLessonList').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(!b)return;selected=Number(b.dataset.day);render()});$('academyLoadLesson').addEventListener('click',loadLesson);$('academyMarkDone').addEventListener('click',()=>{const lang=$('academyLanguage').value,done=completed(lang);state[lang]=done.includes(selected)?done.filter(x=>x!==selected):[...done,selected].sort((a,b)=>a-b);localStorage.setItem(KEY,JSON.stringify(state));render()});render();
})();
