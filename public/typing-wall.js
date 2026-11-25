(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const HISTORY_KEY = 'sju_typing_pro_history_v2';
  const THEME_KEY = 'sju_typing_theme_v52';

  // Rich, non-repeating exam-grade passage library (20+ unique English & Hindi paragraphs)
  const BANK = {
    en: {
      exam: [
        'The Constitution of India establishes the framework of democratic governance, fundamental rights, directive principles and independent institutions. Candidates preparing for clerical and administrative examinations must read every word with care, maintain a calm rhythm and never sacrifice accuracy for raw speed.',
        'Digital public infrastructure has transformed banking, education, healthcare and citizen services across rural and urban India. Instant digital payments, online certificate portals and transparent recruitment systems have reduced delays while making essential government services accessible to every student.',
        'Effective time management during a competitive skill test requires steady focus from the very first second. Keep your fingers positioned lightly on the home row, maintain relaxed shoulders, avoid looking down at the keyboard and recover smoothly whenever a minor error occurs.',
        'The Indian railway network connects mountains, plains, deserts and coastal cities through thousands of stations and bridges. Modern engineering achievements such as high-altitude rail links in Jammu and Kashmir have improved all-weather connectivity, trade and tourism across the region.',
        'Public administration depends on accurate record keeping, clear official correspondence and timely verification of documents. Clerical officers and data entry operators play a vital role in drafting notices, maintaining registers, updating spreadsheets and assisting citizens politely.',
        'Renewable energy projects including solar parks, wind farms and Himalayan hydroelectric stations are expanding India clean power capacity every year. Sustainable development requires balancing rapid economic growth with forest conservation, clean rivers and responsible water management.',
        'A disciplined student builds a practical daily schedule that combines conceptual revision, timed mock tests and regular typing practice. Consistent daily effort over several months creates reliable speed and high accuracy that remain stable even under examination hall pressure.',
        'Before submitting any online recruitment application, candidates should verify their date of birth, educational qualifications, category certificate details and photograph dimensions carefully. Reading the official advertisement thoroughly prevents avoidable mistakes during document verification.',
        'Scientific research institutions such as ISRO and DRDO have demonstrated remarkable self-reliance in satellite launches, space exploration and defence technology. Young graduates and diploma holders across the country continue to contribute to innovation in engineering and computing.',
        'Agriculture remains the backbone of rural livelihoods, supported by modern irrigation, soil health testing, crop insurance and digital market platforms. Strengthening rural roads, cold storage facilities and vocational training centers helps create new employment opportunities.'
      ],
      easy: [
        'Practice every day with relaxed hands and look at the screen while typing. Accuracy always comes first and speed grows naturally when your fingers remember every key position without hesitation.',
        'A good student makes a clear daily plan, follows a regular study routine and checks mistakes carefully after every practice session. Small improvements repeated daily become strong habits.',
        'Keep your back straight, place your fingers on the home row keys and press each key with a light steady touch. Smooth rhythm is much faster than rushing and pressing backspace again and again.',
        'Read one word ahead on the screen so your fingers stay ready for the next letters. With regular five minute and ten minute sessions, your typing speed will rise smoothly every week.'
      ],
      numbers: [
        'Application No. 2026/JK/1048; Date: 25-11-2026; Reporting Time: 09:30 AM. Fee: Rs. 250.00. Roll No.: 008517; Centre Code: 042; Net Score: 86.75%.',
        'Invoice #9842-A | Amount: Rs. 14,750.50 | GST @ 18% = Rs. 2,655.09 | Total Payable: Rs. 17,405.59 | Ref: SJU/2026-27/091.',
        'Exam Schedule: Shift-1 (09:00 to 10:30), Shift-2 (12:30 to 14:00), Shift-3 (16:00 to 17:30). Negative Marking: -0.25 & -0.50; Pass Target: 35 WPM (95%+).',
        '0123456789 98,765.43 18/24/36 01-01-2026 31-12-2026 A+B=C (X/Y)*100 #Exam2026 @Centre_04 75.25% 100.00% Rs. 4,999/-'
      ],
      legal: [
        'Whereas the applicant has submitted the requisite documents and statutory declarations, the competent authority shall verify all particulars in accordance with the prevailing recruitment rules and notify the eligible candidates through the official portal.',
        'The undersigned hereby certifies that every statement furnished in the online application form is true, complete and correct to the best of their knowledge and belief. Any discrepancy detected at any stage shall render the candidature liable to cancellation.',
        'In exercise of the powers conferred by the relevant administrative notification, the selection board has directed that candidates appearing for the skill test must produce valid photo identification and their downloaded admit card at the verification desk.',
        'Subject to fulfillment of domicile, age limit and educational eligibility criteria prescribed in the advertisement, shortlisted applicants shall be invited for document verification and final merit list preparation without prejudice to official instructions.'
      ],
      hard: [
        'Constitutional jurisprudence, administrative accountability, statutory interpretation, fiscal federalism and judicial review demand rigorous analytical precision under high-pressure examination conditions. Candidates must master hyphenated compounds, punctuation marks (;:—) and complex terminology without sacrificing accuracy.',
        'Macroeconomic stabilization requires synchronized monetary policy calibration, prudent fiscal consolidation, transparent regulatory frameworks and resilient supply-chain logistics. Economists frequently evaluate inflation trajectories, sovereign yields, balance-of-payments equilibrium and productivity indices simultaneously.',
        'Cybersecurity architecture encompasses cryptographic authentication, zero-trust network segmentation, vulnerability remediation, intrusion detection and incident-response governance. Organizations safeguarding citizen databases must enforce multi-factor verification and continuous compliance audits.',
        'Interdisciplinary breakthroughs in quantum computing, biotechnology, materials science and renewable energy storage are redefining global competitiveness. Maintaining technical fluency alongside rapid, error-free keyboard execution distinguishes top-percentile candidates in national examinations.'
      ]
    },
    hi: {
      exam: [
        'भारत का संविधान देश की लोकतांत्रिक शासन व्यवस्था, नागरिकों के मौलिक अधिकारों, कर्तव्यों और स्वतंत्र संस्थाओं का मजबूत आधार है। प्रत्येक अभ्यर्थी को परीक्षा के दौरान धैर्य और एकाग्रता के साथ सही शब्दों का अभ्यास करना चाहिए।',
        'डिजिटल सेवाओं ने शिक्षा, बैंकिंग, जन-सूचना और सरकारी प्रमाण-पत्रों की प्रक्रिया को अत्यंत सरल और पारदर्शी बना दिया है। नियमित अभ्यास से टाइपिंग की गति और शुद्धता दोनों में निरंतर सुधार होता है।',
        'सरकारी भर्ती प्रक्रिया में लिखित परीक्षा, टाइपिंग कौशल परीक्षण और दस्तावेज सत्यापन महत्वपूर्ण चरण होते हैं। उम्मीदवारों को आधिकारिक अधिसूचना में दी गई पात्रता, आयु सीमा और परीक्षा तिथि की जाँच अवश्य करनी चाहिए।',
        'जम्मू और कश्मीर में आधुनिक रेल संपर्क और सड़क परियोजनाओं ने यात्रा, व्यापार और पर्यटन को नई गति दी है। युवाओं के लिए तकनीकी शिक्षा और कौशल विकास आज के समय की सबसे बड़ी आवश्यकता है।',
        'अनुशासित दिनचर्या, नियमित पुनरावृत्ति और प्रतिदिन समयबद्ध अभ्यास किसी भी प्रतियोगी परीक्षा में सफलता की कुंजी है। शुरुआत में शुद्धता पर ध्यान दें और धीरे-धीरे अपनी गति बढ़ाएँ।'
      ],
      easy: [
        'नियमित अभ्यास से टाइपिंग की गति और शुद्धता दोनों बढ़ती हैं। शुरुआत में धीरे टाइप करें और हर शब्द को सही लिखने का प्रयास करें। अपनी उँगलियों को सही स्थान पर रखें और स्क्रीन पर ध्यान दें।',
        'एक अच्छा विद्यार्थी समय सारणी बनाता है, प्रतिदिन अभ्यास करता है और अपनी गलतियों को समझकर उनमें सुधार करता है। छोटी-छोटी कोशिशें ही बड़ी सफलता का रास्ता बनाती हैं।'
      ],
      numbers: [
        'आवेदन संख्या: 2026/JK/1048; दिनांक: 25-11-2026; समय: 09:30 बजे। शुल्क: ₹250.00; रोल नंबर: 008517; केंद्र कोड: 042; प्रतिशत: 86.75%।',
        'परीक्षा पाली-1 (09:00 से 10:30), पाली-2 (12:30 से 14:00), पाली-3 (16:00 से 17:30)। लक्ष्य गति: 30 शब्द प्रति मिनट, शुद्धता: 95% से अधिक।'
      ],
      legal: [
        'अधोहस्ताक्षरी प्रमाणित करता है कि आवेदन में दी गई सभी जानकारी मेरी जानकारी के अनुसार सत्य एवं पूर्ण है। किसी भी प्रकार की त्रुटि पाए जाने पर संबंधित अभ्यर्थी को निर्धारित समय सीमा में आवश्यक दस्तावेज प्रस्तुत करने होंगे।',
        'सक्षम प्राधिकारी द्वारा जारी सभी दिशा-निर्देशों का पालन करना प्रत्येक अभ्यर्थी की जिम्मेदारी है। आवेदन जमा करने से पहले नाम, जन्म तिथि, श्रेणी और शैक्षणिक विवरण ध्यानपूर्वक जाँच लें।'
      ],
      hard: [
        'प्रशासनिक उत्तरदायित्व, संवैधानिक प्रावधान, न्यायिक समीक्षा, वित्तीय संघवाद तथा सार्वजनिक पारदर्शिता जैसे विषयों का अध्ययन एकाग्रता और निरंतर अभ्यास की माँग करता है। अभ्यर्थियों को विराम चिह्न, संख्याओं और संयुक्त शब्दों का सही प्रयोग करना चाहिए।'
      ]
    }
  };
  const MIXED = [
    'The Constitution of India भारत का सर्वोच्च कानून है और सभी नागरिकों को समानता का अधिकार देता है। Candidates should practise daily प्रतिदिन अभ्यास करें and maintain 95%+ accuracy शुद्धता बनाए रखें.',
    'Digital India डिजिटल इंडिया और e-Governance ने सरकारी सेवाओं को तेज़ और पारदर्शी बनाया है। Regular 5-minute and 10-minute typing sessions build real exam confidence.'
  ];

  const PROFILE_HINTS = {
    general: 'General speed mode: unlimited auto-new passages ready for 35 to 100+ WPM.',
    'ssc-chsl-en': 'SSC CHSL English benchmark: 35 WPM with 93%+ accuracy (10-minute skill test).',
    'ssc-chsl-hi': 'SSC CHSL Hindi benchmark: 30 WPM with 93%+ accuracy (10-minute skill test).',
    'ssc-dest': 'SSC CGL DEST benchmark: 2000 key depressions in 15 min (~27 WPM, 95%+ accuracy).',
    'rrb-en': 'RRB NTPC English benchmark: 30 WPM with 95%+ accuracy.',
    'rrb-hi': 'RRB NTPC Hindi benchmark: 25 WPM with 95%+ accuracy.',
    jkssb: 'JKSSB Clerical / Junior Assistant benchmark: 35 WPM English with 90%+ accuracy.',
    'crpf-hcm': 'CRPF / BSF / CISF HCM benchmark: 35 WPM English / 30 WPM Hindi (95%+ accuracy).',
    upsssc: 'UPSSSC Junior Assistant benchmark: 30 WPM English / 25 WPM Hindi.',
    cpct: 'CPCT benchmark: 30 WPM English / 20 WPM Hindi with steady accuracy.',
    court: 'High Court / District Court benchmark: 40 WPM with high legal-vocabulary accuracy.',
    steno: 'Stenographer transcription practice: aim for 40+ WPM with minimal backspaces.',
    custom: 'Custom passage mode: paste your own text above and start.'
  };
  const EXAM_TARGETS = {
    'ssc-chsl-en': { wpm: 35, acc: 93 }, 'ssc-chsl-hi': { wpm: 30, acc: 93 },
    'ssc-dest': { wpm: 27, acc: 95 }, 'rrb-en': { wpm: 30, acc: 95 },
    'rrb-hi': { wpm: 25, acc: 95 }, jkssb: { wpm: 35, acc: 90 },
    cpct: { wpm: 30, acc: 90 }, court: { wpm: 40, acc: 95 },
    steno: { wpm: 40, acc: 95 }, 'crpf-hcm': { wpm: 35, acc: 95 }, upsssc: { wpm: 30, acc: 92 }
  };

  let passage = '', timer = null, startedAt = 0, endAt = 0, active = false, paused = false;
  let elapsedBeforePause = 0, lastResult = null, backspaceCount = 0, lastWeakKeys = [];
  let soundEnabled = true, voiceEnabled = true, wordStreak = 0, lastLen = 0, deckCursor = 0;
  let shuffledDeck = [];

  // ==================== MECHANICAL KEYBOARD SOUND ENGINE ====================
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function playKeyClick(kind) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (kind === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(165, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        return;
      }

      // Crisp mechanical switch click (short filtered noise burst + tactile thock)
      const dur = kind === 'space' ? 0.045 : 0.028;
      const bufSize = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.28));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = kind === 'space' ? 950 : (1900 + Math.random() * 450);
      filter.Q.value = 1.6;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(kind === 'space' ? 0.16 : 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch (_) {}
  }

  function playVictoryAndVoice(netWpm, acc) {
    if (soundEnabled) {
      try {
        const ctx = getAudioCtx();
        if (ctx) {
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            const t = ctx.currentTime + idx * 0.11;
            gain.gain.setValueAtTime(0.11, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.36);
          });
        }
      } catch (_) {}
    }
    if (voiceEnabled && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(
          `Congratulations! Your typing test is complete. Your net speed is ${netWpm} words per minute with ${acc} percent accuracy.`
        );
        msg.lang = 'en-IN';
        msg.rate = 1.02;
        window.speechSynthesis.speak(msg);
      } catch (_) {}
    }
  }

  // ==================== UNLIMITED NON-REPEATING PASSAGE ENGINE ====================
  const getLanguage = () => $('typingLanguage').value;
  const getMode = () => $('typingMode').value;
  const getDuration = () => Number($('typingDuration').value);
  const history = () => { try { const v = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (_) { return []; } };

  function refillDeck() {
    const lang = getLanguage(), mode = getMode();
    const pool = lang === 'mixed' ? MIXED.slice() : (BANK[lang][mode] || BANK[lang].exam).slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    shuffledDeck = pool;
    deckCursor = 0;
  }

  function nextUniqueParagraph() {
    if (!shuffledDeck.length || deckCursor >= shuffledDeck.length) refillDeck();
    return shuffledDeck[deckCursor++];
  }

  function buildHighSpeedPassage() {
    if (getMode() === 'custom') return $('customPassage')?.value?.trim() || '';
    refillDeck();
    // Pre-build 6+ distinct paragraphs (~2,000+ chars) so even 80-120 WPM users have huge seamless runway
    const mins = getDuration() || 10;
    const neededChars = Math.max(1800, mins * 650); // 650 chars/min = 130 WPM headroom!
    const parts = [];
    let len = 0;
    while (len < neededChars) {
      const p = nextUniqueParagraph();
      parts.push(p);
      len += p.length + 2;
    }
    return parts.join('\n\n');
  }

  // ==================== ANTI-COPY PROTECTION ====================
  function attachAntiCopy() {
    const pEl = $('typingPassage');
    const inp = $('typingInput');
    ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'].forEach(evt => {
      pEl?.addEventListener(evt, (e) => {
        e.preventDefault();
        $('typingResult').textContent = '🛡️ Copy protection active — type the passage manually for genuine practice.';
      });
    });
    ['paste', 'drop', 'copy', 'cut'].forEach(evt => {
      inp?.addEventListener(evt, (e) => {
        e.preventDefault();
        $('typingResult').textContent = '🛡️ Paste/Copy disabled during typing test to keep your WPM score authentic.';
      });
    });
  }

  // ==================== THEME SWITCHER ====================
  function applyTheme(theme) {
    document.body.classList.remove('theme-dark', 'theme-warm');
    if (theme === 'dark') document.body.classList.add('theme-dark');
    if (theme === 'warm') document.body.classList.add('theme-warm');
    document.querySelectorAll('.tw-theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }
  document.querySelectorAll('.tw-theme-btn').forEach(b => b.addEventListener('click', () => applyTheme(b.dataset.theme)));
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');

  // ==================== KEYBOARD COACH & PASSAGE RENDER ====================
  const KEY_ROWS_EN = ['1234567890-=', 'qwertyuiop[]\\', "asdfghjkl;'", 'zxcvbnm,./'];
  const KEY_ROWS_HI = ['१२३४५६७८९०-ृ', 'ौैाीूबहगदजड़', 'ोे्िुपरकतचट', 'ेंमनवलस,.य'];
  let backspaceDisabled = false, tapeMode = false, fontSizePx = 19, botTargetWpm = 0, dictationOn = false, dictationTimer = null;
  let wpmTimeline = [], lastSampleSec = 0;
  function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function renderKeyboard() {
    const host = $('twKeyboard'); if (!host) return;
    const next = Array.from(passage)[Array.from($('typingInput').value).length] || '';
    const activeRows = getLanguage() === 'hi' ? KEY_ROWS_HI : KEY_ROWS_EN;
    host.innerHTML = activeRows.map((row, ri) => `<div class="tw-keyrow">${Array.from(row).map(key => {
      const home = ri === 2 && 'asdfghjkl'.includes(key);
      const match = next && next.toLowerCase() === key.toLowerCase();
      return `<span class="tw-key${home ? ' home' : ''}${match ? ' next' : ''}">${escapeHtml(key)}</span>`;
    }).join('')}</div>`).join('') + `<div class="tw-keyrow"><span class="tw-key space${next === ' ' ? ' next' : ''}">SPACE</span></div>`;
    const tips = { a: 'Left pinky', s: 'Left ring', d: 'Left middle', f: 'Left index', j: 'Right index', k: 'Right middle', l: 'Right ring', ';': 'Right pinky', ' ': 'Thumb (Spacebar)' };
    $('twFingerTip').textContent = next ? `Next Key: "${next === ' ' ? 'SPACE' : next}" • Finger: ${tips[next.toLowerCase()] || 'Reach smoothly from home row'}` : 'Passage complete!';
  }

  function updateProfileHint() {
    $('examHint').textContent = PROFILE_HINTS[$('examProfile').value] || PROFILE_HINTS.general;
    $('customPassageWrap').style.display = getMode() === 'custom' ? 'grid' : 'none';
  }

  function renderPassage() {
    const typed = $('typingInput').value;
    const chars = Array.from(passage);
    const entered = Array.from(typed);
    let html = '';
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const cls = i < entered.length ? (entered[i] === ch ? 'correct' : 'wrong') : (i === entered.length && active && !paused ? 'current' : '');
      html += `<span${cls ? ` class="${cls}"` : ''}>${escapeHtml(ch)}</span>`;
    }
    const pBox = $('typingPassage');
    pBox.innerHTML = html;
    renderKeyboard();
    const cur = pBox.querySelector('.current');
    if (cur) {
      const targetScroll = cur.offsetTop - pBox.offsetTop - pBox.clientHeight / 2 + 28;
      pBox.scrollTop = Math.max(0, targetScroll);
    }
  }

  function getRankBadge(netWpm, acc) {
    if (netWpm >= 80 && acc >= 92) return '🔥 Speed Master (80+ WPM)';
    if (netWpm >= 60 && acc >= 92) return '⚡ Pro Typist (60+ WPM)';
    if (netWpm >= 35 && acc >= 90) return '🏆 Exam Ready (35+ WPM)';
    if (netWpm >= 20) return '📈 Improving';
    return '🎯 Warm-Up';
  }

  function formatTime(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  function reset() {
    clearInterval(timer); timer = null; active = false; paused = false;
    elapsedBeforePause = 0; startedAt = 0; endAt = 0; backspaceCount = 0; wordStreak = 0; lastLen = 0;
    if ($('backspaces')) $('backspaces').textContent = '0';
    if ($('streakCount')) $('streakCount').textContent = '🔥 0';
    passage = buildHighSpeedPassage() || 'Please paste a custom passage above before starting.';
    $('typingInput').value = '';
    $('typingInput').disabled = true;
    $('timeLeft').textContent = getDuration() ? formatTime(getDuration() * 60) : '∞';
    $('typingPause').disabled = true;
    $('typingPause').textContent = 'Ⅱ Pause';
    $('typingFinish').disabled = true;
    $('wpm').textContent = '0';
    $('accuracy').textContent = '100%';
    $('cpm').textContent = '0';
    $('errors').textContent = '0';
    $('progressText').textContent = '0%';
    $('typingProgress').style.width = '0%';
    if ($('rankLiveBadge')) $('rankLiveBadge').textContent = '🎯 Ready';
    $('typingResult').textContent = `Ready • ${passage.length.toLocaleString()} characters loaded (auto-extends for 80+ WPM) • Press Start!`;
    $('resultPanel').textContent = 'Complete a typing test to see your Net WPM, Rank Badge, Missed Keys & Celebration Scorecard here.';
    $('printResult').disabled = true;
    wpmTimeline = []; lastSampleSec = 0;
    if (dictationTimer) { clearInterval(dictationTimer); dictationTimer = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if ($('printCertBtn')) $('printCertBtn').disabled = true;
    if ($('submitToppersBtn')) $('submitToppersBtn').disabled = true;
    if ($('speedChartCard')) $('speedChartCard').style.display = 'none';
    renderPassage();
  }

  function metrics() {
    const typed = Array.from($('typingInput').value), target = Array.from(passage);
    let correct = 0, wrong = 0;
    for (let i = 0; i < typed.length; i++) { if (typed[i] === target[i]) correct++; else wrong++; }
    const elapsedMs = paused ? elapsedBeforePause : elapsedBeforePause + Math.max(0, Date.now() - startedAt);
    const elapsed = Math.max(1 / 60, elapsedMs / 60000);
    const grossWpm = Math.round(typed.length / 5 / elapsed);
    const netWpm = Math.max(0, Math.round(correct / 5 / elapsed));
    const cpm = Math.round(typed.length / elapsed);
    const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
    const progress = getDuration()
      ? Math.min(100, Math.round((elapsedMs / (getDuration() * 60000)) * 100))
      : Math.min(100, Math.round((typed.length / Math.max(1, target.length)) * 100));

    // Calculate live correct-word streak
    const typedWords = $('typingInput').value.trim().split(/\s+/).filter(Boolean);
    const targetWords = passage.trim().split(/\s+/).filter(Boolean);
    let streak = 0;
    for (let i = typedWords.length - 1; i >= 0; i--) {
      if (typedWords[i] === targetWords[i]) streak++;
      else break;
    }
    wordStreak = streak;

    $('wpm').textContent = String(netWpm);
    $('accuracy').textContent = `${accuracy}%`;
    $('cpm').textContent = String(cpm);
    $('errors').textContent = String(wrong);
    if ($('streakCount')) $('streakCount').textContent = `🔥 ${wordStreak}`;
    if ($('rankLiveBadge')) $('rankLiveBadge').textContent = getRankBadge(netWpm, accuracy);
    $('progressText').textContent = `${progress}%`;
    $('typingProgress').style.width = `${progress}%`;
    return { typed: typed.length, correct, wrong, grossWpm, netWpm, cpm, accuracy, elapsedMinutes: elapsed, progress, wordStreak };
  }

  function tick() {
    if (!active || paused) return;
    const elapsedSec = Math.floor((elapsedBeforePause + Math.max(0, Date.now() - startedAt)) / 1000);
    if (elapsedSec >= lastSampleSec + 5) {
      lastSampleSec = elapsedSec;
      const curM = metrics();
      wpmTimeline.push({ sec: elapsedSec, wpm: curM.netWpm });
    }
    if (botTargetWpm > 0) {
      const mNow = metrics();
      const totalMins = getDuration() || 5;
      const targetChars = botTargetWpm * 5 * totalMins;
      const elapsedMin = (elapsedBeforePause + Math.max(0, Date.now() - startedAt)) / 60000;
      const botChars = botTargetWpm * 5 * elapsedMin;
      const youPct = Math.min(100, Math.round((mNow.correct / Math.max(1, targetChars)) * 100));
      const botPct = Math.min(100, Math.round((botChars / Math.max(1, targetChars)) * 100));
      if ($('raceYouWpm')) $('raceYouWpm').textContent = String(mNow.netWpm);
      if ($('raceBotWpm')) $('raceBotWpm').textContent = String(botTargetWpm);
      if ($('raceYouFill')) $('raceYouFill').style.width = youPct + '%';
      if ($('raceBotFill')) $('raceBotFill').style.width = botPct + '%';
    }
    if (getDuration()) {
      const left = endAt - Date.now();
      $('timeLeft').textContent = formatTime(left / 1000);
      metrics();
      if (left <= 0) finish();
    } else {
      metrics();
    }
  }

  function start() {
    if (active) return;
    if (getMode() === 'custom' && !$('customPassage')?.value?.trim()) {
      $('typingResult').textContent = 'Paste your own passage in the custom passage box first.';
      return;
    }
    reset();
    getAudioCtx();
    active = true; paused = false; startedAt = Date.now();
    endAt = getDuration() ? startedAt + getDuration() * 60000 : Infinity;
    $('typingInput').disabled = false;
    $('typingInput').focus();
    $('typingPause').disabled = false;
    $('typingFinish').disabled = false;
    $('typingResult').textContent = 'Live Typing Active — enjoy crisp mechanical sound & smooth auto-scroll!';
    timer = setInterval(tick, 200);
    renderPassage();
  }

  function pauseToggle() {
    if (!active) return;
    if (!paused) {
      paused = true;
      elapsedBeforePause += Date.now() - startedAt;
      clearInterval(timer);
      $('typingInput').disabled = true;
      $('typingPause').textContent = '▶ Resume';
      $('typingResult').textContent = 'Test paused. Press Resume to continue.';
    } else {
      paused = false;
      startedAt = Date.now();
      endAt = getDuration() ? Date.now() + Math.max(0, getDuration() * 60000 - elapsedBeforePause) : Infinity;
      $('typingInput').disabled = false;
      $('typingInput').focus();
      $('typingPause').textContent = 'Ⅱ Pause';
      timer = setInterval(tick, 200);
    }
    renderPassage();
  }

  function finish() {
    if (!active) return;
    if (getDuration()) $('timeLeft').textContent = '00:00';
    clearInterval(timer); timer = null; active = false; paused = false;
    $('typingInput').disabled = true;
    $('typingPause').disabled = true;
    $('typingFinish').disabled = true;
    const m = metrics();
    const rank = getRankBadge(m.netWpm, m.accuracy);
    const result = {
      id: Date.now(), date: new Date().toISOString(),
      name: $('candidateName').value.trim(),
      exam: $('examProfile').selectedOptions[0].textContent,
      language: getLanguage(), duration: getDuration(), ...m
    };
    lastResult = result;
    const list = history(); list.unshift(result);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 100))); } catch (_) {}
    renderHistory(); renderDashboard();
    $('printResult').disabled = false;
    $('typingResult').textContent = `🎉 Congratulations! Your typing test is complete — Net ${m.netWpm} WPM • ${m.accuracy}% accuracy • ${rank}`;

    const typedChars = Array.from($('typingInput').value), targetChars = Array.from(passage), missMap = {};
    for (let i = 0; i < typedChars.length; i++) {
      if (typedChars[i] !== targetChars[i] && targetChars[i] && targetChars[i] !== '\n') {
        const k = targetChars[i] === ' ' ? 'SPACE' : targetChars[i];
        missMap[k] = (missMap[k] || 0) + 1;
      }
    }
    lastWeakKeys = Object.entries(missMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const weakHtml = lastWeakKeys.length
      ? `<p><b>Most missed keys:</b> ${lastWeakKeys.map(([k, cnt]) => `<span class="tw-badge">${escapeHtml(k)} (${cnt})</span>`).join(' ')}</p>`
      : `<p><b>Mistake analysis:</b> Zero character errors — flawless accuracy!</p>`;
    if ($('practiceWeakKeysBtn')) $('practiceWeakKeysBtn').style.display = lastWeakKeys.length ? 'inline-block' : 'none';

    const tgt = EXAM_TARGETS[$('examProfile').value];
    const targetBadge = tgt
      ? (m.netWpm >= tgt.wpm && m.accuracy >= tgt.acc
          ? `<span class="tw-badge" style="background:#dcfce7;color:#15803d">✓ Exam Benchmark Passed (${tgt.wpm} WPM / ${tgt.acc}%+)</span>`
          : `<span class="tw-badge" style="background:#fef3c7;color:#b45309">🎯 Exam Target: ${tgt.wpm} WPM &amp; ${tgt.acc}%+ accuracy</span>`)
      : '';

    playVictoryAndVoice(m.netWpm, m.accuracy);

    // Compute SSC Full/Half Mistakes & KDPH
    const tWords = $('typingInput').value.trim().split(/\s+/).filter(Boolean);
    const pWords = passage.trim().split(/\s+/).filter(Boolean);
    let fullMistakes = 0, halfMistakes = 0;
    tWords.forEach((w, i) => {
      const ref = pWords[i] || '';
      if (w === ref) return;
      if (w.toLowerCase() === ref.toLowerCase() || w.replace(/[.,;:!?]/g, '') === ref.replace(/[.,;:!?]/g, '')) halfMistakes++;
      else fullMistakes++;
    });
    const totalErrorUnits = fullMistakes + halfMistakes * 0.5;
    const errorPct = tWords.length ? ((totalErrorUnits / tWords.length) * 100).toFixed(2) : '0.00';
    const kdph = Math.round(m.cpm * 60);
    lastResult.kdph = kdph;
    lastResult.errorPct = errorPct;
    lastResult.fullMistakes = fullMistakes;
    lastResult.halfMistakes = halfMistakes;
    if ($('printCertBtn')) $('printCertBtn').disabled = false;
    if ($('submitToppersBtn')) $('submitToppersBtn').disabled = m.accuracy < 90;

    // Render WPM Chart
    if (wpmTimeline.length >= 2 && $('speedChartCard') && $('wpmChartBox')) {
      $('speedChartCard').style.display = 'block';
      const maxW = Math.max(40, ...wpmTimeline.map(p => p.wpm));
      const pts = wpmTimeline.map((p, idx) => {
        const x = Math.round((idx / (wpmTimeline.length - 1)) * 560) + 20;
        const y = 130 - Math.round((p.wpm / maxW) * 110);
        return `${x},${y}`;
      }).join(' ');
      $('wpmChartBox').innerHTML = `<svg viewBox="0 0 600 150" style="width:100%;max-width:600px;height:150px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px"><polyline fill="none" stroke="#155eef" stroke-width="3" points="${pts}" /><text x="12" y="18" font-size="11" fill="#475569">Peak: ${maxW} WPM</text><text x="12" y="144" font-size="11" fill="#64748b">Start (0s) → End (${wpmTimeline[wpmTimeline.length - 1].sec}s)</text></svg>`;
    }

    // Apply Keyboard Error Heatmap
    const badKeySet = new Set(lastWeakKeys.map(([k]) => k.toLowerCase()));
    setTimeout(() => {
      document.querySelectorAll('#twKeyboard .tw-key').forEach(kEl => {
        const txt = kEl.textContent.trim().toLowerCase();
        kEl.classList.remove('heat-bad', 'heat-good');
        if (badKeySet.has(txt)) kEl.classList.add('heat-bad');
        else if (txt.length === 1) kEl.classList.add('heat-good');
      });
    }, 60);

    $('resultPanel').innerHTML = `
      <div style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <b style="font-size:16px;color:#15803d">🎉 Congratulations! Your Typing Test is Complete!</b>
        <span class="tw-badge" style="font-size:12px">${rank}</span>
      </div>
      <div class="tw-result-grid">
        <div><b>${m.netWpm}</b><span>Net WPM</span></div>
        <div><b>${m.grossWpm}</b><span>Gross WPM</span></div>
        <div><b>${m.accuracy}%</b><span>Accuracy</span></div>
        <div><b>${m.cpm}</b><span>CPM</span></div>
        <div><b>${m.correct}</b><span>Correct Chars</span></div>
        <div><b>${m.wrong}</b><span>Errors</span></div>
        <div><b>${backspaceCount}</b><span>Backspaces</span></div><div><b>${kdph.toLocaleString()}</b><span>KDPH</span></div><div><b>${errorPct}%</b><span>Error % (Full:${fullMistakes} / Half:${halfMistakes})</span></div>
      </div>
      <p style="margin-top:10px"><b>${escapeHtml(result.name || 'Candidate')}</b> • ${escapeHtml(result.exam)} • ${escapeHtml(result.language.toUpperCase())} ${targetBadge}</p>
      ${weakHtml}
    `;
    renderPassage();
  }

  function onInput() {
    if (!active || paused) return;
    let val = $('typingInput').value;
    const typed = Array.from(val), target = Array.from(passage);

    // Mechanical sound feedback on new character
    if (typed.length > lastLen) {
      const idx = typed.length - 1;
      const ch = typed[idx];
      if (ch !== target[idx]) playKeyClick('wrong');
      else if (ch === ' ') playKeyClick('space');
      else playKeyClick('key');
    }

    if ($('typingStrict').value === 'strict') {
      let valid = 0;
      while (valid < typed.length && typed[valid] === target[valid]) valid++;
      if (valid < typed.length) {
        $('typingInput').value = typed.slice(0, valid).join('');
        val = $('typingInput').value;
        $('typingResult').textContent = 'Strict mode: wrong character blocked — press the highlighted key.';
      }
    }
    lastLen = Array.from($('typingInput').value).length;

    // Auto-append fresh unseen paragraph whenever user gets within 450 chars of end (80-120+ WPM ready!)
    if (getMode() !== 'custom' && target.length - lastLen < 450) {
      passage += '\n\n' + nextUniqueParagraph();
    }

    const m = metrics();
    $('typingResult').textContent = `Live • Net ${m.netWpm} WPM • Gross ${m.grossWpm} WPM • ${m.accuracy}% Accuracy • 🔥 Streak ${m.wordStreak}`;
    renderPassage();
    if (getMode() === 'custom' && lastLen >= target.length) finish();
  }

  function renderHistory() {
    const rows = history().slice(0, 15);
    if (!rows.length) { $('typingHistory').textContent = 'No completed attempts yet.'; return; }
    $('typingHistory').innerHTML = `<table class="tw-table"><thead><tr><th>Date</th><th>Exam</th><th>Lang</th><th>Net WPM</th><th>Accuracy</th><th>Duration</th></tr></thead><tbody>${rows.map(r => `<tr><td>${new Date(r.date).toLocaleDateString()}</td><td>${escapeHtml(r.exam || 'Practice')}</td><td>${escapeHtml(r.language || '')}</td><td><b>${Number(r.netWpm) || 0}</b></td><td>${Number(r.accuracy) || 0}%</td><td>${r.duration ? `${r.duration} min` : 'Free'}</td></tr>`).join('')}</tbody></table>`;
  }

  function renderDashboard() {
    const rows = history(), w = rows.map(r => Number(r.netWpm) || 0);
    const best = w.length ? Math.max(...w) : 0;
    const avg = w.length ? Math.round(w.reduce((a, b) => a + b, 0) / w.length) : 0;
    $('bestWpm').textContent = best; $('avgWpm').textContent = avg; $('totalTests').textContent = rows.length;
    const dates = [...new Set(rows.map(r => (r.date || '').slice(0, 10)))].sort().reverse();
    let streak = 0, cursor = new Date();
    const today = new Date().toISOString().slice(0, 10);
    if (!dates.includes(today)) cursor.setDate(cursor.getDate() - 1);
    while (dates.includes(cursor.toISOString().slice(0, 10))) { streak++; cursor.setDate(cursor.getDate() - 1); }
    $('practiceStreak').textContent = streak;
  }

  function exportCSV() {
    const rows = history(); if (!rows.length) { alert('No typing history to export.'); return; }
    const cols = ['date', 'name', 'exam', 'language', 'duration', 'netWpm', 'grossWpm', 'accuracy', 'cpm', 'correct', 'wrong', 'typed'];
    const csv = [cols.join(','), ...rows.map(r => cols.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'typing-test-history.csv'; a.click(); URL.revokeObjectURL(a.href);
  }

  $('loadDailyDrill')?.addEventListener('click', () => {
    const lang = getLanguage() === 'mixed' ? 'en' : getLanguage();
    $('typingMode').value = 'custom';
    $('customPassageWrap').style.display = 'grid';
    $('customPassage').value = lang === 'hi'
      ? 'क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न प फ ब भ म य र ल व श ष स ह।\n\nनियमित अभ्यास से हिंदी टाइपिंग की गति और शुद्धता दोनों में तेज़ी से सुधार होता है।'
      : 'asdf jkl; asdfg hjkl; fdsa ;lkj ask dad fall lad flask glass hall sad half dash glad;\nqwert yuiop zxcvb nm,./ The quick brown fox jumps over the lazy dog 1234567890.';
    reset();
    $('typingResult').textContent = 'Daily Home-Row + Full Keyboard drill loaded. Press Start Typing Test!';
  });

  $('typingStart').addEventListener('click', start);
  $('typingReset').addEventListener('click', reset);
  $('typingNextWall').addEventListener('click', reset);
  $('typingInput').addEventListener('input', onInput);
  $('typingPause').addEventListener('click', pauseToggle);
  $('typingFinish').addEventListener('click', finish);
  ['examProfile', 'typingLanguage', 'typingDuration', 'typingMode', 'typingStrict'].forEach(id => $(id).addEventListener('change', () => { updateProfileHint(); reset(); }));
  $('customPassage').addEventListener('input', () => { if (getMode() === 'custom' && !active) reset(); });
  $('exportHistory').addEventListener('click', exportCSV);
  $('clearHistory').addEventListener('click', () => { if (confirm('Delete all typing history saved in this browser?')) { localStorage.removeItem(HISTORY_KEY); renderHistory(); renderDashboard(); } });
  $('printResult').addEventListener('click', () => {
    if (!lastResult) return;
    const w = window.open('', '_blank'); if (!w) { window.print(); return; }
    w.document.write(`<!doctype html><title>Typing Result</title><style>body{font:16px Arial;padding:40px;color:#0f172a}h1{color:#155eef}.box{border:1px solid #cbd5e1;border-radius:12px;padding:20px;margin-top:20px}b{font-size:22px;color:#155eef}</style><h1>Sarkari Job Universe — Typing Pro Result</h1><p>${escapeHtml(lastResult.name || 'Candidate')} • ${escapeHtml(lastResult.exam)}</p><div class="box"><p>Net WPM: <b>${lastResult.netWpm}</b></p><p>Gross WPM: <b>${lastResult.grossWpm}</b></p><p>Accuracy: <b>${lastResult.accuracy}%</b></p><p>CPM: <b>${lastResult.cpm}</b></p><p>Correct: ${lastResult.correct} | Errors: ${lastResult.wrong}</p></div>`);
    w.document.close(); w.print();
  });
  $('typingInput').addEventListener('keydown', (e) => {
    if (active && !paused && e.key === 'Backspace') {
      if (backspaceDisabled) {
        e.preventDefault();
        playKeyClick('wrong');
        $('typingResult').textContent = '🚫 Backspace is DISABLED (Real RRB / Court Exam Rule)! Keep typing forward.';
        return;
      }
      backspaceCount++;
      if ($('backspaces')) $('backspaces').textContent = String(backspaceCount);
      playKeyClick('space');
    }
  });
  $('typingSoundToggle')?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    $('typingSoundToggle').textContent = soundEnabled ? '🔊 Mechanical Sound: ON' : '🔇 Sound: OFF';
  });
  $('typingVoiceToggle')?.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    $('typingVoiceToggle').textContent = voiceEnabled ? '🗣️ Voice Alert: ON' : '🔇 Voice Alert: OFF';
  });
  $('practiceWeakKeysBtn')?.addEventListener('click', () => {
    if (!lastWeakKeys.length) return;
    const keys = lastWeakKeys.map(([k]) => k === 'SPACE' ? ' ' : k).filter(Boolean);
    const drill = Array.from({ length: 20 }, (_, i) => keys.map((ch, j) => (ch === ' ' ? 'a' : ch) + keys[(i + j) % keys.length]).join(' ')).join(' ');
    $('typingMode').value = 'custom';
    $('customPassageWrap').style.display = 'grid';
    $('customPassage').value = drill;
    $('typingDuration').value = '3';
    reset();
    $('typingResult').textContent = 'Custom missed-keys drill loaded! Press Start Typing Test.';
  });
  $('typingFocusMode')?.addEventListener('click', () => {
    const on = document.body.classList.toggle('tw-focus');
    $('typingFocusMode').textContent = on ? '↩ Exit Focus' : '🖥️ Focus Mode';
  });

  attachAntiCopy();
  updateProfileHint();
  renderHistory();
  renderDashboard();
  reset();

  // ==================== V100.0 PRO CONTROLS ====================
  $('toggleBackspaceBtn')?.addEventListener('click', () => {
    backspaceDisabled = !backspaceDisabled;
    $('toggleBackspaceBtn').textContent = backspaceDisabled ? '🚫 Backspace: OFF (Exam)' : '⌫ Backspace: ON';
  });

  $('toggleTapeBtn')?.addEventListener('click', () => {
    tapeMode = !tapeMode;
    $('typingPassage')?.classList.toggle('tape-mode', tapeMode);
    $('toggleTapeBtn').textContent = tapeMode ? '📜 View: Single-Line Tape' : '📜 View: Exam Box';
  });

  $('fontDownBtn')?.addEventListener('click', () => {
    fontSizePx = Math.max(13, fontSizePx - 2);
    if ($('typingPassage')) $('typingPassage').style.fontSize = fontSizePx + 'px';
  });

  $('fontUpBtn')?.addEventListener('click', () => {
    fontSizePx = Math.min(30, fontSizePx + 2);
    if ($('typingPassage')) $('typingPassage').style.fontSize = fontSizePx + 'px';
  });

  $('botSpeedSelect')?.addEventListener('change', (e) => {
    botTargetWpm = Number(e.target.value) || 0;
    if ($('botRaceBox')) $('botRaceBox').style.display = botTargetWpm > 0 ? 'grid' : 'none';
    if ($('raceBotWpm')) $('raceBotWpm').textContent = String(botTargetWpm);
  });

  $('dictationBtn')?.addEventListener('click', () => {
    dictationOn = !dictationOn;
    $('dictationBtn').textContent = dictationOn ? '🎙️ Audio Dictation: ON' : '🎙️ Audio Dictation: OFF';
    if (!dictationOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (dictationTimer) { clearInterval(dictationTimer); dictationTimer = null; }
    } else if (dictationOn && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(passage.slice(0, 600));
      utter.lang = getLanguage() === 'hi' ? 'hi-IN' : 'en-IN';
      utter.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  });

  $('printCertBtn')?.addEventListener('click', () => {
    if (!lastResult) return;
    const w = window.open('', '_blank');
    if (!w) { window.print(); return; }
    const rank = getRankBadge(lastResult.netWpm, lastResult.accuracy);
    w.document.write(`<!doctype html><title>Typing Practice Certificate</title><style>body{font-family:Georgia,serif;padding:30px;background:#f8fafc;color:#0f172a}.cert{max-width:780px;margin:0 auto;background:#fff;border:10px double #b45309;padding:42px;text-align:center;box-shadow:0 12px 30px rgba(0,0,0,.08)}h1{color:#1e3a8a;margin:8px 0;font-size:32px}h2{color:#059669;margin:14px 0;font-size:26px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:24px 0}.grid div{border:1px solid #cbd5e1;border-radius:10px;padding:12px}.grid b{display:block;font-size:22px;color:#155eef}</style><div class="cert"><div style="font-size:12px;letter-spacing:2px;font-weight:bold;color:#b45309">SARKARI JOB UNIVERSE • TYPING PRO ULTIMATE v1.0</div><h1>Certificate of Typing Practice</h1><p>This certifies that</p><h2>${escapeHtml(lastResult.name || 'Candidate')}</h2><p>has completed the <b>${escapeHtml(lastResult.exam)}</b> typing test (${escapeHtml(lastResult.language.toUpperCase())}) with:</p><div class="grid"><div><b>${lastResult.netWpm}</b>Net WPM</div><div><b>${lastResult.accuracy}%</b>Accuracy</div><div><b>${(lastResult.kdph || 0).toLocaleString()}</b>KDPH</div><div><b>${lastResult.errorPct || '0'}%</b>Error %</div></div><p><b>Rank Achieved:</b> ${rank} &bull; <b>Date:</b> ${new Date(lastResult.date).toLocaleDateString()}</p><p style="font-size:11px;color:#64748b;margin-top:26px">Independent practice certificate generated by Sarkari Job Universe. Not an official government examination certificate.</p></div>`);
    w.document.close();
    w.print();
  });

  async function loadTypingLeaderboard() {
    const el = $('typingToppersList');
    if (!el) return;
    try {
      const r = await fetch('/api/typing-leaderboard', { cache: 'no-store' });
      const d = await r.json();
      const rows = (d.today && d.today.length) ? d.today : (d.allTime || []);
      if (!rows.length) {
        el.innerHTML = '<p class="tw-note">Be the first typist on Today\'s Toppers Board! Score 90%+ accuracy and click Submit.</p>';
        return;
      }
      el.innerHTML = `<table class="tw-table"><thead><tr><th>Rank</th><th>Candidate</th><th>Exam</th><th>Net WPM</th><th>Accuracy</th><th>KDPH</th></tr></thead><tbody>${rows.map((x, i) => `<tr><td><b>#${i + 1}</b></td><td>${escapeHtml(x.name)}</td><td>${escapeHtml(x.exam)}</td><td><b style="color:#155eef">${x.netWpm} WPM</b></td><td>${x.accuracy}%</td><td>${(x.kdph || 0).toLocaleString()}</td></tr>`).join('')}</tbody></table>`;
    } catch {
      el.textContent = 'Leaderboard will load once connected to the server.';
    }
  }

  $('submitToppersBtn')?.addEventListener('click', async () => {
    if (!lastResult || lastResult.accuracy < 90) return;
    const btn = $('submitToppersBtn');
    btn.disabled = true;
    btn.textContent = 'Submitting…';
    try {
      const r = await fetch('/api/typing-leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lastResult.name || 'Candidate',
          exam: lastResult.exam,
          language: lastResult.language,
          netWpm: lastResult.netWpm,
          accuracy: lastResult.accuracy,
          kdph: lastResult.kdph || 0
        })
      });
      if (r.ok) {
        btn.textContent = '✅ Submitted to Toppers Board!';
        loadTypingLeaderboard();
      } else {
        btn.textContent = 'Submit failed';
      }
    } catch {
      btn.textContent = 'Offline — Retry';
      btn.disabled = false;
    }
  });

  loadTypingLeaderboard();
})();
