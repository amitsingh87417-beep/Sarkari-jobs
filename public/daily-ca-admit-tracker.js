(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function safeUrl(u) {
    try {
      const parsed = new URL(u);
      return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : "#";
    } catch {
      return "#";
    }
  }

  function buildSimplePdf(lines) {
    const encoder = new TextEncoder();
    const parts = [];
    let offset = 0;
    const offsets = [0];
    function pushBytes(u8) { parts.push(u8); offset += u8.length; }
    function pushStr(s) { pushBytes(encoder.encode(s)); }
    function pdfEsc(s) {
      return String(s || "").replace(/[^ -~]/g, " ").replace(/\/g, "\").replace(/\(/g, "\(").replace(/\)/g, "\)");
    }

    const perPage = 46;
    const pages = [];
    for (let i = 0; i < lines.length; i += perPage) pages.push(lines.slice(i, i + perPage));
    if (!pages.length) pages.push(["Sarkari Job Universe Notes"]);

    pushStr("%PDF-1.4
");
    let nextId = 4;
    const pageObjs = pages.map(l => ({ pId: nextId++, cId: nextId++, lines: l }));
    const totalObjs = nextId - 1;

    offsets[1] = offset;
    pushStr("1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
");
    offsets[2] = offset;
    pushStr(`2 0 obj
<< /Type /Pages /Kids [ ${pageObjs.map(p => `${p.pId} 0 R`).join(" ")} ] /Count ${pageObjs.length} >>
endobj
`);
    offsets[3] = offset;
    pushStr("3 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
");

    for (const po of pageObjs) {
      offsets[po.pId] = offset;
      pushStr(`${po.pId} 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${po.cId} 0 R >>
endobj
`);
      let st = "BT
/F1 10 Tf
40 800 Td
16 TL
";
      po.lines.forEach((ln, i) => {
        const clean = pdfEsc(ln).slice(0, 96);
        st += (i === 0 ? `(${clean}) Tj
` : `T* (${clean}) Tj
`);
      });
      st += "ET
";
      const sb = encoder.encode(st);
      offsets[po.cId] = offset;
      pushStr(`${po.cId} 0 obj
<< /Length ${sb.length} >>
stream
`);
      pushBytes(sb);
      pushStr("
endstream
endobj
");
    }

    const xrefPos = offset;
    pushStr(`xref
0 ${totalObjs + 1}
0000000000 65535 f 
`);
    for (let i = 1; i <= totalObjs; i++) pushStr(`${String(offsets[i]).padStart(10, "0")} 00000 n 
`);
    pushStr(`trailer
<< /Size ${totalObjs + 1} /Root 1 0 R >>
startxref
${xrefPos}
%%EOF`);
    return new Blob(parts, { type: "application/pdf" });
  }

  const TRACKER_KEY = "sju_admit_result_tracker_v1";

  function loadTrackedItems() {
    try {
      const saved = JSON.parse(localStorage.getItem(TRACKER_KEY) || "null");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    return [
      { id: "def-1", exam: "SSC GD / CHSL / MTS", stage: "Form / Notice Check", dateInfo: "Check official schedule", portal: "https://ssc.gov.in/" },
      { id: "def-2", exam: "JKSSB Recruitment & Admit Cards", stage: "Admit Card / Notice", dateInfo: "Verify on jkssb.nic.in", portal: "https://jkssb.nic.in/" },
      { id: "def-3", exam: "Railway RRB / Indian Army", stage: "Result / Exam Update", dateInfo: "Verify on official portal", portal: "https://www.rrbcdg.gov.in/" }
    ];
  }

  function saveTrackedItems(arr) {
    try { localStorage.setItem(TRACKER_KEY, JSON.stringify(arr)); } catch {}
  }

  async function initSuite() {
    const mount = document.getElementById("daily-ca-admit-suite");
    if (!mount) return;

    let bank = [];
    try {
      const r = await fetch("/data/practice-question-bank.json");
      if (r.ok) bank = await r.json();
    } catch {}
    if (!Array.isArray(bank) || !bank.length) {
      bank = [{ category: "GK", question: "Which Article guarantees equality before law?", options: ["Article 14", "Article 19", "Article 21", "Article 32"], answer: 0, explanation: "Article 14 guarantees equality before law." }];
    }

    let caItems = [];
    try {
      const r = await fetch("/api/current-affairs");
      if (r.ok) {
        const d = await r.json();
        if (Array.isArray(d.items)) caItems = d.items;
      }
    } catch {}

    const categories = ["ALL", ...Array.from(new Set(bank.map(q => q.category).filter(Boolean)))];
    let selectedCat = "ALL";
    let quizSet = [];
    let userAns = {};
    let submitted = false;
    let tracked = loadTrackedItems();
    let stageFilter = "ALL";
    let lastPdfUrl = null;

    function pickQuiz(cat) {
      const pool = (cat && cat !== "ALL")
        ? bank.filter(q => String(q.category || "").toLowerCase() === cat.toLowerCase())
        : bank.slice();
      const src = pool.length ? pool : bank.slice();
      return src.slice().sort(() => Math.random() - 0.5).slice(0, 6);
    }

    quizSet = pickQuiz(selectedCat);

    function render() {
      let score = 0;
      const wrongTopics = [];
      if (submitted) {
        quizSet.forEach((q, idx) => {
          if (userAns[idx] === q.answer) score++;
          else wrongTopics.push(q.category || "GK");
        });
      }

      const filteredTracked = tracked.filter(item => stageFilter === "ALL" || item.stage === stageFilter);

      mount.innerHTML = `
        <section style="max-width:1160px;margin:24px auto;padding:0 16px;" id="ca-quiz-admit-tracker">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">

            <!-- #1: DAILY CURRENT AFFAIRS & STATIC GK QUIZ -->
            <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:20px;padding:20px;box-shadow:0 12px 30px rgba(15,41,87,0.06);">
              <span style="background:#eff6ff;color:#1d4ed8;font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;">#1 • DAILY CURRENT AFFAIRS &amp; STATIC GK QUIZ</span>
              <h3 style="margin:6px 0 6px;font-size:19px;color:#0f172a;">Daily GK &amp; Topic Quiz + Quick Revision</h3>
              <p style="margin:0 0 10px;font-size:12px;color:#64748b;">Subject chunein, 6 sawal solve karein, weak topic dekhein aur current affairs/quiz ka PDF download karein.</p>

              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
                <select id="dczCatSelect" style="flex:1;min-width:150px;padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#f8fafc;font-size:12px;font-weight:700;">
                  ${categories.map(c => `<option value="${esc(c)}" ${selectedCat === c ? "selected" : ""}>${c === "ALL" ? "All Subjects (Mixed)" : esc(c)}</option>`).join("")}
                </select>
                <button type="button" id="dczNewQuizBtn" style="background:#155eef;color:#fff;border:0;padding:8px 12px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">New Quiz &#8635;</button>
                <button type="button" id="dczPdfBtn" style="background:#059669;color:#fff;border:0;padding:8px 12px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">Export PDF</button>
                <a id="dczPdfLink" style="display:none;background:#16a34a;color:#fff;text-decoration:none;padding:8px 10px;border-radius:9px;font-size:12px;font-weight:800;">Save PDF</a>
              </div>

              ${submitted ? `
                <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:11px;padding:10px 12px;margin-bottom:10px;font-size:12px;color:#14532d;">
                  <b>Score: ${score} / ${quizSet.length}</b> (${Math.round((score / Math.max(1, quizSet.length)) * 100)}%)
                  ${wrongTopics.length ? `<br><b>Weak Topics to Revise:</b> ${esc([...new Set(wrongTopics)].join(", "))}` : "<br><b>Great accuracy! Sabhi sawal sahi hue.</b>"}
                </div>
              ` : ""}

              <div style="display:grid;gap:8px;max-height:340px;overflow-y:auto;padding-right:3px;">
                ${quizSet.map((q, qi) => `
                  <div style="border:1px solid #e2e8f0;background:#f8fafc;border-radius:11px;padding:10px;">
                    <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:6px;">Q${qi + 1}. [${esc(q.category || "GK")}] ${esc(q.question)}</div>
                    <div style="display:grid;gap:4px;">
                      ${(q.options || []).map((opt, oi) => {
                        const ch = userAns[qi] === oi;
                        let bg = ch ? "#dbeafe" : "#fff";
                        let brd = ch ? "#155eef" : "#cbd5e1";
                        if (submitted) {
                          if (oi === q.answer) { bg = "#dcfce7"; brd = "#16a34a"; }
                          else if (ch) { bg = "#fee2e2"; brd = "#dc2626"; }
                        }
                        return `<button type="button" data-dcz-q="${qi}" data-dcz-o="${oi}" ${submitted ? "disabled" : ""} style="text-align:left;padding:6px 9px;border-radius:7px;border:1px solid ${brd};background:${bg};font-size:11px;font-weight:600;color:#0f172a;cursor:${submitted ? "default" : "pointer"};">${String.fromCharCode(65 + oi)}. ${esc(opt)}</button>`;
                      }).join("")}
                    </div>
                    ${submitted && q.explanation ? `<div style="font-size:11px;color:#334155;margin-top:5px;">Note: ${esc(q.explanation)}</div>` : ""}
                  </div>
                `).join("")}
              </div>

              ${!submitted ? `
                <button type="button" id="dczSubmitBtn" style="margin-top:10px;width:100%;background:#16a34a;color:#fff;border:0;padding:9px 14px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;">Submit Quiz &amp; Check Explanations</button>
              ` : ""}
            </div>

            <!-- #2: ADMIT CARD & RESULT QUICK TRACKER -->
            <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:20px;padding:20px;box-shadow:0 12px 30px rgba(15,41,87,0.06);display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <span style="background:#fef3c7;color:#b45309;font-size:10px;font-weight:800;padding:4px 10px;border-radius:999px;">#2 • ADMIT CARD &amp; RESULT QUICK TRACKER</span>
                <h3 style="margin:6px 0 6px;font-size:19px;color:#0f172a;">Form, Admit Card &amp; Result Status Tracker</h3>
                <p style="margin:0 0 10px;font-size:12px;color:#64748b;">Apne exams ka stage track karein aur har update ko official portal par verify karein.</p>

                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
                  ${["ALL", "Form / Notice Check", "Admit Card / Notice", "Result / Exam Update"].map(st => `
                    <button type="button" data-trk-f="${esc(st)}" style="padding:5px 10px;border-radius:999px;border:1px solid ${stageFilter === st ? "#155eef" : "#cbd5e1"};background:${stageFilter === st ? "#155eef" : "#f8fafc"};color:${stageFilter === st ? "#fff" : "#334155"};font-size:11px;font-weight:700;cursor:pointer;">${st === "ALL" ? "All Stages" : esc(st)}</button>
                  `).join("")}
                </div>

                <div style="display:grid;gap:8px;max-height:220px;overflow-y:auto;margin-bottom:12px;">
                  ${filteredTracked.map(item => `
                    <div style="border:1px solid #e2e8f0;background:#f8fafc;border-radius:11px;padding:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
                      <div>
                        <div style="font-size:12px;font-weight:800;color:#0f172a;">${esc(item.exam)}</div>
                        <div style="font-size:11px;color:#475569;margin-top:2px;">
                          <span style="background:#dbeafe;color:#1d4ed8;padding:2px 7px;border-radius:6px;font-weight:700;">${esc(item.stage)}</span>
                          &bull; ${esc(item.dateInfo || "Verify official site")}
                        </div>
                      </div>
                      <div style="display:flex;gap:6px;align-items:center;">
                        <a href="${esc(safeUrl(item.portal))}" target="_blank" rel="noopener" style="background:#eff6ff;color:#155eef;padding:5px 8px;border-radius:7px;font-size:11px;font-weight:800;text-decoration:none;">Portal &#8599;</a>
                        <button type="button" data-trk-del="${esc(item.id)}" style="border:0;background:#fee2e2;color:#b91c1c;border-radius:6px;padding:5px 7px;font-size:11px;font-weight:800;cursor:pointer;">&#10005;</button>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>

              <form id="trkAddForm" style="border-top:1px solid #e2e8f0;padding-top:10px;display:grid;gap:7px;">
                <div style="font-size:12px;font-weight:800;color:#0f172a;">+ Add Exam / Admit Card / Result Item</div>
                <input id="trkExamInp" required maxlength="90" placeholder="e.g. JKSSB / SSC Exam Name" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                  <select id="trkStageSel" style="padding:8px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#fff;">
                    <option>Form / Notice Check</option>
                    <option>Admit Card / Notice</option>
                    <option>Result / Exam Update</option>
                  </select>
                  <input id="trkDateInp" placeholder="Date / Status note" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;">
                </div>
                <input id="trkUrlInp" type="url" placeholder="Official portal URL (https://...)" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;">
                <button type="submit" style="background:#0f2957;color:#fff;border:0;padding:8px 12px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">Save to Tracker</button>
              </form>
            </div>

          </div>
        </section>
      `;

      document.getElementById("dczCatSelect").addEventListener("change", e => {
        selectedCat = e.target.value;
        userAns = {};
        submitted = false;
        quizSet = pickQuiz(selectedCat);
        render();
      });

      document.getElementById("dczNewQuizBtn").addEventListener("click", () => {
        userAns = {};
        submitted = false;
        quizSet = pickQuiz(selectedCat);
        render();
      });

      mount.querySelectorAll("button[data-dcz-q]").forEach(btn => {
        btn.addEventListener("click", () => {
          if (submitted) return;
          userAns[Number(btn.dataset.dczQ)] = Number(btn.dataset.dczO);
          render();
        });
      });

      const subBtn = document.getElementById("dczSubmitBtn");
      if (subBtn) {
        subBtn.addEventListener("click", () => {
          submitted = true;
          render();
        });
      }

      document.getElementById("dczPdfBtn").addEventListener("click", () => {
        const lines = [
          "SARKARI JOB UNIVERSE - DAILY CURRENT AFFAIRS & QUIZ REVISION",
          `Category: ${selectedCat} | Date: ${new Date().toISOString().slice(0, 10)}`,
          "--------------------------------------------------------------------"
        ];
        caItems.slice(0, 8).forEach((c, idx) => {
          lines.push(`CA ${idx + 1}. [${c.date || ""}] ${c.title || ""}`);
          lines.push(`   ${c.summary || ""}`);
        });
        lines.push("--------------------------------------------------------------------");
        lines.push("PRACTICE QUIZ QUESTIONS & ANSWERS:");
        quizSet.forEach((q, idx) => {
          const ansTxt = (q.options && q.options[q.answer]) ? q.options[q.answer] : "";
          lines.push(`Q${idx + 1}. ${q.question}`);
          lines.push(`   Answer: ${ansTxt} | ${q.explanation || ""}`);
        });
        const blob = buildSimplePdf(lines);
        if (lastPdfUrl) URL.revokeObjectURL(lastPdfUrl);
        lastPdfUrl = URL.createObjectURL(blob);
        const a = document.getElementById("dczPdfLink");
        a.href = lastPdfUrl;
        a.download = "sarkari-current-affairs-quiz.pdf";
        a.style.display = "inline-block";
      });

      mount.querySelectorAll("button[data-trk-f]").forEach(btn => {
        btn.addEventListener("click", () => {
          stageFilter = btn.dataset.trkF;
          render();
        });
      });

      mount.querySelectorAll("button[data-trk-del]").forEach(btn => {
        btn.addEventListener("click", () => {
          tracked = tracked.filter(x => x.id !== btn.dataset.trkDel);
          saveTrackedItems(tracked);
          render();
        });
      });

      document.getElementById("trkAddForm").addEventListener("submit", e => {
        e.preventDefault();
        const ex = document.getElementById("trkExamInp").value.trim();
        if (!ex) return;
        tracked.unshift({
          id: "trk-" + Date.now(),
          exam: ex,
          stage: document.getElementById("trkStageSel").value,
          dateInfo: document.getElementById("trkDateInp").value.trim() || "Verify on official site",
          portal: document.getElementById("trkUrlInp").value.trim() || "https://ssc.gov.in/"
        });
        saveTrackedItems(tracked);
        render();
      });
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSuite);
  } else {
    initSuite();
  }
})();
