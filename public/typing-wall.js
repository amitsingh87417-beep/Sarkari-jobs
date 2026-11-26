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
    general: { name: "General Speed Pro (80+ WPM)", targetWpm: 45, maxErrPct: 8, defaultSec: 300, lockBs: false, pool: "general" }
  };

  const PASSAGES = {
    govt: [
      "Digital public infrastructure has transformed banking, education, healthcare and citizen services across rural and urban India. Instant digital payments, online certificate portals and transparent recruitment systems have reduced delays while making essential government services accessible to every student.",
      "Public administration depends on accurate record keeping, clear official correspondence and timely verification of documents. Clerical officers and data entry operators play a vital role in drafting notices, maintaining registers, updating spreadsheets and assisting citizens politely.",
      "The Constitution of India establishes a sovereign, socialist, secular and democratic republic ensuring justice, liberty, equality and fraternity for all citizens. Fundamental rights protect individual freedom while directive principles guide the state toward inclusive welfare and balanced development.",
      "Transparent governance requires disciplined file movement, verified expenditure audits and prompt grievance redressal at every district office. Modern e-office platforms allow departments to track official memoranda, sanction orders and recruitment notifications with complete accountability."
    ],
    railway: [
      "Indian Railways connects thousands of towns, industrial corridors and remote regions through one of the largest passenger and freight networks in the world. Modern signalling, electrified routes and high speed train corridors have significantly improved travel safety and punctuality.",
      "Railway station operations depend on coordinated scheduling, accurate ticketing records and real time freight tracking across regional zones. Dedicated ministerial and clerical staff ensure smooth passenger services, timely roster management and strict compliance with safety manuals.",
      "Dedicated freight corridors allow heavy cargo trains to move agricultural produce, coal, cement and manufactured goods faster between major ports and inland logistics hubs, reducing transport costs and supporting national economic growth."
    ],
    defence: [
      "Central armed police forces and defence personnel guard national borders, protect critical infrastructure and assist civil authorities during natural disasters. Discipline, physical fitness and accurate administrative reporting form the backbone of every battalion headquarters.",
      "Head constable ministerial personnel manage personnel records, pay bills, service books, leave rosters and confidential official correspondence with speed and precision. Regular typing practice builds the calm accuracy required during timed skill examinations.",
      "Modern border management combines brave human vigilance with satellite monitoring, thermal sensors and rapid communication networks across mountain passes, deserts and coastal frontiers."
    ],
    legal: [
      "The judiciary upholds the rule of law by interpreting statutes, protecting constitutional remedies and delivering reasoned judgments without fear or favour. Court clerks and judicial assistants prepare cause lists, verify affidavits and transcribe formal proceedings with zero factual error.",
      "Every petition filed before a High Court undergoes careful scrutiny regarding jurisdiction, limitation period, annexures and sworn verification. Accurate typing of legal terminology, citations and dates ensures that judicial records remain clear and reliable for future reference.",
      "Alternative dispute resolution mechanisms such as Lok Adalats and mediation centres help citizens settle civil and family matters amicably while reducing the burden on regular trial courts."
    ],
    general: [
      "Consistent daily practice is the fastest method to reach eighty words per minute with ninety eight percent accuracy. Keep your fingers anchored on the home row keys, maintain steady rhythm and look at the highlighted word ahead rather than looking down at the keyboard.",
      "Renewable energy projects including solar parks, wind farms and Himalayan hydroelectric stations are expanding clean power capacity across India every year. Sustainable development requires balancing rapid industrial growth with forest conservation and clean water management.",
      "Students preparing for competitive examinations succeed through structured revision, timed mock tests and careful analysis of every mistake. Small improvements in speed and accuracy every single day compound into outstanding exam performance."
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

  function boloSpeak(text, force = false) {
    if (boloTextEl) boloTextEl.textContent = text;
    if (state.voiceMode === "off" && !force) return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-IN";
      u.rate = state.voiceMode === "dictation" ? 1.05 : 1.0;
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
    lastMilestoneMin: 0
  };

  // DOM refs
  const $ = (id) => document.getElementById(id);
  const screens = { setup: $("screenSetup"), exam: $("screenExam"), result: $("screenResult") };

  function showScreen(name) {
    Object.entries(screens).forEach(([k, el]) => el && el.classList.toggle("active", k === name));
    const hero = $("twHero");
    const hist = $("historyCard");
    if (hero) hero.style.display = name === "exam" ? "none" : "";
    if (hist) hist.style.display = name === "exam" ? "none" : "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildPassage(customWords = null) {
    if (customWords && customWords.length) {
      const repeated = [];
      while (repeated.length < 120) repeated.push(...customWords);
      state.words = repeated.slice(0, 140);
    } else {
      const prof = EXAM_PROFILES[state.examKey] || EXAM_PROFILES.ssc;
      const pool = PASSAGES[prof.pool] || PASSAGES.govt;
      const chunks = [];
      for (let i = 0; i < 6; i++) {
        chunks.push(pool[Math.floor(Math.random() * pool.length)]);
      }
      state.words = chunks.join(" ").split(/\s+/).filter(Boolean);
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
    return { grossWpm, netWpm, acc };
  }

  function resetExam(customWeakWords = null) {
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

    const prof = EXAM_PROFILES[state.examKey] || EXAM_PROFILES.ssc;
    const lockBs = state.mode === "strict" || prof.lockBs;
    $("activeExamBadge").textContent = `${prof.name} • Target ${prof.targetWpm} WPM${lockBs ? " • Backspace Locked" : ""}`;
    $("modeHint").textContent = `Mode: ${lockBs ? "Strict Exam (Backspace LOCKED)" : "Practice (Backspace ON)"} • Auto-scroll active • Anti-copy protected`;

    buildPassage(customWeakWords);
    updateStats();
    const inp = $("wordInput");
    inp.value = "";
    inp.disabled = false;
    setTimeout(() => inp.focus(), 80);

    if (customWeakWords) {
      boloSpeak("Weak words drill ready! Type carefully to fix your mistakes.");
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
    const errPct = state.wordIdx > 0 ? Math.round((state.errors / state.wordIdx) * 100) : 0;
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

    saveHistory({ exam: prof.name, netWpm, acc, errors: state.errors, date: new Date().toLocaleDateString("en-IN") });
  
  // ==================== LIVE FINGER KEYBOARD ENGINE ====================
  const KB_ROWS = [
    [["`","f-lp"],["1","f-lp"],["2","f-lr"],["3","f-lm"],["4","f-li"],["5","f-li"],["6","f-ri"],["7","f-ri"],["8","f-rm"],["9","f-rr"],["0","f-rp"],["-","f-rp"],["=","f-rp"],["Backspace","f-rp","w-wide"]],
    [["Tab","f-lp","w-wide"],["q","f-lp"],["w","f-lr"],["e","f-lm"],["r","f-li"],["t","f-li"],["y","f-ri"],["u","f-ri"],["i","f-rm"],["o","f-rr"],["p","f-rp"],["[","f-rp"],["]","f-rp"]],
    [["Caps","f-lp","w-wide"],["a","f-lp"],["s","f-lr"],["d","f-lm"],["f","f-li"],["g","f-li"],["h","f-ri"],["j","f-ri"],["k","f-rm"],["l","f-rr"],[";","f-rp"],["'","f-rp"],["Enter","f-rp","w-wide"]],
    [["LShift","f-lp","w-shift"],["z","f-lp"],["x","f-lr"],["c","f-lm"],["v","f-li"],["b","f-li"],["n","f-ri"],["m","f-ri"],[",","f-rm"],[".","f-rr"],["/","f-rp"],["RShift","f-rp","w-shift"]],
    [["Space","f-th","w-space"]]
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
      row.forEach(([label, fClass, wClass]) => {
        const k = document.createElement("div");
        k.className = `tw-key ${fClass}` + (wClass ? ` ${wClass}` : "");
        const display = label === "LShift" || label === "RShift" ? "SHIFT" : label === "Space" ? "SPACEBAR" : label.length === 1 ? label.toUpperCase() : label;
        k.textContent = display;
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
    const isUpper = nextChar.length === 1 && nextChar >= "A" && nextChar <= "Z";
    const norm = nextChar === " " ? " " : nextChar.toLowerCase();
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
      const typed = wordInput.value.trim();
      if (!typed) return;
      startTimer();
      const expected = state.words[state.wordIdx] || "";
      state.keystrokes += typed.length + 1;
      if (typed === expected) {
        state.wordStates[state.wordIdx] = "ok";
        state.correctChars += expected.length + 1;
        playKeySound(state.soundProfile, "space");
        if (typeof flashKeyPress === "function") flashKeyPress(" ", true);
      } else {
        state.wordStates[state.wordIdx] = "err";
        state.errors++;
        state.weakWords.push(expected);
        playKeySound(state.soundProfile, "error");
      }
      state.wordIdx++;
      wordInput.value = "";

      if (state.wordIdx >= state.words.length - 15) {
        const pool = PASSAGES[prof.pool] || PASSAGES.govt;
        const extra = pool[Math.floor(Math.random() * pool.length)].split(/\s+/).filter(Boolean);
        state.words.push(...extra);
        state.wordStates.push(...new Array(extra.length).fill(null));
      }

      if (state.voiceMode === "dictation" && state.wordIdx % 4 === 0) {
        boloSpeak(state.words.slice(state.wordIdx, state.wordIdx + 4).join(" "));
      }
      renderPassage("");
      updateStats();
    }
  });

  wordInput.addEventListener("input", () => {
    if (state.finished) return;
    if (!state.started && wordInput.value.length > 0) startTimer();
    const val = wordInput.value;
    const expected = state.words[state.wordIdx] || "";
    const lastIdx = val.length - 1;
    if (lastIdx >= 0) {
      const ok = val[lastIdx] === expected[lastIdx];
      playKeySound(state.soundProfile, ok ? "normal" : "error");
      if (typeof flashKeyPress === "function") flashKeyPress(val[lastIdx], ok);
    }
    renderPassage(val);
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
      }
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
    showScreen("exam");
    resetExam();
  });

  function updateTopbarToggles() {
    const labels = { mxblue: "🔊 MX Blue", typewriter: "⌨ Typewriter", soft: "💻 Soft", off: "🔇 Silent" };
    $("toggleSoundBtn").textContent = labels[state.soundProfile] || "🔊 Sound";
    $("toggleSoundBtn").classList.toggle("on", state.soundProfile !== "off");
    const vLabels = { coach: "🎙 Bolo Bar: Coach", dictation: "📢 Bolo Bar: Dictation", off: "🔇 Bolo Bar: OFF" };
    $("toggleVoiceBtn").textContent = vLabels[state.voiceMode] || "🎙 Bolo Bar";
    $("toggleVoiceBtn").classList.toggle("on", state.voiceMode !== "off");
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

  renderHistory();
})();
