(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const TODAY = new Date().toISOString().slice(0, 10);
  const VOTE_KEY = "sju_poll_voted_" + TODAY;
  const QUIZ_KEY = "sju_quiz_done_" + TODAY;

  async function initSuite() {
    const mount = document.getElementById("daily-engage-suite");
    if (!mount) return;

    let state = { quiz: { title: "Aaj Ka Daily Quiz", questions: [] }, leaderboard: [], poll: null, countdowns: [] };

    async function fetchData() {
      try {
        const r = await fetch("/api/engage-suite");
        if (r.ok) state = await r.json();
      } catch {}
    }

    await fetchData();

    function formatCountdown(targetDateStr) {
      const target = new Date(targetDateStr + "T09:00:00");
      const diff = target - new Date();
      if (isNaN(target.getTime())) return "Date Announced Soon";
      if (diff <= 0) return "🔥 Exam Day / Live Now!";
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      return `${days} Din, ${hrs} Ghante Baaki`;
    }

    function whatsappUrl(text) {
      return "https://api.whatsapp.com/send?text=" + encodeURIComponent(text + "\n\nCheck here: " + window.location.origin);
    }

    let userAnswers = {};
    let quizSubmitted = false;
    try {
      const savedQ = JSON.parse(localStorage.getItem(QUIZ_KEY) || "null");
      if (savedQ) { userAnswers = savedQ.answers || {}; quizSubmitted = true; }
    } catch {}

    function render() {
      const questions = (state.quiz && Array.isArray(state.quiz.questions)) ? state.quiz.questions : [];
      const leaders = Array.isArray(state.leaderboard) ? state.leaderboard : [];
      const poll = state.poll;
      const countdowns = Array.isArray(state.countdowns) ? state.countdowns : [];
      const hasVoted = localStorage.getItem(VOTE_KEY) === (poll && poll.id);

      let score = 0;
      if (quizSubmitted) {
        questions.forEach((q, idx) => {
          if (userAnswers[idx] === q.answerIndex) score++;
        });
      }

      const totalVotes = poll && Array.isArray(poll.options)
        ? poll.options.reduce((acc, o) => acc + (Number(o.votes) || 0), 0)
        : 0;

      mount.innerHTML = `
        <div style="max-width:1160px;margin:22px auto;padding:0 16px;">
          <!-- TOP EXAM COUNTDOWN RADAR -->
          ${countdowns.length ? `
            <div style="background:linear-gradient(120deg,#102b5c,#155eef);color:#fff;border-radius:18px;padding:18px 20px;margin-bottom:16px;box-shadow:0 12px 30px rgba(21,94,239,0.16);">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
                <div>
                  <span style="background:rgba(255,255,255,0.16);padding:4px 10px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.6px;">⏳ EXAM COUNTDOWN & ADMIT CARD RADAR</span>
                  <h3 style="margin:6px 0 0;font-size:19px;color:#fff;">Aane Wale Bade Exams Ki Taiyari Meter</h3>
                </div>
                <a href="${whatsappUrl("⏳ Sarkari Exam Countdown & Daily Quiz dekho Sarkari Job Universe par!")}" target="_blank" rel="noopener" style="background:#22c55e;color:#fff;text-decoration:none;padding:8px 14px;border-radius:10px;font-size:12px;font-weight:800;">📲 WhatsApp Share</a>
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;">
                ${countdowns.map(c => `
                  <div style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:13px;padding:13px;">
                    <div style="font-size:11px;color:#bfdbfe;font-weight:700;">📅 ${esc(c.examDate)} • ${esc(c.tag || "Upcoming")}</div>
                    <div style="font-size:15px;font-weight:800;margin:4px 0;">${esc(c.title)}</div>
                    <div style="font-size:13px;font-weight:800;color:#fde047;">⏳ ${formatCountdown(c.examDate)}</div>
                    ${c.link ? `<a href="${esc(c.link)}" target="_blank" rel="noopener" style="display:inline-block;margin-top:6px;font-size:11px;color:#fff;text-decoration:underline;font-weight:700;">Admit Card / Notice Link ↗</a>` : ""}
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <!-- MAIN 2-COLUMN DAILY ARENA: QUIZ + LEADERBOARD AND POLL + DEMAND BOX -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px;">
            
            <!-- 1. DAILY QUIZ CHALLENGE + TOPPERS LEADERBOARD -->
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:20px;box-shadow:0 10px 28px rgba(15,23,42,0.05);">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:11px;font-weight:800;color:#155eef;background:#edf4ff;padding:4px 10px;border-radius:999px;">🏆 DAILY QUIZ & LEADERBOARD</span>
                <span style="font-size:11px;color:#64748b;">${esc(TODAY)}</span>
              </div>
              <h3 style="margin:4px 0 6px;font-size:19px;color:#0f172a;">${esc((state.quiz && state.quiz.title) || "Aaj Ka Live Quiz Challenge")}</h3>
              <p style="margin:0 0 12px;font-size:13px;color:#64748b;">Sawal solve karein aur apna naam Toppers Board par darj karein!</p>

              ${questions.length ? `
                <div id="suiteQuizQuestions">
                  ${questions.map((q, qIdx) => `
                    <div style="border:1px solid #e5eaf2;border-radius:12px;padding:12px;margin-bottom:10px;background:#f8fafc;">
                      <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:7px;">Q${qIdx + 1}. ${esc(q.question)}</div>
                      <div style="display:grid;gap:5px;">
                        ${(q.options || []).map((opt, oIdx) => {
                          const selected = userAnswers[qIdx] === oIdx;
                          let bg = selected ? "#dbeafe" : "#fff";
                          let border = selected ? "#155eef" : "#dce5f1";
                          let color = "#1e293b";
                          if (quizSubmitted) {
                            if (oIdx === q.answerIndex) { bg = "#dcfce7"; border = "#16a34a"; color = "#14532d"; }
                            else if (selected) { bg = "#fee2e2"; border = "#dc2626"; color = "#7f1d1d"; }
                          }
                          return `<button type="button" data-sq="${qIdx}" data-so="${oIdx}" ${quizSubmitted ? "disabled" : ""} style="text-align:left;padding:8px 10px;border-radius:8px;border:1px solid ${border};background:${bg};color:${color};font-size:12px;font-weight:600;cursor:${quizSubmitted ? "default" : "pointer"};">${esc(opt)}</button>`;
                        }).join("")}
                      </div>
                      ${quizSubmitted && q.explanation ? `<div style="font-size:11px;color:#475569;margin-top:6px;">💡 ${esc(q.explanation)}</div>` : ""}
                    </div>
                  `).join("")}
                </div>

                ${!quizSubmitted ? `
                  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
                    <input id="suitePlayerName" maxlength="40" placeholder="Apna Naam likhein (Leaderboard ke liye)" style="flex:1;min-width:170px;padding:10px;border:1px solid #cbd5e1;border-radius:10px;font:inherit;font-size:13px;">
                    <input id="suitePlayerCity" maxlength="40" placeholder="District / State (e.g. Rajouri)" style="width:150px;padding:10px;border:1px solid #cbd5e1;border-radius:10px;font:inherit;font-size:13px;">
                    <button type="button" id="suiteSubmitQuiz" style="background:#155eef;color:#fff;border:0;padding:10px 16px;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;">Submit Score 🏆</button>
                  </div>
                ` : `
                  <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:12px;margin-top:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div style="font-size:13px;font-weight:800;color:#14532d;">🎉 Aapka Score: ${score} / ${questions.length}</div>
                    <a href="${whatsappUrl(`🏆 Maine aaj ke Sarkari Job Universe Daily Quiz mein ${score}/${questions.length} score kiya! Tum bhi try karo:`)}" target="_blank" rel="noopener" style="background:#16a34a;color:#fff;text-decoration:none;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;">📲 Score WhatsApp Par Bhejein</a>
                  </div>
                `}
              ` : `<p style="font-size:13px;color:#64748b;">Aaj ka quiz jald hi upload hoga.</p>`}

              <!-- TOPPERS BOARD -->
              <div style="margin-top:16px;border-top:1px solid #e2e8f0;padding-top:12px;">
                <div style="font-size:12px;font-weight:800;color:#0f172a;margin-bottom:8px;">🥇 Today's Toppers Board</div>
                ${leaders.length ? leaders.slice(0, 5).map((l, idx) => `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-radius:9px;background:${idx === 0 ? "#fef9c3" : "#f8fafc"};margin-bottom:5px;font-size:12px;">
                    <span><b>#${idx + 1} ${esc(l.name)}</b> ${l.city ? `<small style="color:#64748b;">(${esc(l.city)})</small>` : ""}</span>
                    <span style="font-weight:800;color:#155eef;">${l.score}/${l.total}</span>
                  </div>
                `).join("") : `<p style="font-size:12px;color:#64748b;margin:0;">Pehle participant banein aur #1 rank hasil karein!</p>`}
              </div>
            </div>

            <!-- 2. DAILY STUDENT POLL + DEMAND / DOUBT BOX -->
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:20px;box-shadow:0 10px 28px rgba(15,23,42,0.05);display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
                  <span style="font-size:11px;font-weight:800;color:#7c3aed;background:#f3e8ff;padding:4px 10px;border-radius:999px;">🗳️ STUDENT POLL & REQUEST BOX</span>
                  <span style="font-size:11px;color:#64748b;">${totalVotes} Votes</span>
                </div>
                ${poll ? `
                  <h3 style="margin:4px 0 10px;font-size:18px;color:#0f172a;">${esc(poll.question)}</h3>
                  <div style="display:grid;gap:8px;">
                    ${(poll.options || []).map((opt, idx) => {
                      const pct = totalVotes > 0 ? Math.round(((Number(opt.votes) || 0) / totalVotes) * 100) : 0;
                      return `
                        <button type="button" data-poll-opt="${idx}" ${hasVoted ? "disabled" : ""} style="position:relative;overflow:hidden;text-align:left;padding:10px 12px;border-radius:10px;border:1px solid #dce5f1;background:#f8fafc;cursor:${hasVoted ? "default" : "pointer"};">
                          <div style="position:absolute;left:0;top:0;bottom:0;width:${hasVoted ? pct : 0}%;background:#e0e7ff;transition:width .3s;"></div>
                          <div style="position:relative;display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:#1e293b;">
                            <span>${esc(opt.label)}</span>
                            ${hasVoted ? `<span>${pct}% (${opt.votes || 0})</span>` : `<span style="color:#155eef;font-size:11px;">Vote →</span>`}
                          </div>
                        </button>
                      `;
                    }).join("")}
                  </div>
                ` : ""}
              </div>

              <!-- STUDENT DEMAND / PAPER REQUEST BOX -->
              <div style="margin-top:18px;border-top:1px solid #e2e8f0;padding-top:14px;">
                <h4 style="margin:0 0 6px;font-size:15px;color:#0f172a;">📩 Apni Demand / PDF Request Bhejein</h4>
                <p style="margin:0 0 10px;font-size:12px;color:#64748b;">Kis exam ka PDF paper, mock test ya job update chahiye? Seedha Admin ko bhejein:</p>
                <form id="suiteDemandForm" style="display:grid;gap:8px;">
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <input id="demandName" maxlength="50" placeholder="Aapka Naam" style="flex:1;min-width:130px;padding:9px 11px;border:1px solid #cbd5e1;border-radius:9px;font:inherit;font-size:13px;">
                    <select id="demandExam" style="padding:9px 11px;border:1px solid #cbd5e1;border-radius:9px;font:inherit;font-size:13px;">
                      <option>JKSSB</option>
                      <option>SSC GD / CHSL</option>
                      <option>Army GD / Defence</option>
                      <option>Railway RRB</option>
                      <option>Other Exam</option>
                    </select>
                  </div>
                  <input id="demandText" required maxlength="300" placeholder="e.g. JKSSB Constable ka naya model paper PDF upload karein..." style="padding:9px 11px;border:1px solid #cbd5e1;border-radius:9px;font:inherit;font-size:13px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                    <button type="submit" style="background:#0f2957;color:#fff;border:0;padding:9px 15px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;">Admin Ko Bhejein →</button>
                    <span id="demandMsg" style="font-size:12px;color:#16a34a;font-weight:700;"></span>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      `;

      // Bind Quiz options
      mount.querySelectorAll("button[data-sq]").forEach(btn => {
        btn.addEventListener("click", () => {
          if (quizSubmitted) return;
          const qIdx = Number(btn.getAttribute("data-sq"));
          const oIdx = Number(btn.getAttribute("data-so"));
          userAnswers[qIdx] = oIdx;
          render();
        });
      });

      // Bind Quiz submit
      const subBtn = document.getElementById("suiteSubmitQuiz");
      if (subBtn) {
        subBtn.addEventListener("click", async () => {
          if (Object.keys(userAnswers).length < questions.length) {
            alert("Kripya pehle sabhi sawalon ke jawab chunein!");
            return;
          }
          const nameInput = document.getElementById("suitePlayerName");
          const cityInput = document.getElementById("suitePlayerCity");
          const playerName = (nameInput && nameInput.value.trim()) || "Student";
          const playerCity = (cityInput && cityInput.value.trim()) || "";
          let sc = 0;
          questions.forEach((q, idx) => { if (userAnswers[idx] === q.answerIndex) sc++; });
          quizSubmitted = true;
          try {
            localStorage.setItem(QUIZ_KEY, JSON.stringify({ answers: userAnswers, score: sc }));
            const r = await fetch("/api/engage-suite/quiz-score", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: playerName, city: playerCity, score: sc, total: questions.length })
            });
            if (r.ok) {
              const d = await r.json();
              state.leaderboard = d.leaderboard || state.leaderboard;
            }
          } catch {}
          render();
        });
      }

      // Bind Poll vote
      mount.querySelectorAll("button[data-poll-opt]").forEach(btn => {
        btn.addEventListener("click", async () => {
          if (!poll || hasVoted) return;
          const optIdx = Number(btn.getAttribute("data-poll-opt"));
          localStorage.setItem(VOTE_KEY, poll.id);
          try {
            const r = await fetch("/api/engage-suite/poll-vote", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ optionIndex: optIdx })
            });
            if (r.ok) {
              const d = await r.json();
              state.poll = d.poll || state.poll;
            }
          } catch {}
          render();
        });
      });

      // Bind Student Demand Form
      const dForm = document.getElementById("suiteDemandForm");
      if (dForm) {
        dForm.addEventListener("submit", async e => {
          e.preventDefault();
          const msgEl = document.getElementById("demandMsg");
          const name = document.getElementById("demandName").value.trim() || "Student";
          const exam = document.getElementById("demandExam").value;
          const message = document.getElementById("demandText").value.trim();
          if (!message) return;
          try {
            const r = await fetch("/api/engage-suite/demand", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, exam, message })
            });
            if (r.ok) {
              dForm.reset();
              if (msgEl) msgEl.textContent = "✅ Request Admin ko bhej di gayi!";
            }
          } catch {}
        });
      }
    }

    render();
  }

  // Also add 1-click WhatsApp share buttons automatically to rendered Job Cards without modifying app.js
  function attachWhatsAppToJobCards() {
    const grid = document.getElementById("jobGrid");
    if (!grid) return;
    const inject = () => {
      grid.querySelectorAll(".job-card").forEach(card => {
        if (card.querySelector(".wa-share-btn")) return;
        const titleEl = card.querySelector("h3");
        const title = titleEl ? titleEl.textContent.trim() : "Sarkari Job Update";
        const bottom = card.querySelector(".card-bottom") || card;
        const a = document.createElement("a");
        a.className = "wa-share-btn";
        a.href = "https://api.whatsapp.com/send?text=" + encodeURIComponent("📢 " + title + "\nDetails dekhein: " + window.location.origin);
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = "📲 Share";
        a.style.cssText = "background:#dcfce7;color:#15803d;padding:8px 11px;border-radius:9px;font-size:12px;font-weight:800;text-decoration:none;";
        bottom.appendChild(a);
      });
    };
    inject();
    const obs = new MutationObserver(inject);
    obs.observe(grid, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { initSuite(); attachWhatsAppToJobCards(); });
  } else {
    initSuite();
    attachWhatsAppToJobCards();
  }
})();
