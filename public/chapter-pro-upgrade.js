"use strict";
// ============================================================================
// 100-CHAPTER SYLLABUS PRO UPGRADE v2.0
// Adds All-India Exam Filter, Hard/Ultra-Hard Mode & Instant 25Q CBT Quiz Modal
// ============================================================================
(function () {
  function initChapterPro() {
    const chaptersSec = document.getElementById("chapters");
    const chapterGrid = document.getElementById("chapterGrid");
    if (!chaptersSec || !chapterGrid) return;

    // Inject Pro Control Bar above chapterGrid
    const bar = document.createElement("div");
    bar.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#eef4ff;border:1px solid #c7dbff;border-radius:12px;padding:10px 12px;margin:10px 0 14px;font-size:12.5px";
    bar.innerHTML = `
      <b style="color:#155eef">⚡ Unlimited Smart Question Engine Active:</b>
      <select id="cpExamSel" style="padding:7px 10px;border-radius:8px;border:1px solid #bfd3f7;font:inherit;font-weight:700">
        <option value="SSC GD">SSC GD / CHSL / CGL</option>
        <option value="RRB NTPC">Railway RRB NTPC / Group D</option>
        <option value="JKSSB">JKSSB / J&K Police</option>
        <option value="BSF / CRPF / Assam Rifles">BSF / CRPF / Assam Rifles</option>
        <option value="State Police">All-India State Police</option>
        <option value="Banking">Banking (IBPS / SBI)</option>
        <option value="Army GD">Army Agniveer GD</option>
      </select>
      <select id="cpDiffSel" style="padding:7px 10px;border-radius:8px;border:1px solid #bfd3f7;font:inherit;font-weight:700">
        <option value="Hard" selected>Difficulty: Hard Exam Level</option>
        <option value="Ultra Hard">Difficulty: Ultra-Hard Ranker</option>
      </select>
      <button type="button" id="cpQuick25Btn" style="border:0;background:#155eef;color:#fff;padding:8px 13px;border-radius:8px;font-weight:800;cursor:pointer">⚡ Launch 25Q All-India Hard CBT</button>
    `;
    chapterGrid.parentNode.insertBefore(bar, chapterGrid);

    // Create CBT Modal
    const modal = document.createElement("div");
    modal.id = "cpCbtModal";
    modal.style.cssText = "display:none;position:fixed;inset:0;background:rgba(15,23,42,.72);z-index:9999;overflow-y:auto;padding:18px";
    modal.innerHTML = `
      <div style="max-width:820px;margin:16px auto;background:#fff;border-radius:18px;padding:20px;box-shadow:0 24px 60px rgba(0,0,0,.35)">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #e2e8f0;padding-bottom:10px;margin-bottom:12px">
          <div><b id="cpModalTitle" style="font-size:17px;color:#0f172a">Hard CBT Quiz</b><div id="cpModalSub" style="font-size:12px;color:#64748b">25 Questions • Negative Marking -0.25</div></div>
          <div style="display:flex;align-items:center;gap:10px">
            <span id="cpTimer" style="background:#fef2f2;color:#dc2626;padding:6px 11px;border-radius:999px;font-weight:800;font-size:13px">15:00</span>
            <button type="button" id="cpCloseModal" style="border:1px solid #cbd5e1;background:#f8fafc;border-radius:8px;padding:6px 11px;font-weight:800;cursor:pointer">✕</button>
          </div>
        </div>
        <div id="cpModalBody">Loading hard questions...</div>
      </div>
    `;
    document.body.appendChild(modal);

    let timerId = null;
    function closeModal() {
      clearInterval(timerId);
      modal.style.display = "none";
    }
    document.getElementById("cpCloseModal").addEventListener("click", closeModal);

    async function launchHardQuiz(topicTitle) {
      const exam = document.getElementById("cpExamSel").value;
      const diff = document.getElementById("cpDiffSel").value;
      modal.style.display = "block";
      document.getElementById("cpModalTitle").textContent = `${topicTitle} — ${exam} (${diff})`;
      document.getElementById("cpModalSub").textContent = "25 Hard Questions • +1 Correct / -0.25 Wrong • Instant Explanations";
      const body = document.getElementById("cpModalBody");
      body.innerHTML = "<p>Generating 25 fresh hard exam questions...</p>";

      let qs = [];
      try {
        const res = await fetch(`/api/practice/questions?category=${encodeURIComponent(topicTitle)}&difficulty=${encodeURIComponent(diff)}&count=25&exam=${encodeURIComponent(exam)}`);
        if (res.ok) {
          const data = await res.json();
          qs = Array.isArray(data) ? data : (data.questions || []);
        }
      } catch (_) {}

      if (!qs.length) {
        try {
          const r2 = await fetch("/api/mock-test/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exam, topic: topicTitle, difficulty: diff, count: 25 })
          });
          if (r2.ok) {
            const d2 = await r2.json();
            qs = d2.questions || [];
          }
        } catch (_) {}
      }

      if (!qs.length) {
        body.innerHTML = "<p style='color:#dc2626'>Could not load questions right now. Please open AI Mock Test page.</p>";
        return;
      }

      let left = 900;
      clearInterval(timerId);
      timerId = setInterval(() => {
        left--;
        const m = String(Math.floor(Math.max(0, left) / 60)).padStart(2, "0");
        const s = String(Math.max(0, left) % 60).padStart(2, "0");
        document.getElementById("cpTimer").textContent = `${m}:${s}`;
        if (left <= 0) submitQuiz();
      }, 1000);

      const picks = new Array(qs.length).fill(-1);
      body.innerHTML = qs.map((q, qi) => `
        <div style="border:1px solid #e2e8f0;border-radius:12px;padding:13px;margin-bottom:10px">
          <div style="font-weight:700;margin-bottom:8px">Q${qi + 1}. ${q.question}</div>
          ${(q.options || []).map((opt, oi) => `
            <label style="display:block;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;margin:5px 0;cursor:pointer">
              <input type="radio" name="cpq_${qi}" value="${oi}" style="margin-right:8px"> ${opt}
            </label>
          `).join("")}
          <div id="cpexp_${qi}" style="display:none;margin-top:8px;padding:8px 10px;border-radius:8px;background:#f0fdf4;color:#166534;font-size:12.5px"></div>
        </div>
      `).join("") + `<button type="button" id="cpSubmitBtn" style="width:100%;padding:13px;border:0;border-radius:11px;background:#155eef;color:#fff;font-weight:800;font-size:15px;cursor:pointer">Submit &amp; Check Score</button><div id="cpScoreOut" style="margin-top:12px"></div>`;

      qs.forEach((_, qi) => {
        body.querySelectorAll(`input[name="cpq_${qi}"]`).forEach((inp) => {
          inp.addEventListener("change", () => { picks[qi] = Number(inp.value); });
        });
      });

      function submitQuiz() {
        clearInterval(timerId);
        let correct = 0, wrong = 0;
        qs.forEach((q, qi) => {
          const expEl = document.getElementById(`cpexp_${qi}`);
          const ans = Number(q.answer || 0);
          if (picks[qi] === ans) {
            correct++;
            if (expEl) { expEl.style.display = "block"; expEl.style.background = "#f0fdf4"; expEl.style.color = "#166534"; expEl.textContent = `✅ Correct! ${q.explanation || ""}`; }
          } else {
            if (picks[qi] !== -1) wrong++;
            if (expEl) { expEl.style.display = "block"; expEl.style.background = "#fef2f2"; expEl.style.color = "#991b1b"; expEl.textContent = `❌ Correct Answer: ${(q.options || [])[ans] || "Option " + (ans + 1)}. ${q.explanation || ""}`; }
          }
        });
        const score = Math.max(0, Math.round((correct - wrong * 0.25) * 100) / 100);
        const pct = Math.round((correct / qs.length) * 100);
        const out = document.getElementById("cpScoreOut");
        if (out) {
          out.innerHTML = `<div style="padding:14px;border-radius:12px;background:#eef4ff;border:1.5px solid #155eef;font-weight:800;font-size:15px">Score: ${score} / ${qs.length} (${pct}%) • Correct: ${correct} • Wrong: ${wrong} (-0.25 each)</div>`;
          out.scrollIntoView({ behavior: "smooth" });
        }
      }
      document.getElementById("cpSubmitBtn").addEventListener("click", submitQuiz);
    }

    document.getElementById("cpQuick25Btn").addEventListener("click", () => launchHardQuiz("All-India Mixed Hard"));

    // Add quick "⚡ 25Q Hard" trigger on double-click or via observer on chapter buttons
    const observer = new MutationObserver(() => {
      chapterGrid.querySelectorAll(".chapter").forEach((card) => {
        if (card.dataset.cpEnhanced) return;
        card.dataset.cpEnhanced = "1";
        const titleEl = card.querySelector("b");
        const title = titleEl ? titleEl.textContent.trim() : "General Knowledge";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "⚡ 25Q Hard CBT";
        btn.style.cssText = "margin-top:8px;border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;border-radius:7px;padding:4px 9px;font-size:11px;font-weight:800;cursor:pointer;display:inline-block";
        btn.addEventListener("click", (e) => { e.stopPropagation(); launchHardQuiz(title); });
        card.appendChild(btn);
      });
    });
    observer.observe(chapterGrid, { childList: true, subtree: true });
    // Trigger once immediately if already populated
    setTimeout(() => {
      chapterGrid.querySelectorAll(".chapter").forEach((card) => {
        if (card.dataset.cpEnhanced) return;
        card.dataset.cpEnhanced = "1";
        const titleEl = card.querySelector("b");
        const title = titleEl ? titleEl.textContent.trim() : "General Knowledge";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "⚡ 25Q Hard CBT";
        btn.style.cssText = "margin-top:8px;border:1px solid #bfdbfe;background:#eff6ff;color:#1d4ed8;border-radius:7px;padding:4px 9px;font-size:11px;font-weight:800;cursor:pointer;display:inline-block";
        btn.addEventListener("click", (e) => { e.stopPropagation(); launchHardQuiz(title); });
        card.appendChild(btn);
      });
    }, 600);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initChapterPro);
  else initChapterPro();
})();
