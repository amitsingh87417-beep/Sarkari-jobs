(function () {
  "use strict";
  const MEM_KEY = "sju_v100_ai_study_memory";

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function loadMem() {
    try { return JSON.parse(localStorage.getItem(MEM_KEY) || "{}"); } catch { return {}; }
  }
  function saveMem(m) {
    try { localStorage.setItem(MEM_KEY, JSON.stringify(m)); } catch {}
  }

  const EXAM_KITS = {
    "SSC GD": { query: "SSC", typing: "35 WPM", mock: "/mock-test.html", pdf: "/papers.html", cutoffs: { UR: 138, OBC: 134, EWS: 132, SC: 122, ST: 118, RBA: 120 }, maxMarks: 160 },
    "SSC CHSL": { query: "SSC", typing: "35 WPM", mock: "/mock-test.html", pdf: "/papers.html", cutoffs: { UR: 152, OBC: 147, EWS: 145, SC: 132, ST: 125, RBA: 130 }, maxMarks: 200 },
    "JKSSB": { query: "JKSSB", typing: "35 WPM", mock: "/mock-test.html", pdf: "/papers.html", cutoffs: { UR: 82, OBC: 76, EWS: 74, SC: 70, ST: 68, RBA: 75 }, maxMarks: 100 },
    "RRB NTPC": { query: "RRB", typing: "30 WPM", mock: "/mock-test.html", pdf: "/papers.html", cutoffs: { UR: 76, OBC: 72, EWS: 70, SC: 64, ST: 60, RBA: 65 }, maxMarks: 100 },
    "Army GD": { query: "Army", typing: "N/A", mock: "/mock-test.html", pdf: "/papers.html", cutoffs: { UR: 72, OBC: 70, EWS: 68, SC: 65, ST: 64, RBA: 66 }, maxMarks: 100 },
    "Banking": { query: "Bank", typing: "35 WPM", mock: "/mock-test.html", pdf: "/papers.html", cutoffs: { UR: 74, OBC: 71, EWS: 70, SC: 64, ST: 59, RBA: 65 }, maxMarks: 100 }
  };

  function initV100PowerSuite() {
    const mount = document.getElementById("v100-student-power-suite");
    if (!mount) return;
    const mem = loadMem();
    const activeExam = mem.targetExam || "SSC GD";
    const weakTopic = mem.weakTopic || "Quantitative Aptitude & Reasoning";
    const visits = (Number(mem.visits) || 0) + 1;
    mem.visits = visits;
    mem.lastVisit = new Date().toISOString().slice(0, 10);
    saveMem(mem);

    mount.innerHTML = `
      <section style="max-width:1160px;margin:22px auto;padding:0 16px;" id="v100-power-hub">
        <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a 60%,#0f766e);color:#fff;border-radius:22px;padding:22px;box-shadow:0 16px 38px rgba(15,23,42,.18);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
            <div>
              <span style="background:rgba(16,185,129,.22);border:1px solid rgba(16,185,129,.5);color:#a7f3d0;padding:4px 11px;border-radius:999px;font-size:10.5px;font-weight:800;letter-spacing:.6px;">🚀 v1.0 • AI STUDY MEMORY • MY EXAM KIT • SAFE SCORE ESTIMATOR</span>
              <h2 style="margin:7px 0 3px;font-size:clamp(21px,3.2vw,28px);color:#fff;">India #1 Personalized Exam Command Center</h2>
              <p style="margin:0;font-size:13px;color:#dbeafe;">Apna Target Exam chunein — AI Study Memory aapka weak topic, daily streak (Visit #${visits}) aur safe cut-off target yaad rakhega.</p>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;">
            <!-- 1. MY EXAM KIT -->
            <div style="background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:16px;">
              <div style="font-size:11px;font-weight:800;color:#fde047;margin-bottom:6px;">🎯 1. MY TARGET EXAM KIT</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
                ${Object.keys(EXAM_KITS).map((ex) => `<button type="button" data-kit-ex="${esc(ex)}" style="padding:6px 11px;border-radius:999px;border:1px solid ${ex === activeExam ? "#fff" : "rgba(255,255,255,.3)"};background:${ex === activeExam ? "#fff" : "rgba(255,255,255,.12)"};color:${ex === activeExam ? "#0f172a" : "#fff"};font-size:11.5px;font-weight:800;cursor:pointer;">${esc(ex)}</button>`).join("")}
              </div>
              <div id="v100KitSummary" style="font-size:12.5px;color:#e2e8f0;line-height:1.65;"></div>
            </div>

            <!-- 2. CUT-OFF & SAFE SCORE ESTIMATOR -->
            <div style="background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:16px;">
              <div style="font-size:11px;font-weight:800;color:#a7f3d0;margin-bottom:6px;">📊 2. CUT-OFF &amp; SAFE SCORE ESTIMATOR</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <select id="estCat" style="padding:8px;border-radius:8px;border:0;font-size:12px;font-weight:700;color:#0f172a;">
                  <option value="UR">General / UR</option><option value="OBC">OBC</option><option value="EWS">EWS</option><option value="SC">SC</option><option value="ST">ST</option><option value="RBA">RBA (J&amp;K)</option>
                </select>
                <input id="estScore" type="number" min="0" max="200" placeholder="Your Mock Score" style="padding:8px;border-radius:8px;border:0;font-size:12px;font-weight:700;color:#0f172a;">
              </div>
              <button type="button" id="estCalcBtn" style="width:100%;padding:8px;border-radius:9px;border:0;background:#10b981;color:#fff;font-size:12px;font-weight:800;cursor:pointer;">Check Safe Score Status →</button>
              <div id="estResult" style="margin-top:8px;font-size:12px;color:#f8fafc;line-height:1.55;">Apna mock score daal kar target safe zone check karein.</div>
            </div>

            <!-- 3. AI STUDY MEMORY -->
            <div style="background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.2);border-radius:16px;padding:16px;">
              <div style="font-size:11px;font-weight:800;color:#93c5fd;margin-bottom:6px;">🧠 3. AI STUDY MEMORY (ON-DEVICE)</div>
              <label style="display:block;font-size:11px;color:#cbd5e1;margin-bottom:4px;">Your Weak Topic to Focus On:</label>
              <div style="display:flex;gap:6px;margin-bottom:8px;">
                <input id="memWeakInput" value="${esc(weakTopic)}" style="flex:1;padding:8px;border-radius:8px;border:0;font-size:12px;color:#0f172a;">
                <button type="button" id="memSaveBtn" style="padding:8px 11px;border-radius:8px;border:0;background:#38bdf8;color:#0f172a;font-size:12px;font-weight:800;cursor:pointer;">Save</button>
              </div>
              <div id="memAdvice" style="font-size:12px;color:#e2e8f0;line-height:1.6;">
                💡 <b>Next Recommended Step:</b> Attempt 1 Real CBT Mock for <b>${esc(activeExam)}</b> + 10-min Typing Drill today!
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    function renderKit(ex) {
      const k = EXAM_KITS[ex] || EXAM_KITS["SSC GD"];
      document.getElementById("v100KitSummary").innerHTML = `
        <b>Active Kit: ${esc(ex)}</b> (Max Marks: ${k.maxMarks} • Typing Target: ${k.typing})<br>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
          <a href="${k.mock}" style="background:#fff;color:#1e3a8a;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;text-decoration:none;">📝 Real CBT Mock</a>
          <a href="${k.pdf}" style="background:#10b981;color:#fff;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;text-decoration:none;">📄 100Q Hard PDFs</a>
          <a href="/typing-wall.html" style="background:#f59e0b;color:#0f172a;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:800;text-decoration:none;">⌨️ Typing Pro</a>
        </div>
      `;
    }
    renderKit(activeExam);

    mount.querySelectorAll("[data-kit-ex]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ex = btn.dataset.kitEx;
        const m = loadMem();
        m.targetExam = ex;
        saveMem(m);
        const searchInp = document.getElementById("searchInput");
        if (searchInp && EXAM_KITS[ex]) {
          searchInp.value = EXAM_KITS[ex].query;
          searchInp.dispatchEvent(new Event("input", { bubbles: true }));
        }
        initV100PowerSuite();
      });
    });

    document.getElementById("estCalcBtn")?.addEventListener("click", () => {
      const m = loadMem();
      const ex = m.targetExam || "SSC GD";
      const k = EXAM_KITS[ex] || EXAM_KITS["SSC GD"];
      const cat = document.getElementById("estCat").value;
      const sc = Number(document.getElementById("estScore").value);
      const safe = k.cutoffs[cat] || k.cutoffs.UR;
      const out = document.getElementById("estResult");
      if (isNaN(sc) || document.getElementById("estScore").value === "") {
        out.textContent = "Kripya apna mock score number mein likhein.";
        return;
      }
      if (sc >= safe) {
        out.innerHTML = `✅ <b>SAFE ZONE!</b> (${sc}/${k.maxMarks}) — ${esc(ex)} (${cat}) target safe score ~${safe} hai. Keep revising!`;
      } else if (sc >= safe - 12) {
        out.innerHTML = `⚡ <b>BORDERLINE (${safe - sc} marks away)</b> — Target ~${safe}/${k.maxMarks}. Daily 50 Hard Qs practice karein.`;
      } else {
        out.innerHTML = `🎯 <b>NEEDS BOOST (${safe - sc} marks needed)</b> — Target ~${safe}/${k.maxMarks}. Weak topic aur Real CBT Mock par focus karein.`;
      }
    });

    document.getElementById("memSaveBtn")?.addEventListener("click", () => {
      const m = loadMem();
      m.weakTopic = document.getElementById("memWeakInput").value.trim() || "General Studies";
      saveMem(m);
      document.getElementById("memAdvice").innerHTML = `✅ <b>Saved in AI Memory!</b> Focus topic: <b>${esc(m.weakTopic)}</b>. Open All Explain Wall or Unlimited Practice Questions & Smart Mock Tests to master it.`;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initV100PowerSuite);
  } else {
    initV100PowerSuite();
  }
})();
