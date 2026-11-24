(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const SECTORS = [
    { name: "SSC (CGL, CHSL, GD, MTS, CPO)", url: "https://ssc.gov.in/", note: "Central govt exams & recruitments" },
    { name: "JKSSB (Jammu & Kashmir Selection Board)", url: "https://jkssb.nic.in/", note: "J&K UT level posts & exams" },
    { name: "UPSC (Civil Services, NDA, CDS, CAPF)", url: "https://upsc.gov.in/", note: "All-India civil & defence exams" },
    { name: "Indian Railways (RRB & RRC)", url: "https://www.rrbcdg.gov.in/", note: "NTPC, Group D, JE, ALP & more" },
    { name: "Indian Army / Defence", url: "https://joinindianarmy.nic.in/", note: "Agniveer, Soldier GD, Tradesman & officers" },
    { name: "IBPS & Public Sector Banking", url: "https://www.ibps.in/", note: "PO, Clerk, RRB & bank recruitments" },
    { name: "National Career Service (NCS)", url: "https://www.ncs.gov.in/", note: "Career & employment portal" },
    { name: "Indian Air Force (Agniveervayu)", url: "https://agnipathvayu.cdac.in/", note: "Air Force recruitment portal" }
  ];

  async function initUnlimitedSuite() {
    const mount = document.getElementById("unlimited-mock-and-sectors");
    if (!mount) return;

    let bank = [];
    try {
      const r = await fetch("/data/practice-question-bank.json");
      if (r.ok) bank = await r.json();
    } catch {}

    if (!Array.isArray(bank) || !bank.length) {
      bank = [
        {
          category: "GK",
          question: "Bharat ke pehle President kaun the?",
          options: ["Dr. Rajendra Prasad", "Dr. S. Radhakrishnan", "Jawaharlal Nehru", "Zakir Husain"],
          answer: 0,
          explanation: "Dr. Rajendra Prasad Bharat ke pehle President the."
        }
      ];
    }

    let testQuestions = [];
    let testAnswers = {};
    let testSubmitted = false;

    function pickRandomQuestions(count, catFilter) {
      const pool = (catFilter && catFilter !== "ALL")
        ? bank.filter(q => String(q.category || "").toLowerCase() === catFilter.toLowerCase())
        : bank.slice();
      const source = pool.length ? pool : bank.slice();
      const out = [];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * source.length);
        out.push(source[idx]);
      }
      return out;
    }

    const categories = ["ALL", ...Array.from(new Set(bank.map(q => q.category).filter(Boolean)))];

    mount.innerHTML = `
      <div style="max-width:1160px;margin:22px auto;padding:0 16px;">
        <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:20px;padding:22px;box-shadow:0 12px 32px rgba(15,41,87,0.07);">
          <div style="margin-bottom:14px;">
            <span style="background:#dcfce7;color:#15803d;font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;letter-spacing:.5px;">♾️ UNLIMITED MOCK TEST + QUESTION BANK + OFFICIAL SECTORS</span>
            <h3 style="margin:6px 0 4px;font-size:20px;color:#0f172a;">Government Job Sectors (Official Links) & Unlimited Practice</h3>
            <p style="margin:0;font-size:13px;color:#64748b;">Sabhi bade government job sectors ke direct official links, unlimited mock test generator, aur har sawal ka jawab + explanation yahan ek saath hai.</p>
          </div>

          <!-- OFFICIAL SECTORS GRID -->
          <div style="margin-bottom:18px;">
            <div style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:8px;">🏛️ Major Government Job Sectors & Official Portals</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;">
              ${SECTORS.map(s => `
                <a href="${esc(s.url)}" target="_blank" rel="noopener" style="display:block;text-decoration:none;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:11px 13px;color:#0f172a;">
                  <div style="font-size:13px;font-weight:800;color:#155eef;">${esc(s.name)} ↗</div>
                  <div style="font-size:11px;color:#64748b;margin-top:3px;">${esc(s.note)}</div>
                </a>
              `).join("")}
            </div>
          </div>

          <!-- UNLIMITED MOCK TEST GENERATOR -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px;margin-bottom:16px;">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">
              <div>
                <div style="font-size:12px;font-weight:800;color:#155eef;">⚡ UNLIMITED CUSTOM MOCK TEST</div>
                <h4 style="margin:2px 0 0;font-size:17px;color:#0f172a;">Jitni Baar Chahein Naya Mock Test Banayein</h4>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                <select id="umCat" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                  ${categories.map(c => `<option value="${esc(c)}">${c === "ALL" ? "All Subjects" : esc(c)}</option>`).join("")}
                </select>
                <select id="umCount" style="padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                  <option value="5">5 Questions</option>
                  <option value="10" selected>10 Questions</option>
                  <option value="20">20 Questions</option>
                  <option value="30">30 Questions</option>
                </select>
                <button type="button" id="umStartBtn" style="background:#155eef;color:#fff;border:0;padding:8px 14px;border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;">▶ Naya Mock Test Shuru Karein</button>
              </div>
            </div>
            <div id="umTestArea" style="font-size:13px;color:#475569;">"Naya Mock Test Shuru Karein" dabayein — har baar naya practice test banega aur submit karte hi score + answer explanation dikhega.</div>
          </div>

          <!-- UNLIMITED QUESTION BANK WITH ANSWERS -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px;">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;">
              <div>
                <div style="font-size:12px;font-weight:800;color:#059669;">📚 QUESTION BANK WITH ANSWERS</div>
                <h4 style="margin:2px 0 0;font-size:17px;color:#0f172a;">Practice Questions, Answers & Explanations (${bank.length} Saved)</h4>
              </div>
              <input id="umSearchQ" placeholder="Sawal ya topic search karein..." style="padding:8px 11px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;min-width:200px;">
            </div>
            <div id="umBankList" style="display:grid;gap:8px;max-height:360px;overflow-y:auto;"></div>
          </div>
        </div>
      </div>
    `;

    function renderMockTest() {
      const area = document.getElementById("umTestArea");
      if (!testQuestions.length) return;
      let correct = 0;
      if (testSubmitted) {
        testQuestions.forEach((q, idx) => {
          if (testAnswers[idx] === q.answer) correct++;
        });
      }
      area.innerHTML = `
        ${testSubmitted ? `
          <div style="background:#dcfce7;border:1px solid #86efac;color:#14532d;padding:12px;border-radius:12px;margin-bottom:12px;font-weight:800;">
            🏆 Test Complete! Score: ${correct} / ${testQuestions.length} (${Math.round((correct / testQuestions.length) * 100)}%)
          </div>
        ` : ""}
        <div style="display:grid;gap:10px;">
          ${testQuestions.map((q, idx) => `
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
              <div style="font-weight:700;color:#0f172a;margin-bottom:6px;">${idx + 1}. [${esc(q.category || "GK")}] ${esc(q.question)}</div>
              <div style="display:grid;gap:5px;">
                ${(q.options || []).map((opt, oIdx) => {
                  const chosen = testAnswers[idx] === oIdx;
                  let bg = chosen ? "#dbeafe" : "#f8fafc";
                  let brd = chosen ? "#155eef" : "#cbd5e1";
                  if (testSubmitted) {
                    if (oIdx === q.answer) { bg = "#dcfce7"; brd = "#16a34a"; }
                    else if (chosen) { bg = "#fee2e2"; brd = "#dc2626"; }
                  }
                  return `<button type="button" data-umq="${idx}" data-umo="${oIdx}" ${testSubmitted ? "disabled" : ""} style="text-align:left;padding:7px 10px;border-radius:8px;border:1px solid ${brd};background:${bg};font-size:12px;font-weight:600;color:#0f172a;cursor:${testSubmitted ? "default" : "pointer"};">${esc(opt)}</button>`;
                }).join("")}
              </div>
              ${testSubmitted && q.explanation ? `<div style="margin-top:6px;font-size:11px;color:#334155;">💡 <b>Explanation:</b> ${esc(q.explanation)}</div>` : ""}
            </div>
          `).join("")}
        </div>
        ${!testSubmitted ? `
          <button type="button" id="umFinishBtn" style="margin-top:12px;background:#16a34a;color:#fff;border:0;padding:10px 18px;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;">✓ Submit Mock Test & Check Answers</button>
        ` : ""}
      `;

      area.querySelectorAll("button[data-umq]").forEach(btn => {
        btn.addEventListener("click", () => {
          if (testSubmitted) return;
          testAnswers[Number(btn.dataset.umq)] = Number(btn.dataset.umo);
          renderMockTest();
        });
      });

      const fin = document.getElementById("umFinishBtn");
      if (fin) {
        fin.addEventListener("click", () => {
          testSubmitted = true;
          renderMockTest();
        });
      }
    }

    document.getElementById("umStartBtn").addEventListener("click", () => {
      const cat = document.getElementById("umCat").value;
      const cnt = Number(document.getElementById("umCount").value) || 10;
      testQuestions = pickRandomQuestions(cnt, cat);
      testAnswers = {};
      testSubmitted = false;
      renderMockTest();
    });

    function renderBankList() {
      const qTerm = (document.getElementById("umSearchQ").value || "").trim().toLowerCase();
      const listEl = document.getElementById("umBankList");
      const filtered = bank.filter(item => {
        if (!qTerm) return true;
        return (item.question || "").toLowerCase().includes(qTerm) ||
               (item.category || "").toLowerCase().includes(qTerm) ||
               (item.explanation || "").toLowerCase().includes(qTerm);
      });

      listEl.innerHTML = filtered.slice(0, 40).map((item, i) => {
        const ansText = (item.options && item.options[item.answer] !== undefined) ? item.options[item.answer] : "";
        return `
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;font-size:12px;">
            <div style="font-weight:700;color:#0f172a;">Q${i + 1} [${esc(item.category || "GK")}]: ${esc(item.question)}</div>
            <div style="color:#15803d;font-weight:700;margin-top:4px;">✔ Answer: ${esc(ansText)}</div>
            ${item.explanation ? `<div style="color:#475569;margin-top:2px;">💡 ${esc(item.explanation)}</div>` : ""}
          </div>
        `;
      }).join("") || `<div style="font-size:12px;color:#64748b;">Koi matching question nahi mila.</div>`;
    }

    document.getElementById("umSearchQ").addEventListener("input", renderBankList);
    renderBankList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initUnlimitedSuite);
  } else {
    initUnlimitedSuite();
  }
})();
