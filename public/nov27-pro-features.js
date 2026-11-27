(function () {
  if (document.getElementById('sju-nov27-pro-suite')) return;

  const container = document.createElement('section');
  container.id = 'sju-nov27-pro-suite';
  container.style.cssText = 'font-family:system-ui,-apple-system,sans-serif;max-width:1180px;margin:24px auto;padding:0 14px;color:#0f172a;';

  container.innerHTML = `
    <style>
      #sju-nov27-pro-suite * { box-sizing: border-box; }
      .sju-pro-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; align-items: start; }
      .sju-pro-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px; box-shadow: 0 4px 16px rgba(15,23,42,0.06); }
      .sju-pro-hdr { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 14px; }
      .sju-pro-hdr h3 { margin: 0; font-size: 1.12rem; color: #0f172a; }
      .sju-pro-badge { background: #dc2626; color: #fff; font-size: 0.72rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; }
      .sju-pro-badge.blue { background: #2563eb; }
      .sju-pro-badge.green { background: #16a34a; }
      .sju-pro-label { display: block; font-size: 0.82rem; font-weight: 600; color: #475569; margin: 10px 0 4px; }
      .sju-pro-input, .sju-pro-select { width: 100%; padding: 9px 11px; border: 1px solid #cbd5e1; border-radius: 9px; font-size: 0.9rem; background: #fff; color: #0f172a; }
      .sju-pro-btn { display: block; width: 100%; text-align: center; background: #2563eb; color: #fff; border: none; padding: 11px 14px; border-radius: 10px; font-weight: 700; font-size: 0.92rem; cursor: pointer; text-decoration: none; margin-top: 12px; }
      .sju-pro-btn:hover { background: #1d4ed8; }
      .sju-pro-btn.green { background: #16a34a; }
      .sju-pro-btn.green:hover { background: #15803d; }
      .sju-pro-btn.dark { background: #0f172a; }
      .sju-pro-btn.dark:hover { background: #1e293b; }
      .sju-pro-out { display: none; margin-top: 12px; padding: 11px 13px; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; font-size: 0.88rem; line-height: 1.55; }
      .sju-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
      .sju-mini-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px 10px; font-size: 0.8rem; }
      .sju-mini-box span { display: block; color: #64748b; font-size: 0.72rem; }
    </style>

    <div class="sju-pro-grid">
      <!-- 1. SSC CHSL 2026 EXAM CITY & REGIONAL FINDER -->
      <div class="sju-pro-card">
        <div class="sju-pro-hdr">
          <h3>SSC CHSL 2026 Exam City &amp; Status</h3>
          <span class="sju-pro-badge">CITY SLIP LIVE</span>
        </div>
        <div class="sju-mini-grid">
          <div class="sju-mini-box"><span>Tier-1 Exam Dates</span><strong>03–31 Dec 2026</strong></div>
          <div class="sju-mini-box"><span>Admit Card</span><strong>2–3 Days Before Exam</strong></div>
        </div>
        <a href="https://ssc.gov.in/login" target="_blank" rel="noopener noreferrer" class="sju-pro-btn">
          Check SSC CHSL Exam City (ssc.gov.in) &rarr;
        </a>
        <label class="sju-pro-label" for="sjuNovRegion">State / UT ke hisaab se Regional Portal chunein:</label>
        <select id="sjuNovRegion" class="sju-pro-select">
          <option value="">-- State / UT Select Karein --</option>
          <option value="NWR">Jammu &amp; Kashmir, Ladakh, Punjab, Haryana, HP, Chandigarh (NWR)</option>
          <option value="NR">Delhi, Rajasthan, Uttarakhand (NR)</option>
          <option value="CR">Uttar Pradesh, Bihar (CR)</option>
          <option value="MPR">Madhya Pradesh, Chhattisgarh (MPR)</option>
          <option value="WR">Maharashtra, Gujarat, Goa (WR)</option>
          <option value="ER">West Bengal, Odisha, Jharkhand, Sikkim (ER)</option>
          <option value="SR">Andhra Pradesh, Telangana, Tamil Nadu, Puducherry (SR)</option>
          <option value="KKR">Karnataka, Kerala, Lakshadweep (KKR)</option>
          <option value="NER">Assam, Arunachal, Manipur, Meghalaya, Mizoram, Nagaland, Tripura (NER)</option>
        </select>
        <div id="sjuNovRegionOut" class="sju-pro-out"></div>
      </div>

      <!-- 2. ALL-INDIA & GOVT REAL CBT MOCK TEST SELECTOR -->
      <div class="sju-pro-card">
        <div class="sju-pro-hdr">
          <h3>All-India Real CBT Mock Test</h3>
          <span class="sju-pro-badge blue">28 ALL-INDIA EXAMS</span>
        </div>
        <p style="margin:0 0 8px;font-size:0.84rem;color:#475569;">Apna All-India ya State Govt exam select karein — click karte hi Real CBT Exam Paper (Timer + Palette + Negative Marking) seedha start ho jayega.</p>
        <label class="sju-pro-label" for="sjuMockExamSel">1. Target Govt Exam Select Karein:</label>
        <select id="sjuMockExamSel" class="sju-pro-select">
          <option value="SSC GD">SSC GD Constable (80 Q • 60 Min)</option>
          <option value="SSC CHSL">SSC CHSL 10+2 Tier-1 (100 Q • 60 Min)</option>
          <option value="SSC CGL">SSC CGL Tier-1 Hard (100 Q • 60 Min)</option>
          <option value="SSC MTS">SSC MTS &amp; Havaldar (90 Q • 90 Min)</option>
          <option value="SSC CPO">SSC CPO SI Delhi Police / CAPF (200 Q)</option>
          <option value="SSC Stenographer">SSC Stenographer Grade C &amp; D (200 Q)</option>
          <option value="SSC JE">SSC Junior Engineer JE (100 Q)</option>
          <option value="JKSSB">JKSSB Class-IV / MTS / Patwari (100 Q)</option>
          <option value="J&K Police">J&amp;K Police Constable / SI (100 Q)</option>
          <option value="RRB NTPC">Railway RRB NTPC CBT-1 (100 Q)</option>
          <option value="RRB Group D">Railway RRB Group D (100 Q)</option>
          <option value="RRB ALP / Technician">Railway RRB ALP &amp; Technician (75 Q)</option>
          <option value="IBPS Clerk / PO">IBPS Clerk &amp; PO Prelims (100 Q)</option>
          <option value="SBI Clerk / PO">SBI Clerk &amp; PO Prelims (100 Q)</option>
          <option value="Army GD">Indian Army Agniveer GD (50 Q)</option>
          <option value="Air Force Agniveer">Indian Air Force Agniveervayu (50 Q)</option>
          <option value="Navy SSR / MR">Indian Navy Agniveer SSR / MR (100 Q)</option>
          <option value="BSF / CRPF / Assam Rifles">BSF / CRPF / CISF / Assam Rifles (100 Q)</option>
          <option value="Delhi Police">Delhi Police Constable (100 Q)</option>
          <option value="UP Police">UP Police Constable / SI (150 Q)</option>
          <option value="State Police">All-India State Police Constable (100 Q)</option>
          <option value="DSSSB MTS">DSSSB MTS &amp; Clerical (200 Q)</option>
          <option value="UPSC CSE Prelims">UPSC Civil Services IAS GS-I (100 Q)</option>
          <option value="UPSC NDA">UPSC NDA &amp; NA GAT (150 Q)</option>
          <option value="UPSC CDS">UPSC CDS GK &amp; English (120 Q)</option>
          <option value="UPSSSC PET">UPSSSC PET / Inter Level (100 Q)</option>
          <option value="UPTET / CTET">UPTET / CTET / KVS Teaching (100 Q)</option>
        </select>
        <label class="sju-pro-label" for="sjuMockLangSel">2. Exam Language (English / Hindi):</label>
        <select id="sjuMockLangSel" class="sju-pro-select">
          <option value="en" selected>English Medium</option>
          <option value="hi">Hindi Medium (हिन्दी)</option>
        </select>

        <div class="sju-mini-grid" style="margin-top:8px;">
          <div>
            <label class="sju-pro-label" for="sjuMockSubSel">Subject (Custom Mode):</label>
            <select id="sjuMockSubSel" class="sju-pro-select">
              <option value="All">Full Real Exam Pattern</option>
              <option value="General Knowledge">GK &amp; Current Affairs</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Reasoning">Reasoning</option>
              <option value="English">English</option>
              <option value="General Science">General Science</option>
              <option value="Computer">Computer Awareness</option>
              <option value="Jammu & Kashmir">Jammu &amp; Kashmir GK</option>
            </select>
          </div>
          <div>
            <label class="sju-pro-label" for="sjuMockCountSel">Questions (Custom):</label>
            <select id="sjuMockCountSel" class="sju-pro-select">
              <option value="25">25 Questions</option>
              <option value="50">50 Questions</option>
              <option value="100" selected>100 Questions</option>
            </select>
          </div>
        </div>

        <button id="sjuLaunchRealCbtBtn" class="sju-pro-btn green" type="button">
          Start Real CBT Mock Test Now &rarr;
        </button>
        <button id="sjuLaunchCustomBtn" class="sju-pro-btn dark" type="button" style="margin-top:8px;padding:9px 12px;font-size:0.84rem;">
          Start Subject-Wise Custom Mock &rarr;
        </button>
      </div>

      <!-- 3. NEGATIVE MARKING & CGPA-TO-% CALCULATOR -->
      <div class="sju-pro-card">
        <div class="sju-pro-hdr">
          <h3>Negative Marking &amp; CGPA Calculator</h3>
          <span class="sju-pro-badge green">SMART TOOL</span>
        </div>
        <div class="sju-mini-grid">
          <div>
            <label class="sju-pro-label" for="sjuRightIn">Right Answers:</label>
            <input type="number" id="sjuRightIn" class="sju-pro-input" value="70">
          </div>
          <div>
            <label class="sju-pro-label" for="sjuWrongIn">Wrong Answers:</label>
            <input type="number" id="sjuWrongIn" class="sju-pro-input" value="10">
          </div>
        </div>
        <div class="sju-mini-grid">
          <div>
            <label class="sju-pro-label" for="sjuPosIn">Marks / Right:</label>
            <input type="number" step="0.5" id="sjuPosIn" class="sju-pro-input" value="2">
          </div>
          <div>
            <label class="sju-pro-label" for="sjuNegIn">Negative Marking:</label>
            <select id="sjuNegIn" class="sju-pro-select">
              <option value="0.50">-0.50 (SSC)</option>
              <option value="0.25">-0.25 (JKSSB/Bank)</option>
              <option value="0.333">-1/3 (RRB/UPSC)</option>
              <option value="0">0 (No Negative)</option>
            </select>
          </div>
        </div>
        <button id="sjuCalcNegBtn" class="sju-pro-btn" type="button">Calculate CBT Score</button>
        <div id="sjuNegOut" class="sju-pro-out"></div>

        <div style="display:flex;gap:8px;margin-top:12px;align-items:end;">
          <div style="flex:1;">
            <label class="sju-pro-label" for="sjuCgpaIn" style="margin-top:0;">CGPA to % (x9.5):</label>
            <input type="number" step="0.01" id="sjuCgpaIn" class="sju-pro-input" placeholder="e.g. 7.6">
          </div>
          <button id="sjuCalcCgpaBtn" class="sju-pro-btn green" type="button" style="width:auto;margin-top:0;padding:9px 14px;">Convert</button>
        </div>
        <div id="sjuCgpaRes" class="sju-pro-out"></div>
      </div>
    </div>
  `;

  const footer = document.querySelector('footer');
  if (footer && footer.parentNode) {
    footer.parentNode.insertBefore(container, footer);
  } else {
    document.body.appendChild(container);
  }

  // SSC Region Handler
  const regionMap = {
    NWR: { n: 'North Western Region (NWR - Chandigarh)', u: 'https://www.sscnwr.org/' },
    NR: { n: 'Northern Region (NR - New Delhi)', u: 'https://sscnr.nic.in/' },
    CR: { n: 'Central Region (CR - Prayagraj)', u: 'https://www.ssc-cr.org/' },
    MPR: { n: 'Madhya Pradesh Region (MPR - Raipur)', u: 'https://www.sscmpr.org/' },
    WR: { n: 'Western Region (WR - Mumbai)', u: 'https://www.sscwr.net/' },
    ER: { n: 'Eastern Region (ER - Kolkata)', u: 'https://www.sscer.org/' },
    SR: { n: 'Southern Region (SR - Chennai)', u: 'https://www.sscsr.gov.in/' },
    KKR: { n: 'Karnataka Kerala Region (KKR - Bengaluru)', u: 'https://www.ssckkr.kar.nic.in/' },
    NER: { n: 'North Eastern Region (NER - Guwahati)', u: 'https://www.sscner.org.in/' }
  };

  document.getElementById('sjuNovRegion').addEventListener('change', function () {
    const out = document.getElementById('sjuNovRegionOut');
    const info = regionMap[this.value];
    if (info) {
      out.style.display = 'block';
      out.innerHTML = '<strong>Region:</strong> ' + info.n + '<br><a href="' + info.u + '" target="_blank" rel="noopener noreferrer" style="color:#16a34a;font-weight:700;">Open Official Regional Website &rarr;</a>';
    } else {
      out.style.display = 'none';
    }
  });

  // 1-Click Real CBT Auto-Start Launcher
  document.getElementById('sjuLaunchRealCbtBtn').addEventListener('click', function () {
    const exam = document.getElementById('sjuMockExamSel').value;
    const lang = document.getElementById('sjuMockLangSel')?.value || 'en';
    window.location.href = '/mock-test.html?mode=real&exam=' + encodeURIComponent(exam) + '&lang=' + encodeURIComponent(lang) + '&autostart=1';
  });

  // Subject-Wise Custom Mock Auto-Start Launcher
  document.getElementById('sjuLaunchCustomBtn').addEventListener('click', function () {
    const exam = document.getElementById('sjuMockExamSel').value;
    const sub = document.getElementById('sjuMockSubSel').value;
    const count = document.getElementById('sjuMockCountSel').value;
    const lang = document.getElementById('sjuMockLangSel')?.value || 'en';
    window.location.href = '/mock-test.html?mode=custom&exam=' + encodeURIComponent(exam) + '&lang=' + encodeURIComponent(lang) + '&subject=' + encodeURIComponent(sub) + '&count=' + encodeURIComponent(count) + '&autostart=1';
  });

  // Negative Marking Calculator
  document.getElementById('sjuCalcNegBtn').addEventListener('click', function () {
    const r = parseFloat(document.getElementById('sjuRightIn').value) || 0;
    const w = parseFloat(document.getElementById('sjuWrongIn').value) || 0;
    const p = parseFloat(document.getElementById('sjuPosIn').value) || 1;
    const n = parseFloat(document.getElementById('sjuNegIn').value) || 0;
    const score = (r * p) - (w * n);
    const acc = (r + w) > 0 ? ((r / (r + w)) * 100).toFixed(1) : '0.0';
    const out = document.getElementById('sjuNegOut');
    out.style.display = 'block';
    out.innerHTML = '<strong>Final Score:</strong> ' + score.toFixed(2) + ' marks | <strong>Accuracy:</strong> ' + acc + '%<br><strong>Negative Deducted:</strong> -' + (w * n).toFixed(2) + ' marks';
  });

  // CGPA Converter
  document.getElementById('sjuCalcCgpaBtn').addEventListener('click', function () {
    const c = parseFloat(document.getElementById('sjuCgpaIn').value);
    const out = document.getElementById('sjuCgpaRes');
    if (isNaN(c) || c <= 0 || c > 10) {
      out.style.display = 'block';
      out.innerHTML = 'Please enter valid CGPA (0.1 to 10.0).';
      return;
    }
    out.style.display = 'block';
    out.innerHTML = '<strong>Equivalent Percentage:</strong> ' + (c * 9.5).toFixed(2) + '%';
  });
})();
