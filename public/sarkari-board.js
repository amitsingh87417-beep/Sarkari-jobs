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

  const expanded = {};

  async function initSarkariBoard() {
    const mount = document.getElementById("sarkari-board-suite");
    if (!mount) return;

    let allJobs = [];
    let settings = {
      versionLabel: "v51.0.0 Pro",
      announcement: "Sarkari Job Universe v51.0.0 Pro — 100% Original Career Portal for All 28 States, 8 UTs & J&K",
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
        const hay = [j.title, j.organization, j.category, j.description, j.qualification, j.type, j.region, j.lastDate].join(" ").toLowerCase();
        const jobRegionNorm = normRegion(j.region || "All India");
        const regionOk = !selRegionNorm || jobRegionNorm === selRegionNorm || (selRegionNorm === "india" && jobRegionNorm === "all india");
        const qualHay = [j.qualification, j.title, j.description].join(" ").toLowerCase();
        const qualOk = !qual || (qual === "graduate" ? /graduat|bachelor|degree|b\.e|b\.tech|mbbs|llb|b\.sc|b\.com/i.test(qualHay) : qualHay.includes(qual));
        return (!q || hay.includes(q)) && (!type || j.type === type) && regionOk && (!cat || j.category === cat) && qualOk;
      });
    }

    function renderBoard() {
      const jobs = getFilteredJobs();
      const quickBar = `
        <div class="sb-announce">
          <span class="sb-ver">${esc(settings.versionLabel || "v51.0.0 Pro")}</span>
          <span>${esc(settings.announcement)}</span>
        </div>
        <div class="sb-quick-strip">
          ${jobs.slice(0, 8).map((j, i) => `
            <a class="sb-quick-tile sb-q-${i % 4}" href="/job.html?id=${encodeURIComponent(j.id)}">
              <b>${esc(j.title)}</b>
              <span>${esc(j.badge || j.lastDate || j.type || "Open Details →")}</span>
            </a>
          `).join("")}
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
                const badgeText = j.badge || (/today/i.test(j.lastDate || "") ? "Last Date Today" : "");
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

    // Bind live re-render to top filters & chips
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
