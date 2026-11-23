(function () {
  const $ = (s) => document.querySelector(s);

  const HARD_WALL_PARAGRAPHS = [
    "Constitutional jurisprudence, administrative accountability, statutory interpretation, fiscal federalism, and judicial review demand rigorous analytical precision under high-pressure examination conditions. Every aspirant must master complex syntax, hyphenated compound terms, numerical ratios (18:24:36), punctuation marks (;:—), and dense paragraphs without sacrificing accuracy or rhythm.",
    "Jammu and Kashmir geography spans Pir Panjal and Zanskar ranges, alpine passes like Zoji La (3,528m) and Banihal, tectonic and glacial lakes including Wular, Dal, Mansar, and Surinsar, and river basins of Jhelum, Chenab, Ravi, and Tawi. High-speed typing across technical terminology builds mental stamina for SSC, JKSSB, RRB, and defence clerical tests.",
    "Cryptography, distributed consensus, asynchronous event loops, relational indexing, memory-mapped files, and zero-trust authentication form the backbone of modern computing systems. Practicing sustained keystrokes across dense multi-clause sentences sharpens finger endurance and reduces typographical errors during long exam shifts.",
    "Macroeconomic stabilization, monetary transmission mechanisms, capital account convertibility, sovereign bond yields, inflation targeting, and supply-chain resilience require disciplined comprehension and rapid recall. Keep typing continuously: unlimited auto-extending passages load automatically as you progress."
  ];

  let wallSeed = 0;
  let customWallText = "";
  const WALL_500K_CHARS = 500000;
  const TARGET_1MIN_KEYS = 10000;
  const SESSION_STORAGE_KEY = "sju_typing_wall_sessions_v1";

  let passage = "";
  let typingTimer = null;
  let typingStarted = 0;
  let typingEnd = 0;
  let typingActive = false;
  let typedKeyCount = 0;
  let backlogErrors = 0;
  let prevLen = 0;
  let lastValidText = "";

  function loadSessions() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveSession(entry) {
    try {
      const list = loadSessions();
      list.unshift(entry);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
    } catch {}
  }

  function renderSessionSummary() {
    const list = loadSessions();
    const badge = $("#typingBestBadge");
    if (badge) {
      const bestWpm = list.length ? Math.max(...list.map((x) => Number(x.wpm) || 0)) : 0;
      badge.textContent = `Best: ${bestWpm} WPM | Sessions: ${list.length}`;
    }
    const logEl = $("#typingSessionLog");
    if (logEl) {
      logEl.textContent = list.length
        ? "Recent Sessions: " + list.slice(0, 4).map((s) => `[${s.date}] ${s.wpm} WPM | ${s.acc}% | Backlog: ${s.backlog} | ${s.keys} keys`).join(" • ")
        : "Recent Sessions: Abhi koi session record nahi hua.";
    }
  }

  function generateHardWallText(seed, minLength) {
    const parts = [];
    let currentLen = 0;
    let idx = seed;
    while (currentLen < minLength) {
      const p = HARD_WALL_PARAGRAPHS[idx % HARD_WALL_PARAGRAPHS.length];
      const block = `[Hard Wall #${idx + 1}] ${p} `;
      parts.push(block);
      currentLen += block.length;
      idx++;
    }
    return parts.join("");
  }

  function getInitialTypingPassage() {
    const mode = $("#typingMode")?.value || "hard_wall";
    const mins = Number($("#typingDuration")?.value || 15);
    const targetLen = mode === "hard_wall" || mins === 5 ? WALL_500K_CHARS : mode === "unlimited_stream" ? 15000 : 12000;

    if (customWallText && customWallText.trim().length > 0) {
      let out = customWallText.trim() + " ";
      const customTarget = mode === "hard_wall" || mins === 5 ? WALL_500K_CHARS : Math.max(4000, out.length * 4);
      while (out.length < customTarget) out += customWallText.trim() + " ";
      return out;
    }

    return generateHardWallText(wallSeed, targetLen);
  }

  function appendUnlimitedPassageIfNeeded() {
    const mode = $("#typingMode")?.value || "hard_wall";
    if (mode !== "unlimited_stream") return;
    const curLen = ($("#typingInput")?.value || "").length;
    if (passage.length - curLen < 1500) {
      wallSeed++;
      passage += customWallText
        ? (customWallText.trim() + " ").repeat(30)
        : generateHardWallText(wallSeed, 15000);
      if ($("#typingPassage")) $("#typingPassage").textContent = passage;
    }
  }

  function resetTyping() {
    clearInterval(typingTimer);
    typingTimer = null;
    typingActive = false;
    typingStarted = 0;
    typingEnd = 0;
    typedKeyCount = 0;
    backlogErrors = 0;
    prevLen = 0;
    lastValidText = "";
    passage = getInitialTypingPassage();

    const inp = $("#typingInput");
    if (inp) {
      inp.value = "";
      inp.disabled = true;
    }
    if ($("#typingPassage")) $("#typingPassage").textContent = passage;

    const mins = Number($("#typingDuration")?.value || 15);
    if ($("#timeLeft")) $("#timeLeft").textContent = String(mins).padStart(2, "0") + ":00";
    if ($("#wpm")) $("#wpm").textContent = "0";
    if ($("#accuracy")) $("#accuracy").textContent = "100%";
    if ($("#backlogCount")) $("#backlogCount").textContent = "0";
    if ($("#typingProgress")) $("#typingProgress").style.width = "0%";

    if ($("#typingResult")) {
      $("#typingResult").textContent = `Hard Wall Ready (${passage.length.toLocaleString()} chars) • 1-Min Goal: ${TARGET_1MIN_KEYS.toLocaleString()} keys • Backlog tracking active.`;
    }
    renderSessionSummary();
  }

  function typingMetrics() {
    const typed = $("#typingInput")?.value || "";
    const elapsedMins = Math.max(1 / 60, (Date.now() - typingStarted) / 60000);
    const elapsedWholeMins = Math.max(1, (Date.now() - typingStarted) / 60000);
    let correct = 0;
    let wrongCharsNow = 0;
    const len = Math.min(typed.length, passage.length);
    for (let i = 0; i < len; i++) {
      if (typed[i] === passage[i]) correct++;
      else wrongCharsNow++;
    }
    const accuracy = typed.length ? Math.round((correct / len) * 100) : 100;
    const wordsTyped = typed.trim() ? typed.trim().split(/\s+/).length : 0;
    const wpmVal = Math.round(wordsTyped / elapsedWholeMins);
    const kpmVal = Math.round(typedKeyCount / elapsedMins);

    if ($("#wpm")) $("#wpm").textContent = String(wpmVal);
    if ($("#accuracy")) $("#accuracy").textContent = accuracy + "%";
    if ($("#backlogCount")) $("#backlogCount").textContent = String(backlogErrors);

    const pct = Math.min(100, Math.round((typed.length / Math.max(1, passage.length)) * 10000) / 100);
    if ($("#typingProgress")) $("#typingProgress").style.width = pct + "%";

    const mins = Number($("#typingDuration")?.value || 15);
    if ($("#typingResult")) {
      if (mins === 1 || $("#typingMode")?.value === "key_10k") {
        $("#typingResult").textContent = `Keys: ${typedKeyCount.toLocaleString()} / ${TARGET_1MIN_KEYS.toLocaleString()} (${kpmVal.toLocaleString()}/min) • Backlog/Errors: ${backlogErrors} (Active Wrong: ${wrongCharsNow}) • ${wpmVal} WPM • ${accuracy}% acc.`;
      } else {
        $("#typingResult").textContent = `Running • Keys: ${typedKeyCount.toLocaleString()} • Backlog/Errors: ${backlogErrors} (Active Wrong: ${wrongCharsNow}) • ${wpmVal} WPM • ${accuracy}% acc.`;
      }
    }
  }

  function finishTyping() {
    clearInterval(typingTimer);
    typingTimer = null;
    typingActive = false;
    const inp = $("#typingInput");
    if (inp) inp.disabled = true;
    typingMetrics();

    const wpmVal = Number($("#wpm")?.textContent) || 0;
    const accVal = Number(String($("#accuracy")?.textContent || "100").replace("%", "")) || 100;
    saveSession({
      date: new Date().toISOString().slice(0, 10),
      wpm: wpmVal,
      acc: accVal,
      backlog: backlogErrors,
      keys: typedKeyCount
    });
    renderSessionSummary();

    if ($("#typingResult")) {
      $("#typingResult").textContent = `Session complete. Keys: ${typedKeyCount.toLocaleString()} · Backlog/Errors: ${backlogErrors} · ${wpmVal} WPM · ${accVal}% accuracy.`;
    }
  }

  $("#typingStart")?.addEventListener("click", () => {
    if (typingActive) return;
    resetTyping();
    const mins = Number($("#typingDuration")?.value || 15);
    typingStarted = Date.now();
    typingEnd = typingStarted + mins * 60000;
    typingActive = true;
    const inp = $("#typingInput");
    if (inp) {
      inp.disabled = false;
      inp.focus();
    }
    if ($("#typingResult")) $("#typingResult").textContent = "Timer running — type the hard passage wall above.";
    typingTimer = setInterval(() => {
      const left = Math.max(0, typingEnd - Date.now());
      const sec = Math.ceil(left / 1000);
      if ($("#timeLeft")) {
        $("#timeLeft").textContent = String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
      }
      typingMetrics();
      if (left <= 0) finishTyping();
    }, 250);
  });

  $("#typingInput")?.addEventListener("keydown", (e) => {
    if (!typingActive) return;
    if (e.key === "Backspace") backlogErrors++;
  });

  $("#typingInput")?.addEventListener("input", () => {
    if (!typingActive) return;
    const strictMode = $("#typingStrict")?.value || "alert";
    const inp = $("#typingInput");
    let val = inp?.value || "";

    if (strictMode === "strict_lock") {
      for (let i = 0; i < val.length; i++) {
        if (val[i] !== passage[i]) {
          backlogErrors++;
          val = lastValidText;
          if (inp) inp.value = val;
          if ($("#backlogCount")) $("#backlogCount").textContent = String(backlogErrors);
          if ($("#typingResult")) {
            $("#typingResult").textContent = `Strict Lock: Wrong character blocked. Backlog/Errors: ${backlogErrors}.`;
          }
          return;
        }
      }
    }

    lastValidText = val;
    const curLen = val.length;
    if (curLen > prevLen) {
      typedKeyCount += (curLen - prevLen);
      if (strictMode !== "free") {
        for (let i = prevLen; i < curLen; i++) {
          if (val[i] !== passage[i]) backlogErrors++;
        }
      }
    }
    prevLen = curLen;
    appendUnlimitedPassageIfNeeded();
    typingMetrics();
  });

  $("#typingNextWall")?.addEventListener("click", () => {
    customWallText = "";
    wallSeed++;
    resetTyping();
  });

  $("#typingApplyCustom")?.addEventListener("click", () => {
    const raw = ($("#typingCustomBox")?.value || "").trim();
    if (!raw) {
      alert("Pehle custom passage box mein text paste karein.");
      return;
    }
    customWallText = raw;
    resetTyping();
    if ($("#typingResult")) {
      $("#typingResult").textContent = "Custom passage loaded! Press 'Start typing test' to begin.";
    }
  });

  $("#typingClearCustom")?.addEventListener("click", () => {
    customWallText = "";
    const box = $("#typingCustomBox");
    if (box) box.value = "";
    resetTyping();
  });

  $("#typingReset")?.addEventListener("click", resetTyping);
  $("#typingDuration")?.addEventListener("change", resetTyping);
  $("#typingMode")?.addEventListener("change", resetTyping);
  $("#typingStrict")?.addEventListener("change", typingMetrics);

  resetTyping();
})();
