(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const HISTORY_KEY = 'sju_typing_pro_history_v2';
  const DAY_KEY = 'sju_typing_pro_last_day_v2';
  const BANK = {
    en: {
      exam: [
        'The Constitution of India establishes the framework of democratic governance, fundamental rights, public duties and independent institutions. Candidates should read every word carefully, maintain a steady rhythm and avoid sacrificing accuracy for speed. Administrative decisions must follow the law, protect citizens and remain transparent.',
        'The recruitment process may include a written examination, skill test, document verification and medical examination. Applicants should check the official notification for eligibility, age limits, syllabus, examination dates and instructions. A candidate must enter the examination hall with valid identification and follow the supervisor instructions.',
        'Digital services have improved access to education, banking, public information and government facilities. Strong passwords, secure networks, regular updates and careful verification of links help protect personal information. Responsible use of technology requires awareness, patience and good judgement.'
      ],
      easy: ['Practice every day to improve your typing speed. Keep your hands relaxed and look at the screen. Accuracy is more important than speed in the beginning.','A good student makes a clear plan, follows a regular routine and checks mistakes after every practice session. Small improvements become strong habits over time.'],
      numbers: ['Application No. 2026/JK/1048; Date: 23-11-2026; Time: 10:30 AM. Fee: Rs. 250.00. Roll No.: 008517; Centre Code: 042; Percentage: 75.50%.','0123456789  98,765.43  18/24/36  01-01-2026  31-12-2026  A+B=C  (X/Y)*100  #Exam2026 @Centre_04'],
      legal: ['Whereas the applicant has submitted the required documents, the authority shall verify the particulars and issue an appropriate communication in accordance with the applicable rules and regulations. Any discrepancy must be reported within the prescribed period.','The undersigned hereby certifies that the information provided in this application is true and complete to the best of their knowledge. The applicant agrees to comply with all instructions issued by the competent authority.'],
      hard: ['Constitutional jurisprudence, administrative accountability, statutory interpretation, fiscal federalism and judicial review demand rigorous analytical precision under high-pressure examination conditions. Candidates must master complex syntax, hyphenated terms, numerical ratios (18:24:36), punctuation marks (;:—) and dense paragraphs without sacrificing accuracy.']
    },
    hi: {
      exam: ['भारत का संविधान देश की शासन व्यवस्था, नागरिकों के मौलिक अधिकारों, कर्तव्यों और स्वतंत्र संस्थाओं का आधार है। प्रत्येक अभ्यर्थी को प्रश्नों को ध्यानपूर्वक पढ़ना चाहिए और सही उत्तर देने के साथ समय का उचित प्रबंधन करना चाहिए। नियमित अभ्यास से गति और शुद्धता दोनों में सुधार होता है।','भर्ती प्रक्रिया में लिखित परीक्षा, कौशल परीक्षण, दस्तावेज सत्यापन और अन्य चरण शामिल हो सकते हैं। उम्मीदवार को आधिकारिक अधिसूचना में दी गई पात्रता, आयु सीमा, पाठ्यक्रम, परीक्षा तिथि और आवश्यक निर्देशों की जाँच करनी चाहिए।'],
      easy: ['नियमित अभ्यास से टाइपिंग की गति और शुद्धता बढ़ती है। शुरुआत में धीरे टाइप करें और हर शब्द को सही लिखने का प्रयास करें। अपनी उँगलियों को सही स्थान पर रखें और स्क्रीन पर ध्यान दें।','एक अच्छा विद्यार्थी समय सारणी बनाता है, प्रतिदिन अभ्यास करता है और अपनी गलतियों को समझकर उनमें सुधार करता है। छोटी-छोटी कोशिशें बड़ी सफलता का रास्ता बनाती हैं।'],
      numbers: ['आवेदन संख्या: 2026/JK/1048; दिनांक: 23-11-2026; समय: 10:30 बजे। शुल्क: ₹250.00; रोल नंबर: 008517; केंद्र कोड: 042; प्रतिशत: 75.50%।','०१२३४५६७८९  98,765.43  18/24/36  01-01-2026  31-12-2026  परीक्षा-2026'],
      legal: ['अधोहस्ताक्षरी प्रमाणित करता है कि आवेदन में दी गई सभी जानकारी मेरी जानकारी के अनुसार सत्य एवं पूर्ण है। किसी भी प्रकार की त्रुटि पाए जाने पर संबंधित अभ्यर्थी को निर्धारित समय सीमा में आवश्यक दस्तावेज प्रस्तुत करने होंगे।','सक्षम प्राधिकारी द्वारा जारी सभी दिशा-निर्देशों का पालन करना प्रत्येक अभ्यर्थी की जिम्मेदारी है। आवेदन जमा करने से पहले नाम, जन्म तिथि, श्रेणी और शैक्षणिक विवरण ध्यानपूर्वक जाँच लें।'],
      hard: ['प्रशासनिक उत्तरदायित्व, संवैधानिक प्रावधान, न्यायिक समीक्षा, वित्तीय संघवाद तथा सार्वजनिक पारदर्शिता जैसे विषयों का अध्ययन एकाग्रता और निरंतर अभ्यास की माँग करता है। अभ्यर्थियों को विराम चिह्न, संख्याओं और संयुक्त शब्दों का सही प्रयोग करना चाहिए।']
    }
  };
  const MIXED = ['The Constitution of India भारत का सर्वोच्च कानून है और सभी नागरिकों को समानता का अधिकार देता है। Candidates should practise daily प्रतिदिन अभ्यास करें and maintain accuracy शुद्धता बनाए रखें.'];
  const PROFILE_HINTS = {
    general: 'General practice: choose any duration and language. Track your personal improvement.',
    'ssc-chsl-en': 'Practice benchmark: English typing is commonly associated with 35 WPM in CHSL skill-test guidance. Verify the current notification and exact test rules.',
    'ssc-chsl-hi': 'Practice benchmark: Hindi typing is commonly associated with 30 WPM in CHSL skill-test guidance. Verify the current notification and required Hindi keyboard/font rules.',
    'ssc-dest': 'DEST is a data-entry skill test, not a conventional paragraph WPM test. This passage drill helps with accuracy and sustained typing; practise the official data-entry format separately.',
    'rrb-en': 'Practice benchmark often used for RRB typing skill preparation: 30 WPM English. Check the relevant CEN notification for the exact post and rules.',
    'rrb-hi': 'Practice benchmark often used for RRB typing skill preparation: 25 WPM Hindi. Check the relevant CEN notification and permitted keyboard/font details.',
    jkssb: 'JKSSB typing requirements are post-specific. Use the language, speed, duration and format stated in your particular advertisement.',
    cpct: 'CPCT includes multiple computer skills and may have prescribed Hindi/English typing components. This page covers passage typing practice only.',
    court: 'Court and High Court typing requirements vary by state, post, language and notification. Use the exact prescribed passage and test duration when available.',
    steno: 'Stenography requires shorthand dictation and transcription. This typing passage is useful for transcription accuracy but does not simulate shorthand dictation.',
    custom: 'Custom profile: use your own required target and passage.'
  };
  let passage = '', timer = null, startedAt = 0, endAt = 0, active = false, paused = false, elapsedBeforePause = 0, lastResult = null, passageIndex = 0;
  const getLanguage = () => $('typingLanguage').value;
  const getMode = () => $('typingMode').value;
  const getDuration = () => Number($('typingDuration').value);
  const history = () => { try { const v = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (_) { return []; } };
  function sampleText() {
    const lang = getLanguage(), mode = getMode();
    if (mode === 'custom') return $('customPassage')?.value?.trim() || '';
    const bank = lang === 'mixed' ? { exam: MIXED, easy: MIXED, numbers: MIXED, legal: MIXED, hard: MIXED } : BANK[lang];
    const list = bank[mode] || bank.exam;
    const item = list[passageIndex % list.length];
    return (item + '\n\n').repeat(8).trim();
  }
  const KEY_ROWS = ['1234567890-=', 'qwertyuiop[]\\', "asdfghjkl;'", 'zxcvbnm,./'];
  function renderKeyboard() {
    const host = $('twKeyboard'); if (!host) return;
    const next = Array.from(passage)[Array.from($('typingInput').value).length] || '';
    host.innerHTML = KEY_ROWS.map((row, ri) => `<div class="tw-keyrow">${Array.from(row).map(key => {
      const home = ri === 2 && 'asdfghjkl'.includes(key);
      const match = next && next.toLowerCase() === key.toLowerCase();
      return `<span class="tw-key${home ? ' home' : ''}${match ? ' next' : ''}">${escapeHtml(key)}</span>`;
    }).join('')}</div>`).join('') + `<div class="tw-keyrow"><span class="tw-key space${next === ' ' ? ' next' : ''}">SPACE</span></div>`;
    const tips = {a:'Left little finger',s:'Left ring finger',d:'Left middle finger',f:'Left index finger',j:'Right index finger',k:'Right middle finger',l:'Right ring finger',';':'Right little finger',' ':'Thumb'};
    $('twFingerTip').textContent = next ? `Next key: ${next === ' ' ? 'SPACE' : next} • ${tips[next.toLowerCase()] || 'Use the appropriate finger; keep wrists relaxed.'}` : 'Passage complete — review your accuracy and errors.';
  }
  function updateProfileHint() { $('examHint').textContent = PROFILE_HINTS[$('examProfile').value] || PROFILE_HINTS.general; $('customPassageWrap').style.display = getMode() === 'custom' ? 'grid' : 'none'; }
  function renderPassage() {
    const typed = $('typingInput').value;
    const chars = Array.from(passage);
    const entered = Array.from(typed);
    let html = '';
    chars.forEach((ch, i) => {
      const cls = i < entered.length ? (entered[i] === ch ? 'correct' : 'wrong') : (i === entered.length && active && !paused ? 'current' : '');
      html += `<span${cls ? ` class="${cls}"` : ''}>${escapeHtml(ch)}</span>`;
    });
    $('typingPassage').innerHTML = html;
    renderKeyboard();
    const current = $('typingPassage').querySelector('.current');
    if (current) current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function reset() {
    clearInterval(timer); timer = null; active = false; paused = false; elapsedBeforePause = 0; startedAt = 0; endAt = 0;
    passage = sampleText() || 'Please select or paste a custom passage before starting the test.';
    $('typingInput').value = ''; $('typingInput').disabled = true;
    $('timeLeft').textContent = formatTime(getDuration() * 60); $('typingPause').disabled = true; $('typingPause').textContent = 'Ⅱ Pause'; $('typingFinish').disabled = true;
    $('wpm').textContent = '0'; $('accuracy').textContent = '100%'; $('cpm').textContent = '0'; $('errors').textContent = '0'; $('progressText').textContent = '0%'; $('typingProgress').style.width = '0%';
    $('typingResult').textContent = `Ready • ${passage.length.toLocaleString()} characters • ${getLanguage() === 'hi' ? 'Hindi Unicode' : getLanguage() === 'mixed' ? 'Mixed' : 'English'}`;
    $('resultPanel').textContent = 'Your completed test result will appear here.'; $('printResult').disabled = true; renderPassage();
  }
  function formatTime(seconds) { const s = Math.max(0, Math.ceil(seconds)); return `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`; }
  function metrics() {
    const typed = Array.from($('typingInput').value), target = Array.from(passage);
    let correct = 0, wrong = 0;
    for (let i = 0; i < typed.length; i++) { if (typed[i] === target[i]) correct++; else wrong++; }
    const elapsedMs = paused ? elapsedBeforePause : elapsedBeforePause + Math.max(0, Date.now() - startedAt);
    const elapsed = Math.max(1 / 60, elapsedMs / 60000);
    const grossWpm = Math.round(typed.length / 5 / elapsed);
    const netWpm = Math.max(0, Math.round(correct / 5 / elapsed));
    const cpm = Math.round(typed.length / elapsed);
    const accuracy = typed.length ? Math.round(correct / typed.length * 100) : 100;
    const progress = Math.min(100, Math.round(typed.length / Math.max(1,target.length) * 100));
    $('wpm').textContent = String(netWpm); $('accuracy').textContent = `${accuracy}%`; $('cpm').textContent = String(cpm); $('errors').textContent = String(wrong); $('progressText').textContent = `${progress}%`; $('typingProgress').style.width = `${progress}%`;
    return { typed: typed.length, correct, wrong, grossWpm, netWpm, cpm, accuracy, elapsedMinutes: elapsed, progress };
  }
  function tick() {
    if (!active || paused) return;
    const left = endAt - Date.now();
    $('timeLeft').textContent = formatTime(left / 1000);
    const m = metrics();
    $('typingResult').textContent = `Live • Net ${m.netWpm} WPM • Gross ${m.grossWpm} WPM • ${m.accuracy}% accuracy • ${m.wrong} incorrect characters`;
    if (left <= 0) finish();
  }
  function start() {
    if (active) return;
    if (getMode() === 'custom' && !$('customPassage')?.value?.trim()) { $('typingResult').textContent = 'Paste your own passage in the custom passage box first.'; return; }
    reset(); active = true; paused = false; startedAt = Date.now(); endAt = getDuration() ? startedAt + getDuration() * 60000 : Infinity;
    $('typingInput').disabled = false; $('typingInput').focus(); $('typingPause').disabled = false; $('typingFinish').disabled = false;
    $('typingResult').textContent = 'Test started. Type the passage shown above.';
    if (getDuration() === 0) $('timeLeft').textContent = '∞';
    timer = setInterval(tick, 200); renderPassage();
  }
  function pauseToggle() {
    if (!active) return;
    if (!paused) { paused = true; elapsedBeforePause += Date.now() - startedAt; clearInterval(timer); $('typingInput').disabled = true; $('typingPause').textContent = '▶ Resume'; $('typingResult').textContent = 'Test paused. Press Resume to continue.'; }
    else { paused = false; startedAt = Date.now(); endAt = getDuration() ? Date.now() + Math.max(0, getDuration() * 60000 - elapsedBeforePause) : Infinity; $('typingInput').disabled = false; $('typingInput').focus(); $('typingPause').textContent = 'Ⅱ Pause'; timer = setInterval(tick, 200); }
    renderPassage();
  }
  function finish() {
    if (!active) return;
    tickFinal(); clearInterval(timer); timer = null; active = false; paused = false; $('typingInput').disabled = true; $('typingPause').disabled = true; $('typingFinish').disabled = true;
    const m = metrics();
    const result = { id: Date.now(), date: new Date().toISOString(), name: $('candidateName').value.trim(), exam: $('examProfile').selectedOptions[0].textContent, language: getLanguage(), duration: getDuration(), ...m };
    lastResult = result;
    const list = history(); list.unshift(result); try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0,100))); } catch (_) {}
    renderHistory(); renderDashboard(); $('printResult').disabled = false;
    $('typingResult').textContent = `Test complete • Net ${m.netWpm} WPM • Gross ${m.grossWpm} WPM • ${m.accuracy}% accuracy • ${m.wrong} incorrect characters.`;
    $('resultPanel').innerHTML = `<div class="tw-result-grid"><div><b>${m.netWpm}</b><span>Net WPM</span></div><div><b>${m.grossWpm}</b><span>Gross WPM</span></div><div><b>${m.accuracy}%</b><span>Accuracy</span></div><div><b>${m.cpm}</b><span>Characters/min</span></div><div><b>${m.correct}</b><span>Correct characters</span></div><div><b>${m.wrong}</b><span>Incorrect characters</span></div></div><p><b>${escapeHtml(result.name || 'Candidate')}</b> • ${escapeHtml(result.exam)} • ${escapeHtml(result.language.toUpperCase())} • ${getDuration() ? `${getDuration()} minute(s)` : `${m.elapsedMinutes.toFixed(1)} min`}</p><p class="tw-note">Net WPM is calculated from correctly typed characters using the standard 5-character word convention. This practice score is not an official recruitment result.</p>`;
    renderPassage();
  }
  function tickFinal() { if (getDuration()) $('timeLeft').textContent = '00:00'; }
  function onInput() {
    if (!active || paused) return;
    let val = $('typingInput').value;
    if ($('typingStrict').value === 'strict') {
      const typed = Array.from(val), target = Array.from(passage); let valid = 0;
      while (valid < typed.length && typed[valid] === target[valid]) valid++;
      if (valid < typed.length) { $('typingInput').value = typed.slice(0, valid).join(''); val = $('typingInput').value; $('typingResult').textContent = 'Strict mode: incorrect character blocked. Type the highlighted next character.'; }
    }
    const target = Array.from(passage), typed = Array.from(val);
    if (typed.length > target.length && getMode() !== 'custom') passage += sampleText();
    const m = metrics(); $('typingResult').textContent = `Live • Net ${m.netWpm} WPM • ${m.accuracy}% accuracy • ${m.wrong} errors • ${m.cpm} CPM`;
    renderPassage();
    if (Array.from($('typingInput').value).length >= Array.from(passage).length) { if (getMode() === 'custom') finish(); else passage += sampleText(); }
  }
  function renderHistory() {
    const rows = history().slice(0,15);
    if (!rows.length) { $('typingHistory').textContent = 'No completed attempts yet.'; return; }
    $('typingHistory').innerHTML = `<table class="tw-table"><thead><tr><th>Date</th><th>Exam</th><th>Language</th><th>Net WPM</th><th>Accuracy</th><th>Duration</th></tr></thead><tbody>${rows.map(r => `<tr><td>${new Date(r.date).toLocaleDateString()}</td><td>${escapeHtml(r.exam || 'Practice')}</td><td>${escapeHtml(r.language || '')}</td><td><b>${Number(r.netWpm)||0}</b></td><td>${Number(r.accuracy)||0}%</td><td>${r.duration ? `${r.duration} min` : 'Free'}</td></tr>`).join('')}</tbody></table>`;
  }
  function renderDashboard() {
    const rows = history(), w = rows.map(r => Number(r.netWpm)||0), best = w.length ? Math.max(...w) : 0, avg = w.length ? Math.round(w.reduce((a,b)=>a+b,0)/w.length) : 0;
    $('bestWpm').textContent = best; $('avgWpm').textContent = avg; $('totalTests').textContent = rows.length;
    const dates = [...new Set(rows.map(r => (r.date || '').slice(0,10)))].sort().reverse(); let streak = 0, cursor = new Date();
    const today = new Date().toISOString().slice(0,10); if (!dates.includes(today)) cursor.setDate(cursor.getDate()-1);
    while (dates.includes(cursor.toISOString().slice(0,10))) { streak++; cursor.setDate(cursor.getDate()-1); }
    $('practiceStreak').textContent = streak;
  }
  function exportCSV() {
    const rows = history(); if (!rows.length) { alert('No typing history to export.'); return; }
    const cols = ['date','name','exam','language','duration','netWpm','grossWpm','accuracy','cpm','correct','wrong','typed'];
    const csv = [cols.join(','), ...rows.map(r => cols.map(k => `"${String(r[k] ?? '').replace(/"/g,'""')}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); a.download = 'typing-test-history.csv'; a.click(); URL.revokeObjectURL(a.href);
  }
  $('loadDailyDrill')?.addEventListener('click', () => {
    const lang = getLanguage() === 'mixed' ? 'en' : getLanguage();
    const drills = lang === 'hi' ? BANK.hi.easy : BANK.en.easy;
    $('typingMode').value = 'custom'; $('customPassageWrap').style.display = 'grid';
    $('customPassage').value = drills[new Date().getDay() % drills.length];
    reset(); $('typingResult').textContent = 'Daily drill loaded. Press Start test when ready.';
    $('typingInput').focus();
  });
  $('typingStart').addEventListener('click', start); $('typingReset').addEventListener('click', reset); $('typingNextWall').addEventListener('click', () => { passageIndex++; reset(); });
  $('typingInput').addEventListener('input', onInput); $('typingPause').addEventListener('click', pauseToggle); $('typingFinish').addEventListener('click', finish);
  ['examProfile','typingLanguage','typingDuration','typingMode','typingStrict'].forEach(id => $(id).addEventListener('change', () => { updateProfileHint(); reset(); }));
  $('customPassage').addEventListener('input', () => { if (getMode() === 'custom' && !active) reset(); });
  $('typingCopyPassage').addEventListener('click', async () => { try { await navigator.clipboard.writeText(passage); $('typingResult').textContent = 'Passage copied.'; } catch (_) { $('typingResult').textContent = 'Clipboard permission unavailable on this browser.'; } });
  $('exportHistory').addEventListener('click', exportCSV); $('clearHistory').addEventListener('click', () => { if (confirm('Delete all typing history saved in this browser?')) { localStorage.removeItem(HISTORY_KEY); renderHistory(); renderDashboard(); } });
  $('printResult').addEventListener('click', () => { if (!lastResult) return; const w = window.open('', '_blank'); if (!w) { window.print(); return; } w.document.write(`<!doctype html><title>Typing Test Result</title><style>body{font:16px Arial;padding:40px;color:#18243a}h1{color:#155eef}.box{border:1px solid #ccd6e5;border-radius:12px;padding:20px;margin-top:20px}b{font-size:22px;color:#155eef}</style><h1>Sarkari Job Universe — Typing Practice Result</h1><p>${escapeHtml(lastResult.name || 'Candidate')} • ${escapeHtml(lastResult.exam)}</p><div class="box"><p>Net WPM: <b>${lastResult.netWpm}</b></p><p>Gross WPM: <b>${lastResult.grossWpm}</b></p><p>Accuracy: <b>${lastResult.accuracy}%</b></p><p>CPM: <b>${lastResult.cpm}</b></p><p>Correct characters: ${lastResult.correct} | Incorrect: ${lastResult.wrong}</p><p>Language: ${escapeHtml(lastResult.language)} | Duration: ${lastResult.duration || 'Unlimited'} minutes</p></div><p>Practice simulator score only; not an official examination certificate.</p>`); w.document.close(); w.print(); });
  updateProfileHint(); renderHistory(); renderDashboard(); reset();
})();
