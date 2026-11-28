(function () {
  "use strict";

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function safeUrl(v) {
    try {
      const u = new URL(v);
      return ["https:", "http:"].includes(u.protocol) ? u.href : "#";
    } catch {
      return "#";
    }
  }

  function normRegion(v) {
    return String(v || "").toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
  }

  const BOXES = [
    { id: "new-update", title: "Latest Highlights", icon: "⚡", theme: "emerald", match: (j, idx) => j.section === "New Update" || (!j.section && idx < 18) },
    { id: "admit-card", title: "Admit Cards & City Slip", icon: "🎫", theme: "indigo", match: (j) => j.section === "Admit Card" || j.type === "Admit Card" },
    { id: "top-online-form", title: "Top Online Forms", icon: "📝", theme: "royal", match: (j) => j.section === "Top Online Form" || (!j.section && j.type === "Job" && /SSC|JKSSB|UPSC|Railway|Banking|Defence|Police|Teaching|Clerical/i.test(`${j.category} ${j.organization}`)) },
    { id: "other-online-form", title: "More Vacancies", icon: "📋", theme: "slate", match: (j) => j.section === "Other Online Form" || (!j.section && j.type === "Job" && !/Admission|Scholarship|Outsourcing|Certificate/i.test(`${j.category} ${j.section || ""}`)) },
    { id: "results", title: "Results & Scorecards", icon: "🏆", theme: "teal", match: (j) => j.section === "Results" || j.type === "Result" },
    { id: "answer-key", title: "Answer Keys", icon: "🔑", theme: "violet", match: (j) => j.section === "Answer Key" || j.type === "Answer Key" },
    { id: "outsourcing", title: "Contractual / Outsourcing", icon: "💼", theme: "slate", match: (j) => j.section === "Outsourcing" || /outsourc|contract|samvida|ncs|becil/i.test(`${j.title} ${j.category}`) },
    { id: "admission", title: "Admissions & Entrance", icon: "🎓", theme: "indigo", match: (j) => j.section === "Admission Form" || /Admission/i.test(`${j.category} ${j.title}`) },
    { id: "syllabus", title: "Exam Syllabus & Pattern", icon: "📚", theme: "royal", match: (j) => j.section === "Syllabus" || j.type === "Syllabus" },
    { id: "certificate", title: "Citizen Services & Docs", icon: "🪪", theme: "teal", match: (j) => j.section === "Certificate" || /certificate|aadhaar|voter|digilocker|domicile/i.test(`${j.title} ${j.category}`) },
    { id: "scholarships", title: "Scholarships & Schemes", icon: "🌟", theme: "violet", match: (j) => j.section === "Scholarships" || /Scholarship|PMSSS/i.test(`${j.category} ${j.title}`) },
    { id: "jk-special", title: "Jammu & Kashmir Special", icon: "🏔️", theme: "emerald", match: (j) => /jammu|kashmir|jkssb|j&k|ladakh/i.test(`${j.region} ${j.organization} ${j.title}`) }
  ];

  function daysLeftBadge(lastDateStr) {
    if (!lastDateStr) return "";
    if (/today/i.test(lastDateStr)) return "🔥 Last Date Today";
    const parsed = Date.parse(lastDateStr);
    if (!Number.isFinite(parsed)) return "";
    const diffDays = Math.ceil((parsed - Date.now()) / 86400000);
    if (diffDays === 0) return "🔥 Today";
    if (diffDays > 0 && diffDays <= 7) return `⏳ ${diffDays}d Left`;
    return "";
  }

  function isExpiredClient(j) {
    if (!j || (j.type && j.type !== "Job")) return false;
    if (j.section && ["Certificate", "Syllabus", "Results", "Admit Card", "Answer Key"].includes(j.section)) return false;
    const s = String(j.lastDate || "").trim();
    if (!s || /see notice|check|ongoing|always|open|active|district|result|admit|n\/a/i.test(s)) return false;
    const m = s.match(/\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})\b/i);
    const monMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    let dt = null;
    if (m) dt = new Date(Number(m[3]), monMap[m[2].slice(0, 3).toLowerCase()], Number(m[1]), 23, 59, 59);
    else if (/^\d{4}-\d{2}-\d{2}$/.test(s)) dt = new Date(s + "T23:59:59");
    if (!dt || isNaN(dt.getTime())) return false;
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    return dt.getTime() < todayStart.getTime();
  }

  const expanded = {};
  let tickerPaused = false;
  let tickerOffset = 0;

  async function initSarkariBoard() {
    const mount = document.getElementById("sarkari-board-suite");
    if (!mount) return;

    let allJobs = [];
    let settings = {
      versionLabel: "v1.0",
      announcement: "Welcome to Sarkari Job Universe v1.0 — Latest Govt Jobs, Real CBT Mock Tests, Unlimited Practice Questions & Smart Mock Tests & Typing Pro!",
      whatsappUrl: "https://api.whatsapp.com/send?text=Check%20Sarkari%20Job%20Universe",
      telegramUrl: "https://t.me/"
    };

    try {
      const [jr, sr] = await Promise.allSettled([
        fetch("/api/jobs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/site-settings", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null))
      ]);
      if (jr.status === "fulfilled" && jr.value && Array.isArray(jr.value.jobs)) allJobs = jr.value.jobs;
      if (sr.status === "fulfilled" && sr.value) settings = { ...settings, ...sr.value };
    } catch {}

    if (!allJobs.length) {
      try {
        const fb = await fetch("./data/jobs.json", { cache: "no-store" }).then((r) => r.json());
        allJobs = Array.isArray(fb.jobs) ? fb.jobs : Array.isArray(fb) ? fb : [];
      } catch {}
    }

    function getFilteredJobs() {
      const q = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
      const activeChipEl = document.querySelector(".chip[data-chip].active");
      const chipType = activeChipEl ? (activeChipEl.dataset.chip || "") : "";
      const type = chipType || (document.getElementById("typeFilter")?.value || "");
      const region = document.getElementById("regionFilter")?.value || "";
      const cat = document.getElementById("categoryFilter")?.value || "";
      const qual = (document.getElementById("qualFilter")?.value || "").toLowerCase().trim();
      const selRegionNorm = normRegion(region);

      return allJobs.filter((j) => {
        if (isExpiredClient(j)) return false;
        const hay = [j.title, j.organization, j.category, j.description, j.qualification, j.type, j.region, j.lastDate].join(" ").toLowerCase();
        const jobRegionNorm = normRegion(j.region || "All India");
        const regionOk = !selRegionNorm || jobRegionNorm === selRegionNorm || (selRegionNorm === "india" && jobRegionNorm === "all india");
        const qualHay = [j.qualification, j.title, j.description].join(" ").toLowerCase();
        const qualOk = !qual || (qual === "graduate" ? /graduat|bachelor|degree|b\.e|b\.tech|mbbs|llb|b\.sc|b\.com/i.test(qualHay) : qualHay.includes(qual));
        return (!q || hay.includes(q)) && (!type || j.type === type) && regionOk && (!cat || j.category === cat) && qualOk;
      });
    }

    function buildTickerRow(items, offsetIdx, reverse) {
      if (!items.length) return "";
      const rotated = [];
      for (let i = 0; i < Math.min(items.length, 16); i++) {
        rotated.push(items[(i + offsetIdx) % items.length]);
      }
      // Duplicate for seamless infinite slow scroll
      const doubled = rotated.concat(rotated);
      return `
        <div class="sb-marquee-row${reverse ? " sb-marquee-rev" : ""}${tickerPaused ? " sb-paused" : ""}">
          <div class="sb-marquee-track">
            ${doubled.map((j, i) => `
              <a class="sb-quick-tile sb-marquee-card sb-q-${(i + (reverse ? 2 : 0)) % 6}" href="/job.html?id=${encodeURIComponent(j.id)}">
                <div class="sb-tile-top">
                  <span class="sb-tile-type">${esc(j.type || "Job")}</span>
                  <span class="sb-tile-live">● LIVE</span>
                </div>
                <b>${esc(j.title)}</b>
                <span class="sb-tile-meta">${esc(j.badge || j.lastDate || j.organization || "Open Details →")}</span>
              </a>
            `).join("")}
          </div>
        </div>
      `;
    }

    function renderBoard() {
      const jobs = getFilteredJobs();
      const row1Jobs = jobs.filter((_, i) => i % 2 === 0);
      const row2Jobs = jobs.filter((_, i) => i % 2 === 1);
      const fallbackRow2 = row2Jobs.length ? row2Jobs : jobs;

      const quickBar = `
        <div class="sb-announce">
          <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:220px;flex-wrap:wrap">
            <span class="sb-ver">${esc(settings.versionLabel || "v1.0")}</span>
            <span>${esc(settings.announcement)}</span>
          </div>
          <div class="sb-ticker-ctrls">
            <button type="button" id="sbToggleScroll" class="sb-ctrl-btn">${tickerPaused ? "▶ Play Scroll" : "⏸ Pause"}</button>
            <button type="button" id="sbNextBatch" class="sb-ctrl-btn">↻ Next Jobs</button>
          </div>
        </div>
        <div class="sb-marquee-wrap" aria-label="Auto-scrolling latest government jobs">
          ${buildTickerRow(row1Jobs.length ? row1Jobs : jobs, tickerOffset, false)}
          ${buildTickerRow(fallbackRow2, tickerOffset + 3, true)}
        </div>
      `;

      const colsHtml = BOXES.map((box) => {
        const matched = jobs.filter((j, idx) => box.match(j, idx));
        const limit = expanded[box.id] ? matched.length : 10;
        const visible = matched.slice(0, limit);
        const hasMore = matched.length > 10;
        return `
          <div class="sb-box">
            <div class="sb-head sb-head-${box.theme}">
              <h3><span>${box.icon}</span> ${esc(box.title)}</h3>
              <span class="sb-count">${matched.length}</span>
            </div>
            <ul class="sb-list">
              ${visible.length ? visible.map((j) => {
                const badgeText = j.badge || daysLeftBadge(j.lastDate);
                return `
                  <li>
                    <a class="sb-row-link" href="/job.html?id=${encodeURIComponent(j.id)}">
                      <span class="sb-row-text">${esc(j.title)}${badgeText ? ` <em class="sb-pill">${esc(badgeText)}</em>` : ""}</span>
                      <span class="sb-row-arrow">→</span>
                    </a>
                  </li>
                `;
              }).join("") : `<li class="sb-empty">No matching updates in this category for the selected filter.</li>`}
            </ul>
            <div class="sb-foot">
              ${hasMore ? `<button type="button" class="sb-more-btn" data-sb-more="${esc(box.id)}">${expanded[box.id] ? "Show Less ↑" : `View All (${matched.length}) →`}</button>` : `<span style="font-size:11px;color:#64748b;font-weight:700">Showing all items</span>`}
            </div>
          </div>
        `;
      }).join("");

      const tgUrl = safeUrl(settings.telegramUrl);
      const waUrl = safeUrl(settings.whatsappUrl);

      mount.innerHTML = `
        ${quickBar}
        <div class="sb-grid">${colsHtml}</div>
        <div class="sb-social-bar">
          ${tgUrl !== "#" ? `<a class="sb-tg-link" href="${esc(tgUrl)}" target="_blank" rel="noopener">📢 Join Sarkari Job Universe on Telegram ↗</a>` : ""}
          ${waUrl !== "#" ? `<a class="sb-wa-link" href="${esc(waUrl)}" target="_blank" rel="noopener">💬 WhatsApp Job Alerts</a>` : ""}
        </div>
      `;

      document.getElementById("sbToggleScroll")?.addEventListener("click", () => {
        tickerPaused = !tickerPaused;
        renderBoard();
      });

      document.getElementById("sbNextBatch")?.addEventListener("click", () => {
        tickerOffset = (tickerOffset + 4) % Math.max(1, jobs.length);
        renderBoard();
      });

      mount.querySelectorAll("[data-sb-more]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.sbMore;
          expanded[id] = !expanded[id];
          renderBoard();
        });
      });

      if (waUrl !== "#" && !document.getElementById("sjuFloatingWa")) {
        const fab = document.createElement("a");
        fab.id = "sjuFloatingWa";
        fab.href = waUrl;
        fab.target = "_blank";
        fab.rel = "noopener";
        fab.className = "sb-fab-wa";
        fab.textContent = "💬 WhatsApp";
        document.body.appendChild(fab);
      }
    }

    ["searchInput", "typeFilter", "regionFilter", "categoryFilter", "qualFilter"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener(id === "searchInput" ? "input" : "change", renderBoard);
    });
    document.querySelectorAll(".chip[data-chip]").forEach((b) => b.addEventListener("click", () => setTimeout(renderBoard, 20)));
    document.getElementById("resetBtn")?.addEventListener("click", () => setTimeout(renderBoard, 20));

    renderBoard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSarkariBoard);
  } else {
    initSarkariBoard();
  }
})();
