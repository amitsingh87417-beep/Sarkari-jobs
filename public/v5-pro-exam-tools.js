(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const SYLLABUS_DATA = {
    ssc_gd: {
      name: "SSC GD Constable",
      qual: "10th Pass",
      pattern: "80 Questions • 160 Marks • 60 Minutes • Negative Marking: 0.25 / 0.50 as per notice",
      subjects: "General Intelligence & Reasoning (20 Q), General Knowledge & Awareness (20 Q), Elementary Mathematics (20 Q), English / Hindi (20 Q)"
    },
    ssc_chsl: {
      name: "SSC CHSL (10+2)",
      qual: "12th Pass",
      pattern: "Tier-1: 100 Questions • 200 Marks • 60 Minutes • Negative Marking: 0.50 per wrong answer",
      subjects: "English Language (25 Q), General Intelligence (25 Q), Quantitative Aptitude (25 Q), General Awareness (25 Q)"
    },
    jkssb: {
      name: "JKSSB Class-IV / MTS / Constable / Junior Assistant",
      qual: "10th / 12th / Graduate (Post-wise)",
      pattern: "100–120 Objective MCQs • 2 Hours • Negative Marking: 0.25 per wrong answer",
      subjects: "General English, General Awareness with special reference to J&K UT, Numerical & Reasoning Ability, Basic Science / Computer"
    },
    army_gd: {
      name: "Indian Army Agniveer GD / Tradesman",
      qual: "8th / 10th Pass",
      pattern: "50 Questions • 100 Marks • 60 Minutes • Negative Marking: 0.50 per wrong answer",
      subjects: "General Knowledge (15 Q), General Science (15 Q), Mathematics (15 Q), Logical Reasoning (5 Q)"
    },
    railway: {
      name: "Railway RRB NTPC / Group D",
      qual: "10th / ITI / 12th / Graduate",
      pattern: "CBT-1: 100 Questions • 100 Marks • 90 Minutes • Negative Marking: 1/3rd (0.33)",
      subjects: "Mathematics, General Intelligence & Reasoning, General Science & General Awareness"
    }
  };

  function initV5Suite() {
    const mount = document.getElementById("v5-pro-exam-suite");
    if (!mount) return;

    let omrCount = 20;
    let omrAnswers = {}; // qNum -> 'A'|'B'|'C'|'D'
    let omrKeys = {};    // qNum -> 'A'|'B'|'C'|'D'

    mount.innerHTML = `
      <div style="max-width:1160px;margin:22px auto;padding:0 16px;">
        <div style="background:linear-gradient(180deg,#ffffff 0%,#f8fafc 100%);border:1px solid #cbd5e1;border-radius:22px;padding:22px;box-shadow:0 14px 34px rgba(15,41,87,0.08);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
            <div>
              <span style="background:#0f2957;color:#fff;font-size:11px;font-weight:800;padding:4px 11px;border-radius:999px;letter-spacing:.6px;">🚀 v5.0 COMPLETE EDITION • OMR, SYLLABUS & QUALIFICATION MATCHER</span>
              <h3 style="margin:6px 0 4px;font-size:21px;color:#0f172a;">Digital OMR Evaluator, Exam Syllabus & Qualification Matcher</h3>
              <p style="margin:0;font-size:13px;color:#64748b;">PDF paper solve karte waqt digital OMR sheet bharein, negative marking ke saath exact score nikaalein, exam syllabus dekhein aur apni qualification ke hisaab se bharti khojein.</p>
            </div>
            <button type="button" id="v5PrintReportBtn" style="background:#0f2957;color:#fff;border:0;padding:10px 15px;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;">🖨️ Print / Save Study Summary</button>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px;">
            <!-- 1. DIGITAL OMR SHEET + NEGATIVE MARKING CALCULATOR -->
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;">
              <div style="font-size:11px;font-weight:800;color:#155eef;margin-bottom:4px;">📝 DIGITAL OMR SHEET & SCORE EVALUATOR</div>
              <h4 style="margin:0 0 8px;font-size:17px;color:#0f172a;">PDF Paper Ke Liye Live OMR & Negative Marking</h4>
              <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
                <select id="omrQCount" style="padding:7px 9px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#f8fafc;">
                  <option value="10">10 Questions</option>
                  <option value="20" selected>20 Questions</option>
                  <option value="50">50 Questions</option>
                  <option value="100">100 Questions</option>
                </select>
                <select id="omrNegMark" style="padding:7px 9px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#f8fafc;">
                  <option value="0">No Negative Marking (0)</option>
                  <option value="0.25" selected>-0.25 Negative (SSC/JKSSB)</option>
                  <option value="0.33">-0.33 Negative (Railway 1/3)</option>
                  <option value="0.50">-0.50 Negative (Army/CHSL)</option>
                </select>
                <input id="omrMarksPerQ" type="number" step="0.5" min="0.5" max="10" value="1" title="Marks per correct question" style="width:72px;padding:7px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#f8fafc;">
              </div>
              <div style="font-size:11px;color:#64748b;margin-bottom:6px;">Left side: <b>Apna Answer (A/B/C/D)</b> • Right side: <b>Answer Key (Sahi Jawab)</b></div>
              <div id="omrGridBox" style="max-height:240px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:10px;padding:8px;background:#f8fafc;display:grid;gap:5px;"></div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
                <button type="button" id="omrCalcScoreBtn" style="background:#16a34a;color:#fff;border:0;padding:9px 14px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">✓ Calculate Net Score</button>
                <button type="button" id="omrClearBtn" style="background:#e2e8f0;color:#1e293b;border:0;padding:9px 12px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">Reset OMR</button>
              </div>
              <div id="omrResultBox" style="margin-top:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:9px;padding:9px;font-size:12px;color:#14532d;">OMR bubbles chunein aur Net Score check karein.</div>
            </div>

            <!-- 2. EXAM SYLLABUS & QUALIFICATION MATCHER -->
            <div style="display:grid;gap:14px;">
              <!-- SYLLABUS CARD -->
              <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;">
                <div style="font-size:11px;font-weight:800;color:#7c3aed;margin-bottom:4px;">📖 EXAM SYLLABUS & PATTERN GUIDE</div>
                <h4 style="margin:0 0 8px;font-size:17px;color:#0f172a;">Exam Chunein & Pattern Dekhein</h4>
                <select id="v5SyllabusSelect" style="width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;font-size:13px;background:#f8fafc;margin-bottom:10px;">
                  <option value="ssc_gd">SSC GD Constable (10th Pass)</option>
                  <option value="ssc_chsl">SSC CHSL 10+2 (12th Pass)</option>
                  <option value="jkssb">JKSSB Class-IV / MTS / Constable</option>
                  <option value="army_gd">Indian Army Agniveer GD / Tradesman</option>
                  <option value="railway">Railway RRB NTPC / Group D</option>
                </select>
                <div id="v5SyllabusBox" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:11px;padding:12px;font-size:12px;color:#1e293b;line-height:1.6;"></div>
              </div>

              <!-- QUALIFICATION MATCHER -->
              <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px;">
                <div style="font-size:11px;font-weight:800;color:#d97706;margin-bottom:4px;">🎯 QUALIFICATION MATCHER</div>
                <h4 style="margin:0 0 8px;font-size:17px;color:#0f172a;">Apni Qualification Ke Hisaab Se Bharti Khojein</h4>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
                  <button type="button" data-qual="10th" class="v5-qual-btn" style="padding:7px 11px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;font-size:12px;font-weight:800;cursor:pointer;">10th Pass</button>
                  <button type="button" data-qual="12th" class="v5-qual-btn" style="padding:7px 11px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;font-size:12px;font-weight:800;cursor:pointer;">12th Pass</button>
                  <button type="button" data-qual="ITI" class="v5-qual-btn" style="padding:7px 11px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;font-size:12px;font-weight:800;cursor:pointer;">ITI Trade</button>
                  <button type="button" data-qual="Diploma" class="v5-qual-btn" style="padding:7px 11px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;font-size:12px;font-weight:800;cursor:pointer;">Diploma</button>
                  <button type="button" data-qual="Graduate" class="v5-qual-btn" style="padding:7px 11px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;font-size:12px;font-weight:800;cursor:pointer;">Graduate</button>
                </div>
                <div id="v5QualOutput" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px;font-size:12px;color:#78350f;line-height:1.6;">
                  Apni qualification button par click karein — recommended exams aur seedha job search filter khul jayega.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render OMR Rows
    function renderOmr() {
      const box = document.getElementById("omrGridBox");
      const opts = ["A", "B", "C", "D"];
      let html = "";
      for (let i = 1; i <= omrCount; i++) {
        const uAns = omrAnswers[i] || "";
        const kAns = omrKeys[i] || "";
        html += `
          <div style="display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid #e2e8f0;border-radius:7px;padding:4px 8px;font-size:11px;">
            <span style="font-weight:800;width:32px;color:#0f172a;">Q${i}</span>
            <div style="display:flex;gap:3px;">
              ${opts.map(o => `<button type="button" data-omr-u="${i}" data-val="${o}" style="width:24px;height:22px;border-radius:5px;border:1px solid ${uAns === o ? "#155eef" : "#cbd5e1"};background:${uAns === o ? "#155eef" : "#fff"};color:${uAns === o ? "#fff" : "#334155"};font-weight:800;font-size:10px;cursor:pointer;">${o}</button>`).join("")}
            </div>
            <select data-omr-k="${i}" style="padding:2px 4px;border:1px solid #cbd5e1;border-radius:5px;font-size:11px;background:#f8fafc;">
              <option value="">Key</option>
              ${opts.map(o => `<option value="${o}" ${kAns === o ? "selected" : ""}>${o}</option>`).join("")}
            </select>
          </div>
        `;
      }
      box.innerHTML = html;

      box.querySelectorAll("button[data-omr-u]").forEach(btn => {
        btn.addEventListener("click", () => {
          const qn = Number(btn.dataset.omrU);
          const val = btn.dataset.val;
          omrAnswers[qn] = (omrAnswers[qn] === val) ? "" : val;
          renderOmr();
        });
      });

      box.querySelectorAll("select[data-omr-k]").forEach(sel => {
        sel.addEventListener("change", () => {
          omrKeys[Number(sel.dataset.omrK)] = sel.value;
        });
      });
    }

    document.getElementById("omrQCount").addEventListener("change", e => {
      omrCount = Number(e.target.value) || 20;
      renderOmr();
    });

    document.getElementById("omrClearBtn").addEventListener("click", () => {
      omrAnswers = {};
      omrKeys = {};
      renderOmr();
      document.getElementById("omrResultBox").textContent = "OMR reset ho gayi hai.";
    });

    document.getElementById("omrCalcScoreBtn").addEventListener("click", () => {
      const neg = Number(document.getElementById("omrNegMark").value) || 0;
      const pos = Number(document.getElementById("omrMarksPerQ").value) || 1;
      let attempted = 0, correct = 0, wrong = 0, unattempted = 0;

      for (let i = 1; i <= omrCount; i++) {
        const u = omrAnswers[i];
        const k = omrKeys[i];
        if (!u) {
          unattempted++;
        } else {
          attempted++;
          if (k) {
            if (u === k) correct++;
            else wrong++;
          }
        }
      }
      const hasKeys = Object.values(omrKeys).some(Boolean);
      if (!hasKeys) {
        document.getElementById("omrResultBox").innerHTML = `Attempted: <b>${attempted}</b> / ${omrCount}. Sahi score ke liye har question ke saamne <b>Key (A/B/C/D)</b> bhi select karein.`;
        return;
      }
      const net = (correct * pos) - (wrong * neg);
      document.getElementById("omrResultBox").innerHTML = `
        ✅ Correct: <b>${correct}</b> • ❌ Wrong: <b>${wrong}</b> • ⚪ Blank: <b>${unattempted}</b><br>
        🏆 <b>Net Score: ${net.toFixed(2)} Marks</b> (Negative: -${neg}/wrong)
      `;
    });

    // Syllabus selector
    function renderSyllabus() {
      const key = document.getElementById("v5SyllabusSelect").value;
      const item = SYLLABUS_DATA[key] || SYLLABUS_DATA.ssc_gd;
      document.getElementById("v5SyllabusBox").innerHTML = `
        <div><b>Exam:</b> ${esc(item.name)}</div>
        <div><b>Eligibility:</b> ${esc(item.qual)}</div>
        <div style="margin-top:4px;"><b>Pattern:</b> ${esc(item.pattern)}</div>
        <div style="margin-top:4px;"><b>Subjects:</b> ${esc(item.subjects)}</div>
      `;
    }
    document.getElementById("v5SyllabusSelect").addEventListener("change", renderSyllabus);
    renderSyllabus();

    // Qualification matcher
    const QUAL_MAP = {
      "10th": "SSC GD Constable, SSC MTS, Railway Group D, Army Agniveer GD, JKSSB Class-IV / MTS, India Post GDS",
      "12th": "SSC CHSL (LDC/DEO), SSC Stenographer, JKSSB Junior Assistant / Constable, Army Clerk / Technical, RRB NTPC (12th)",
      "ITI": "Railway ALP & Technician, DRDO / ISRO Technician, Army Tradesman, Power / Jal Shakti ITI Posts",
      "Diploma": "SSC JE, RRB JE, JKSSB Junior Engineer, State Polytechnic & PSU Technical Posts",
      "Graduate": "SSC CGL, UPSC Civil Services / CDS, IBPS PO / Clerk, JKSSB Sub-Inspector / Naib Tehsildar / Patwari, RRB NTPC Graduate"
    };

    mount.querySelectorAll(".v5-qual-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const q = btn.dataset.qual;
        document.getElementById("v5QualOutput").innerHTML = `
          <b>🎓 ${esc(q)} Pass Recommended Exams:</b><br>${esc(QUAL_MAP[q] || "")}
        `;
        const searchInp = document.getElementById("searchInput");
        if (searchInp) {
          searchInp.value = q;
          searchInp.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
    });

    // Print Summary button
    document.getElementById("v5PrintReportBtn").addEventListener("click", () => {
      window.print();
    });

    renderOmr();

    // Add subtle v5.0 badge in footer without changing existing footer markup
    const footer = document.querySelector("footer");
    if (footer && !document.getElementById("sjuV5Tag")) {
      const tag = document.createElement("span");
      tag.id = "sjuV5Tag";
      tag.style.cssText = "font-size:11px;font-weight:800;color:#155eef;background:#edf4ff;padding:4px 10px;border-radius:999px;";
      tag.textContent = "Sarkari Job Universe v5.0 Complete";
      footer.appendChild(tag);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initV5Suite);
  } else {
    initV5Suite();
  }
})();
