(function () {
  const $ = (s) => document.querySelector(s);

  const HARD_WALL_PARAGRAPHS = [
    "Constitutional jurisprudence, administrative accountability, statutory interpretation, fiscal federalism, and judicial review demand rigorous analytical precision under high-pressure examination conditions. Every aspirant must master complex syntax, hyphenated compound terms, numerical ratios (18:24:36), punctuation marks (;:—), and dense paragraphs without sacrificing accuracy or rhythm.",
    "Jammu and Kashmir geography spans Pir Panjal and Zanskar ranges, alpine passes like Zoji La (3,528m) and Banihal, tectonic and glacial lakes including Wular, Dal, Mansar, and Surinsar, and river basins of Jhelum, Chenab, Ravi, and Tawi. High-speed typing across technical terminology builds mental stamina for SSC, JKSSB, RRB, and defence clerical tests.",
    "Cryptography, distributed consensus, asynchronous event loops, relational indexing, memory-mapped files, and zero-trust authentication form the backbone of modern computing systems. Practicing sustained keystrokes across dense multi-clause sentences sharpens finger endurance and reduces typographical errors during long exam shifts.",
    "Macroeconomic stabilization, monetary transmission mechanisms, capital account convertibility, sovereign bond yields, inflation targeting, and supply-chain resilience require disciplined comprehension and rapid recall. Keep typing continuously: unlimited auto-extending passages load automatically as you progress."
  ];

  let wallSeed = 0;
  const WALL_500K_CHARS = 500000;
  const TARGET_1MIN_KEYS = 10000;

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
    if (mode === "hard_wall" || mins === 5) {
      return generateHardWallText(wallSeed, WALL_500K_CHARS);
    }
    if (mode === "unlimited_stream") {
      return generateHardWallText(wallSeed, 15000);
    }
    return generateHardWallText(wallSeed, 12000);
  }

  let passage = getInitialTypingPassage();
  let typingTimer = null;
  let typingStarted = 0;
  let typingEnd = 0;
  let typingActive = false;
  let typedKeyCount = 0;
  let backlogErrors = 0;
  let prevLen = 0;

  function appendUnlimitedPassageIfNeeded() {
    const mode = $("#typingMode")?.value || "hard_wall";
    if (mode !== "unlimited_stream") return;
    const curLen = ($("#typingInput")?.value || "").length;
    if (passage.length - curLen < 1500) {
      wallSeed++;
      passage += generateHardWallText(wallSeed, 15000);
      $("#typingPassage").textContent = passage;
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
    passage = getInitialTypingPassage();
    $("#typingInput").value = "";
    $("#typingInput").disabled = true;
    $("#typingPassage").textContent = passage;
    const mins = Number($("#typingDuration").value);
    $("#timeLeft").textContent = String(mins).padStart(2, "0") + ":00";
    $("#wpm").textContent = "0";
    $("#accuracy").textContent = "100%";
    $("#typingProgress").style.width = "0%";
    $("#typingResult").textContent = `Hard Wall Ready (${passage.length.toLocaleString()} chars) • 1-Min Goal: ${TARGET_1MIN_KEYS.toLocaleString()} keys • Backlog tracking active.`;
  }

  function typingMetrics() {
    const typed = $("#typingInput").value;
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
    $("#wpm").textContent = String(wpmVal);
    $("#accuracy").textContent = accuracy + "%";
    const pct = Math.min(100, Math.round((typed.length / Math.max(1, passage.length)) * 10000) / 100);
    $("#typingProgress").style.width = pct + "%";
    const mins = Number($("#typingDuration").value);
    if (mins === 1 || $("#typingMode")?.value === "key_10k") {
      $("#typingResult").textContent = `Keys: ${typedKeyCount.toLocaleString()} / ${TARGET_1MIN_KEYS.toLocaleString()} (${kpmVal.toLocaleString()}/min) • Backlog/Errors: ${backlogErrors} (Active Wrong: ${wrongCharsNow}) • ${wpmVal} WPM • ${accuracy}% acc.`;
    } else {
      $("#typingResult").textContent = `Running • Keys: ${typedKeyCount.toLocaleString()} • Backlog/Errors: ${backlogErrors} (Active Wrong: ${wrongCharsNow}) • ${wpmVal} WPM • ${accuracy}% acc.`;
    }
  }

  function finishTyping() {
    clearInterval(typingTimer);
    typingActive = false;
    $("#typingInput").disabled = true;
    typingMetrics();
    $("#typingResult").textContent = `Session complete. Keys: ${typedKeyCount.toLocaleString()} · Backlog/Errors: ${backlogErrors} · ${$("#wpm").textContent} WPM · ${$("#accuracy").textContent} accuracy.`;
  }

  $("#typingStart").addEventListener("click", () => {
    if (typingActive) return;
    resetTyping();
    const mins = Number($("#typingDuration").value);
    typingStarted = Date.now();
    typingEnd = typingStarted + mins * 60000;
    typingActive = true;
    $("#typingInput").disabled = false;
    $("#typingInput").focus();
    $("#typingResult").textContent = "Timer running — type the hard passage wall above.";
    typingTimer = setInterval(() => {
      const left = Math.max(0, typingEnd - Date.now());
      const sec = Math.ceil(left / 1000);
      $("#timeLeft").textContent = String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
      typingMetrics();
      if (left <= 0) finishTyping();
    }, 250);
  });

  $("#typingInput").addEventListener("keydown", (e) => {
    if (!typingActive) return;
    if (e.key === "Backspace") backlogErrors++;
  });

  $("#typingInput").addEventListener("input", () => {
    if (!typingActive) return;
    const val = $("#typingInput").value;
    const curLen = val.length;
    if (curLen > prevLen) {
      typedKeyCount += (curLen - prevLen);
      for (let i = prevLen; i < curLen; i++) {
        if (val[i] !== passage[i]) backlogErrors++;
      }
    }
    prevLen = curLen;
    appendUnlimitedPassageIfNeeded();
    typingMetrics();
  });

  $("#typingNextWall")?.addEventListener("click", () => {
    wallSeed++;
    resetTyping();
  });

  $("#typingReset").addEventListener("click", resetTyping);
  $("#typingDuration").addEventListener("change", resetTyping);
  $("#typingMode")?.addEventListener("change", resetTyping);
  resetTyping();
})();
