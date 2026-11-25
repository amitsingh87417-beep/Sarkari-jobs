const $ = (s) => document.querySelector(s);
let questions = [], answers = {}, reviewMarks = {}, sectionsMeta = [], current = 0, submitted = false, reviewWrongOnly = false;
let testTimer = null, timeLeftSec = 0, negPenalty = 0.25, testNote = "", activeMode = "real";

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtClock(sec) {
  const s = Math.max(0, Math.ceil(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function stopTimer() {
  if (testTimer) { clearInterval(testTimer); testTimer = null; }
}

function startTimer(mins) {
  stopTimer();
  timeLeftSec = Math.max(0, Number(mins) || 0) * 60;
  if (!timeLeftSec) return;
  testTimer = setInterval(() => {
    if (submitted) return stopTimer();
    timeLeftSec--;
    const el = $("#mockClock");
    if (el) el.textContent = fmtClock(timeLeftSec);
    if (timeLeftSec <= 0) { stopTimer(); submitTest(true); }
  }, 1000);
}

function submitTest(auto = false) {
  if (submitted || !questions.length) return;
  submitted = true;
  stopTimer();
  render(auto);
}

function computeStats() {
  let correct = 0, wrong = 0, skipped = 0;
  const bySec = {};
  questions.forEach((q, i) => {
    const sec = q.section || q.category || "General";
    if (!bySec[sec]) bySec[sec] = { total: 0, correct: 0, wrong: 0 };
    bySec[sec].total++;
    if (answers[i] === undefined) skipped++;
    else if (answers[i] === q.answerIndex) { correct++; bySec[sec].correct++; }
    else { wrong++; bySec[sec].wrong++; }
  });
  const net = correct - wrong * negPenalty;
  const pct = questions.length ? Math.max(0, Math.round((net / questions.length) * 100)) : 0;
  return { correct, wrong, skipped, net, pct, bySec };
}

function render(autoSubmitted = false) {
  if (!questions.length) return;
  const visibleIndices = submitted && reviewWrongOnly
    ? questions.map((q, i) => (answers[i] !== q.answerIndex ? i : -1)).filter((i) => i >= 0)
    : questions.map((_, i) => i);

  if (!visibleIndices.includes(current)) current = visibleIndices.length ? visibleIndices[0] : 0;
  const q = questions[current];
  const stats = submitted ? computeStats() : null;

  const secNames = [...new Set(questions.map((x) => x.section || x.category || "General"))];
  const currentSec = q.section || q.category || "General";
  const secTabsHtml = secNames.length > 1
    ? `<div class="sec-tabs">${secNames.map((sn) => {
        const firstIdx = questions.findIndex((x) => (x.section || x.category || "General") === sn);
        const cnt = questions.filter((x) => (x.section || x.category || "General") === sn).length;
        return `<button type="button" class="sec-tab${sn === currentSec ? " active" : ""}" data-jump="${firstIdx}">${esc(sn)} (${cnt})</button>`;
      }).join("")}</div>`
    : "";

  const paletteHtml = `<div class="palette-box">
    <div style="font-size:13px;font-weight:800;color:#0f172a">Question Palette</div>
    <div class="palette">${questions.map((item, i) => {
      let cls = "pal-btn";
      if (i === current) cls += " cur";
      if (submitted) {
        if (answers[i] === item.answerIndex) cls += " ok";
        else if (answers[i] !== undefined) cls += " bad";
      } else {
        if (reviewMarks[i]) cls += " rev";
        else if (answers[i] !== undefined) cls += " ans";
      }
      return `<button type="button" class="${cls}" data-jump="${i}">${i + 1}</button>`;
    }).join("")}</div>
    <div class="legend">
      <span>🟩 Answered: <b>${Object.keys(answers).length}</b></span>
      <span>🟪 Review: <b>${Object.values(reviewMarks).filter(Boolean).length}</b></span>
      <span>⬜ Remaining: <b>${questions.length - Object.keys(answers).length}</b></span>
      <span>➖ Neg: <b>-${negPenalty}</b></span>
    </div>
    ${!submitted ? `<button type="button" class="btn primary" id="sideSubmit" style="width:100%;margin-top:12px">Submit CBT Paper ✓</button>` : ""}
  </div>`;

  const secTableHtml = submitted
    ? `<div style="overflow-x:auto;margin-top:12px"><table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:#f1f5f9"><th style="padding:7px;border:1px solid #cbd5e1;text-align:left">Section</th><th style="padding:7px;border:1px solid #cbd5e1">Total</th><th style="padding:7px;border:1px solid #cbd5e1">Correct</th><th style="padding:7px;border:1px solid #cbd5e1">Wrong</th><th style="padding:7px;border:1px solid #cbd5e1">Net</th></tr></thead>
        <tbody>${Object.entries(stats.bySec).map(([sn, st]) => `<tr><td style="padding:7px;border:1px solid #cbd5e1"><b>${esc(sn)}</b></td><td style="padding:7px;border:1px solid #cbd5e1;text-align:center">${st.total}</td><td style="padding:7px;border:1px solid #cbd5e1;text-align:center;color:#15803d"><b>${st.correct}</b></td><td style="padding:7px;border:1px solid #cbd5e1;text-align:center;color:#dc2626">${st.wrong}</td><td style="padding:7px;border:1px solid #cbd5e1;text-align:center"><b>${(st.correct - st.wrong * negPenalty).toFixed(2)}</b></td></tr>`).join("")}</tbody>
      </table></div>`
    : "";

  const resultCard = submitted
    ? `<div class="result-card">
        <h2 style="margin-top:0">${autoSubmitted ? "⏰ Time Up — " : "🏆 "}Net Score: ${stats.net.toFixed(2)} / ${questions.length} (${stats.pct}%)</h2>
        <p>✅ Correct: <b>${stats.correct}</b> · ❌ Wrong: <b>${stats.wrong}</b> · ⚪ Skipped: <b>${stats.skipped}</b> · Negative: <b>-${negPenalty}</b></p>
        ${secTableHtml}
        <div class="mock-actions">
          <button class="btn ghost" type="button" id="toggleWrongOnly">${reviewWrongOnly ? "Show all questions" : `Review Wrong / Skipped (${stats.wrong + stats.skipped})`}</button>
          <button class="btn primary" type="button" id="restartTop">🚀 Attempt Another Hard Paper</button>
        </div>
      </div>`
    : "";

  const timerBar = `<div class="timer-bar">
    <span>📝 ${esc(testNote || "Real Exam CBT Simulator")}</span>
    <span class="timer-clock">⏱️ <span id="mockClock">${timeLeftSec ? fmtClock(timeLeftSec) : "Unlimited"}</span></span>
  </div>`;

  $("#testArea").innerHTML = `${resultCard}${timerBar}
    <div class="cbt-layout">
      <div class="question-card" style="margin:0">
        ${secTabsHtml}
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <div class="eyebrow blue">QUESTION ${current + 1} OF ${questions.length} • ${esc(currentSec)}</div>
          <span style="font-size:11px;font-weight:800;color:#059669">+1.0 / -${negPenalty}</span>
        </div>
        <div class="progress"><span style="width:${(Object.keys(answers).length / questions.length) * 100}%"></span></div>
        <h3>${esc(q.question)}</h3>
        <div>${q.options.map((o, i) => {
          let cls = "option";
          if (submitted) {
            if (i === q.answerIndex) cls += " correct";
            else if (answers[current] === i) cls += " wrong";
          } else if (answers[current] === i) cls += " selected";
          return `<button class="${cls}" data-opt="${i}" ${submitted ? "disabled" : ""}>${String.fromCharCode(65 + i)}. ${esc(o)}</button>`;
        }).join("")}</div>
        ${submitted ? `<div class="explain"><b>${answers[current] === q.answerIndex ? "✅ Correct!" : "❌ Correct Answer: " + esc(q.options[q.answerIndex])}</b><br>${esc(q.explanation || "")}</div>` : ""}
        <div class="mock-actions">
          ${current > 0 ? '<button class="btn ghost" type="button" id="prev">← Prev</button>' : ""}
          ${!submitted ? '<button class="btn ghost" type="button" id="clearResp">Clear</button>' : ""}
          ${!submitted ? `<button class="btn ghost" type="button" id="markRev" style="border-color:#7c3aed;color:#7c3aed">${reviewMarks[current] ? "★ Marked for Review" : "☆ Mark for Review & Next"}</button>` : ""}
          ${current < questions.length - 1 ? '<button class="btn primary" type="button" id="next">Save &amp; Next →</button>' : ""}
          ${!submitted ? '<button class="btn primary" type="button" id="finish" style="background:#16a34a">Submit Exam ✓</button>' : '<button class="btn primary" type="button" id="restart">New Paper →</button>'}
        </div>
      </div>
      ${paletteHtml}
    </div>`;

  document.querySelectorAll("[data-opt]").forEach((b) => {
    b.onclick = () => { if (!submitted) { answers[current] = Number(b.dataset.opt); render(); } };
  });
  document.querySelectorAll("[data-jump]").forEach((b) => {
    b.onclick = () => { current = Number(b.dataset.jump); render(); };
  });
  $("#clearResp")?.addEventListener("click", () => { delete answers[current]; render(); });
  $("#markRev")?.addEventListener("click", () => {
    reviewMarks[current] = !reviewMarks[current];
    if (current < questions.length - 1) current++;
    render();
  });
  $("#prev")?.addEventListener("click", () => { current--; render(); });
  $("#next")?.addEventListener("click", () => { current++; render(); });
  $("#finish")?.addEventListener("click", () => submitTest(false));
  $("#sideSubmit")?.addEventListener("click", () => submitTest(false));
  $("#toggleWrongOnly")?.addEventListener("click", () => { reviewWrongOnly = !reviewWrongOnly; render(); });
  const triggerNew = () => (activeMode === "real" ? $("#realSetup") : $("#setup")).requestSubmit();
  $("#restart")?.addEventListener("click", triggerNew);
  $("#restartTop")?.addEventListener("click", triggerNew);
}

// Mode switcher
document.querySelectorAll(".mode-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeMode = btn.dataset.mode;
    document.querySelectorAll(".mode-tab").forEach((b) => b.classList.toggle("active", b === btn));
    $("#realSetup").classList.toggle("hidden", activeMode !== "real");
    $("#setup").classList.toggle("hidden", activeMode !== "custom");
  });
});

// Real Exam Paper submit
$("#realSetup")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  stopTimer();
  $("#testArea").innerHTML = '<div class="question-card">⚡ Building your Real CBT Exam Paper from 5,00,000+ Hard Question Engine…</div>';
  try {
    const r = await fetch("/api/mock-test/real-paper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam: $("#realExam").value,
        difficulty: $("#realDiff").value,
        paperNo: $("#realPaperNo").value ? Number($("#realPaperNo").value) : undefined
      })
    });
    const d = await r.json();
    if (!r.ok) throw Error(d.error || "Could not generate real paper");
    questions = d.questions || [];
    answers = {};
    reviewMarks = {};
    sectionsMeta = d.sections || [];
    current = 0;
    submitted = false;
    reviewWrongOnly = false;
    negPenalty = Number(d.negative) || 0.25;
    testNote = d.note || d.title || "Real CBT Paper";
    startTimer(d.durationMin || 60);
    render();
    $("#testArea").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    $("#testArea").innerHTML = `<div class="question-card">${esc(err.message)}</div>`;
  }
});

// Custom / Unlimited Marathon submit
$("#setup")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  stopTimer();
  $("#testArea").innerHTML = '<div class="question-card">⚡ Generating your Hard Mock Test from 5,00,000+ Question Engine…</div>';
  try {
    negPenalty = Number($("#negMark")?.value) || 0;
    const mins = Number($("#timerMins")?.value) || 0;
    const r = await fetch("/api/mock-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam: $("#exam").value,
        topic: $("#topic").value,
        difficulty: $("#difficulty").value,
        count: $("#count").value
      })
    });
    const d = await r.json();
    if (!r.ok) throw Error(d.error || "Could not generate test");
    questions = d.questions || [];
    answers = {};
    reviewMarks = {};
    current = 0;
    submitted = false;
    reviewWrongOnly = false;
    testNote = `${d.exam} • ${d.topic} (${d.difficulty}) • ${questions.length} Qs`;
    startTimer(mins);
    render();
    $("#testArea").scrollIntoView({ behavior: "smooth" });
  } catch (x) {
    $("#testArea").innerHTML = `<div class="question-card">${esc(x.message)}</div>`;
  }
});

async function daily() {
  try {
    const r = await fetch("/api/daily-question"), q = await r.json();
    $("#dailyQ").textContent = q.q;
    $("#dailyOptions").innerHTML = q.options.map((o, i) => `<button class="option" data-daily="${i}">${String.fromCharCode(65 + i)}. ${esc(o)}</button>`).join("");
    document.querySelectorAll("[data-daily]").forEach((b) => {
      b.onclick = () => {
        $("#dailyExplain").textContent = Number(b.dataset.daily) === q.answer ? "✅ Correct! " + q.explanation : "❌ Not quite. " + q.explanation;
        document.querySelectorAll("[data-daily]").forEach((x) => { x.disabled = true; });
      };
    });
  } catch {
    $("#dailyQ").textContent = "Daily question is temporarily unavailable.";
  }
}
daily();

async function loadPublishedTests() {
  const el = $("#publishedTests");
  try {
    const r = await fetch("/api/tests"), d = await r.json();
    el.innerHTML = (d.tests || []).map((t) => `<div class="admin-row"><div><b>${esc(t.title)}</b><small>${esc(t.exam)} · ${t.questionCount} questions · ${t.duration} min</small></div><button class="btn primary" data-startset="${esc(t.id)}">Start test</button></div>`).join("") || "<p class=muted-note>No admin-published tests yet.</p>";
    document.querySelectorAll("[data-startset]").forEach((b) => { b.onclick = () => startSavedTest(b.dataset.startset); });
  } catch {
    el.textContent = "Could not load published tests.";
  }
}

async function startSavedTest(id) {
  const area = $("#testArea");
  area.innerHTML = "Loading test…";
  try {
    const r = await fetch("/api/tests/" + encodeURIComponent(id)), d = await r.json();
    if (!r.ok) throw Error(d.error);
    negPenalty = Number($("#negMark")?.value) || 0.25;
    questions = d.test.questions.map((q) => ({ section: d.test.exam || "Exam", question: q.question, options: q.options, answerIndex: q.answerIndex, explanation: q.explanation }));
    answers = {};
    reviewMarks = {};
    current = 0;
    submitted = false;
    reviewWrongOnly = false;
    testNote = `Admin Test: ${d.test.title} (${d.test.duration || 30} min)`;
    startTimer(d.test.duration || 30);
    render();
    area.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    area.textContent = e.message;
  }
}
loadPublishedTests();
