(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function initAllExplainWall() {
    const mount = document.getElementById("all-explain-wall-suite");
    if (!mount) return;

    let aiConnected = false;
    let aiModelLabel = "Checking AI...";
    try {
      const st = await fetch("/api/ai-explain-wall/status");
      if (st.ok) {
        const d = await st.json();
        aiConnected = Boolean(d.connected);
        aiModelLabel = aiConnected ? `AI Connected (${d.model})` : "Offline Fallback (Set OPENAI_API_KEY on server)";
      }
    } catch {
      aiModelLabel = "Offline Mode";
    }

    let wallBlocks = [];

    mount.innerHTML = `
      <section style="max-width:1160px;margin:24px auto;padding:0 16px;" id="all-explain-wall">
        <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:22px;padding:22px;box-shadow:0 14px 34px rgba(15,41,87,0.08);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
            <div>
              <span style="background:#155eef;color:#fff;font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;letter-spacing:.5px;">AI POWERED • STEP-BY-STEP SOLVER &amp; UNLIMITED MCQs</span>
              <h2 style="margin:6px 0 4px;font-size:clamp(22px,3.5vw,28px);color:#0f172a;">All Explain Wall</h2>
              <p style="margin:0;font-size:13px;color:#64748b;">Yahan user kuch bhi solve ya explain kar sakta hai — Maths, Reasoning, GK, English, Grammar, ya Unlimited Practice MCQs.</p>
            </div>
            <span style="padding:5px 11px;border-radius:999px;font-size:11px;font-weight:800;background:${aiConnected ? "#dcfce7" : "#fef3c7"};color:${aiConnected ? "#15803d" : "#b45309"};">
              ${esc(aiModelLabel)}
            </span>
          </div>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:15px;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-bottom:10px;">
              <select id="aewMode" style="padding:9px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;font-weight:700;">
                <option value="solve" selected>Solve &amp; Explain Anything + 3 MCQs</option>
                <option value="mcqs">Generate Unlimited Practice MCQs</option>
              </select>
              <select id="aewExam" style="padding:9px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;font-weight:700;">
                <option>SSC GD / CHSL / CGL</option>
                <option>JKSSB / J&amp;K Police</option>
                <option>Railway RRB</option>
                <option>Indian Army / Agniveer</option>
                <option>Banking IBPS / SBI</option>
                <option>General Study</option>
              </select>
              <select id="aewCount" style="padding:9px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;font-weight:700;">
                <option value="5">5 MCQs Batch</option>
                <option value="10" selected>10 MCQs Batch</option>
                <option value="15">15 MCQs Batch</option>
                <option value="20">20 MCQs Batch</option>
              </select>
            </div>

            <textarea id="aewPrompt" rows="3" maxlength="3000" placeholder="Apna koi bhi sawal, math equation, reasoning puzzle, English grammar, ya topic likhein (e.g. 'If CP=500 and Profit=18%, find SP with trick' ya 'Fundamental Rights Articles 14-32')..." style="width:100%;padding:11px;border:1px solid #cbd5e1;border-radius:10px;font:inherit;font-size:13px;background:#fff;resize:vertical;"></textarea>

            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px;">
              <button type="button" id="aewRunBtn" style="background:#155eef;color:#fff;border:0;padding:10px 16px;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;">Explain &amp; Solve on Wall →</button>
              <button type="button" id="aewMoreBtn" style="background:#059669;color:#fff;border:0;padding:10px 14px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;">+ Add More Questions to Wall</button>
              <button type="button" id="aewClearBtn" style="background:#e2e8f0;color:#1e293b;border:0;padding:10px 12px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;">Clear Wall</button>
              <span id="aewStatus" style="font-size:12px;color:#475569;"></span>
            </div>
          </div>

          <div id="aewFeed" style="display:grid;gap:14px;margin-top:16px;"></div>
        </div>
      </section>
    `;

    function renderFeed() {
      const feed = document.getElementById("aewFeed");
      if (!wallBlocks.length) {
        feed.innerHTML = `<div style="padding:14px;border:1px dashed #cbd5e1;border-radius:12px;font-size:12px;color:#64748b;">Upar koi bhi sawal ya topic likh kar <b>Explain &amp; Solve on Wall</b> dabayein — har naya jawab aur practice set is wall par judta jayega.</div>`;
        return;
      }

      feed.innerHTML = wallBlocks.map((blk, bIdx) => {
        let score = 0;
        if (blk.submitted) {
          (blk.mcqs || []).forEach((q, qi) => {
            if (blk.answers[qi] === q.answerIndex) score++;
          });
        }
        return `
          <article style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:16px;padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
              <span style="background:#dbeafe;color:#1d4ed8;font-size:10px;font-weight:800;padding:3px 9px;border-radius:999px;">#${wallBlocks.length - bIdx} • ${esc(blk.source || "AI Engine")}</span>
              <span style="font-size:11px;color:#64748b;">${esc(blk.exam || "")}</span>
            </div>
            <h3 style="margin:0 0 8px;font-size:17px;color:#0f172a;">${esc(blk.title)}</h3>
            ${blk.explanation ? `<div style="font-size:13px;color:#1e293b;line-height:1.65;white-space:pre-line;margin-bottom:8px;">${esc(blk.explanation)}</div>` : ""}
            ${Array.isArray(blk.steps) && blk.steps.length ? `
              <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;margin-bottom:8px;font-size:12px;color:#334155;">
                <b>Step-by-Step Solution:</b>
                <ul style="margin:5px 0 0 18px;padding:0;line-height:1.6;">
                  ${blk.steps.map(st => `<li>${esc(st)}</li>`).join("")}
                </ul>
              </div>
            ` : ""}
            ${blk.shortcut ? `
              <div style="background:#fefce8;border:1px solid #fde047;border-radius:10px;padding:8px 12px;margin-bottom:10px;font-size:12px;color:#713f12;">
                <b>Exam Shortcut / Tip:</b> ${esc(blk.shortcut)}
              </div>
            ` : ""}

            ${Array.isArray(blk.mcqs) && blk.mcqs.length ? `
              <div style="display:grid;gap:8px;">
                ${blk.mcqs.map((q, qi) => `
                  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:11px;padding:10px;">
                    <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:6px;">Q${qi + 1}. ${esc(q.question)}</div>
                    <div style="display:grid;gap:4px;">
                      ${(q.options || []).map((opt, oi) => {
                        const ch = blk.answers[qi] === oi;
                        let bg = ch ? "#dbeafe" : "#f8fafc";
                        let brd = ch ? "#155eef" : "#cbd5e1";
                        if (blk.submitted) {
                          if (oi === q.answerIndex) { bg = "#dcfce7"; brd = "#16a34a"; }
                          else if (ch) { bg = "#fee2e2"; brd = "#dc2626"; }
                        }
                        return `<button type="button" data-aew-b="${bIdx}" data-aew-q="${qi}" data-aew-o="${oi}" ${blk.submitted ? "disabled" : ""} style="text-align:left;padding:6px 9px;border-radius:7px;border:1px solid ${brd};background:${bg};font-size:11px;font-weight:600;color:#0f172a;cursor:${blk.submitted ? "default" : "pointer"};">${String.fromCharCode(65 + oi)}. ${esc(opt)}</button>`;
                      }).join("")}
                    </div>
                    ${blk.submitted && q.explanation ? `<div style="font-size:11px;color:#334155;margin-top:5px;">Explanation: ${esc(q.explanation)}</div>` : ""}
                  </div>
                `).join("")}
              </div>
              <div style="margin-top:9px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                ${!blk.submitted
                  ? `<button type="button" data-aew-sub="${bIdx}" style="background:#16a34a;color:#fff;border:0;padding:8px 14px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">Check Answers</button>`
                  : `<span style="background:#dcfce7;color:#14532d;padding:6px 11px;border-radius:8px;font-size:12px;font-weight:800;">Score: ${score} / ${blk.mcqs.length}</span>`
                }
              </div>
            ` : ""}
          </article>
        `;
      }).join("");

      feed.querySelectorAll("button[data-aew-b]").forEach(btn => {
        btn.addEventListener("click", () => {
          const bi = Number(btn.dataset.aewB);
          const qi = Number(btn.dataset.aewQ);
          const oi = Number(btn.dataset.aewO);
          if (!wallBlocks[bi] || wallBlocks[bi].submitted) return;
          wallBlocks[bi].answers[qi] = oi;
          renderFeed();
        });
      });

      feed.querySelectorAll("button[data-aew-sub]").forEach(btn => {
        btn.addEventListener("click", () => {
          const bi = Number(btn.dataset.aewSub);
          if (!wallBlocks[bi]) return;
          wallBlocks[bi].submitted = true;
          renderFeed();
        });
      });
    }

    async function runExplainWall(forceMcqMode) {
      const statusEl = document.getElementById("aewStatus");
      const mode = forceMcqMode ? "mcqs" : document.getElementById("aewMode").value;
      const exam = document.getElementById("aewExam").value;
      const count = Number(document.getElementById("aewCount").value) || 10;
      const prompt = document.getElementById("aewPrompt").value.trim() || (forceMcqMode ? `${exam} Mixed Practice Questions` : "");
      if (!prompt) {
        statusEl.textContent = "Pehle apna sawal ya topic likhein.";
        return;
      }
      statusEl.textContent = "AI Explain Wall par jawab taiyar ho raha hai...";
      try {
        const r = await fetch("/api/ai-explain-wall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, exam, count, prompt })
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Request failed");
        wallBlocks.unshift({
          source: d.source,
          exam,
          title: d.title,
          explanation: d.explanation,
          steps: d.steps || [],
          shortcut: d.shortcut || "",
          mcqs: d.mcqs || [],
          answers: {},
          submitted: false
        });
        statusEl.textContent = "Wall par add ho gaya!";
        renderFeed();
      } catch (err) {
        statusEl.textContent = err.message;
      }
    }

    document.getElementById("aewRunBtn").addEventListener("click", () => runExplainWall(false));
    document.getElementById("aewMoreBtn").addEventListener("click", () => runExplainWall(true));
    document.getElementById("aewClearBtn").addEventListener("click", () => {
      wallBlocks = [];
      document.getElementById("aewStatus").textContent = "";
      renderFeed();
    });

    renderFeed();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllExplainWall);
  } else {
    initAllExplainWall();
  }
})();
