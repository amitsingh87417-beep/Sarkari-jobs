(() => {
  const el = document.querySelector("#jobDetails");
  const sideEl = document.querySelector("#sideLatest");
  const esc = (v) => String(v ?? "See official notification").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = (v) => { try { const u = new URL(v); return ["https:", "http:"].includes(u.protocol) ? u.href : "#"; } catch { return "#"; } };

  fetch("/api/jobs", { cache: "no-store" })
    .then((r) => r.json())
    .then(({ jobs = [] }) => {
      if (sideEl) {
        sideEl.innerHTML = jobs.slice(0, 10).map((item) => `<li><a href="/job.html?id=${encodeURIComponent(item.id)}">${esc(item.title)}</a></li>`).join("");
      }
      const id = new URLSearchParams(location.search).get("id");
      const j = jobs.find((x) => String(x.id) === String(id));
      if (!j) {
        el.innerHTML = '<div class="j-body"><h1>Notice not found</h1><p>This listing may have expired or been removed.</p></div>';
        return;
      }
      document.title = j.title + " | Sarkari Job Universe";
      const apply = link(j.applyUrl || j.officialUrl);
      const notice = link(j.notificationPdf || j.officialUrl);
      const waShare = "https://api.whatsapp.com/send?text=" + encodeURIComponent(`📢 ${j.title}\nOrganization: ${j.organization || ""}\nLast Date: ${j.lastDate || "Check Notice"}\nFull Details: ${location.href}`);

      el.innerHTML = `
        <div class="j-banner">
          <div class="j-pill-row">
            <span class="j-pill">${esc(j.type || "Job")}</span>
            <span class="j-pill">${esc(j.region || "All India")}</span>
            <span class="j-pill">${esc(j.category || "Recruitment")}</span>
            ${j.badge ? `<span class="j-pill" style="background:#ef4444">${esc(j.badge)}</span>` : ""}
          </div>
          <h1>${esc(j.title)}</h1>
          <p>${esc(j.organization || "Official Authority")}${j.notificationNo ? " • Advt. No.: " + esc(j.notificationNo) : ""}</p>
        </div>
        <div class="j-body">
          <p style="font-size:13.5px;color:#334155;line-height:1.7;margin-top:0">${esc(j.description || "Check complete important dates, eligibility, vacancy breakdown and official application links below.")}</p>

          <div class="j-actions">
            <a href="${apply}" target="_blank" rel="noopener">Apply / Official Portal ↗</a>
            <a class="sec" href="${notice}" target="_blank" rel="noopener">Official Notice / PDF ↗</a>
            <a class="sec" href="${esc(j.practicePdf || '/papers/mega-100q-all-india-hard.pdf')}" download style="background:#fef3c7;color:#92400e;border-color:#fcd34d">📄 Free 100Q Practice PDF ↓</a>
            <a class="sec" href="#" onclick="window.print();return false">🖨️ Print / Save PDF</a>
            <a class="wa" href="${waShare}" target="_blank" rel="noopener">📲 Share on WhatsApp</a>
          </div>

          <table class="j-table">
            <thead>
              <tr>
                <th class="j-th-blue" style="width:50%">📅 Important Dates</th>
                <th class="j-th-emerald" style="width:50%">💳 Application Fee &amp; Mode</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ul class="j-ul">
                    <li><b>Application Begin:</b> ${esc(j.startDate || "As per official schedule")}</li>
                    <li><b>Last Date to Apply:</b> <span style="color:#dc2626;font-weight:800">${esc(j.lastDate || "Check Official Notice")}</span></li>
                    <li><b>Exam / Test Date:</b> ${esc(j.examDate || "As per schedule")}</li>
                    <li><b>Admit Card:</b> Available Before Exam</li>
                    ${j.importantDates ? `<li><b>Other Dates:</b> ${esc(j.importantDates)}</li>` : ""}
                  </ul>
                </td>
                <td>
                  <ul class="j-ul">
                    <li><b>Application Fee:</b> ${esc(j.applicationFee || "Check Official Notification")}</li>
                    <li><b>Payment Mode:</b> Pay online via Debit Card, Credit Card, Net Banking or UPI (where applicable).</li>
                    <li><b>Verification:</b> Always confirm exact category-wise fee on the official recruitment portal.</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="j-table">
            <thead>
              <tr><th colspan="2" class="j-th-slate">🎯 Age Limit &amp; Relaxation</th></tr>
            </thead>
            <tbody>
              <tr>
                <td style="width:50%"><b>Age Limit:</b> ${esc(j.ageLimit || "As per official recruitment rules")}</td>
                <td style="width:50%"><b>Age Relaxation:</b> ${esc(j.ageRelaxation || "Extra age relaxation as per category / govt rules")}</td>
              </tr>
            </tbody>
          </table>

          <table class="j-table">
            <thead>
              <tr><th colspan="3" class="j-th-emerald">📋 Vacancy &amp; Educational Eligibility Summary</th></tr>
              <tr>
                <th>Post / Recruitment Title</th>
                <th style="width:140px">Total Posts</th>
                <th>Eligibility / Qualification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>${esc(j.title)}</b><br><small style="color:#64748b">${esc(j.organization || "")}</small></td>
                <td><b>${esc(j.totalPosts || j.vacancies || "As notified")}</b></td>
                <td>${esc(j.qualification || "See official notification for post-wise qualification")}</td>
              </tr>
            </tbody>
          </table>

          <table class="j-table">
            <thead>
              <tr><th class="j-th-blue">🧭 Selection Process &amp; How to Apply</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p style="margin:0 0 8px"><b>Selection Process:</b> ${esc(j.selectionProcess || "Written Exam / CBT / Skill Test / Document Verification as per official notice.")}</p>
                  <p style="margin:0"><b>How to Apply:</b> ${esc(j.howToApply || "Visit the official website linked below, read the complete advertisement, complete OTR/Registration, upload photo & signature in required KB size, and submit before the closing date.")}</p>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="j-table">
            <thead>
              <tr><th colspan="2" class="j-th-slate">🔗 Important Useful Direct Links</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Apply Online / Official Website</b></td>
                <td style="text-align:right"><a class="j-btn-sm" href="${apply}" target="_blank" rel="noopener">Click Here ↗</a></td>
              </tr>
              <tr>
                <td><b>Download Official Notification / Notice</b></td>
                <td style="text-align:right"><a class="j-btn-sm" style="background:#059669" href="${notice}" target="_blank" rel="noopener">Open Notice ↗</a></td>
              </tr>
              <tr>
                <td><b>Download Free 100-Question Hard Practice PDF (For This Exam)</b></td>
                <td style="text-align:right"><a class="j-btn-sm" style="background:#d97706" href="${esc(j.practicePdf || '/papers/mega-100q-all-india-hard.pdf')}" download>⬇ Download 100Q PDF</a></td>
              </tr>
              <tr>
                <td><b>Generate Unlimited Custom 100Q Hard PDF (Smart Exam Engine)</b></td>
                <td style="text-align:right"><a class="j-btn-sm" style="background:#0f766e" href="/api/pdf-sets/generate?set=1&amp;exam=${encodeURIComponent(j.category || j.organization || 'All-India')}&amp;difficulty=Hard">⚡ Generate Fresh PDF</a></td>
              </tr>
              <tr>
                <td><b>Free Real-Paper CBT Mock Test &amp; Typing Pro</b></td>
                <td style="text-align:right"><a class="j-btn-sm" style="background:#7c3aed" href="/mock-test.html">Start CBT Mock →</a></td>
              </tr>
            </tbody>
          </table>

          <p class="muted-note">Disclaimer: Sarkari Job Universe is an independent career information portal. Always verify dates, fees, vacancies, and eligibility directly from the linked official government notification before applying.</p>
        </div>
      `;
    })
    .catch(() => {
      el.innerHTML = '<div class="j-body">Could not load job details. Please refresh and try again.</div>';
    });
})();
