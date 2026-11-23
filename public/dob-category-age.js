(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const CATEGORIES = {
    UR: { label: "General / UR", relax: 0 },
    EWS: { label: "EWS", relax: 0 },
    OBC: { label: "OBC (NCL)", relax: 3 },
    SC: { label: "SC", relax: 5 },
    ST: { label: "ST", relax: 5 },
    RBA_ALC_OSC: { label: "RBA / ALC / OSC (J&K)", relax: 3 },
    EX_SERVICEMAN: { label: "Ex-Serviceman", relax: 3 },
    PWD: { label: "PwBD / Divyang", relax: 10 }
  };

  function calcExactAge(dobDate, refDate) {
    let y = refDate.getFullYear() - dobDate.getFullYear();
    let m = refDate.getMonth() - dobDate.getMonth();
    let d = refDate.getDate() - dobDate.getDate();
    if (d < 0) {
      m--;
      const prevDays = new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
      d += prevDays;
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    return { y, m, d };
  }

  function initDobCategorySuite() {
    const mount = document.getElementById("dob-category-age-suite");
    if (!mount) return;

    mount.innerHTML = `
      <div style="max-width:1160px;margin:22px auto;padding:0 16px;">
        <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:20px;padding:22px;box-shadow:0 12px 32px rgba(15,41,87,0.07);">
          <div style="margin-bottom:14px;">
            <span style="background:#dbeafe;color:#155eef;font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;letter-spacing:.5px;">🎂 DOB &amp; CATEGORY AGE ELIGIBILITY CALCULATOR</span>
            <h3 style="margin:6px 0 4px;font-size:20px;color:#0f172a;">Date of Birth + Category Age Relaxation Calculator</h3>
            <p style="margin:0;font-size:13px;color:#64748b;">Apni <b>Date of Birth (DOB)</b> aur <b>Category</b> (General, EWS, OBC, SC, ST, RBA/ALC/OSC, Ex-Serviceman, PwBD) chunekar exam cut-off date ke hisaab se exact umar aur eligibility check karein.</p>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;">
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:15px;padding:16px;display:grid;gap:10px;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#334155;margin-bottom:3px;">1. Date of Birth (DOB) *</label>
                  <input id="dobInput" type="date" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                </div>
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#334155;margin-bottom:3px;">2. Exam Cut-Off Date</label>
                  <input id="dobCutoff" type="date" value="2026-08-01" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#334155;margin-bottom:3px;">3. Category Chunein</label>
                  <select id="dobCategory" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                    <option value="UR">General / UR (0 yr)</option>
                    <option value="EWS">EWS (0 yr)</option>
                    <option value="OBC">OBC-NCL (+3 yrs)</option>
                    <option value="SC">SC (+5 yrs)</option>
                    <option value="ST">ST (+5 yrs)</option>
                    <option value="RBA_ALC_OSC">RBA / ALC / OSC (+3 yrs)</option>
                    <option value="EX_SERVICEMAN">Ex-Serviceman (+3 yrs)</option>
                    <option value="PWD">PwBD / Divyang (+10 yrs)</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#334155;margin-bottom:3px;">4. Extra Relaxation (Optional)</label>
                  <input id="dobExtraRelax" type="number" min="0" max="30" value="0" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#334155;margin-bottom:3px;">Notice Min Age</label>
                  <input id="dobMinAge" type="number" min="14" max="60" value="18" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                </div>
                <div>
                  <label style="display:block;font-size:11px;font-weight:700;color:#334155;margin-bottom:3px;">Notice Max Age (UR)</label>
                  <input id="dobMaxAge" type="number" min="16" max="65" value="27" style="width:100%;padding:8px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:12px;">
                </div>
              </div>

              <button type="button" id="dobCalcBtn" style="background:#155eef;color:#fff;border:0;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;">🎂 Calculate Exact Age &amp; Category Eligibility</button>
            </div>

            <div id="dobResultCard" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:15px;padding:16px;display:flex;flex-direction:column;justify-content:center;">
              <div style="font-size:13px;color:#475569;line-height:1.65;">
                Yahan aapko apni <b>Exact Umar (Saal, Mahine, Din)</b>, <b>Category Relaxation ke baad Maximum Allowed Age</b>, aur <b>Eligible / Not Eligible</b> status turant dikhega.
                <br><br><small style="color:#64748b;">Note: Har exam notification ke rule ke hisaab se cut-off date aur relaxation alag ho sakti hai — official notice zaroor check karein.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("dobCalcBtn")?.addEventListener("click", () => {
      const dobVal = document.getElementById("dobInput")?.value || "";
      const cutVal = document.getElementById("dobCutoff")?.value || "";
      const catKey = document.getElementById("dobCategory")?.value || "UR";
      const extra = Math.max(0, Number(document.getElementById("dobExtraRelax")?.value) || 0);
      const minAge = Math.max(0, Number(document.getElementById("dobMinAge")?.value) || 18);
      const maxAgeUr = Math.max(minAge, Number(document.getElementById("dobMaxAge")?.value) || 27);
      const resCard = document.getElementById("dobResultCard");
      if (!resCard) return;

      if (!dobVal || !cutVal) {
        resCard.innerHTML = `<div style="color:#b91c1c;font-weight:700;font-size:13px;">⚠️ Kripya apni Date of Birth aur Cut-Off Date dono chunein.</div>`;
        return;
      }

      const d1 = new Date(dobVal + "T00:00:00");
      const d2 = new Date(cutVal + "T00:00:00");
      if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime()) || d2 < d1) {
        resCard.innerHTML = `<div style="color:#b91c1c;font-weight:700;font-size:13px;">⚠️ Cut-Off Date, Date of Birth ke baad ki honi chahiye.</div>`;
        return;
      }

      const age = calcExactAge(d1, d2);
      const catInfo = CATEGORIES[catKey] || CATEGORIES.UR;
      const totalRelax = catInfo.relax + extra;
      const allowedMax = maxAgeUr + totalRelax;

      const exactYearsFloat = (d2 - d1) / (1000 * 60 * 60 * 24 * 365.2425);
      const isTooYoung = exactYearsFloat < minAge;
      const isTooOld = exactYearsFloat > allowedMax + 0.0001;
      const eligible = !isTooYoung && !isTooOld;

      resCard.innerHTML = `
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <span style="font-size:12px;font-weight:800;color:#0f172a;">🎂 Exact Age on ${esc(cutVal)}</span>
            <span style="padding:4px 10px;border-radius:999px;font-size:11px;font-weight:800;background:${eligible ? "#dcfce7" : "#fee2e2"};color:${eligible ? "#15803d" : "#b91c1c"};">
              ${eligible ? "✅ AGE ELIGIBLE" : "❌ AGE LIMIT CHECK"}
            </span>
          </div>
          <div style="font-size:20px;font-weight:800;color:#155eef;margin-bottom:8px;">
            ${age.y} Saal, ${age.m} Mahine, ${age.d} Din
          </div>
          <div style="font-size:12px;color:#334155;line-height:1.65;">
            • Category: <b>${esc(catInfo.label)}</b> (Relaxation: <b>+${totalRelax} yrs</b>)<br>
            • Allowed Age Range: <b>${minAge} se ${allowedMax} saal</b> (Base UR Max: ${maxAgeUr})<br>
            • Status: <b>${eligible ? "Aap is age range mein aate hain." : (isTooYoung ? "Abhi minimum age poori nahi hui hai." : "Maximum age limit paar ho chuki hai.")}</b>
          </div>
        </div>
      `;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDobCategorySuite);
  } else {
    initDobCategorySuite();
  }
})();
