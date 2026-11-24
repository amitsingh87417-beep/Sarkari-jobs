const $ = (s) => document.querySelector(s);
let questions = [], answers = {}, bookmarks = {}, current = 0, submitted = false, reviewWrongOnly = false;
let testTimer = null, timeLeftSec = 0, negPenalty = 0.25, testNote = "";

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtClock(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function stopTimer() {
  if (testTimer) {
    clearInterval(testTimer);
    testTimer = null;
  }
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
    if (timeLeftSec <= 0) {
      stopTimer();
      submitTest(true);
    }
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
  questions.forEach((q, i) => {
    if (answers[i] === undefined) skipped++;
    else if (answers[i] === q.answerIndex) correct++;
    else wrong++;
  });
  const net = correct - wrong * negPenalty;
  const pct = questions.length ? Math.max(0, Math.round((net / questions.length) * 100)) : 0;
  return { correct, wrong, skipped, net, pct };
}

function render(autoSubmitted = false) {
  if (!questions.length) return;
  const visibleIndices = submitted && reviewWrongOnly
    ? questions.map((q, i) => (answers[i] !== q.answerIndex ? i : -1)).filter((i) => i >= 0)
    : questions.map((_, i) => i);

  if (!visibleIndices.includes(current)) {
    current = visibleIndices.length ? visibleIndices[0] : 0;
  }

  const q = questions[current];
  const stats = submitted ? computeStats() : null;

  const paletteHtml = `<div class="palette">${questions.map((item, i) => {
    let cls = "pal-btn";
    if (i === current) cls += " cur";
    if (bookmarks[i]) cls += " bm";
    if (submitted) {
      if (answers[i] === item.answerIndex) cls += " ok";
      else if (answers[i] !== undefined) cls += " bad";
    } else if (answers[i] !== undefined) {
      cls += " ans";
    }
    return `<button type="button" class="${cls}" data-jump="${i}">${i + 1}${bookmarks[i] ? "★" : ""}</button>`;
  }).join("")}</div>`;

  const resultCard = submitted
    ? `<div class="result-card">
        <h2>${autoSubmitted ? "⏰ Time Up — " : ""}Net Score: ${stats.net.toFixed(2)} / ${questions.length}</h2>
        <p>✅ Correct: <b>${stats.correct}</b> · ❌ Wrong: <b>${stats.wrong}</b> · ⚪ Skipped: <b>${stats.skipped}</b> · Negative: <b>-${negPenalty}</b> · Accuracy Score: <b>${stats.pct}%</b></p>
        <div class="mock-actions">
          <button class="btn ghost" type="button" id="toggleWrongOnly">${reviewWrongOnly ? "Show all questions" : `Review wrong / skipped only (${stats.wrong + stats.skipped})`}</button>
          <button class="btn primary" type="button" id="restartTop">Start new test</button>
        </div>
      </div>`
    : "";

  const timerBar = `<div class="timer-bar">
    <span>Answered: ${Object.keys(answers).length} / ${questions.length} · Bookmarked: ${Object.values(bookmarks).filter(Boolean).length}</span>
    <span>Negative: -${negPenalty} ${timeLeftSec || !submitted ? `· ⏱️ <b id="mockClock">${timeLeftSec ? fmtClock(timeLeftSec) : "No timer"}</b>` : ""}</span>
  </div>`;

  const noteHtml = testNote ? `<p class="muted-note">${esc(testNote)}</p>` : "";

  $("#testArea").innerHTML = `${noteHtml}${resultCard}${timerBar}
    <div class="question-card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
        <div class="eyebrow blue">QUESTION ${current + 1} OF ${questions.length}</div>
        <button type="button" class="btn ghost" id="bmBtn" style="padding:6px 10px;font-size:12px">${bookmarks[current] ? "★ Bookmarked" : "☆ Bookmark"}</button>
      </div>
      <div class="progress"><span style="width:${(Object.keys(answers).length / questions.length) * 100}%"></span></div>
      ${paletteHtml}
      <h3>${esc(q.question)}</h3>
      <div>${q.options.map((o, i) => {
        let cls = "option";
        if (submitted) {
          if (i === q.answerIndex) cls += " correct";
          else if (answers[current] === i) cls += " wrong";
        } else if (answers[current] === i) {
          cls += " selected";
        }
        return `<button class="${cls}" data-opt="${i}" ${submitted ? "disabled" : ""}>${String.fromCharCode(65 + i)}. ${esc(o)}</button>`;
      }).join("")}</div>
      ${submitted ? `<div class="explain"><b>${answers[current] === q.answerIndex ? "✅ Correct" : "Correct answer: " + esc(q.options[q.answerIndex])}</b><br>${esc(q.explanation || "")}</div>` : ""}
      <div class="mock-actions">
        ${current > 0 ? '<button class="btn ghost" id="prev">← Previous</button>' : ""}
        ${current < questions.length - 1 ? '<button class="btn primary" id="next">Next question →</button>' : ""}
        ${!submitted ? '<button class="btn primary" id="finish">Submit test</button>' : '<button class="btn ghost" id="restart">New test</button>'}
      </div>
    </div>`;

  document.querySelectorAll("[data-opt]").forEach((b) => {
    b.onclick = () => {
      if (!submitted) {
        answers[current] = Number(b.dataset.opt);
        render();
      }
    };
  });
  document.querySelectorAll("[data-jump]").forEach((b) => {
    b.onclick = () => {
      current = Number(b.dataset.jump);
      render();
    };
  });
  $("#bmBtn")?.addEventListener("click", () => {
    bookmarks[current] = !bookmarks[current];
    render();
  });
  $("#prev")?.addEventListener("click", () => { current--; render(); });
  $("#next")?.addEventListener("click", () => { current++; render(); });
  $("#finish")?.addEventListener("click", () => submitTest(false));
  $("#toggleWrongOnly")?.addEventListener("click", () => { reviewWrongOnly = !reviewWrongOnly; render(); });
  $("#restart")?.addEventListener("click", () => { $("#setup").requestSubmit(); });
  $("#restartTop")?.addEventListener("click", () => { $("#setup").requestSubmit(); });
}

$("#setup").addEventListener("submit", async (e) => {
  e.preventDefault();
  stopTimer();
  $("#testArea").innerHTML = '<div class="question-card">Generating your practice test…</div>';
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
    bookmarks = {};
    current = 0;
    submitted = false;
    reviewWrongOnly = false;
    testNote = d.note || "";
    startTimer(mins);
    render();
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
        $("#dailyExplain").textContent = Number(b.dataset.daily) === q.answer ? "Correct! " + q.explanation : "Not quite. " + q.explanation;
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
    negPenalty = Number($("#negMark")?.value) || 0;
    questions = d.test.questions.map((q) => ({ question: q.question, options: q.options, answerIndex: q.answerIndex, explanation: q.explanation }));
    answers = {};
    bookmarks = {};
    current = 0;
    submitted = false;
    reviewWrongOnly = false;
    testNote = `Admin test: ${d.test.title} (${d.test.duration || 30} min)`;
    startTimer(d.test.duration || 30);
    render();
    area.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    area.textContent = e.message;
  }
}
loadPublishedTests();
