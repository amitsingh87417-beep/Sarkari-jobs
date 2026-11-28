(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'sju_typing_academy_30day_v1';

  const topics = [
    ['Home Row Basics (asdf jkl;)', 'Beginner', 'Place left fingers on A-S-D-F and right fingers on J-K-L-; without looking down.',
      'asdf jkl; asdf jkl; fdsa ;lkj asdf jkl; ff jj dd kk ss ll aa ;; asdf jkl; fdsa ;lkj\n\nasdf jkl; sad lad ask dad fall all flask glass hall half dash glad ask dad fall lad'],
    ['Home Row + G & H (asdfg hjkl;)', 'Beginner', 'Reach G with left index finger and H with right index finger, then return to F and J.',
      'asdfg hjkl; fgf jhj asdfg hjkl; gfdsa ;lkjh glad half flash shall dash gash hall\n\nask a lad; dad had a glass flask; a glad lad shall dash half a hall; flag falls'],
    ['Home Row Real Words & Rhythm', 'Beginner', 'Build smooth speed using full Home Row words and spaces.',
      'dad ask sad lad all fall hall glass flask glad half dash flag shall salad alfalfa\n\na sad lad had a glass; dad shall ask a glad lad; half a flask falls as a flag'],
    ['Top Row Left (qwert)', 'Beginner', 'Reach Q-W-E-R-T from the home row and return your fingers to A-S-D-F immediately.',
      'qwert trewq frf ded sws aqa ftf qwert asdfg qwert trewq red wet set rat art tar\n\nwear tear rare tree free steer water after earth starter great trade faster rate'],
    ['Top Row Right (yuiop)', 'Beginner', 'Reach Y-U-I-O-P with the right hand and return cleanly to J-K-L-;.',
      'yuiop poiuy jyj juj kik lol p;p yuiop hjkl; you oil joy toy top pot pop loop pool\n\nyour pure pour tour prior youth policy output input priority option trophy utility'],
    ['Home + Top Row Full Words', 'Beginner', 'Combine Home Row and Top Row for fluent, real-world typing.',
      'write quiet power paper report letter people proper spirit effort result topper\n\nwe require proper preparation to write clear letters and achieve top results daily'],
    ['Bottom Row Left (zxcvb)', 'Beginner', 'Reach Z-X-C-V-B smoothly without lifting your wrists off position.',
      'zxcvb bvcxz fvf dcd sxs aza fbf zxcvb asdfg cab bad bag cave wave save brave\n\ncareful active basic exact advance value cover civil service exam vector balance'],
    ['Bottom Row Right (nm,./)', 'Beginner', 'Master N-M-comma-period-slash with the right hand.',
      'nm,./ /.,mn jnj jmj k,k l.l ;/; man name main moon noon mine mind number morning\n\nmanage, maintain, monitor, minimum, maximum, nomination, common, union, nation.'],
    ['Full Alphabet A-Z Keyboard Drill', 'Beginner', 'Use every single letter key from A to Z in balanced pangram drills.',
      'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.\n\nSphinx of black quartz, judge my vow. Quick zephyrs blow, vexing daft Jim every day.'],
    ['Shift Key & Capital Letters', 'Intermediate', 'Use opposite-hand Shift for crisp capital letters without slowing down.',
      'India Jammu Kashmir Delhi Mumbai Chennai Kolkata Srinagar Rajouri SSC JKSSB UPSC\n\nStaff Selection Commission, Railway Recruitment Board, Indian Army, Reserve Bank.'],
    ['Punctuation & Office Symbols', 'Intermediate', 'Practise commas, colons, semicolons, brackets and hyphens accurately.',
      'Notice: Advt. No. 12/2026 (Revised); Date: 25-11-2026 — Apply online! Are you ready?\n\nRules: (1) Accuracy first; (2) Calm rhythm; (3) Zero panic; (4) Verify every line.'],
    ['Number Row (0-9) & Dates', 'Intermediate', 'Master top-row digits, roll numbers, percentages and currency figures.',
      '12345 67890 10 20 35 45 50 75 80 95 100 2026 01-01-2026 31-12-2026 Rs. 250.00\n\nRoll No. 202604819; Marks: 178.50/200 (89.25%); Target Speed: 45 WPM; Errors: 0.'],
    ['High-Frequency Exam Words', 'Intermediate', 'Build burst speed on the 50 most common words in government exam passages.',
      'government administration constitution department notification recruitment selection\n\ncandidate examination verification certificate qualification application eligibility'],
    ['Zero-Backspace Accuracy Drill', 'Intermediate', 'Slow down slightly and aim for 98–100% accuracy with zero backspaces.',
      'Accuracy builds lasting speed. When you avoid mistakes, you never waste precious seconds fixing typos. Focus on clean strokes and even spacing between every word.'],
    ['Office & Clerical Vocabulary', 'Intermediate', 'Practise formal administrative phrasing used in SSC & JKSSB tests.',
      'The competent authority has approved the revised schedule for the skill test. All shortlisted candidates must report at the examination centre thirty minutes prior.'],
    ['5-Minute Exam Passage I', 'Advanced', 'Complete a smooth 5-minute passage maintaining 35+ WPM.',
      'Digital governance has simplified access to education, banking and public welfare schemes across India. Transparent recruitment portals allow candidates from remote villages to check notices and submit applications without delay.'],
    ['5-Minute Exam Passage II', 'Advanced', 'Sustain focus and minimize error rate across dense sentences.',
      'The Indian Constitution safeguards fundamental rights while outlining fundamental duties for every citizen. Independent constitutional bodies ensure free elections, fair audits and transparent public recruitment across states and union territories.'],
    ['Legal & High Court Vocabulary', 'Advanced', 'Practise formal judicial and statutory wording for Court typing exams.',
      'Whereas the petitioner has filed the present application along with supporting affidavits, the honourable court directs that notice be issued to the respondent authority within the prescribed statutory period.'],
    ['Data Entry (DEST) Precision Drill', 'Advanced', 'Exact keystroke control for SSC CGL DEST (2000 key depressions / 15 min).',
      'Code: JK-2026/04; Dept: Finance & Revenue; Total Entries: 1,450; Verified: 1,442 (99.45%); Pending: 08. Remarks: All ledger balances reconciled as on 25-11-2026.'],
    ['Long-Form Multi-Paragraph Flow', 'Advanced', 'Maintain steady WPM across multiple paragraphs without fatigue.',
      'Consistent preparation turns average candidates into top rankers. Set clear weekly benchmarks for both speed and accuracy, track your missed keys after each session and revise weak patterns daily.'],
    ['Difficult Letter Combinations', 'Advanced', 'Train tricky bigrams (qu, zx, ph, th, tion, ment, ing) for smoother flow.',
      'question quality quantity squeeze puzzle rhythm psychology strength implementation\n\nacknowledgement administration extraordinary infrastructure telecommunication'],
    ['Speed Ladder (40 -> 55 WPM)', 'Advanced', 'Push your rhythm smoothly past 45–55 WPM while keeping 95%+ accuracy.',
      'Read ahead by two words while your fingers finish the current word. Keep your elbows relaxed and let each keystroke flow in a light, continuous, unbroken stream of motion.'],
    ['10-Minute SSC / RRB Mock Drill', 'Advanced', 'Full 10-minute rehearsal simulating real SSC CHSL and RRB NTPC rules.',
      'Candidates appearing in computer-based typing tests should verify keyboard responsiveness during the trial window, maintain upright posture and avoid checking the timer too frequently during the ten-minute test.'],
    ['Numbers + Punctuation Speed', 'Advanced', 'Fast transitions between text, capital letters, numbers and brackets.',
      'Ref. No. SSC/NR/2026-88 (Tier-II): 35 WPM = 1,750 key depressions in 10 minutes. Error allowance: 7% for UR & 10% for reserved categories (verify official notice).'],
    ['Complex Vocabulary & Hyphens', 'Expert', 'Handle long, hyphenated and formal terms at 55+ WPM.',
      'Self-reliant, well-coordinated, multi-dimensional, state-of-the-art, cost-effective, long-term decision-making and evidence-based policy formulation drive sustainable growth.'],
    ['60+ WPM Pro Burst Training', 'Expert', 'High-velocity sentences designed to break past the 60 WPM barrier.',
      'Speed mastery comes from eliminating hesitation between words. Trust your muscle memory, keep your eyes locked on the highlighted word and let your fingers glide effortlessly.'],
    ['70+ WPM Championship Drill', 'Expert', 'Push towards 70+ WPM with minimal backspaces and 95%+ precision.',
      'Modern digital networks process billions of secure transactions every day, relying on resilient servers, encrypted protocols and rapid error-recovery systems engineered for uninterrupted uptime.'],
    ['80+ WPM Speed Master Rehearsal', 'Expert', 'Elite speed training for 80+ WPM typists with rich, varied vocabulary.',
      'Exceptional typists combine effortless finger dexterity, rhythmic cadence and laser-sharp visual anticipation to maintain eighty words per minute or higher across extended documents without fatigue.'],
    ['20-Minute Endurance Challenge', 'Expert', 'Sustained accuracy and speed over a full 20-minute endurance session.',
      'Long-duration typing tests evaluate stamina as much as speed. Breathe evenly, keep your shoulders loose and focus on steady rhythm so your net speed stays strong from minute one to minute twenty.'],
    ['Day 30 — Final Grand Assessment', 'Expert', 'Final graduation test covering full keyboard mastery, speed & accuracy.',
      'Congratulations on reaching Day 30 of the Typing Pro Ultimate Academy! Apply every habit you have mastered—home-row discipline, smooth rhythm, zero panic and high accuracy—to conquer any government typing examination.']
  ];

  const hindiDrills = [
    'क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न प फ ब भ म य र ल व श ष स ह।',
    'विद्यार्थी प्रतिदिन अभ्यास करता है और अपनी उँगलियों को सही स्थान पर रखता है। शुरुआत में शुद्धता पर ध्यान दें, गति नियमित अभ्यास से बढ़ती है।',
    'सार्वजनिक सेवाओं में सही अभिलेख, स्पष्ट जानकारी और जिम्मेदार प्रशासन का महत्वपूर्ण स्थान है। अभ्यर्थियों को निर्देश ध्यान से पढ़ने चाहिए।',
    'आवेदन संख्या 2026/JK/1048; दिनांक 25-11-2026; समय 10:30 बजे; केंद्र कोड 042; शुल्क ₹250.00। लक्ष्य गति 30 शब्द प्रति मिनट।'
  ];

  function load() { try { const x = JSON.parse(localStorage.getItem(KEY) || '{}'); return x && typeof x === 'object' ? x : {}; } catch (e) { return {}; } }
  let state = load(), selected = 1;
  function completed(lang) { return Array.isArray(state[lang]) ? state[lang] : []; }
  function getText(lang, day) {
    if (lang === 'hi') return hindiDrills[(day - 1) % hindiDrills.length] + '\n\n' + hindiDrills[day % hindiDrills.length];
    return topics[day - 1][3];
  }
  function visibleDays() {
    const f = $('academyLevelFilter').value;
    return topics.map((t, i) => ({ day: i + 1, t })).filter(x => f === 'all' || x.t[1] === f);
  }

  function render() {
    const lang = $('academyLanguage').value, done = completed(lang), days = visibleDays();
    $('academyLessonSelect').innerHTML = days.map(x => `<option value="${x.day}">Day ${x.day} — ${x.t[0]}</option>`).join('');
    if (!days.some(x => x.day === selected)) selected = days[0]?.day || 1;
    $('academyLessonSelect').value = String(selected);
    const t = topics[selected - 1];
    $('academyLessonTitle').textContent = `Day ${selected} — ${t[0]}`;
    $('academyLessonDesc').textContent = `${t[1]} Stage • ${t[2]}`;
    $('academyLessonText').textContent = getText(lang, selected);
    $('academyLessonStatus').textContent = done.includes(selected)
      ? 'Completed ✓ You can repeat this lesson anytime.'
      : 'Click "Load Lesson in Typing Bar" to practise this drill with live sound & keyboard coach.';
    $('academyMarkDone').textContent = done.includes(selected) ? 'Mark Incomplete' : '✓ Mark Done';
    $('academyLessonList').innerHTML = days.map(x => `<button type="button" class="tw-lesson${done.includes(x.day) ? ' done' : ''}" data-day="${x.day}" aria-current="${x.day === selected}">Day ${x.day} ${done.includes(x.day) ? '✓' : ''}<small>${x.t[0]}</small></button>`).join('');
    const pct = Math.round((done.length / topics.length) * 100);
    $('academyCompleted').textContent = `${done.length} / ${topics.length}`;
    $('academyPercent').textContent = `${pct}%`;
    $('academyProgressBar').style.width = pct + '%';
    $('academyLevel').textContent = done.length < 9 ? 'Beginner' : done.length < 16 ? 'Intermediate' : done.length < 25 ? 'Advanced' : 'Expert';
  }

  function loadLesson() {
    const lang = $('academyLanguage').value, text = getText(lang, selected);
    $('typingLanguage').value = lang;
    $('typingMode').value = 'custom';
    $('customPassageWrap').style.display = 'grid';
    $('customPassage').value = text;
    $('typingDuration').value = selected >= 23 ? '10' : selected >= 16 ? '5' : '3';
    $('typingReset').click();
    $('typingResult').textContent = `Academy Day ${selected} (${topics[selected - 1][0]}) loaded! Press Start Typing Test.`;
    $('typingInput').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  $('academyLanguage').addEventListener('change', () => { selected = 1; render(); });
  $('academyLevelFilter').addEventListener('change', render);
  $('academyLessonSelect').addEventListener('change', e => { selected = Number(e.target.value); render(); });
  $('academyLessonList').addEventListener('click', e => { const b = e.target.closest('[data-day]'); if (!b) return; selected = Number(b.dataset.day); render(); });
  $('academyLoadLesson').addEventListener('click', loadLesson);
  $('academyMarkDone').addEventListener('click', () => {
    const lang = $('academyLanguage').value, done = completed(lang);
    state[lang] = done.includes(selected) ? done.filter(x => x !== selected) : [...done, selected].sort((a, b) => a - b);
    localStorage.setItem(KEY, JSON.stringify(state));
    render();
  });
  $('academyNextBtn')?.addEventListener('click', () => {
    const lang = $('academyLanguage').value, done = completed(lang);
    const next = topics.findIndex((_, i) => !done.includes(i + 1));
    selected = next >= 0 ? next + 1 : 1;
    $('academyLevelFilter').value = 'all';
    render();
  });
  $('academyResetBtn')?.addEventListener('click', () => {
    const lang = $('academyLanguage').value;
    if (confirm('Reset all academy lesson progress for this language?')) {
      state[lang] = [];
      localStorage.setItem(KEY, JSON.stringify(state));
      selected = 1;
      render();
    }
  });
  render();
})();
