"use strict";

// ============================================================================
// TYPING PRO ULTIMATE v2.0 — ALL-INDIA EXAM ENGINE + MECHANICAL SOUND + BOLO BAR
// Clean 3-Step Flow: Setup -> Distraction-Free Single-Line Exam -> Result & Weak Drill
// ============================================================================
(function () {
  const EXAM_PROFILES = {
    ssc: { name: "SSC CHSL / CGL (DEST)", targetWpm: 35, maxErrPct: 5, defaultSec: 600, lockBs: false, pool: "govt" },
    rrb: { name: "RRB NTPC Typing", targetWpm: 30, maxErrPct: 5, defaultSec: 600, lockBs: true, pool: "railway" },
    crpf: { name: "CRPF / BSF / CISF HCM", targetWpm: 35, maxErrPct: 5, defaultSec: 600, lockBs: false, pool: "defence" },
    court: { name: "High Court / Supreme Court (JCA)", targetWpm: 40, maxErrPct: 4, defaultSec: 600, lockBs: false, pool: "legal" },
    jkssb: { name: "JKSSB / UPSSSC / CPCT", targetWpm: 35, maxErrPct: 5, defaultSec: 600, lockBs: false, pool: "govt" },
    general: { name: "General Speed Pro (80+ WPM)", targetWpm: 45, maxErrPct: 8, defaultSec: 300, lockBs: false, pool: "general" },
    kb_home: { name: "Keyboard Practice: Home Row (ASDF JKL;)", targetWpm: 25, maxErrPct: 5, defaultSec: 180, lockBs: false, pool: "kb_home" },
    kb_top: { name: "Keyboard Practice: Top Row (QWERTYUIOP)", targetWpm: 25, maxErrPct: 5, defaultSec: 180, lockBs: false, pool: "kb_top" },
    kb_bottom: { name: "Keyboard Practice: Bottom Row (ZXCVBNM,./)", targetWpm: 25, maxErrPct: 5, defaultSec: 180, lockBs: false, pool: "kb_bottom" },
    kb_numbers: { name: "Keyboard Practice: Numbers & Symbols (1-0 !@#)", targetWpm: 20, maxErrPct: 5, defaultSec: 180, lockBs: false, pool: "kb_numbers" },
    kb_all: { name: "Full Keyboard All-Keys Mastery (A-Z + 0-9 + Shift)", targetWpm: 30, maxErrPct: 5, defaultSec: 300, lockBs: false, pool: "kb_all" },
    numpad: { name: "Numpad / Data Entry Drill (0-9)", targetWpm: 28, maxErrPct: 4, defaultSec: 300, lockBs: false, pool: "numpad" },
    daily: { name: "Today's 5-Min Daily Challenge", targetWpm: 35, maxErrPct: 5, defaultSec: 300, lockBs: false, pool: "daily" }
  };

  const PASSAGES = {
    govt: [
      "Digital public infrastructure has transformed banking, education, healthcare and citizen services across rural and urban India. Instant digital payments, online certificate portals and transparent recruitment systems have reduced delays while making essential government services accessible to every student.",
      "Public administration depends on accurate record keeping, clear official correspondence and timely verification of documents. Clerical officers and data entry operators play a vital role in drafting notices, maintaining registers, updating spreadsheets and assisting citizens politely.",
      "The Constitution of India establishes a sovereign, socialist, secular and democratic republic ensuring justice, liberty, equality and fraternity for all citizens. Fundamental rights protect individual freedom while directive principles guide the state toward inclusive welfare and balanced development.",
      "Transparent governance requires disciplined file movement, verified expenditure audits and prompt grievance redressal at every district office. Modern e-office platforms allow departments to track official memoranda, sanction orders and recruitment notifications with complete accountability.",
      "Staff Selection Commission and state recruitment boards conduct computer based examinations and skill tests to select capable clerks, assistants and data entry operators. Candidates who maintain steady posture and high accuracy easily qualify for final merit lists.",
      "District revenue offices maintain land ownership records, mutation registers, domicile certificates and income verifications for local residents. Digitization of land maps and online verification portals has saved citizens countless visits to tehsil headquarters.",
      "Parliamentary committees examine departmental budgets, review public expenditure and recommend administrative reforms to improve service delivery. Civil servants prepare detailed briefing notes, statistical tables and compliance reports within strict timelines.",
      "Public welfare schemes covering rural housing, clean drinking water, scholarships and maternal nutrition depend on accurate beneficiary databases. Field verification teams and block offices coordinate every month to ensure funds reach eligible families directly.",
      "Smart city initiatives focus on reliable public transport, underground power cables, solid waste management and integrated command centres. Municipal corporations use digital dashboards to monitor water supply, street lighting and citizen feedback daily.",
      "National education reforms emphasize foundational literacy, vocational skills, digital classrooms and transparent board assessments. State scholarship portals enable deserving students from remote districts to pursue higher studies without financial barriers.",
      "Electronic procurement portals allow government departments to invite competitive bids from verified suppliers across India. Open tendering reduces project costs, prevents favouritism and creates clear audit trails for public infrastructure works.",
      "Panchayati Raj institutions strengthen grassroots democracy by enabling village assemblies to plan local roads, irrigation channels and school repairs. Gram panchayat secretaries record resolutions, maintain cash books and upload progress reports online."
    ],
    railway: [
      "Indian Railways connects thousands of towns, industrial corridors and remote regions through one of the largest passenger and freight networks in the world. Modern signalling, electrified routes and high speed train corridors have significantly improved travel safety and punctuality.",
      "Railway station operations depend on coordinated scheduling, accurate ticketing records and real time freight tracking across regional zones. Dedicated ministerial and clerical staff ensure smooth passenger services, timely roster management and strict compliance with safety manuals.",
      "Dedicated freight corridors allow heavy cargo trains to move agricultural produce, coal, cement and manufactured goods faster between major ports and inland logistics hubs, reducing transport costs and supporting national economic growth.",
      "Mountain railway projects across Jammu and Kashmir, Himachal Pradesh and the Northeast engineering marvels feature long tunnels, high steel arch bridges and all weather tracks that connect remote valleys with major national cities.",
      "Computerized passenger reservation systems process millions of bookings, cancellations and chart preparations every single day. Commercial clerks and enquiry officers assist travellers with platform updates, refund rules and parcel dispatch receipts.",
      "Track electrification and solar powered railway stations help reduce diesel consumption and lower carbon emissions across the national rail grid. Maintenance engineers inspect overhead equipment, sleepers and track circuits regularly to ensure safe journeys.",
      "Railway workshops manufacture modern coaches fitted with bio toilets, emergency braking systems, fire detection sensors and comfortable seating. Quality inspection teams test every coach thoroughly before clearing it for mainline express service.",
      "Automatic block signalling and anti collision safety systems allow more trains to operate smoothly on busy trunk routes without compromising passenger safety. Control room officers monitor live train positions round the clock across every division.",
      "Suburban rail networks in Mumbai, Chennai, Kolkata and Delhi carry millions of office commuters and students every morning and evening. Punctual turnaround schedules and clear public announcements keep platform crowds moving safely.",
      "Parcel trains and kisan rail services transport fresh fruits, vegetables and dairy products rapidly from farming districts to distant metropolitan markets, helping farmers receive fair prices while reducing post harvest spoilage."
    ],
    defence: [
      "Central armed police forces and defence personnel guard national borders, protect critical infrastructure and assist civil authorities during natural disasters. Discipline, physical fitness and accurate administrative reporting form the backbone of every battalion headquarters.",
      "Head constable ministerial personnel manage personnel records, pay bills, service books, leave rosters and confidential official correspondence with speed and precision. Regular typing practice builds the calm accuracy required during timed skill examinations.",
      "Modern border management combines brave human vigilance with satellite monitoring, thermal sensors and rapid communication networks across mountain passes, deserts and coastal frontiers.",
      "Disaster response battalions deploy rapidly during floods, landslides, earthquakes and cyclones to rescue stranded citizens and restore essential relief supplies. Coordination centres maintain live communication logs and inventory lists throughout every operation.",
      "Defence training academies emphasize physical endurance, tactical leadership, map reading, cyber awareness and ethical conduct. Cadets follow strict daily routines that build resilience, teamwork and clear decision making under pressure.",
      "Indigenous defence manufacturing produces naval vessels, transport aircraft, artillery systems, radars and bulletproof gear within Indian shipyards and factories. Self reliance strengthens national security and creates high skill engineering careers.",
      "Military hospitals and field medical units provide emergency trauma care, preventive healthcare and rehabilitation support to soldiers and veterans in high altitude stations and remote border outposts.",
      "Coastal security agencies patrol maritime zones, monitor fishing vessels and safeguard ports and offshore installations against smuggling and sea hazards. Accurate radio logs and watch duty registers remain essential at every coastal station.",
      "Aviation maintenance crews inspect engines, avionics and safety systems before every sortie to ensure complete flight readiness. Technical tradesmen document every calibration and component check in official maintenance logs.",
      "Ex servicemen welfare boards assist retired personnel and their families with pension verification, healthcare cards, skill transition courses and re employment opportunities across central and state departments."
    ],
    legal: [
      "The judiciary upholds the rule of law by interpreting statutes, protecting constitutional remedies and delivering reasoned judgments without fear or favour. Court clerks and judicial assistants prepare cause lists, verify affidavits and transcribe formal proceedings with zero factual error.",
      "Every petition filed before a High Court undergoes careful scrutiny regarding jurisdiction, limitation period, annexures and sworn verification. Accurate typing of legal terminology, citations and dates ensures that judicial records remain clear and reliable for future reference.",
      "Alternative dispute resolution mechanisms such as Lok Adalats and mediation centres help citizens settle civil and family matters amicably while reducing the burden on regular trial courts.",
      "Electronic court portals enable advocates and litigants to check daily case status, download certified copies of orders and file digital pleadings from any district. Digitization of old judicial archives protects vital legal precedents from physical damage.",
      "Constitutional benches examine complex questions involving fundamental rights, federal powers and statutory interpretation. Stenographers and personal assistants transcribe lengthy oral arguments accurately while maintaining strict confidentiality.",
      "District legal services authorities provide free legal aid, awareness camps and counselling support to economically weaker sections, senior citizens and women seeking timely justice.",
      "Trial courts record witness testimonies, mark documentary exhibits and hear cross examinations in accordance with procedural codes. Clear and error free deposition transcripts assist appellate courts during subsequent review.",
      "Tribunals specializing in administrative services, taxation, consumer protection and environmental conservation deliver faster domain specific orders. Registry officials verify filing fees, index sheets and service of notices every morning.",
      "Law libraries attached to High Courts maintain updated volumes of central acts, state gazettes, legal journals and online judgment databases for judges and research clerks.",
      "Judicial training institutes conduct regular workshops on forensic evidence, cyber law, digital signatures and case management so court staff stay updated with evolving legal procedures."
    ],
    general: [
      "Consistent daily practice is the fastest method to reach eighty words per minute with ninety eight percent accuracy. Keep your fingers anchored on the home row keys, maintain steady rhythm and look at the highlighted word ahead rather than looking down at the keyboard.",
      "Renewable energy projects including solar parks, wind farms and Himalayan hydroelectric stations are expanding clean power capacity across India every year. Sustainable development requires balancing rapid industrial growth with forest conservation and clean water management.",
      "Students preparing for competitive examinations succeed through structured revision, timed mock tests and careful analysis of every mistake. Small improvements in speed and accuracy every single day compound into outstanding exam performance.",
      "High speed typists do not rush wildly through difficult words; instead they keep an even tempo across easy and hard combinations. Smooth rhythm prevents finger tangles, lowers error penalties and lifts net speed above eighty words per minute effortlessly.",
      "Space research missions have placed communication satellites, weather monitors and lunar explorers into precise orbits at remarkable cost efficiency. Scientific data from orbital sensors supports agriculture forecasting, disaster warnings and rural broadband connectivity.",
      "Modern software engineering relies on clean code structure, automated testing, version control and clear documentation. Developers who type fluently write programs, debug errors and respond to technical queries much faster during tight project deadlines.",
      "Healthy study habits combine focused forty five minute learning blocks with short active breaks, proper hydration and adequate sleep. Reviewing weak topics before bedtime helps the brain consolidate memory far better than last minute cramming.",
      "Rural entrepreneurship and digital commerce now allow local artisans, farmers and small workshops to sell handmade goods directly to buyers across the nation. Fast courier networks and instant payment links have opened new income opportunities in small towns.",
      "Himalayan rivers originate from high glaciers and mountain springs, supplying drinking water, irrigation and clean electricity to millions of households across the northern plains. Protecting watersheds and planting native trees keeps ecosystems resilient.",
      "Public libraries and community study rooms offer quiet spaces where students from diverse backgrounds prepare together for national and state examinations. Sharing notes, practising group quizzes and staying disciplined builds lasting confidence.",
      "Financial literacy empowers young adults to compare savings accounts, understand compound interest, avoid online fraud and plan long term investments responsibly. Checking official websites and verifying messages before sharing details keeps digital accounts safe.",
      "Effective communication requires clear sentences, polite tone and accurate spelling whether writing an official email, an exam essay or a technical report. Practising timed typing daily sharpens both reading speed and written clarity."
    ],
    kb_home: [
      "asdf jkl; asdf jkl; fjdk slaj ghfj dksa; sad lad dad fad ask flask glass hall fall all; half glad dash flash lash salad; asks falls halls lads dads;",
      "jjj fff kkk ddd lll sss ;;; aaa ggg hhh fjfj dkdk slsl a;a; ghgh; a sad lad had a glass flask; dad asks all lads; half a dash;",
      "add all dad fall glad hall half lad sad ask dash flash flask glass lash salad shall; dad had a glad lad; a glass flask falls in the hall;"
    ],
    kb_top: [
      "qwer uiop qwer uiop tyui opqw erty; quiet power tower write route quote; pure type rope port true wire; query poetry report priority;",
      "qqq ppp www ooo eee iii rrr uuu ttt yyy; we try to write pure poetry; your report power is top; type every word properly;",
      "pretty quiet writer wrote pure poetry; power tower route port rope wire; try to type your true report with top priority;"
    ],
    kb_bottom: [
      "zxcv nm,. zxcv nm,. bnm, ./zx cvbn; zoom calm exam next back move; zero, zone, cave, wave, brave, voice, basic, music, public, comic.",
      "zzz /// xxx ... ccc ,,, vvv mmm bbb nnn; calm men can move seven boxes. mix zinc, wax, and carbon. check every number, comma, and dot.",
      "brave civic comic exam music public voice wave zero zone; move seven calm boxes back next week; check commas, dots, and slashes."
    ],
    kb_numbers: [
      "1234 5678 90-= 10 20 35 48 59 67 74 82 91 2026 185202; Rs.100 Rs.500 98.5% 24/7 (10+2) #1 @home $50 & more! 35-WPM 100% 1947 2027",
      "1! 2@ 3# 4$ 5% 6^ 7& 8* 9( 0) -_ =+ [10] {25} 50% + 25% = 75%; Date: 26-11-2026; Roll No: 1045892; Code: SSC-2026/CHSL!",
      "80 WPM x 15 Min = 1,200 Words; 100% Accuracy; Fee: Rs.100 (Gen/OBC) & Rs.0 (SC/ST); Advt. No. 10/2026; Helplines: 112, 100, 108."
    ],
    kb_all: [
      "The quick brown fox jumps over 13 lazy dogs! Check SSC CHSL (10+2) 2026: Target = 35 WPM, Accuracy >= 95%, Fee: Rs.100 & Time: 10:00 min.",
      "Pack my box with 5 dozen liquor jugs & 2026 Exam Papers! Railway RRB NTPC (30 WPM), JKSSB Advt. 10/2026, Code #A-98, Score: 99.5%!",
      "80+ WPM Pro Speed Test: Type A-Z, a-z, 0-9 & Symbols (!@#$%^&*) smoothly for 1, 5, 10, 15 or 20 minutes with zero hesitation!"
    ],
    numpad: [
      "1045 2089 3490 4512 5678 6723 7891 8904 9012 185202 2026 2027 1250.50 4890.75 99.95 100.00 24/7 365 15-08-1947 26-11-2026",
      "789 456 123 000 100.25 250.50 750.75 1999.00 54321 98765 112233 445566 778899 10+20=30 85-40=45 12*12=144 500/25=20 3.1416",
      "01/01/2026 15/05/2026 31/12/2026 8820 4410 7735 9960 3305 6615 2208 5590 1420.80 3980.45 6125.10 8499.99 1024 2048 4096 8192"
    ],
    hindi: [
      "भारत का संविधान विश्व का सबसे बड़ा लिखित संविधान है जो प्रत्येक नागरिक को समानता स्वतंत्रता और न्याय का अधिकार प्रदान करता है। सरकारी कार्यालयों में हिंदी टंकण का विशेष महत्व है।",
      "डिजिटल भारत अभियान ने ग्रामीण और शहरी क्षेत्रों में बैंकिंग शिक्षा स्वास्थ्य तथा सरकारी सेवाओं को अत्यंत सरल और पारदर्शी बना दिया है। छात्र अब ऑनलाइन पोर्टल के माध्यम से सभी आवेदन घर बैठे कर सकते हैं।",
      "नियमित अभ्यास और सही उंगलियों की स्थिति से हिंदी टाइपिंग में पैंतीस से पचास शब्द प्रति मिनट की गति आसानी से प्राप्त की जा सकती है। शुद्धता बनाए रखना प्रत्येक परीक्षा में सफलता की कुंजी है।",
      "भारतीय रेल देश के कोने कोने को जोड़ने वाली सबसे बड़ी परिवहन प्रणाली है। आधुनिक सिग्नल प्रणाली और विद्युतीकरण से यात्रा पहले से अधिक सुरक्षित और समयबद्ध हो गई है।",
      "न्यायालय कानून के शासन की रक्षा करते हैं और नागरिकों के मौलिक अधिकारों को सुनिश्चित करते हैं। लिपिक और आशुलिपिक का कार्य अभिलेखों को बिना किसी त्रुटि के समय पर तैयार करना होता है।",
      "प्रतियोगी परीक्षाओं की तैयारी करने वाले विद्यार्थियों को प्रतिदिन समयबद्ध अभ्यास करना चाहिए। अपनी गलतियों का विश्लेषण करके और कमजोर शब्दों को दोहराकर वे निश्चित रूप से चयन सूची में स्थान बना सकते हैं।"
    ]
  };

  // ==================== ADVANCED MECHANICAL SOUND ENGINE (Web Audio API) ====================
  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function playKeySound(profile, type = "normal") {
    if (profile === "off") return;
    const ctx = getAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === "error") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(165, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.09);
      return;
    }

    // Crisp noise burst for tactile switch click
    const dur = profile === "typewriter" ? 0.045 : profile === "mxblue" ? 0.028 : 0.018;
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.25));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const baseFreq = type === "space" ? 650 : profile === "mxblue" ? 2400 : profile === "typewriter" ? 1350 : 950;
    filter.frequency.setValueAtTime(baseFreq + (Math.random() * 240 - 120), now);
    filter.Q.setValueAtTime(profile === "mxblue" ? 2.4 : 1.5, now);

    const gain = ctx.createGain();
    const vol = profile === "typewriter" ? 0.28 : profile === "mxblue" ? 0.22 : 0.12;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    noise.start(now);

    // Subtle tactile bottom-out thock
    const thock = ctx.createOscillator();
    const tGain = ctx.createGain();
    thock.type = "triangle";
    thock.frequency.setValueAtTime(type === "space" ? 120 : profile === "typewriter" ? 170 : 220, now);
    thock.frequency.exponentialRampToValueAtTime(55, now + 0.03);
    tGain.gain.setValueAtTime(vol * 0.45, now);
    tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.032);
    thock.connect(tGain); tGain.connect(ctx.destination);
    thock.start(now); thock.stop(now + 0.035);
  }

  // ==================== ADVANCED BOLO BAR (Voice Coach & Dictation) ====================
  const boloTextEl = document.getElementById("boloText");
  const boloDotEl = document.getElementById("boloDot");

  let lastSpokenText = "";
  let stenoPaused = false;
  function boloSpeak(text, force = false) {
    lastSpokenText = text;
    if (boloTextEl) boloTextEl.textContent = text;
    if (state.voiceMode === "off" && !force) return;
    if (stenoPaused && !force) return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = state.lang && state.lang.startsWith("hi") ? "hi-IN" : "en-IN";
      const sp = Number(state.stenoSpeed || 80);
      u.rate = state.voiceMode === "dictation" ? (sp === 60 ? 0.82 : sp === 100 ? 1.25 : 1.02) : 1.0;
      u.pitch = 1.0;
      u.onstart = () => boloDotEl && boloDotEl.classList.add("speaking");
      u.onend = () => boloDotEl && boloDotEl.classList.remove("speaking");
      u.onerror = () => boloDotEl && boloDotEl.classList.remove("speaking");
      window.speechSynthesis.speak(u);
    } catch (_) {}
  }

  // ==================== STATE ====================
  const state = {
    examKey: "ssc",
    durationSec: 300,
    timeLeft: 300,
    mode: "practice",
    soundProfile: "mxblue",
    voiceMode: "coach",
    candidate: "",
    fontSize: 21,
    words: [],
    wordStates: [], // null | "ok" | "err"
    wordIdx: 0,
    started: false,
    finished: false,
    timerId: null,
    keystrokes: 0,
    correctChars: 0,
    errors: 0,
    backspaces: 0,
    weakWords: [],
    lastMilestoneMin: 0,
    boxMode: "multiline",
    typedHistoryText: "",
    errorKeyCounts: {},
    focusMode: false,
    lang: "en",
    botWpm: 0,
    stenoSpeed: 80,
    highlightOn: true,
    fullErrors: 0,
    halfErrors: 0,
    wordTimes: [],
    wordStartMs: 0,
    botWordIdx: 0,
    lastResultPayload: null
  };

  // DOM refs
  const $ = (id) => document.getElementById(id);
  const screens = { setup: $("screenSetup"), exam: $("screenExam"), result: $("screenResult") };

  function setFocusMode(on) {
    state.focusMode = Boolean(on);
    document.body.classList.toggle("tw-focus-mode", state.focusMode);
    const btn = $("toggleFocusBtn");
    if (btn) {
      btn.textContent = state.focusMode ? "🎯 Focus Mode: ON" : "🎯 Focus Mode: OFF";
      btn.classList.toggle("on", state.focusMode);
    }
  }

  function showScreen(name) {
    if (name === "result") {
      setFocusMode(false);
      screens.setup && screens.setup.classList.remove("active");
      screens.exam && screens.exam.classList.remove("active");
      screens.result && screens.result.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (name === "exam") {
      screens.setup && screens.setup.classList.add("active");
      screens.exam && screens.exam.classList.add("active");
      screens.result && screens.result.classList.remove("active");
      const ex = $("screenExam");
      if (ex) ex.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // "setup" -> show Setup + Live Typing Box together!
      setFocusMode(false);
      screens.setup && screens.setup.classList.add("active");
      screens.exam && screens.exam.classList.add("active");
      screens.result && screens.result.classList.remove("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  let passageDeck = [];
  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getDailySeedIndex(len) {
    const d = new Date();
    const key = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return key % Math.max(1, len);
  }

  function refillDeck(poolKey) {
    if (state.lang && state.lang.startsWith("hi") && !poolKey.startsWith("kb_") && poolKey !== "numpad") {
      passageDeck = shuffleArr(PASSAGES.hindi);
      return;
    }
    if (poolKey === "daily") {
      const allExam = ["govt", "railway", "defence", "legal", "general"].flatMap((k) => PASSAGES[k] || []);
      const start = getDailySeedIndex(allExam.length);
      const ordered = [];
      for (let i = 0; i < allExam.length; i++) ordered.push(allExam[(start + i) % allExam.length]);
      passageDeck = ordered;
      return;
    }
    const primary = PASSAGES[poolKey] || PASSAGES.govt;
    const isSpecial = poolKey.startsWith("kb_") || poolKey === "numpad";
    if (isSpecial) {
      passageDeck = shuffleArr(primary);
    } else {
      const others = ["govt", "railway", "defence", "legal", "general"]
        .filter((k) => k !== poolKey)
        .flatMap((k) => PASSAGES[k] || []);
      passageDeck = [...shuffleArr(primary), ...shuffleArr(others)];
    }
  }

  function nextParagraphWords(poolKey) {
    if (!passageDeck.length) refillDeck(poolKey);
    const para = passageDeck.shift() || PASSAGES.general[0];
    return para.split(/\s+/).filter(Boolean);
  }

  function buildPassage(customWords = null) {
    const durationMin = Math.max(1, (state.durationSec || 300) / 60);
    // Size passage for 80 to 105 WPM typists (1 min = 110+ words, 5 min = 550+ words, 15 min = 1,650+ words, 20 min = 2,200+ words)
    const targetWords = Math.max(115, Math.ceil(durationMin * 110));

    if (customWords && customWords.length) {
      const repeated = [];
      while (repeated.length < targetWords) repeated.push(...customWords);
      state.words = repeated.slice(0, targetWords + 20);
    } else {
      const prof = EXAM_PROFILES[state.examKey] || EXAM_PROFILES.ssc;
      refillDeck(prof.pool);
      const collected = [];
      while (collected.length < targetWords) {
        collected.push(...nextParagraphWords(prof.pool));
      }
      state.words = collected;
    }
    state.wordStates = new Array(state.words.length).fill(null);
    state.wordIdx = 0;
    renderPassage();
  }

  function renderPassage(typedCurrent = "") {
    const view = $("passageView");
    if (!view) return;
    const html = state.words.map((w, i) => {
      if (i < state.wordIdx) {
        const cls = state.wordStates[i] === "ok" ? "c-ok" : "c-err";
        return `<span class="${cls}">${w}</span>`;
      }
      if (state.botWpm > 0 && state.started && i === state.botWordIdx && i !== state.wordIdx) {
        return `<span class="c-bot" title="Ghost Bot">${w}</span>`;
      }
      if (i === state.wordIdx) {
        let inner = "";
        for (let c = 0; c < w.length; c++) {
          if (c < typedCurrent.length) {
            const ok = typedCurrent[c] === w[c];
            inner += `<span class="${ok ? "c-ok" : "c-err"}">${w[c]}</span>`;
          } else if (c === typedCurrent.length) {
            inner += `<span class="c-cur">${w[c]}</span>`;
          } else {
            inner += w[c];
          }
        }
        return `<span id="curWordSpan" style="font-weight:800">${inner}</span>`;
      }
      return w;
    }).join(" ");
    view.innerHTML = html;
    view.style.fontSize = state.fontSize + "px";
    view.classList.toggle("no-highlight", !state.highlightOn);

    const curEl = document.getElementById("curWordSpan");
    const stage = $("typingStage");
    if (curEl && stage) {
      const top = curEl.offsetTop;
      const targetScroll = Math.max(0, top - stage.clientHeight * 0.35);
      stage.scrollTop = targetScroll;
    }
    if (typeof highlightNextFingerKey === 'function') highlightNextFingerKey(typedCurrent);
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateStats() {
    const elapsedMin = Math.max((state.durationSec - state.timeLeft) / 60, 1 / 60);
    const grossWpm = Math.round((state.keystrokes / 5) / elapsedMin);
    const netWpm = Math.max(0, Math.round((state.correctChars / 5) / elapsedMin));
    const totalAttempted = state.wordIdx;
    const acc = totalAttempted > 0 ? Math.max(0, Math.round(((totalAttempted - state.errors) / totalAttempted) * 100)) : 100;

    $("stTimer").textContent = fmtTime(state.timeLeft);
    $("stWpm").textContent = state.started ? netWpm : 0;
    $("stAcc").textContent = acc + "%";
    $("stKeys").textContent = state.keystrokes;
    $("stErr").textContent = state.errors;
    $("stBs").textContent = state.backspaces;
    $("wordCountHint").textContent = `Words: ${state.wordIdx} / ${state.words.length}`;

    const pct = Math.min(100, Math.round(((state.durationSec - state.timeLeft) / state.durationSec) * 100));
    $("progressFill").style.width = pct + "%";
    // Update Live Ghost Bot Racer
    const raceWrap = $("raceWrap");
    if (raceWrap) {
      if (state.botWpm > 0) {
        raceWrap.classList.add("show");
        const elapsedSec = Math.max(0, state.durationSec - state.timeLeft);
        state.botWordIdx = state.started ? Math.floor((state.botWpm / 60) * elapsedSec) : 0;
        const totalExpectedBot = Math.max(20, Math.round((state.botWpm / 60) * state.durationSec));
        const youPct = Math.min(100, Math.round((state.wordIdx / totalExpectedBot) * 100));
        const botPct = Math.min(100, Math.round((state.botWordIdx / totalExpectedBot) * 100));
        if ($("raceYouFill")) $("raceYouFill").style.width = youPct + "%";
        if ($("raceBotFill")) $("raceBotFill").style.width = botPct + "%";
        if ($("raceBotName")) $("raceBotName").textContent = `🤖 ${state.botWpm} WPM`;
        const diffW = state.wordIdx - state.botWordIdx;
        if ($("raceStatusText")) {
          $("raceStatusText").textContent = !state.started
            ? `🤖 Ghost Bot (${state.botWpm} WPM) Ready on Starting Line`
            : diffW >= 0 ? `🏆 You are LEADING the ${state.botWpm} WPM Bot!` : `🔥 Chase the ${state.botWpm} WPM Bot!`;
        }
        if ($("raceGapText")) $("raceGapText").textContent = `${diffW >= 0 ? "+" : ""}${diffW} words`;
      } else {
        raceWrap.classList.remove("show");
      }
    }

    // Update Live Target Pace Bar
    const prof = EXAM_PROFILES[state.examKey] || EXAM_PROFILES.ssc;
    const target = prof.targetWpm || 35;
    const paceFill = $("paceFill");
    const paceLabel = $("paceLabel");
    const paceTargetLabel = $("paceTargetLabel");
    if (paceTargetLabel) paceTargetLabel.textContent = `Target: ${target} WPM`;
    if (paceFill && paceLabel) {
      if (!state.started) {
        paceFill.style.width = "0%";
        paceFill.className = "tw-pace-fill";
        paceLabel.textContent = "⚡ Speed Meter: Start typing to track live pace";
      } else {
        const ratio = Math.min(100, Math.round((netWpm / target) * 100));
        paceFill.style.width = ratio + "%";
        const diff = netWpm - target;
        if (diff >= 0) {
          paceFill.className = "tw-pace-fill ahead";
          paceLabel.textContent = `🚀 Ahead of Target (+${diff} WPM) — ${netWpm} / ${target} WPM`;
        } else {
          paceFill.className = "tw-pace-fill behind";
          paceLabel.textContent = `⚡ Pace: ${netWpm} / ${target} WPM (${Math.abs(diff)} WPM to reach target)`;
        }
      }
    }

    return { grossWpm, netWpm, acc };
  }

  function resetExam(customWeakWords = null, interactive = true) {
    clearInterval(state.timerId);
    state.started = false;
    state.finished = false;
    state.timeLeft = state.durationSec;
    state.keystrokes = 0;
    state.correctChars = 0;
    state.errors = 0;
    state.backspaces = 0;
    state.weakWords = [];
    state.lastMilestoneMin = 0;
    state.typedHistoryText = "";
    state.errorKeyCounts = {};
    state.fullErrors = 0;
    state.halfErrors = 0;
    state.wordTimes = [];
    state.wordStartMs = Date.now();
    state.botWordIdx = 0;
    const npWrap = $("numpadWrap");
    if (npWrap) npWrap.classList.toggle("show", state.examKey === "numpad");

    const prof = EXAM_PROFILES[state.examKey] || EXAM_PROFILES.ssc;
    const lockBs = state.mode === "strict" || prof.lockBs;
    $("activeExamBadge").textContent = `${prof.name} • Target ${prof.targetWpm} WPM${lockBs ? " • Backspace Locked" : ""}`;
    $("modeHint").textContent = `Mode: ${lockBs ? "Strict Exam (Backspace LOCKED)" : "Practice (Backspace ON)"} • Auto-scroll active • Anti-copy protected`;

    buildPassage(customWeakWords);
    updateStats();
    const inp = $("wordInput");
    inp.value = "";
    inp.disabled = false;
    if (interactive) setTimeout(() => inp.focus(), 80);

    if (!interactive) {
      if (boloTextEl) boloTextEl.textContent = `${prof.name} ready! Neeche typing box me pehla letter type karte hi timer aur speed meter shuru ho jayega.`;
    } else if (customWeakWords) {
      boloSpeak("Practice drill ready! Type carefully to boost your accuracy.");
    } else if (state.voiceMode === "dictation") {
      boloSpeak(`Dictation ready. First words: ${state.words.slice(0, 4).join(" ")}`);
    } else {
      boloSpeak(`${prof.name} ready. Start typing to begin your ${Math.round(state.durationSec / 60)} minute exam.`);
    }
  }

  function startTimer() {
    if (state.started) return;
    state.started = true;
    state.timerId = setInterval(() => {
      state.timeLeft--;
      const stats = updateStats();
      const elapsedSec = state.durationSec - state.timeLeft;
      const elapsedMin = Math.floor(elapsedSec / 60);
      if (state.voiceMode === "coach" && elapsedMin > state.lastMilestoneMin && state.timeLeft > 15) {
        state.lastMilestoneMin = elapsedMin;
        boloSpeak(`${elapsedMin} minute complete. Speed ${stats.netWpm} words per minute, accuracy ${stats.acc} percent. Keep going!`);
      }
      if (state.timeLeft === 30 && state.voiceMode === "coach") {
        boloSpeak("30 seconds remaining! Stay focused.");
      }
      if (state.timeLeft % 3 === 0 && typeof saveAutoProgress === "function") saveAutoProgress();
      if (state.botWpm > 0) renderPassage(state.boxMode === "multiline" ? wordInput.value.slice(state.typedHistoryText.length) : wordInput.value);
      if (state.timeLeft <= 0) finishExam();
    }, 1000);
  }

  function finishExam() {
    if (state.finished) return;
    state.finished = true;
    clearInterval(state.timerId);
    $("wordInput").disabled = true;

    const { grossWpm, netWpm, acc } = updateStats();
    const prof = EXAM_PROFILES[state.examKey] || EXAM_PROFILES.ssc;
    const weightedErrors = Number((state.fullErrors + state.halfErrors * 0.5).toFixed(1));
    const errPct = state.wordIdx > 0 ? Number(((weightedErrors / state.wordIdx) * 100).toFixed(2)) : 0;
    if ($("resFullErr")) $("resFullErr").textContent = String(state.fullErrors);
    if ($("resHalfErr")) $("resHalfErr").textContent = String(state.halfErrors);
    if ($("resWeightedErr")) $("resWeightedErr").textContent = weightedErrors.toFixed(1);
    if ($("resErrPct")) $("resErrPct").textContent = errPct + "%";
    if (typeof clearAutoProgress === "function") clearAutoProgress();
    const passed = netWpm >= prof.targetWpm && errPct <= prof.maxErrPct;

    $("resNetWpm").textContent = netWpm;
    $("resGrossWpm").textContent = grossWpm;
    $("resAcc").textContent = acc + "%";
    $("resKeys").textContent = state.keystrokes;
    $("resErr").textContent = state.errors;
    $("resBs").textContent = state.backspaces;

    const vBox = $("resultVerdict");
    vBox.className = "tw-verdict " + (passed ? "pass" : "fail");
    const who = state.candidate ? `${state.candidate} — ` : "";
    $("verdictText").textContent = passed
      ? `✅ ${who}PASS! Qualified for ${prof.name}`
      : `⚠️ ${who}NEEDS MORE PRACTICE (${prof.name})`;
    $("verdictMeta").textContent = `Required: ${prof.targetWpm} WPM & ≤${prof.maxErrPct}% Error`;

    // Slow-Word (Hesitation) Tracker
    const slowSorted = state.wordTimes.slice().sort((a, b) => b.ms - a.ms);
    const seenSlow = new Set();
    const topSlow = [];
    for (const item of slowSorted) {
      if (!seenSlow.has(item.word)) { seenSlow.add(item.word); topSlow.push(item); }
      if (topSlow.length >= 10) break;
    }
    const slowListEl = $("slowWordsList");
    const slowBtn = $("practiceSlowBtn");
    if (slowListEl) {
      if (topSlow.length) {
        slowListEl.innerHTML = topSlow.map((s) => `<span class="tw-slow-chip">${s.word} (${(s.ms / 1000).toFixed(1)}s)</span>`).join("");
        if (slowBtn) slowBtn.style.display = "inline-block";
      } else {
        slowListEl.innerHTML = `<span style="color:var(--tw-ok);font-weight:700">Smooth rhythm on every word!</span>`;
        if (slowBtn) slowBtn.style.display = "none";
      }
    }
    state.lastResultPayload = {
      name: state.candidate || "Candidate",
      exam: prof.name,
      netWpm, grossWpm, acc, errPct, passed
    };
    if (state.examKey === "daily" && typeof submitDailyLeaderboard === "function") {
      submitDailyLeaderboard(state.candidate || "You", netWpm, acc);
    }

    const uniqWeak = [...new Set(state.weakWords)].slice(0, 20);
    const wList = $("weakWordsList");
    const wBtn = $("practiceWeakBtn");
    if (uniqWeak.length) {
      wList.innerHTML = uniqWeak.map((w) => `<span class="tw-weak-chip">${w}</span>`).join("");
      wBtn.style.display = "inline-block";
    } else {
      wList.innerHTML = `<span style="color:var(--tw-ok);font-weight:700">Zero mistyped words! Outstanding accuracy!</span>`;
      wBtn.style.display = "none";
    }

    // Populate Keyboard Error Heatmap
    if (typeof renderErrorHeatmap === "function") renderErrorHeatmap();

    // Populate Printable Official Certificate
    const todayStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    if ($("certName")) $("certName").textContent = state.candidate || "Sarkari Exam Candidate";
    if ($("certExam")) $("certExam").textContent = prof.name;
    if ($("certDate")) $("certDate").textContent = todayStr;
    if ($("certNet")) $("certNet").textContent = `${netWpm} WPM`;
    if ($("certGross")) $("certGross").textContent = `${grossWpm} WPM`;
    if ($("certAcc")) $("certAcc").textContent = `${acc}%`;
    if ($("certKeys")) $("certKeys").textContent = String(state.keystrokes);
    const stamp = $("certStamp");
    if (stamp) {
      stamp.textContent = passed ? "PASS • QUALIFIED" : "PRACTICE MORE";
      stamp.className = "tw-cert-stamp" + (passed ? "" : " fail");
    }

    saveHistory({ exam: prof.name, netWpm, acc, errors: state.errors, date: new Date().toLocaleDateString("en-IN") });
  
  const toggleBoxBtn = $("toggleBoxBtn");
  if (toggleBoxBtn) {
    toggleBoxBtn.addEventListener("click", () => {
      state.boxMode = state.boxMode === "multiline" ? "single" : "multiline";
      wordInput.classList.toggle("single-mode", state.boxMode === "single");
      wordInput.rows = state.boxMode === "single" ? 1 : 3;
      wordInput.value = state.boxMode === "multiline" ? state.typedHistoryText : "";
      toggleBoxBtn.textContent = state.boxMode === "multiline" ? "📝 Box: Multi-Line" : "📝 Box: Single-Line";
      wordInput.focus();
    });
  }

  renderHistory();
    showScreen("result");
    boloSpeak(
      passed
        ? `Congratulations! You passed with ${netWpm} words per minute and ${acc} percent accuracy!`
        : `Test complete. Your speed is ${netWpm} words per minute with ${acc} percent accuracy. Practice your weak words to qualify.`
    );
  }

  function saveHistory(entry) {
    try {
      const list = JSON.parse(localStorage.getItem("sju_typing_v2_history") || "[]");
      list.unshift(entry);
      localStorage.setItem("sju_typing_v2_history", JSON.stringify(list.slice(0, 25)));
    } catch (_) {}
  }

  function renderHistory() {
    let list = [];
    try { list = JSON.parse(localStorage.getItem("sju_typing_v2_history") || "[]"); } catch (_) {}
    const best = list.length ? Math.max(...list.map((x) => x.netWpm)) : 0;
    const avg = list.length ? Math.round(list.reduce((s, x) => s + x.netWpm, 0) / list.length) : 0;
    $("bestWpm").textContent = best;
    $("avgWpm").textContent = avg;
    $("totalTests").textContent = list.length;

    const el = $("typingHistory");
    if (!list.length) {
      el.innerHTML = `<p style="color:var(--tw-muted);margin:6px 0">No completed attempts yet. Select an exam above to start!</p>`;
      return;
    }
    if (typeof renderWpmGrowthChart === "function") renderWpmGrowthChart(list);
    el.innerHTML = `<table class="tw-table"><thead><tr><th>Date</th><th>Exam Profile</th><th>Net WPM</th><th>Accuracy</th><th>Errors</th></tr></thead><tbody>${
      list.slice(0, 10).map((r) => `<tr><td>${r.date}</td><td><b>${r.exam}</b></td><td>${r.netWpm} WPM</td><td>${r.acc}%</td><td>${r.errors}</td></tr>`).join("")
    }</tbody></table>`;
  }

  // ==================== INPUT & EVENT WIRING ====================
  const wordInput = $("wordInput");
  wordInput.addEventListener("paste", (e) => e.preventDefault());
  wordInput.addEventListener("keydown", (e) => {
    if (state.finished) return;
    const prof = EXAM_PROFILES[state.examKey] || EXAM_PROFILES.ssc;
    const lockBs = state.mode === "strict" || prof.lockBs;
    if (e.key === "Backspace") {
      if (lockBs) {
        e.preventDefault();
        playKeySound(state.soundProfile, "error");
        return;
      }
      state.backspaces++;
      playKeySound(state.soundProfile, "normal");
      return;
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const raw = wordInput.value;
      const curPart = state.boxMode === "multiline" && raw.startsWith(state.typedHistoryText)
        ? raw.slice(state.typedHistoryText.length).trim()
        : raw.trim();
      if (!curPart) return;
      commitWord(curPart);
      wordInput.value = state.boxMode === "multiline" ? state.typedHistoryText : "";
      wordInput.scrollTop = wordInput.scrollHeight;
    }
  });

  function commitWord(typed) {
    if (!typed) return;
    startTimer();
    const prof = EXAM_PROFILES[state.examKey] || EXAM_PROFILES.ssc;
    const expected = state.words[state.wordIdx] || "";
    state.keystrokes += typed.length + 1;
    // Track Slow-Word (Hesitation) timing
    const nowMs = Date.now();
    const tookMs = state.wordStartMs ? Math.min(15000, nowMs - state.wordStartMs) : 0;
    if (tookMs > 250 && expected.length >= 3) {
      state.wordTimes.push({ word: expected, ms: tookMs });
    }
    state.wordStartMs = nowMs;

    // SSC / High Court Full (1.0) & Half (0.5) Mistake Classification
    const stripPunct = (s) => s.replace(/^[.,;:!?'"()\-]+|[.,;:!?'"()\-]+$/g, "").toLowerCase();
    if (typed === expected) {
      state.wordStates[state.wordIdx] = "ok";
      state.correctChars += expected.length + 1;
      playKeySound(state.soundProfile, "space");
      if (typeof flashKeyPress === "function") flashKeyPress(" ", true);
    } else if (stripPunct(typed) === stripPunct(expected) && stripPunct(expected).length > 0) {
      // Capitalization or punctuation-only difference -> Half Mistake (0.5)
      state.wordStates[state.wordIdx] = "err";
      state.halfErrors++;
      state.errors++;
      state.weakWords.push(expected);
      playKeySound(state.soundProfile, "error");
      if (typeof flashKeyPress === "function") flashKeyPress(" ", false);
    } else {
      // Spelling / wrong word -> Full Mistake (1.0)
      state.wordStates[state.wordIdx] = "err";
      state.fullErrors++;
      state.errors++;
      state.weakWords.push(expected);
      playKeySound(state.soundProfile, "error");
      if (typeof flashKeyPress === "function") flashKeyPress(" ", false);
    }
    state.wordIdx++;
    state.typedHistoryText += typed + " ";
    if (state.typedHistoryText.length > 600) {
      state.typedHistoryText = state.typedHistoryText.slice(-450);
    }
    if (state.wordIdx >= state.words.length - 40) {
      const extra = [...nextParagraphWords(prof.pool), ...nextParagraphWords(prof.pool)];
      state.words.push(...extra);
      state.wordStates.push(...new Array(extra.length).fill(null));
    }
    if (state.voiceMode === "dictation" && state.wordIdx % 4 === 0) {
      boloSpeak(state.words.slice(state.wordIdx, state.wordIdx + 4).join(" "));
    }
    renderPassage("");
    updateStats();
  }

  wordInput.addEventListener("input", () => {
    if (state.finished) return;
    let raw = wordInput.value;
    if (!state.started && raw.length > 0) startTimer();

    // In multiline mode, protect already-committed prefix so user only edits current word
    if (state.boxMode === "multiline") {
      if (!raw.startsWith(state.typedHistoryText)) {
        raw = state.typedHistoryText + raw.slice(Math.min(raw.length, state.typedHistoryText.length));
        wordInput.value = raw;
      }
    }

    let activeVal = state.boxMode === "multiline" ? raw.slice(state.typedHistoryText.length) : raw;
    if (state.lang === "hi_kruti" && activeVal.length && /[A-Za-z]/.test(activeVal)) {
      activeVal = mapKrutiDev(activeVal);
      wordInput.value = (state.boxMode === "multiline" ? state.typedHistoryText : "") + activeVal;
    }

    // Reliable Space handling for Android Chrome + Laptop/Desktop keyboards
    if (/\s/.test(activeVal)) {
      const parts = activeVal.split(/\s+/);
      const endsWithSpace = /\s$/.test(activeVal);
      const toCommit = endsWithSpace ? parts.filter(Boolean) : parts.slice(0, -1).filter(Boolean);
      const remainder = endsWithSpace ? "" : (parts[parts.length - 1] || "");
      toCommit.forEach((w) => commitWord(w));
      wordInput.value = (state.boxMode === "multiline" ? state.typedHistoryText : "") + remainder;
      wordInput.scrollTop = wordInput.scrollHeight;
      renderPassage(remainder);
      return;
    }

    const expected = state.words[state.wordIdx] || "";
    const lastIdx = activeVal.length - 1;
    if (lastIdx >= 0) {
      const ok = activeVal[lastIdx] === expected[lastIdx];
      if (!ok && expected[lastIdx]) {
        const expectedCh = expected[lastIdx];
        const normErr = expectedCh === " " ? " " : (SHIFT_SYMBOL_MAP[expectedCh] || expectedCh.toLowerCase());
        state.errorKeyCounts[normErr] = (state.errorKeyCounts[normErr] || 0) + 1;
      }
      playKeySound(state.soundProfile, ok ? "normal" : "error");
      if (typeof flashKeyPress === "function") flashKeyPress(activeVal[lastIdx], ok);
    }
    wordInput.scrollTop = wordInput.scrollHeight;
    renderPassage(activeVal);
  });

  $("typingStage").addEventListener("click", () => wordInput.focus());

  // Setup cards
  document.querySelectorAll(".tw-exam-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tw-exam-card").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.examKey = btn.dataset.exam;
      const prof = EXAM_PROFILES[state.examKey];
      if (prof) {
        $("setupDuration").value = String(prof.defaultSec);
        $("setupMode").value = prof.lockBs ? "strict" : "practice";
        state.durationSec = prof.defaultSec;
        state.mode = prof.lockBs ? "strict" : "practice";
      }
      resetExam(null, false);
    });
  });

  // Theme switcher
  document.querySelectorAll(".tw-theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tw-theme-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.body.classList.remove("tw-dark", "tw-paper");
      if (btn.dataset.theme === "dark") document.body.classList.add("tw-dark");
      if (btn.dataset.theme === "paper") document.body.classList.add("tw-paper");
    });
  });

  // Enter Exam Screen
  $("enterExamBtn").addEventListener("click", () => {
    state.durationSec = Number($("setupDuration").value) || 300;
    state.mode = $("setupMode").value;
    state.soundProfile = $("setupSound").value;
    state.voiceMode = $("setupVoice").value;
    state.candidate = $("setupName").value.trim();
    updateTopbarToggles();
    setFocusMode(true);
    showScreen("exam");
    resetExam(null, true);
  });

  // Live sync when Setup dropdowns change
  ["setupDuration", "setupMode", "setupSound", "setupVoice", "setupLang", "setupBot", "setupStenoSpeed"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("change", () => {
      state.durationSec = Number($("setupDuration").value) || 300;
      state.mode = $("setupMode").value;
      state.soundProfile = $("setupSound").value;
      state.voiceMode = $("setupVoice").value;
      if ($("setupLang")) state.lang = $("setupLang").value;
      if ($("setupBot")) state.botWpm = Number($("setupBot").value) || 0;
      if ($("setupStenoSpeed")) state.stenoSpeed = Number($("setupStenoSpeed").value) || 80;
      updateTopbarToggles();
      if (!state.started) resetExam(null, false);
    });
  });
  if ($("setupName")) {
    $("setupName").addEventListener("input", () => {
      state.candidate = $("setupName").value.trim();
    });
  }

  // Custom Text / Apna Paragraph Mode
  if ($("loadCustomTextBtn")) {
    $("loadCustomTextBtn").addEventListener("click", () => {
      const txt = ($("customTextInput").value || "").trim();
      const words = txt.split(/\s+/).filter(Boolean);
      if (words.length < 5) {
        alert("Kam se kam 5 words ka paragraph paste karein.");
        return;
      }
      state.durationSec = Number($("setupDuration").value) || 300;
      state.mode = $("setupMode").value;
      state.soundProfile = $("setupSound").value;
      state.voiceMode = $("setupVoice").value;
      state.candidate = $("setupName").value.trim();
      updateTopbarToggles();
      showScreen("exam");
      resetExam(words, true);
      $("activeExamBadge").textContent = `✍️ Custom Paragraph Mode (${words.length} Words)`;
    });
  }
  if ($("clearCustomTextBtn")) {
    $("clearCustomTextBtn").addEventListener("click", () => {
      if ($("customTextInput")) $("customTextInput").value = "";
    });
  }

  // Focus Mode 1-Click Toggle
  if ($("toggleFocusBtn")) {
    $("toggleFocusBtn").addEventListener("click", () => {
      setFocusMode(!state.focusMode);
      wordInput.focus();
    });
  }

  function updateTopbarToggles() {
    const labels = { mxblue: "🔊 MX Blue", typewriter: "⌨ Typewriter", soft: "💻 Soft", off: "🔇 Silent" };
    $("toggleSoundBtn").textContent = labels[state.soundProfile] || "🔊 Sound";
    $("toggleSoundBtn").classList.toggle("on", state.soundProfile !== "off");
    const vLabels = { coach: "🎙 Bolo Bar: Coach", dictation: "📢 Bolo Bar: Dictation", off: "🔇 Bolo Bar: OFF" };
    $("toggleVoiceBtn").textContent = vLabels[state.voiceMode] || "🎙 Bolo Bar";
    $("toggleVoiceBtn").classList.toggle("on", state.voiceMode !== "off");
    const sc = $("stenoCtrls");
    if (sc) sc.classList.toggle("show", state.voiceMode === "dictation");
  }

  $("toggleSoundBtn").addEventListener("click", () => {
    const order = ["mxblue", "typewriter", "soft", "off"];
    state.soundProfile = order[(order.indexOf(state.soundProfile) + 1) % order.length];
    updateTopbarToggles();
    playKeySound(state.soundProfile, "normal");
    wordInput.focus();
  });

  $("toggleVoiceBtn").addEventListener("click", () => {
    const order = ["coach", "dictation", "off"];
    state.voiceMode = order[(order.indexOf(state.voiceMode) + 1) % order.length];
    updateTopbarToggles();
    if (state.voiceMode !== "off") boloSpeak(`Bolo Bar switched to ${state.voiceMode} mode.`);
    wordInput.focus();
  });

  $("fontUpBtn").addEventListener("click", () => { state.fontSize = Math.min(30, state.fontSize + 2); renderPassage(wordInput.value); wordInput.focus(); });
  $("fontDownBtn").addEventListener("click", () => { state.fontSize = Math.max(15, state.fontSize - 2); renderPassage(wordInput.value); wordInput.focus(); });
  $("newPassageBtn").addEventListener("click", () => resetExam());
  $("finishNowBtn").addEventListener("click", () => finishExam());
  $("backSetupBtn").addEventListener("click", () => { clearInterval(state.timerId); showScreen("setup"); });
  $("resultBackSetupBtn").addEventListener("click", () => showScreen("setup"));
  $("retakeBtn").addEventListener("click", () => { showScreen("exam"); resetExam(); });
  $("practiceWeakBtn").addEventListener("click", () => {
    const uniq = [...new Set(state.weakWords)];
    showScreen("exam");
    resetExam(uniq);
  });
  $("printResultBtn").addEventListener("click", () => window.print());

  // ==================== LIVE FINGER KEYBOARD ENGINE ====================
  const SHIFT_SYMBOL_MAP = {"~":"`","!":"1","@":"2","#":"3","$":"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0","_":"-","+":"=","{":"[","}":"]",":":";","\"":"'","<":",",">":".","?":"/"};
  const KB_ROWS = [
    [["`","f-lp","","~"],["1","f-lp","","!"],["2","f-lr","","@"],["3","f-lm","","#"],["4","f-li","","$"],["5","f-li","","%"],["6","f-ri","","^"],["7","f-ri","","&"],["8","f-rm","","*"],["9","f-rr","","("],["0","f-rp","",")"],["-","f-rp","","_"],["=","f-rp","","+"],["Backspace","f-rp","w-wide",""]],
    [["Tab","f-lp","w-wide",""],["q","f-lp","",""],["w","f-lr","",""],["e","f-lm","",""],["r","f-li","",""],["t","f-li","",""],["y","f-ri","",""],["u","f-ri","",""],["i","f-rm","",""],["o","f-rr","",""],["p","f-rp","",""],["[","f-rp","","{"],["]","f-rp","","}"]],
    [["Caps","f-lp","w-wide",""],["a","f-lp","",""],["s","f-lr","",""],["d","f-lm","",""],["f","f-li","home-bump",""],["g","f-li","",""],["h","f-ri","",""],["j","f-ri","home-bump",""],["k","f-rm","",""],["l","f-rr","",""],[";","f-rp","",":"],["'","f-rp","","\""],["Enter","f-rp","w-wide",""]],
    [["LShift","f-lp","w-shift",""],["z","f-lp","",""],["x","f-lr","",""],["c","f-lm","",""],["v","f-li","",""],["b","f-li","",""],["n","f-ri","",""],["m","f-ri","",""],[",","f-rm","","<"],[".","f-rr","",">"],["/","f-rp","","?"],["RShift","f-rp","w-shift",""]],
    [["Space","f-th","w-space",""]]
  ];

  const FINGER_NAMES = {
    "f-lp": "Left Pinky Finger", "f-lr": "Left Ring Finger", "f-lm": "Left Middle Finger", "f-li": "Left Index Finger",
    "f-ri": "Right Index Finger", "f-rm": "Right Middle Finger", "f-rr": "Right Ring Finger", "f-rp": "Right Pinky Finger",
    "f-th": "Thumb (Spacebar)"
  };

  const keyElMap = {};
  const keyFingerMap = {};
  let kbVisible = true;

  function buildLiveKeyboard() {
    const host = $("liveKeyboard");
    if (!host) return;
    host.innerHTML = "";
    KB_ROWS.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "tw-kb-row";
      row.forEach(([label, fClass, wClass, subSym]) => {
        const k = document.createElement("div");
        k.className = `tw-key ${fClass}` + (wClass ? ` ${wClass}` : "");
        const display = label === "LShift" || label === "RShift" ? "SHIFT" : label === "Space" ? "SPACEBAR" : label.length === 1 ? label.toUpperCase() : label;
        k.innerHTML = subSym ? `${display}<sub>${subSym}</sub>` : display;
        const norm = label === "Space" ? " " : label.toLowerCase();
        keyElMap[norm] = k;
        keyFingerMap[norm] = fClass;
        rowEl.appendChild(k);
      });
      host.appendChild(rowEl);
    });
  }

  function highlightNextFingerKey(typedCurrent = "") {
    Object.values(keyElMap).forEach((el) => el.classList.remove("k-next", "k-shift-need"));
    const word = state.words[state.wordIdx] || "";
    let nextChar = "";
    if (typedCurrent.length < word.length) {
      nextChar = word[typedCurrent.length];
    } else {
      nextChar = " ";
    }
    const isShiftSym = Object.prototype.hasOwnProperty.call(SHIFT_SYMBOL_MAP, nextChar);
    const isUpper = (nextChar.length === 1 && nextChar >= "A" && nextChar <= "Z") || isShiftSym;
    const norm = nextChar === " " ? " " : (isShiftSym ? SHIFT_SYMBOL_MAP[nextChar] : nextChar.toLowerCase());
    const targetEl = keyElMap[norm];
    const fClass = keyFingerMap[norm] || "f-th";
    if (targetEl) targetEl.classList.add("k-next");

    let shiftHint = "";
    if (isUpper) {
      const isLeftHand = fClass.startsWith("f-l");
      const shiftEl = keyElMap[isLeftHand ? "rshift" : "lshift"];
      if (shiftEl) shiftEl.classList.add("k-shift-need");
      shiftHint = isLeftHand ? "Hold Right Shift + " : "Hold Left Shift + ";
    }

    const guide = $("fingerGuideText");
    if (guide) {
      const shownKey = nextChar === " " ? "SPACEBAR" : nextChar;
      guide.textContent = `👆 Next Key: [ ${shownKey} ]  •  ${shiftHint}${FINGER_NAMES[fClass] || "Finger"}`;
    }
  }

  function flashKeyPress(keyStr, ok) {
    const norm = keyStr === " " ? " " : String(keyStr || "").toLowerCase();
    const el = keyElMap[norm];
    if (!el) return;
    const cls = ok ? "k-hit-ok" : "k-hit-err";
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 140);
  }

  buildLiveKeyboard();
  const toggleKbBtn = $("toggleKbBtn");
  if (toggleKbBtn) {
    toggleKbBtn.addEventListener("click", () => {
      kbVisible = !kbVisible;
      const wrap = $("fingerKbWrap");
      if (wrap) wrap.style.display = kbVisible ? "" : "none";
      toggleKbBtn.textContent = kbVisible ? "⌨ Finger Keyboard: ON" : "⌨ Finger Keyboard: OFF";
      toggleKbBtn.classList.toggle("on", kbVisible);
      wordInput.focus();
    });
  }


  // ==================== 30-DAY FULL KEYBOARD TYPING CLASS ====================
  const ACADEMY_LESSONS = [
    ["Day 1: Home Row Base", "asdf jkl; asdf jkl; fdsa ;lkj ff jj dd kk ss ll aa ;; asdf jkl; sad lad ask dad fall all"],
    ["Day 2: Home Row + G & H", "asdfg hjkl; fgf jhj glad half flash shall dash gash hall ask a lad dad had a glass flask"],
    ["Day 3: Home Row Words", "dad ask sad lad all fall hall glass flask glad half dash flag shall salad alfalfa"],
    ["Day 4: Top Row Left (QWERT)", "qwer trew qwert frf ftf ded sws aqa wet red tree free fear dear tear wear"],
    ["Day 5: Top Row Right (YUIOP)", "yuiop poiuy jyj juj kik lol p;p you your pour tour our out put pot top"],
    ["Day 6: Full Top + Home Row", "quiet power tower write route quote pure type rope port true wire query poetry report"],
    ["Day 7: Bottom Row Left (ZXCVB)", "zxcvb bvcxz fvf fbf dcd sxs aza cave wave brave save gave fast vast cast"],
    ["Day 8: Bottom Row Right (NM,./)", "nm,./ /.,mn jnj jmj k,k l.l ;/; man men name moon noon common zoom exam"],
    ["Day 9: Full Alphabet Mastery", "the quick brown fox jumps over the lazy dog pack my box with five dozen liquor jugs"],
    ["Day 10: Capital Letters (Shift)", "India Delhi Jammu Kashmir Mumbai Pune Chennai Kolkata Bharat Sarkari Exam Portal"],
    ["Day 11: Numbers Row (1-5)", "12345 54321 10 12 15 23 34 45 51 123 234 345 451 152 243 354 112 223 334"],
    ["Day 12: Numbers Row (6-0)", "67890 09876 60 70 80 90 100 678 789 890 906 2026 2027 1947 185202 987650"],
    ["Day 13: Punctuation & Symbols", "Rs.100 Rs.500 95% (10+2) #1 @home & more! SSC-2026/CHSL; Date: 26-11-2026."],
    ["Day 14: Common Govt Words", "government notification application candidate examination selection commission department ministry"],
    ["Day 15: Speed Rhythm Drill 30 WPM", "regular typing practice builds steady muscle memory and eliminates hesitation during timed tests"],
    ["Day 16: SSC CHSL Official Style", "candidates must maintain accuracy above ninety five percent while typing thirty five words per minute"],
    ["Day 17: RRB NTPC Strict Style", "indian railways operates passenger and freight services across every state with strict punctuality"],
    ["Day 18: High Court Legal Style", "the petitioner submitted the affidavit before the honourable court seeking constitutional remedy"],
    ["Day 19: JKSSB Clerical Style", "district administration offices process domicile certificates revenue records and public grievances"],
    ["Day 20: Banking & Economy Style", "reserve bank monetary policy regulates inflation repo rate liquidity and commercial bank lending"],
    ["Day 21: Difficult Double Letters", "committee accommodation occurrence successfully professionally immediately assessment accountability"],
    ["Day 22: Long Official Words", "implementation infrastructure telecommunication decentralization administration verification"],
    ["Day 23: Numbers + Text Mix", "Advt 10/2026 has 1,260 posts; Last Date: 11 Dec 2026; Age: 18-27 Years; Fee: Rs.100."],
    ["Day 24: Accuracy Lock Drill", "slow down slightly on hard words to protect ninety eight percent accuracy and boost net speed"],
    ["Day 25: 40 WPM Target Sprint", "focused daily sessions of fifteen minutes rapidly lift your typing speed from thirty to forty five"],
    ["Day 26: 50 WPM Pro Sprint", "keep wrists relaxed eyes on the highlighted passage and fingers returning smoothly to home row"],
    ["Day 27: 60 WPM Exam Champion", "digital public infrastructure enables instant payments transparent recruitment and citizen welfare"],
    ["Day 28: 70 WPM Master Flow", "consistent rhythm beats sudden bursts of speed because zero errors prevent costly backspace delays"],
    ["Day 29: Full Mock Endurance", "public administration relies on accurate correspondence verified audits and disciplined file tracking"],
    ["Day 30: 80+ WPM Grand Finale", "congratulations on completing thirty days of full keyboard training ready for every all india exam"]
  ];

  function renderAcademy() {
    const grid = $("academyLessonGrid");
    if (!grid) return;
    let done = [];
    try { done = JSON.parse(localStorage.getItem("sju_acad_done_v2") || "[]"); } catch (_) {}
    const pill = $("academyProgressPill");
    if (pill) pill.textContent = `${done.length} / 30 Days Done`;
    grid.innerHTML = ACADEMY_LESSONS.map(([title, text], i) => {
      const isDone = done.includes(i);
      return `<button type="button" class="tw-exam-card${isDone ? " active" : ""}" data-day="${i}" style="padding:9px 10px">
        <b style="font-size:12px">${isDone ? "✅ " : ""}${title}</b>
        <span style="font-size:11px">Click to Start Lesson →</span>
      </button>`;
    }).join("");

    grid.querySelectorAll("button[data-day]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.day);
        const [title, text] = ACADEMY_LESSONS[idx];
        state.durationSec = Number($("setupDuration").value) || 180;
        state.mode = "practice";
        state.soundProfile = $("setupSound").value;
        state.voiceMode = $("setupVoice").value;
        updateTopbarToggles();
        showScreen("exam");
        resetExam(text.split(/\s+/).filter(Boolean));
        $("activeExamBadge").textContent = `🎓 ${title}`;
        if (!done.includes(idx)) {
          done.push(idx);
          try { localStorage.setItem("sju_acad_done_v2", JSON.stringify(done)); } catch (_) {}
          renderAcademy();
        }
      });
    });
  }
  renderAcademy();


  function renderErrorHeatmap() {
    const chipsEl = $("heatmapChips");
    const kbEl = $("heatmapKb");
    if (!chipsEl || !kbEl) return;
    const entries = Object.entries(state.errorKeyCounts || {}).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      chipsEl.innerHTML = `<span style="color:var(--tw-ok);font-size:12.5px;font-weight:700">Zero key errors! Cleanest accuracy on every key.</span>`;
    } else {
      chipsEl.innerHTML = entries.slice(0, 10).map(([k, cnt]) => {
        const lbl = k === " " ? "SPACE" : k.toUpperCase();
        return `<span class="tw-heat-chip">[ ${lbl} ] × ${cnt} errors</span>`;
      }).join("");
    }
    const maxCnt = entries.length ? entries[0][1] : 1;
    kbEl.innerHTML = "";
    KB_ROWS.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "tw-kb-row";
      row.forEach(([label, fClass, wClass]) => {
        const k = document.createElement("div");
        const norm = label === "Space" ? " " : label.toLowerCase();
        const cnt = (state.errorKeyCounts && state.errorKeyCounts[norm]) || 0;
        let hCls = "";
        if (cnt > 0) {
          const r = cnt / maxCnt;
          hCls = r >= 0.66 ? " heat-high" : r >= 0.33 ? " heat-mid" : " heat-low";
        }
        k.className = `tw-key ${fClass}` + (wClass ? ` ${wClass}` : "") + hCls;
        const display = label === "LShift" || label === "RShift" ? "SHIFT" : label === "Space" ? "SPACEBAR" : label.length === 1 ? label.toUpperCase() : label;
        k.textContent = cnt > 0 ? `${display} (${cnt})` : display;
        rowEl.appendChild(k);
      });
      kbEl.appendChild(rowEl);
    });
  }

  // Initialize Live Typing Box + Finger Keyboard immediately on page load!
  state.durationSec = Number($("setupDuration")?.value) || 300;
  state.mode = $("setupMode")?.value || "practice";
  state.soundProfile = $("setupSound")?.value || "mxblue";
  state.voiceMode = $("setupVoice")?.value || "coach";
  updateTopbarToggles();
  resetExam(null, false);


  // ==================== v4.0 PRO MAX MODULES ====================
  // 1. Kruti Dev 010 Live Character Auto-Mapper
  const KRUTI_MAP = {
    "a":"ं","b":"इ","c":"ब","d":"क","e":"म","f":"ि","g":"ह","h":"ी","i":"प","j":"र","k":"ा","l":"स","m":"उ",
    "n":"द","o":"व","p":"च","q":"ु","r":"त","s":"े","t":"ज","u":"न","v":"अ","w":"ू","x":"ग","y":"ल","z":"्र",
    "A":"।","B":"ठ","C":"भ","D":"क्","E":"म्","F":"थ्","G":"ळ","H":"भ्","I":"प्","J":"श्र","K":"ज्ञ","L":"स्",
    "M":"ड","N":"छ","O":"व्","P":"च्","Q":"फ","R":"त्","S":"ै","T":"ज्","U":"न्","V":"ट","W":"ॅ","X":"ग्","Y":"ल्"
  };
  function mapKrutiDev(str) {
    return str.replace(/[A-Za-z]/g, (ch) => KRUTI_MAP[ch] || ch);
  }

  // 2. Visual Numpad (0-9) Builder & Highlight Hook
  const NUMPAD_KEYS = ["Num","/","*","-","7","8","9","+","4","5","6",".","1","2","3","Enter","0","00",",","="];
  const numpadElMap = {};
  (function buildNumpad() {
    const host = $("liveNumpad");
    if (!host) return;
    host.innerHTML = "";
    NUMPAD_KEYS.forEach((lbl) => {
      const k = document.createElement("div");
      k.className = "tw-key f-ri";
      k.textContent = lbl;
      numpadElMap[lbl.toLowerCase()] = k;
      host.appendChild(k);
    });
  })();

  const origHighlightFn = typeof highlightNextFingerKey === "function" ? highlightNextFingerKey : null;
  if (origHighlightFn) {
    const _orig = origHighlightFn;
    highlightNextFingerKey = function (typedCurrent = "") {
      _orig(typedCurrent);
      Object.values(numpadElMap).forEach((el) => el.classList.remove("k-next"));
      const word = state.words[state.wordIdx] || "";
      const ch = typedCurrent.length < word.length ? word[typedCurrent.length] : " ";
      const nEl = numpadElMap[ch.toLowerCase()];
      if (nEl) nEl.classList.add("k-next");
    };
  }

  // 3. Real Exam Hall "No-Highlight" Toggle
  if ($("toggleHighlightBtn")) {
    $("toggleHighlightBtn").addEventListener("click", () => {
      state.highlightOn = !state.highlightOn;
      $("toggleHighlightBtn").textContent = state.highlightOn ? "👁 Highlight: ON" : "👁 Exam Hall (No Highlight)";
      $("toggleHighlightBtn").classList.toggle("on", state.highlightOn);
      renderPassage(state.boxMode === "multiline" ? wordInput.value.slice(state.typedHistoryText.length) : wordInput.value);
      wordInput.focus();
    });
  }

  // 4. Steno Dictation Pause / Replay Controls
  if ($("stenoPauseBtn")) {
    $("stenoPauseBtn").addEventListener("click", () => {
      stenoPaused = !stenoPaused;
      $("stenoPauseBtn").textContent = stenoPaused ? "▶ Resume" : "⏸ Pause";
      if (stenoPaused && "speechSynthesis" in window) window.speechSynthesis.cancel();
      else if (lastSpokenText) boloSpeak(lastSpokenText, true);
      wordInput.focus();
    });
  }
  if ($("stenoReplayBtn")) {
    $("stenoReplayBtn").addEventListener("click", () => {
      const chunk = state.words.slice(state.wordIdx, state.wordIdx + 5).join(" ");
      boloSpeak(chunk || lastSpokenText, true);
      wordInput.focus();
    });
  }

  // 5. Slow-Word Drill Button + WhatsApp / Telegram 1-Click Share
  if ($("practiceSlowBtn")) {
    $("practiceSlowBtn").addEventListener("click", () => {
      const slowWords = [...new Set(state.wordTimes.slice().sort((a, b) => b.ms - a.ms).map((x) => x.word))].slice(0, 12);
      if (!slowWords.length) return;
      showScreen("exam");
      resetExam(slowWords, true);
      $("activeExamBadge").textContent = "🐢 Slow-Word Speed Drill";
    });
  }
  function getShareText() {
    const p = state.lastResultPayload || { name: "Candidate", exam: "Exam Typing", netWpm: 0, acc: 100, errPct: 0, passed: true };
    const status = p.passed ? "✅ PASS (Qualified)" : "⚡ Practising";
    return `🏆 *Sarkari Job Universe — Typing Score*\n👤 Name: ${p.name}\n📝 Exam: ${p.exam}\n⚡ Net Speed: *${p.netWpm} WPM* | 🎯 Accuracy: *${p.acc}%*\n📊 SSC/Court Error: ${p.errPct}% | Result: ${status}\n👉 Free Typing Pro Test: https://sarkari-jobs-fast.onrender.com/typing-wall.html`;
  }
  if ($("shareWaBtn")) {
    $("shareWaBtn").addEventListener("click", () => {
      window.open("https://wa.me/?text=" + encodeURIComponent(getShareText()), "_blank", "noopener");
    });
  }
  if ($("shareTgBtn")) {
    $("shareTgBtn").addEventListener("click", () => {
      window.open("https://t.me/share/url?url=" + encodeURIComponent("https://sarkari-jobs-fast.onrender.com/typing-wall.html") + "&text=" + encodeURIComponent(getShareText()), "_blank", "noopener");
    });
  }

  // 6. WPM Growth SVG Line Chart
  function renderWpmGrowthChart(list) {
    const host = $("wpmChartSvg");
    if (!host) return;
    const pts = list.slice(0, 12).reverse();
    if (pts.length < 2) {
      host.innerHTML = `<span style="color:var(--tw-muted)">Complete at least 2 typing tests to see your WPM growth chart!</span>`;
      return;
    }
    const W = 680, H = 160, padL = 36, padR = 16, padT = 18, padB = 26;
    const maxWpm = Math.max(45, ...pts.map((p) => p.netWpm + 8));
    const stepX = (W - padL - padR) / Math.max(1, pts.length - 1);
    const coords = pts.map((p, i) => {
      const x = Math.round(padL + i * stepX);
      const y = Math.round(H - padB - (p.netWpm / maxWpm) * (H - padT - padB));
      return { x, y, wpm: p.netWpm, acc: p.acc, idx: i + 1 };
    });
    const poly = coords.map((c) => `${c.x},${c.y}`).join(" ");
    const area = `${padL},${H - padB} ${poly} ${coords[coords.length - 1].x},${H - padB}`;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="#cbd5e1" stroke-width="1"/>
      <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H - padB}" stroke="#cbd5e1" stroke-width="1"/>
      <polygon points="${area}" fill="rgba(21,94,239,0.12)"/>
      <polyline points="${poly}" fill="none" stroke="#155eef" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${coords.map((c) => `<circle cx="${c.x}" cy="${c.y}" r="4.5" fill="#155eef" stroke="#fff" stroke-width="1.5"><title>Test #${c.idx}: ${c.wpm} WPM (${c.acc}% Acc)</title></circle>
        <text x="${c.x}" y="${c.y - 8}" text-anchor="middle" font-size="10" font-weight="700" fill="#0f172a">${c.wpm}</text>
        <text x="${c.x}" y="${H - 8}" text-anchor="middle" font-size="9.5" fill="#64748b">#${c.idx}</text>`).join("")}
    </svg>`;
  }

  // 7. Daily Challenge Top-10 Leaderboard
  function getDailyBoardKey() {
    const d = new Date();
    return `sju_daily_lb_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
  }
  function getDailyBoard() {
    const key = getDailyBoardKey();
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (_) {}
    const defaults = [
      { name: "Rohit Sharma (Delhi)", wpm: 68, acc: 98 },
      { name: "Anjali Verma (UP)", wpm: 61, acc: 97 },
      { name: "Vikram Singh (J&K)", wpm: 54, acc: 96 },
      { name: "Priya Kumari (Bihar)", wpm: 49, acc: 95 },
      { name: "Deepak Yadav (Raj)", wpm: 44, acc: 96 },
      { name: "Sonia Devi (HP)", wpm: 39, acc: 95 }
    ];
    return defaults;
  }
  function submitDailyLeaderboard(name, wpm, acc) {
    const list = getDailyBoard();
    list.push({ name: (name || "You") + " ★", wpm, acc, isUser: true });
    list.sort((a, b) => b.wpm - a.wpm || b.acc - a.acc);
    try { localStorage.setItem(getDailyBoardKey(), JSON.stringify(list.slice(0, 10))); } catch (_) {}
    renderDailyLeaderboard();
  }
  function renderDailyLeaderboard() {
    const el = $("dailyLeaderboard");
    if (!el) return;
    const list = getDailyBoard().slice(0, 10);
    el.innerHTML = `<table class="tw-table"><thead><tr><th>Rank</th><th>Candidate</th><th>Net Speed</th><th>Accuracy</th></tr></thead><tbody>${
      list.map((r, i) => `<tr style="${r.isUser ? "background:#eef4ff;font-weight:800" : ""}"><td>#${i + 1}</td><td>${r.name}</td><td><b>${r.wpm} WPM</b></td><td>${r.acc}%</td></tr>`).join("")
    }</tbody></table>`;
  }
  renderDailyLeaderboard();
  if ($("startDailyBtn")) {
    $("startDailyBtn").addEventListener("click", () => {
      document.querySelectorAll(".tw-exam-card").forEach((b) => b.classList.toggle("active", b.dataset.exam === "daily"));
      state.examKey = "daily";
      state.durationSec = 300;
      if ($("setupDuration")) $("setupDuration").value = "300";
      showScreen("exam");
      resetExam(null, true);
    });
  }

  // 8. Auto-Save & Resume (Power-Cut / Refresh Safe)
  const AUTOSAVE_KEY = "sju_typing_autosave_v4";
  function saveAutoProgress() {
    if (!state.started || state.finished || state.timeLeft <= 2) return;
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
        ts: Date.now(),
        examKey: state.examKey,
        durationSec: state.durationSec,
        timeLeft: state.timeLeft,
        words: state.words,
        wordStates: state.wordStates,
        wordIdx: state.wordIdx,
        keystrokes: state.keystrokes,
        correctChars: state.correctChars,
        errors: state.errors,
        fullErrors: state.fullErrors,
        halfErrors: state.halfErrors,
        backspaces: state.backspaces,
        typedHistoryText: state.typedHistoryText,
        lang: state.lang
      }));
    } catch (_) {}
  }
  function clearAutoProgress() {
    try { localStorage.removeItem(AUTOSAVE_KEY); } catch (_) {}
    const b = $("resumeBanner");
    if (b) b.classList.remove("show");
  }
  (function checkAutoResume() {
    try {
      const raw = JSON.parse(localStorage.getItem(AUTOSAVE_KEY) || "null");
      if (!raw || !raw.words || Date.now() - raw.ts > 2 * 60 * 60 * 1000) return;
      const b = $("resumeBanner");
      const txt = $("resumeBannerText");
      if (txt) txt.textContent = `⚡ Unfinished test saved (${fmtTime(raw.timeLeft)} left, ${raw.wordIdx} words typed). Resume right where you left off?`;
      if (b) b.classList.add("show");
      if ($("resumeTestBtn")) {
        $("resumeTestBtn").addEventListener("click", () => {
          Object.assign(state, {
            examKey: raw.examKey, durationSec: raw.durationSec, timeLeft: raw.timeLeft,
            words: raw.words, wordStates: raw.wordStates, wordIdx: raw.wordIdx,
            keystrokes: raw.keystrokes, correctChars: raw.correctChars, errors: raw.errors,
            fullErrors: raw.fullErrors || 0, halfErrors: raw.halfErrors || 0,
            backspaces: raw.backspaces || 0, typedHistoryText: raw.typedHistoryText || "",
            lang: raw.lang || "en", started: false, finished: false
          });
          b.classList.remove("show");
          wordInput.value = state.boxMode === "multiline" ? state.typedHistoryText : "";
          renderPassage("");
          updateStats();
          showScreen("exam");
          wordInput.focus();
        });
      }
      if ($("discardResumeBtn")) {
        $("discardResumeBtn").addEventListener("click", clearAutoProgress);
      }
    } catch (_) {}
  })();

  // 9. Typing Speed Game — Word Rain Arcade
  (function initWordRain() {
    const modal = $("wordRainModal"), arena = $("rainArena"), inp = $("rainInput");
    if (!modal || !arena || !inp) return;
    const RAIN_WORDS = ["sarkari","railway","ssc","jkssb","constable","officer","exam","typing","speed","accuracy","india","delhi","jammu","kashmir","court","police","clerk","merit","result","admit","card","form","digital","portal","target","winner","focus","rhythm","keyboard","practice","banking","defence","army","navy","science","history","polity","english","maths","logic"];
    let rainActive = false, rainTimer = null, spawnTimer = null, activeWords = [], score = 0, lives = 3, level = 1;

    function stopRain() {
      rainActive = false;
      clearInterval(rainTimer);
      clearInterval(spawnTimer);
      activeWords = [];
      arena.innerHTML = "";
    }
    function updateHud() {
      if ($("rainScore")) $("rainScore").textContent = String(score);
      if ($("rainLevel")) $("rainLevel").textContent = String(level);
      if ($("rainLives")) $("rainLives").textContent = "❤️".repeat(Math.max(0, lives)) || "💀";
    }
    function spawnWord() {
      if (!rainActive) return;
      const w = RAIN_WORDS[Math.floor(Math.random() * RAIN_WORDS.length)];
      const el = document.createElement("div");
      el.className = "tw-rain-word";
      el.textContent = w;
      const maxLeft = Math.max(10, arena.clientWidth - 110);
      el.style.left = Math.floor(Math.random() * maxLeft) + "px";
      el.style.top = "0px";
      arena.appendChild(el);
      activeWords.push({ word: w, y: 0, speed: 1.1 + level * 0.32, el });
    }
    function startRain() {
      stopRain();
      rainActive = true;
      score = 0; lives = 3; level = 1;
      inp.value = "";
      updateHud();
      spawnWord();
      spawnTimer = setInterval(spawnWord, 1900);
      rainTimer = setInterval(() => {
        if (!rainActive) return;
        for (let i = activeWords.length - 1; i >= 0; i--) {
          const item = activeWords[i];
          item.y += item.speed;
          item.el.style.top = item.y + "px";
          if (item.y > arena.clientHeight - 75) item.el.classList.add("danger");
          if (item.y >= arena.clientHeight - 28) {
            item.el.remove();
            activeWords.splice(i, 1);
            lives--;
            playKeySound(state.soundProfile, "error");
            updateHud();
            if (lives <= 0) {
              stopRain();
              arena.innerHTML = `<div style="color:#fff;text-align:center;padding-top:115px;font-size:20px;font-weight:900">Game Over! Final Score: ${score}<br><span style="font-size:13px;color:#93c5fd">Click ▶ Start to play again!</span></div>`;
              return;
            }
          }
        }
      }, 45);
      inp.focus();
    }
    inp.addEventListener("input", () => {
      if (!rainActive) return;
      const val = inp.value.trim().toLowerCase();
      const idx = activeWords.findIndex((x) => x.word === val);
      if (idx >= 0) {
        const hit = activeWords[idx];
        hit.el.classList.add("matched");
        setTimeout(() => hit.el.remove(), 180);
        activeWords.splice(idx, 1);
        inp.value = "";
        score += 10 * level;
        level = 1 + Math.floor(score / 120);
        playKeySound(state.soundProfile, "space");
        updateHud();
      }
    });
    if ($("openWordRainBtn")) $("openWordRainBtn").addEventListener("click", () => { modal.classList.add("open"); startRain(); });
    if ($("closeWordRainBtn")) $("closeWordRainBtn").addEventListener("click", () => { stopRain(); modal.classList.remove("open"); });
    if ($("rainStartBtn")) $("rainStartBtn").addEventListener("click", startRain);
  })();

  renderHistory();
})();
