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

  const BOXES = [
    {
      id: "new-update",
      title: "New Update",
      theme: "green",
      match: (j, idx) => j.section === "New Update" || (!j.section && idx < 18)
    },
    {
      id: "admit-card",
      title: "Admit Card",
      theme: "navyred",
      match: (j) => j.section === "Admit Card" || j.type === "Admit Card"
    },
    {
      id: "top-online-form",
      title: "Top Online Form",
      theme: "navyred",
      match: (j) => j.section === "Top Online Form" || (!j.section && j.type === "Job" && /SSC|JKSSB|UPSC|Railway|Banking|Defence|Police|Teaching|Clerical/i.test(`${j.category} ${j.organization}`))
    },
    {
      id: "other-online-form",
      title: "Other Online Form",
      theme: "navyred",
      match: (j) => j.section === "Other Online Form" || (!j.section && j.type === "Job" && !/Admission|Scholarship|Outsourcing|Certificate/i.test(`${j.category} ${j.section || ""}`))
    },
    {
      id: "results",
      title: "Results",
      theme: "navyred",
      match: (j) => j.section === "Results" || j.type === "Result"
    },
    {
      id: "answer-key",
      title: "Answer Key",
      theme: "navyred",
      match: (j) => j.section === "Answer Key" || j.type === "Answer Key"
    },
    {
      id: "outsourcing",
      title: "Outsourcing (संविदा) Jobs",
      theme: "navyred",
      match: (j) => j.section === "Outsourcing" || /outsourc|contract|samvida|ncs|becil/i.test(`${j.title} ${j.category}`)
    },
    {
      id: "admission",
      title: "Admission Form",
      theme: "navyred",
      match: (j) => j.section === "Admission Form" || /Admission/i.test(`${j.category} ${j.title}`)
    },
    {
      id: "syllabus",
      title: "Syllabus",
      theme: "navyred",
      match: (j) => j.section === "Syllabus" || j.type === "Syllabus"
    },
    {
      id: "certificate",
      title: "Certificate / Important",
      theme: "navyred",
      match: (j) => j.section === "Certificate" || /certificate|aadhaar|voter|digilocker|domicile/i.test(`${j.title} ${j.category}`)
    },
    {
      id: "scholarships",
      title: "Scholarships | Up. Form",
      theme: "navyred",
      match: (j) => j.section === "Scholarships" || /Scholarship|PMSSS/i.test(`${j.category} ${j.title}`)
    },
    {
      id: "jk-special",
      title: "Jammu & Kashmir Special",
      theme: "green",
      match: (j) => /jammu|kashmir|jkssb|j&k|ladakh/i.test(`${j.region} ${j.organization} ${j.title}`)
    }
  ];

  const expanded = {};

  async function initSarkariBoard() {
    const mount = document.getElementById("sarkari-board-suite");
    if (!mount) return;

    let jobs = [];
    let settings = {
      versionLabel: "v50.0.0 Pro",
      announcement: "Sarkari Job Universe v50.0.0 Pro — Latest Govt Jobs, Admit Cards, Results, Free Mock Tests, PDFs & Typing Pro!",
      whatsappUrl: "https://api.whatsapp.com/send?text=Check%20Sarkari%20Job%20Universe",
      telegramUrl: "https://t.me/"
    };

    try {
      const [jr, sr] = await Promise.allSettled([
        fetch("/api/jobs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/site-settings", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null))
      ]);
      if (jr.status === "fulfilled" && jr.value && Array.isArray(jr.value.jobs)) {
        jobs = jr.value.jobs;
      }
      if (sr.status === "fulfilled" && sr.value) {
        settings = { ...settings, ...sr.value };
      }
    } catch {}

    if (!jobs.length) {
      try {
        const fb = await fetch("./data/jobs.json", { cache: "no-store" }).then((r) => r.json());
        jobs = Array.isArray(fb.jobs) ? fb.jobs : Array.isArray(fb) ? fb : [];
      } catch {}
    }

    function renderBoard() {
      const quickBar = `
        <div class="sb-announce">
          <span class="sb-ver">${esc(settings.versionLabel || "v50.0.0 Pro")}</span>
          <span>${esc(settings.announcement || "Latest Government Jobs, Admit Cards, Results & Free Exam Preparation")}</span>
        </div>
        <div class="sb-quick-strip">
          ${jobs.slice(0, 8).map((j, i) => `
            <a class="sb-quick-tile sb-q-${i % 4}" href="/job.html?id=${encodeURIComponent(j.id)}">
              <b>${esc(j.title)}</b>
              <span>${esc(j.badge || j.lastDate || j.type || "Check Notice")}</span>
            </a>
          `).join("")}
        </div>
      `;

      const colsHtml = BOXES.map((box) => {
        const matched = jobs.filter((j, idx) => box.match(j, idx));
        const limit = expanded[box.id] ? matched.length : 12;
        const visible = matched.slice(0, limit);
        const hasMore = matched.length > 12;
        return `
          <div class="sb-box">
            <div class="sb-head sb-head-${box.theme}">
              <h3>${esc(box.title)}</h3>
              <span class="sb-count">${matched.length}</span>
            </div>
            <ul class="sb-list">
              ${visible.length ? visible.map((j) => {
                const badgeText = j.badge || (/today/i.test(j.lastDate || "") ? "Last Date Today" : "");
                return `
                  <li>
                    <a href="/job.html?id=${encodeURIComponent(j.id)}">${esc(j.title)}</a>
                    ${badgeText ? `<span class="sb-inline-badge">(${esc(badgeText)})</span>` : ""}
                  </li>
                `;
              }).join("") : `<li class="sb-empty">New updates coming soon — Admin can add posts here anytime.</li>`}
            </ul>
            <div class="sb-foot">
              ${hasMore ? `<button type="button" class="sb-more-btn" data-sb-more="${esc(box.id)}">${expanded[box.id] ? "Show Less ↑" : `View More (${matched.length}) →`}</button>` : `<a class="sb-more-btn" href="#latest-cards">Filter All →</a>`}
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
          ${tgUrl !== "#" ? `<a class="sb-tg-link" href="${esc(tgUrl)}" target="_blank" rel="noopener">📢 Sarkari Job Universe on Telegram : <b>Join Now</b></a>` : ""}
          ${waUrl !== "#" ? `<a class="sb-wa-link" href="${esc(waUrl)}" target="_blank" rel="noopener">💬 Join WhatsApp Alerts</a>` : ""}
        </div>
      `;

      mount.querySelectorAll("[data-sb-more]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.sbMore;
          expanded[id] = !expanded[id];
          renderBoard();
        });
      });

      // Floating WhatsApp button
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

    renderBoard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSarkariBoard);
  } else {
    initSarkariBoard();
  }
})();
