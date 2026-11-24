(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const EXAM_PROFILES = [
    {
      id: "SSC_ALL",
      name: "SSC (GD / MTS / CHSL / CGL / CPO)",
      sector: "Central Staff Selection",
      syllabus: "General Intelligence & Reasoning, General Awareness (Polity, History, Geography, Science, Static GK), Quantitative Aptitude (Percentage, Ratio, Profit-Loss, SI/CI, Speed-Time, Mensuration), English/Hindi Comprehension & Grammar.",
      latestFocus: "Tier-1 CBT speed, accuracy, negative marking awareness, and daily GK/Current Affairs revision."
    },
    {
      id: "JKSSB_ALL",
      name: "JKSSB (Class-IV / MTS / Constable / Junior Assistant / Patwari)",
      sector: "Jammu & Kashmir UT",
      syllabus: "General English, General Awareness with special reference to J&K UT (Rivers, Lakes, Passes, Districts, History, Culture, Schemes), Numerical & Reasoning Ability, Basic Science & Computer Awareness.",
      latestFocus: "J&K UT special topics, numerical reasoning, and official domicile/post instructions on jkssb.nic.in."
    },
    {
      id: "ARMY_DEFENCE",
      name: "Indian Army / Agniveer / Navy / Air Force",
      sector: "Defence & Armed Forces",
      syllabus: "General Knowledge, General Science (Physics, Chemistry, Biology basics), Mathematics (Arithmetic & Mensuration), Logical Reasoning, and Physical/Medical standards as per official rally/notification.",
      latestFocus: "CEE written practice, science & arithmetic drills, and physical fitness consistency."
    },
    {
      id: "RAILWAY_RRB",
      name: "Indian Railways (RRB NTPC / Group D / ALP / Technician)",
      sector: "Railways & Technical",
      syllabus: "Mathematics, General Intelligence & Reasoning, General Science, and General Awareness on current events of national and international importance.",
      latestFocus: "CBT stages, accuracy under negative marking, and trade/technical fundamentals where applicable."
    },
    {
      id: "BANKING_IBPS",
      name: "Banking (IBPS PO / Clerk / RRB / SBI)",
      sector: "Banking & Finance",
      syllabus: "Quantitative Aptitude & Data Interpretation, Reasoning Ability, English Language, and General/Banking/Economy Awareness.",
      latestFocus: "Calculation speed, DI/series practice, and RBI/economy concepts."
    },
    {
      id: "POLICE_STATE",
      name: "State & UT Police (J&K Police / Delhi Police / UP Police)",
      sector: "Law Enforcement & Security",
      syllabus: "General Knowledge & Current Affairs, Mental Aptitude / Reasoning, Numerical Ability, and Basic Law / Constitution awareness.",
      latestFocus: "Constable/SI exam pattern, reasoning drills, and official recruitment notices."
    }
  ];

  // Pure-JS valid text PDF generator for Unlimited Custom Practice PDFs
  function buildTextPdfBlob(titleLines) {
    const encoder = new TextEncoder();
    const parts = [];
    let offset = 0;
    const offsets = [0];
    function pushBytes(u8) { parts.push(u8); offset += u8.length; }
    function pushStr(s) { pushBytes(encoder.encode(s)); }

    function pdfEscape(s) {
      return String(s || "").replace(/[^ -~]/g, " ").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    }

    const linesPerPage = 46;
    const pages = [];
    for (let i = 0; i < titleLines.length; i += linesPerPage) {
      pages.push(titleLines.slice(i, i + linesPerPage));
    }
    if (!pages.length) pages.push(["Sarkari Job Universe Practice Set"]);

    pushStr("%PDF-1.4\n");
    const catalogId = 1;
    const pagesId = 2;
    const fontId = 3;
    let nextId = 4;

    const pageObjs = pages.map(lines => {
      const pId = nextId++;
      const cId = nextId++;
      return { pId, cId, lines };
    });
    const totalObjs = nextId - 1;

    offsets[catalogId] = offset;
    pushStr(`${catalogId} 0 obj\n<< /Type /Catalog /Pages ${pagesId} 0 R >>\nendobj\n`);

    offsets[pagesId] = offset;
    const kids = pageObjs.map(p => `${p.pId} 0 R`).join(" ");
    pushStr(`${pagesId} 0 obj\n<< /Type /Pages /Kids [ ${kids} ] /Count ${pageObjs.length} >>\nendobj\n`);

    offsets[fontId] = offset;
    pushStr(`${fontId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);

    for (const po of pageObjs) {
      offsets[po.pId] = offset;
      pushStr(`${po.pId} 0 obj\n<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${po.cId} 0 R >>\nendobj\n`);

      let streamText = "BT\n/F1 10 Tf\n40 800 Td\n16 TL\n";
      po.lines.forEach((ln, idx) => {
        const clean = pdfEscape(ln).slice(0, 96);
        if (idx === 0) streamText += `(${clean}) Tj\n`;
        else streamText += `T* (${clean}) Tj\n`;
      });
      streamText += "ET\n";
      const sBytes = encoder.encode(streamText);
      offsets[po.cId] = offset;
      pushStr(`${po.cId} 0 obj\n<< /Length ${sBytes.length} >>\nstream\n`);
      pushBytes(sBytes);
      pushStr(`\nendstream\nendobj\n`);
    }

    const xrefPos = offset;
    pushStr(`xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`);
    for (let i = 1; i <= totalObjs; i++) {
      pushStr(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
    }
    pushStr(`trailer\n<< /Size ${totalObjs + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);
    return new Blob(parts, { type: "application/pdf" });
  }

  async function initUnlimitedExamSuite() {
    const mount = document.getElementById("unlimited-exam-suite");
    if (!mount) return;

    let bank = [];
    try {
      const r = await fetch("/data/practice-question-bank.json");
      if (r.ok) bank = await r.json();
    } catch {}
    if (!Array.isArray(bank) || !bank.length) {
      bank = [
        { category: "GK", question: "Which Article guarantees equality before law?", options: ["Article 14", "Article 19", "Article 21", "Article 32"], answer: 0, explanation: "Article 14 guarantees equality before law." }
      ];
    }

    const subjects = ["ALL", ...Array.from(new Set(bank.map(x => x.category).filter(Boolean)))];
    let generatedQs = [];
    let generatedAns = {};
    let generatedSubmitted = false;
    let lastPdfUrl = null;

    function buildUnlimitedQuestions(count, subj, examLabel) {
      const pool = (subj && subj !== "ALL")
        ? bank.filter(q => String(q.category || "").toLowerCase() === subj.toLowerCase())
        : bank.slice();
      const source = pool.length ? pool : bank.slice();
      const shuffled = source.slice().sort(() => Math.random() - 0.5);
      const out = [];
      for (let i = 0; i < count; i++) {
        const base = shuffled[i % shuffled.length];
        out.push({
          ...base,
          qNo: i + 1,
          examTag: examLabel
        });
      }
      return out;
    }

    mount.innerHTML = `
      <section style="max-width:1160px;margin:24px auto;padding:0 16px;" id="all-exam-unlimited-lab">
        <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:22px;padding:22px;box-shadow:0 14px 34px rgba(15,41,87,0.08);">
          <div style="margin-bottom:16px;">
            <span style="background:#155eef;color:#fff;font-size:11px;font-weight:800;padding:4px 11px;border-radius:999px;letter-spacing:.5px;">⚡ UNLIMITED QUESTION GENERATOR • ALL-EXAM MOCK • UNLIMITED PDF • SECTOR SYLLABUS</span>
            <h2 style="margin:8px 0 4px;font-size:clamp(22px,3.5vw,29px);color:#0f172a;">All-Exam Mock Selector, Unlimited Questions, Unlimited PDF &amp; Sector Syllabus</h2>
            <p style="margin:0;font-size:13px;color:#64748b;">Kisi bhi exam ya sector ka syllabus dekhein, unlimited sawal generate karein, aur apna custom practice PDF turant download karein.</p>
          </div>

          <!-- 1. SECTOR-WISE & EXAM-WISE SYLLABUS + LATEST JOBS FOCUS -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px;margin-bottom:18px;">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">
              <div>
                <div style="font-size:11px;font-weight:800;color:#7c3aed;">📚 SECTOR &amp; EXAM SYLLABUS DIRECTORY</div>
                <h3 style="margin:2px 0 0;font-size:18px;color:#0f172a;">Sector / Exam Chunein Aur Syllabus + Latest Focus Dekhein</h3>
              </div>
              <select id="uesExamSelect" style="padding:9px 12px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;font-size:13px;font-weight:700;color:#0f172a;">
                ${EXAM_PROFILES.map(ex => `<option value="${esc(ex.id)}">${esc(ex.name)}</option>`).join("")}
              </select>
            </div>
            <div id="uesSyllabusCard" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px;font-size:13px;color:#1e293b;line-height:1.65;"></div>
          </div>

          <!-- 2. UNLIMITED QUESTION GENERATOR + UNLIMITED CUSTOM PDF CREATOR -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px;">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;">
              <div>
                <div style="font-size:11px;font-weight:800;color:#059669;">♾️ UNLIMITED QUESTION &amp; CUSTOM PDF GENERATOR</div>
                <h3 style="margin:2px 0 0;font-size:18px;color:#0f172a;">Kitne Bhi Sawal Banayein &amp; PDF Download Karein</h3>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                <select id="uesSubjSelect" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                  ${subjects.map(s => `<option value="${esc(s)}">${s === "ALL" ? "All Subjects (Mixed)" : esc(s)}</option>`).join("")}
                </select>
                <select id="uesCountSelect" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                  <option value="10">10 Questions</option>
                  <option value="25" selected>25 Questions</option>
                  <option value="50">50 Questions</option>
                  <option value="100">100 Questions</option>
                  <option value="200">200 Questions</option>
                  <option value="500">500 Questions</option>
                </select>
                <button type="button" id="uesGenBtn" style="background:#155eef;color:#fff;border:0;padding:9px 14px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">⚡ Generate Questions</button>
                <button type="button" id="uesPdfBtn" style="background:#059669;color:#fff;border:0;padding:9px 14px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">📄 Generate Unlimited PDF</button>
                <a id="uesPdfDownload" style="display:none;background:#16a34a;color:#fff;text-decoration:none;padding:9px 12px;border-radius:9px;font-size:12px;font-weight:800;">⬇ Download PDF</a>
              </div>
            </div>
            <div id="uesPdfStatus" style="font-size:12px;color:#334155;margin-bottom:10px;">Bank ready (${bank.length} saved questions in bank • unlimited custom sets &amp; PDFs available).</div>
            <div id="uesQuestionsArea"></div>
          </div>
        </div>
      </section>
    `;

    function renderSyllabusProfile() {
      const id = document.getElementById("uesExamSelect").value;
      const prof = EXAM_PROFILES.find(x => x.id === id) || EXAM_PROFILES[0];
      document.getElementById("uesSyllabusCard").innerHTML = `
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-bottom:6px;">
          <b>${esc(prof.name)}</b>
          <span style="padding:3px 9px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:800;">Sector: ${esc(prof.sector)}</span>
        </div>
        <div><b>Syllabus:</b> ${esc(prof.syllabus)}</div>
        <div style="margin-top:6px;"><b>Preparation &amp; Latest Job Focus:</b> ${esc(prof.latestFocus)}</div>
        <div style="margin-top:8px;"><a href="#latest" style="color:#155eef;font-weight:800;font-size:12px;text-decoration:none;">Latest Job Updates Dekhein ↓</a></div>
      `;
    }

    function renderGeneratedTest() {
      const area = document.getElementById("uesQuestionsArea");
      if (!generatedQs.length) {
        area.innerHTML = `<div style="padding:14px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;font-size:13px;color:#475569;">"Generate Questions" par click karein ya "Generate Unlimited PDF" se seedha practice PDF banayein.</div>`;
        return;
      }

      let correct = 0;
      if (generatedSubmitted) {
        generatedQs.forEach((q, idx) => {
          if (generatedAns[idx] === q.answer) correct++;
        });
      }

      area.innerHTML = `
        ${generatedSubmitted ? `
          <div style="background:#dcfce7;border:1px solid #86efac;color:#14532d;padding:12px;border-radius:12px;margin-bottom:12px;font-weight:800;font-size:13px;">
            Result: ${correct} / ${generatedQs.length} (${Math.round((correct / generatedQs.length) * 100)}%)
          </div>
        ` : ""}
        <div style="display:grid;gap:10px;max-height:460px;overflow-y:auto;padding-right:4px;">
          ${generatedQs.map((q, idx) => `
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
              <div style="font-weight:700;color:#0f172a;font-size:13px;margin-bottom:6px;">Q${idx + 1}. [${esc(q.category || "GK")}] ${esc(q.question)}</div>
              <div style="display:grid;gap:5px;">
                ${(q.options || []).map((opt, oIdx) => {
                  const chosen = generatedAns[idx] === oIdx;
                  let bg = chosen ? "#dbeafe" : "#f8fafc";
                  let brd = chosen ? "#155eef" : "#cbd5e1";
                  if (generatedSubmitted) {
                    if (oIdx === q.answer) { bg = "#dcfce7"; brd = "#16a34a"; }
                    else if (chosen) { bg = "#fee2e2"; brd = "#dc2626"; }
                  }
                  return `<button type="button" data-ues-q="${idx}" data-ues-o="${oIdx}" ${generatedSubmitted ? "disabled" : ""} style="text-align:left;padding:7px 10px;border-radius:8px;border:1px solid ${brd};background:${bg};font-size:12px;font-weight:600;color:#0f172a;cursor:${generatedSubmitted ? "default" : "pointer"};">${String.fromCharCode(65 + oIdx)}. ${esc(opt)}</button>`;
                }).join("")}
              </div>
              ${generatedSubmitted && q.explanation ? `<div style="margin-top:6px;font-size:11px;color:#334155;">Explanation: ${esc(q.explanation)}</div>` : ""}
            </div>
          `).join("")}
        </div>
        ${!generatedSubmitted ? `
          <button type="button" id="uesSubmitBtn" style="margin-top:12px;background:#16a34a;color:#fff;border:0;padding:10px 16px;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;">Submit Answers &amp; Check Score</button>
        ` : ""}
      `;

      area.querySelectorAll("button[data-ues-q]").forEach(btn => {
        btn.addEventListener("click", () => {
          if (generatedSubmitted) return;
          generatedAns[Number(btn.dataset.uesQ)] = Number(btn.dataset.uesO);
          renderGeneratedTest();
        });
      });

      const subBtn = document.getElementById("uesSubmitBtn");
      if (subBtn) {
        subBtn.addEventListener("click", () => {
          generatedSubmitted = true;
          renderGeneratedTest();
        });
      }
    }

    document.getElementById("uesExamSelect").addEventListener("change", renderSyllabusProfile);
    renderSyllabusProfile();

    document.getElementById("uesGenBtn").addEventListener("click", () => {
      const subj = document.getElementById("uesSubjSelect").value;
      const cnt = Number(document.getElementById("uesCountSelect").value) || 25;
      const examId = document.getElementById("uesExamSelect").value;
      const prof = EXAM_PROFILES.find(x => x.id === examId) || EXAM_PROFILES[0];
      generatedQs = buildUnlimitedQuestions(cnt, subj, prof.name);
      generatedAns = {};
      generatedSubmitted = false;
      renderGeneratedTest();
    });

    document.getElementById("uesPdfBtn").addEventListener("click", () => {
      const subj = document.getElementById("uesSubjSelect").value;
      const cnt = Number(document.getElementById("uesCountSelect").value) || 25;
      const examId = document.getElementById("uesExamSelect").value;
      const prof = EXAM_PROFILES.find(x => x.id === examId) || EXAM_PROFILES[0];
      const list = generatedQs.length ? generatedQs : buildUnlimitedQuestions(cnt, subj, prof.name);
      if (!generatedQs.length) {
        generatedQs = list;
        generatedAns = {};
        generatedSubmitted = false;
        renderGeneratedTest();
      }

      const lines = [
        `SARKARI JOB UNIVERSE - CUSTOM PRACTICE PDF`,
        `Exam: ${prof.name} | Subject: ${subj} | Questions: ${list.length}`,
        `-------------------------------------------------------------------------`
      ];
      list.forEach((q, i) => {
        lines.push(`Q${i + 1}. [${q.category || "GK"}] ${q.question}`);
        (q.options || []).forEach((o, j) => {
          lines.push(`   ${String.fromCharCode(65 + j)}. ${o}`);
        });
        lines.push("");
      });
      lines.push(`=== ANSWER KEY & EXPLANATIONS ===`);
      list.forEach((q, i) => {
        const ansLetter = String.fromCharCode(65 + (Number(q.answer) || 0));
        const ansVal = (q.options && q.options[q.answer]) ? q.options[q.answer] : "";
        lines.push(`Q${i + 1}: ${ansLetter} (${ansVal}) - ${q.explanation || ""}`);
      });

      const blob = buildTextPdfBlob(lines);
      if (lastPdfUrl) URL.revokeObjectURL(lastPdfUrl);
      lastPdfUrl = URL.createObjectURL(blob);
      const dl = document.getElementById("uesPdfDownload");
      dl.href = lastPdfUrl;
      dl.download = `sarkari-job-universe-${list.length}-mcqs.pdf`;
      dl.style.display = "inline-block";
      document.getElementById("uesPdfStatus").innerHTML = `<b>Custom PDF ready!</b> (${list.length} questions + Answer Key • ${Math.max(1, Math.round(blob.size / 1024))} KB) — click <b>Download PDF</b>.`;
    });

    renderGeneratedTest();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUnlimitedExamSuite);
  } else {
    initUnlimitedExamSuite();
  }
})();
