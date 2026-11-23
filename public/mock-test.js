const $ = (s) => document.querySelector(s);
let questions = [], answers = {}, current = 0, submitted = false, testNote = "";

$("#setup")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const area = $("#testArea");
  if (!area) return;
  area.innerHTML = '<div class="question-card">Generating your practice test&hellip;</div>';

  try {
    const r = await fetch("/api/mock-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam: $("#exam")?.value || "SSC GD",
        topic: $("#topic")?.value || "General Knowledge (Mixed)",
        difficulty: $("#difficulty")?.value || "Medium",
        count: $("#count")?.value || "10"
      })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Could not generate test");

    questions = Array.isArray(d.questions) ? d.questions : [];
    answers = {};
    current = 0;
    submitted = false;
    testNote = d.note ? String(d.note) : "";
    render();
    area.scrollIntoView({ behavior: "smooth" });
  } catch (x) {
    area.innerHTML = `<div class="question-card">${esc(x.message)}</div>`;
  }
});

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function renderResultBanner(score) {
  const total = questions.length;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const msg = score >= total * 0.6 ? "Good work. Keep practising!" : "Review explanations and try again.";
  return `<div class="result-card"><h2>Test result: ${score}/${total}</h2><p>${pct}% score &bull; ${esc(msg)}</p></div>`;
}

function render() {
  const area = $("#testArea");
  if (!area || !questions.length) return;

  const q = questions[current];
  const opts = Array.isArray(q.options) ? q.options : [];
  const ansIdx = Math.max(0, Math.min(opts.length - 1, Number(q.answerIndex) || 0));
  const progressPct = ((Object.keys(answers).length / questions.length) * 100).toFixed(1);

  const score = submitted
    ? questions.reduce((n, item, i) => n + (answers[i] === item.answerIndex ? 1 : 0), 0)
    : 0;

  area.innerHTML = `
    ${testNote ? `<p class="muted-note">${esc(testNote)}</p>` : ""}
    ${submitted ? renderResultBanner(score) : ""}
    <div class="question-card">
      <div class="eyebrow blue">QUESTION ${current + 1} OF ${questions.length}</div>
      <div class="progress"><span style="width:${progressPct}%"></span></div>
      <h3>${esc(q.question)}</h3>
      <div>
        ${opts.map((o, i) => {
          let cls = "option";
          if (submitted) {
            if (i === ansIdx) cls += " correct";
            else if (answers[current] === i) cls += " wrong";
          } else if (answers[current] === i) {
            cls += " selected";
          }
          return `<button type="button" class="${cls}" data-opt="${i}" ${submitted ? "disabled" : ""}>${String.fromCharCode(65 + i)}. ${esc(o)}</button>`;
        }).join("")}
      </div>
      ${submitted ? `<div class="explain"><b>${answers[current] === ansIdx ? "Correct" : "Correct answer: " + esc(opts[ansIdx] || "")}</b><br>${esc(q.explanation)}</div>` : ""}
      <div class="mock-actions">
        ${current > 0 ? '<button type="button" class="btn ghost" id="prev">&larr; Previous</button>' : ""}
        ${current < questions.length - 1 ? '<button type="button" class="btn primary" id="next">Next question &rarr;</button>' : ""}
        ${!submitted
          ? '<button type="button" class="btn primary" id="finish">Submit test</button>'
          : '<button type="button" class="btn ghost" id="restart">New test</button>'}
      </div>
    </div>
  `;

  document.querySelectorAll("[data-opt]").forEach((b) => {
    b.onclick = () => {
      if (!submitted) {
        answers[current] = Number(b.dataset.opt);
        render();
      }
    };
  });

  $("#prev")?.addEventListener("click", () => {
    if (current > 0) {
      current--;
      render();
    }
  });

  $("#next")?.addEventListener("click", () => {
    if (current < questions.length - 1) {
      current++;
      render();
    }
  });

  $("#finish")?.addEventListener("click", () => {
    submitted = true;
    render();
  });

  $("#restart")?.addEventListener("click", () => {
    $("#setup")?.requestSubmit();
  });
}

async function daily() {
  const qEl = $("#dailyQ");
  const optEl = $("#dailyOptions");
  const expEl = $("#dailyExplain");
  if (!qEl || !optEl) return;

  try {
    const r = await fetch("/api/daily-question", { cache: "no-store" });
    const q = await r.json().catch(() => ({}));
    if (!r.ok || !q.q || !Array.isArray(q.options)) throw new Error("Unavailable");

    qEl.textContent = q.q;
    optEl.innerHTML = q.options
      .map((o, i) => `<button type="button" class="option" data-daily="${i}">${String.fromCharCode(65 + i)}. ${esc(o)}</button>`)
      .join("");

    document.querySelectorAll("[data-daily]").forEach((b) => {
      b.onclick = () => {
        const picked = Number(b.dataset.daily);
        const isRight = picked === Number(q.answer);
        if (expEl) {
          expEl.textContent = (isRight ? "Correct! " : "Not quite. ") + (q.explanation || "");
        }
        document.querySelectorAll("[data-daily]").forEach((x, idx) => {
          x.disabled = true;
          if (idx === Number(q.answer)) x.classList.add("correct");
          else if (idx === picked && !isRight) x.classList.add("wrong");
        });
      };
    });
  } catch {
    qEl.textContent = "Daily question is temporarily unavailable.";
  }
}

daily();

// Display admin-published tests and launch a saved test from its public ID.
async function loadPublishedTests() {
  const el = $("#publishedTests");
  if (!el) return;

  try {
    const r = await fetch("/api/tests", { cache: "no-store" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Failed");

    el.innerHTML =
      (d.tests || [])
        .map(
          (t) => `<div class="admin-row"><div><b>${esc(t.title)}</b><small>${esc(t.exam)} &middot; ${esc(t.questionCount)} questions &middot; ${esc(t.duration)} min</small></div><button type="button" class="btn primary" data-startset="${esc(t.id)}">Start test</button></div>`
        )
        .join("") || '<p class="muted-note">No admin-published tests yet.</p>';

    document.querySelectorAll("[data-startset]").forEach((b) => {
      b.onclick = () => startSavedTest(b.dataset.startset);
    });
  } catch {
    el.textContent = "Could not load published tests.";
  }
}

async function startSavedTest(id) {
  const area = $("#testArea");
  if (!area) return;
  area.innerHTML = '<div class="question-card">Loading test&hellip;</div>';

  try {
    const r = await fetch("/api/tests/" + encodeURIComponent(id), { cache: "no-store" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Could not load test");

    questions = (d.test?.questions || []).map((q) => ({
      question: q.question,
      options: q.options,
      answerIndex: q.answerIndex,
      explanation: q.explanation
    }));
    answers = {};
    current = 0;
    submitted = false;
    testNote = "";
    render();
    area.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    area.innerHTML = `<div class="question-card">${esc(e.message)}</div>`;
  }
}

loadPublishedTests();
