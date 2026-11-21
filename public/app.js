const $ = (s) => document.querySelector(s);
let allJobs = [], activeChip = "", savedOnly = false, activeOnly = false;
const SAVED_KEY = "sju_saved_jobs_v1";

const saved = () => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
};

if ($("#year")) $("#year").textContent = new Date().getFullYear();

$("#menuBtn")?.addEventListener("click", () => {
  document.querySelector(".topbar")?.classList.toggle("nav-open");
});

function formatUpdatedDate(val) {
  if (!val) return "Recently updated";
  const dt = new Date(val);
  return Number.isNaN(dt.getTime()) ? String(val) : dt.toLocaleString();
}

// Smart Last Date parser supporting YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, "25 Dec 2026"
function parseLastDate(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s || /check|notice|soon|tba|notified|vary|varies/i.test(s)) return null;

  // DD-MM-YYYY or DD/MM/YYYY
  const dmy = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
  if (dmy) {
    const dt = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]), 23, 59, 59);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  // YYYY-MM-DD
  const ymd = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
  if (ymd) {
    const dt = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]), 23, 59, 59);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) {
    parsed.setHours(23, 59, 59, 999);
    return parsed;
  }
  return null;
}

function getJobLiveStatus(job) {
  const dt = parseLastDate(job.lastDate);
  if (!dt) {
    return { key: "check", rank: 2, label: "Verify Notice", isActive: true, daysLeft: null };
  }
  const now = new Date();
  const diffMs = dt.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / 86400000);

  if (diffMs < 0) {
    return { key: "expired", rank: 4, label: "Closed / Expired", isActive: false, daysLeft };
  }
  if (daysLeft <= 5) {
    return {
      key: "soon",
      rank: 0,
      label: daysLeft <= 1 ? "Closing Today!" : `Closing in ${daysLeft}d`,
      isActive: true,
      daysLeft
    };
  }
  return { key: "live", rank: 1, label: `● Present Active (${daysLeft}d left)`, isActive: true, daysLeft };
}

function matchesQualification(job, qualKey) {
  if (!qualKey) return true;
  const hay = [job.qualification, job.title, job.description].join(" ").toLowerCase();
  const rules = {
    "10th": /10th|matric|high school|sslc|class 10|mts|constable/,
    "12th": /12th|10\+2|intermediate|higher secondary|hsc|chsl/,
    "iti": /\biti\b|trade|apprentice|fitter|electrician|welder/,
    "diploma": /diploma|polytechnic|d\.el\.ed|d\.pharm/,
    "graduate": /graduate|graduation|any degree|\bb\.a\b|\bb\.sc\b|\bb\.com\b|bachelor|cgl|upsc|bank/,
    "post graduate": /post graduate|\bpg\b|master|\bm\.a\b|\bm\.sc\b|\bmba\b|\bmca\b/,
    "engineering": /b\.tech|b\.e\b|engineering|engineer|\bje\b|gate/,
    "medical": /mbbs|nursing|gnm|anm|b\.sc nursing|pharmacist|medical|doctor|staff nurse/
  };
  return rules[qualKey] ? rules[qualKey].test(hay) : hay.includes(qualKey);
}

function populateDistrictDatalist() {
  const dl = $("#districtList");
  if (!dl) return;
  const existing = new Set([...dl.querySelectorAll("option")].map((o) => o.value.toLowerCase()));
  allJobs.forEach((j) => {
    const d = String(j.district || "").trim();
    if (d && d.toLowerCase() !== "all districts" && !existing.has(d.toLowerCase())) {
      existing.add(d.toLowerCase());
      const opt = document.createElement("option");
      opt.value = d;
      dl.appendChild(opt);
    }
  });
}

async function fetchJobsPayload() {
  try {
    const r = await fetch("/api/jobs", { cache: "no-store" });
    if (r.ok) return await r.json();
  } catch {}

  const fallback = await fetch("./data/jobs.json", { cache: "no-store" });
  if (!fallback.ok) throw new Error("Failed to load jobs");
  return await fallback.json();
}

async function loadJobs() {
  try {
    const d = await fetchJobsPayload();
    allJobs = Array.isArray(d.jobs) ? d.jobs : Array.isArray(d) ? d : [];

    const activeCount = allJobs.filter((x) => getJobLiveStatus(x).isActive).length;

    if ($("#updatedAt")) {
      $("#updatedAt").textContent = "Last synced: " + formatUpdatedDate(d.updatedAt);
    }
    if ($("#heroCount")) {
      $("#heroCount").textContent = String(allJobs.length);
    }
    if ($("#heroActiveCount")) {
      $("#heroActiveCount").textContent = String(activeCount);
    }
    if ($("#statJobs")) {
      $("#statJobs").textContent = String(allJobs.filter((x) => x.type === "Job").length);
    }
    if ($("#statActive")) {
      $("#statActive").textContent = String(activeCount);
    }

    populateDistrictDatalist();
    render();
  } catch {
    if ($("#jobGrid")) {
      $("#jobGrid").innerHTML = '<div class="loading">Could not load updates. Please refresh the page.</div>';
    }
  }
}

function syncStatePills(selectedState) {
  document.querySelectorAll(".state-pill").forEach((btn) => {
    btn.classList.toggle("active", (btn.dataset.state || "") === (selectedState || ""));
  });
}

function render() {
  const q = ($("#searchInput")?.value || "").toLowerCase().trim();
  const type = activeChip || ($("#typeFilter")?.value || "");
  const region = $("#regionFilter")?.value || "";
  const district = ($("#districtFilter")?.value || "").toLowerCase().trim();
  const qual = $("#qualificationFilter")?.value || "";
  const cat = $("#categoryFilter")?.value || "";
  const sortMode = $("#sortFilter")?.value || "present";
  const keep = saved();

  let list = allJobs.filter((j) => {
    const status = getJobLiveStatus(j);
    const hay = [
      j.title, j.organization, j.category, j.description,
      j.qualification, j.ageLimit, j.type, j.region, j.district, j.notificationNo
    ].join(" ").toLowerCase();

    const regionMatch = !region
      || j.region === region
      || (region === "All India" && (j.region === "India" || j.region === "All India"))
      || (region && hay.includes(region.toLowerCase()));

    const districtMatch = !district
      || String(j.district || "").toLowerCase().includes(district)
      || hay.includes(district);

    return (
      (!q || hay.includes(q)) &&
      (!type || j.type === type) &&
      regionMatch &&
      districtMatch &&
      matchesQualification(j, qual) &&
      (!cat || j.category === cat) &&
      (!activeOnly || status.isActive) &&
      (!savedOnly || keep.includes(j.id))
    );
  });

  if (sortMode === "present") {
    list = [...list].sort((a, b) => {
      const sa = getJobLiveStatus(a);
      const sb = getJobLiveStatus(b);
      if (sa.rank !== sb.rank) return sa.rank - sb.rank;
      if (sa.daysLeft !== null && sb.daysLeft !== null) return sa.daysLeft - sb.daysLeft;
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
  } else if (sortMode === "date") {
    list = [...list].sort((a, b) => {
      const da = parseLastDate(a.lastDate)?.getTime() || Infinity;
      const db = parseLastDate(b.lastDate)?.getTime() || Infinity;
      return da - db;
    });
  } else {
    list = [...list].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }

  if ($("#resultCount")) {
    const activeInList = list.filter((x) => getJobLiveStatus(x).isActive).length;
    $("#resultCount").textContent = `Showing ${list.length} update${list.length === 1 ? "" : "s"} (${activeInList} present active)`;
  }
  $("#jobGrid")?.classList.toggle("hidden", !list.length);
  $("#emptyState")?.classList.toggle("hidden", !!list.length);

  if ($("#jobGrid")) {
    $("#jobGrid").innerHTML = list.map((j) => {
      const cls = j.type === "Result" ? "result" : j.type === "Admit Card" ? "admit" : "";
      const isSaved = keep.includes(j.id);
      const st = getJobLiveStatus(j);
      const applyHref = safeUrl(j.applyUrl || j.officialUrl);
      const notifHref = safeUrl(j.officialUrl);
      const pdfHref = safeUrl(j.pdfUrl || (/\.pdf(\?|$)/i.test(j.officialUrl || "") ? j.officialUrl : ""));
      const districtText = j.district && j.district.toLowerCase() !== "all districts" ? j.district : "";

      return `
        <article class="job-card ${st.key === "expired" ? "is-expired" : ""}">
          <div class="card-top">
            <div>
              <span class="tag ${cls}">${esc(j.type || "Job")}</span>
              <span class="status-badge ${st.key}">${esc(st.label)}</span>
              ${j.sourceType === "auto" ? '<span class="auto-badge">AUTO SYNC</span>' : ""}
            </div>
            <div>
              <span class="region">${esc(j.region || "All India")}</span>
              ${districtText ? `<span class="district-badge">📍 ${esc(districtText)}</span>` : ""}
            </div>
          </div>
          <h3>${esc(j.title)}</h3>
          <div class="org">${esc(j.organization || "")} · ${esc(j.category || "")}</div>
          <p class="job-desc">${esc(j.description || "Check the official notice for full details.")}</p>
          <div class="card-meta">
            <div>Qualification<b>${esc(j.qualification || "See notice")}</b></div>
            <div>Vacancies<b>${esc(j.vacancies || "See notice")}</b></div>
            <div>Last date<b>${esc(j.lastDate || "See notice")}</b></div>
            <div>Exam date<b>${esc(j.examDate || "See notice")}</b></div>
          </div>
          <div class="extra-meta">
            ${j.notificationNo ? `<span>Notification: ${esc(j.notificationNo)}</span>` : ""}
            ${j.ageLimit ? `<span>Age: ${esc(j.ageLimit)}</span>` : ""}
            ${j.applicationFee ? `<span>Fee: ${esc(j.applicationFee)}</span>` : ""}
          </div>
          <div class="card-bottom">
            <button type="button" class="save-job" data-save="${esc(j.id)}" aria-label="${isSaved ? "Remove saved job" : "Save job"}">${isSaved ? "♥ Saved" : "♡ Save"}</button>
            ${pdfHref !== "#"
              ? `<a class="pdf-link" href="${pdfHref}" target="_blank" rel="noopener noreferrer">📄 Official PDF ↗</a>`
              : `<a class="apply-link" href="${notifHref}" target="_blank" rel="noopener noreferrer">📄 Notification ↗</a>`
            }
            ${applyHref !== "#" ? `<a class="apply-link" href="${applyHref}" target="_blank" rel="noopener noreferrer">Apply Online ↗</a>` : ""}
          </div>
        </article>
      `;
    }).join("");

    document.querySelectorAll("[data-save]").forEach((b) => {
      b.addEventListener("click", () => toggleSaved(b.dataset.save));
    });
  }
}

function toggleSaved(id) {
  let a = saved();
  a = a.includes(id) ? a.filter((x) => x !== id) : [...a, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(a));
  render();
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function safeUrl(v) {
  try {
    const u = new URL(v);
    return ["http:", "https:"].includes(u.protocol) ? esc(u.href) : "#";
  } catch {
    return "#";
  }
}

["searchInput", "typeFilter", "regionFilter", "districtFilter", "qualificationFilter", "categoryFilter", "sortFilter"].forEach((id) => {
  const evt = (id === "searchInput" || id === "districtFilter") ? "input" : "change";
  $("#" + id)?.addEventListener(evt, () => {
    if (id === "regionFilter") syncStatePills($("#regionFilter").value);
    activeChip = "";
    savedOnly = false;
    $("#savedOnlyBtn")?.classList.remove("active");
    document.querySelectorAll(".chip[data-chip]").forEach((x) => x.classList.toggle("active", x.dataset.chip === ""));
    render();
  });
});

document.querySelectorAll(".state-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    const st = btn.dataset.state || "";
    if ($("#regionFilter")) $("#regionFilter").value = st;
    syncStatePills(st);
    render();
  });
});

document.querySelectorAll(".chip[data-chip]").forEach((b) => {
  b.addEventListener("click", () => {
    activeChip = b.dataset.chip;
    if ($("#typeFilter")) $("#typeFilter").value = "";
    savedOnly = false;
    $("#savedOnlyBtn")?.classList.remove("active");
    document.querySelectorAll(".chip[data-chip]").forEach((x) => x.classList.toggle("active", x === b));
    render();
  });
});

$("#activeOnlyBtn")?.addEventListener("click", () => {
  activeOnly = !activeOnly;
  $("#activeOnlyBtn")?.classList.toggle("active", activeOnly);
  render();
});

$("#savedOnlyBtn")?.addEventListener("click", () => {
  savedOnly = !savedOnly;
  $("#savedOnlyBtn")?.classList.toggle("active", savedOnly);
  render();
});

$("#resetBtn")?.addEventListener("click", () => {
  if ($("#searchInput")) $("#searchInput").value = "";
  if ($("#districtFilter")) $("#districtFilter").value = "";
  ["typeFilter", "regionFilter", "qualificationFilter", "categoryFilter"].forEach((x) => {
    if ($("#" + x)) $("#" + x).value = "";
  });
  if ($("#sortFilter")) $("#sortFilter").value = "present";
  syncStatePills("");
  activeChip = "";
  savedOnly = false;
  activeOnly = false;
  $("#savedOnlyBtn")?.classList.remove("active");
  $("#activeOnlyBtn")?.classList.remove("active");
  document.querySelectorAll(".chip[data-chip]").forEach((x) => x.classList.toggle("active", !x.dataset.chip));
  render();
});

document.querySelectorAll(".category[data-category]").forEach((b) => {
  b.addEventListener("click", () => {
    if ($("#categoryFilter")) $("#categoryFilter").value = b.dataset.category;
    document.querySelector("#latest")?.scrollIntoView({ behavior: "smooth" });
    render();
  });
});

document.querySelectorAll("[data-qual]").forEach((b) => {
  b.addEventListener("click", () => {
    if ($("#qualificationFilter")) $("#qualificationFilter").value = b.dataset.qual;
    document.querySelector("#latest")?.scrollIntoView({ behavior: "smooth" });
    render();
  });
});

document.querySelectorAll("[data-query]").forEach((b) => {
  b.addEventListener("click", () => {
    if ($("#searchInput")) $("#searchInput").value = b.dataset.query;
    document.querySelector("#latest")?.scrollIntoView({ behavior: "smooth" });
    render();
  });
});

const params = new URLSearchParams(location.search);
if (params.get("q") && $("#searchInput")) {
  $("#searchInput").value = params.get("q");
}
if (params.get("state") && $("#regionFilter")) {
  $("#regionFilter").value = params.get("state");
  syncStatePills(params.get("state"));
}
if (params.get("district") && $("#districtFilter")) {
  $("#districtFilter").value = params.get("district");
}

loadJobs();

fetch("/api/automation/status")
  .then((r) => r.json())
  .then((s) => {
    const el = document.querySelector("#automationNotice");
    if (!el) return;
    if (s.enabled) {
      const last = s.lastRun ? formatUpdatedDate(s.lastRun) : "Running now";
      el.innerHTML = `<b>● Auto Real Govt Jobs Engine Active:</b> Monitoring ${s.feedsConfigured} live feed${s.feedsConfigured === 1 ? "" : "s"} (${s.autoPublish ? "Auto-Publishing Enabled" : "Admin Review Queue"}). Last sync: ${esc(last)} · Next sync: ${esc(s.nextRun || "Every 2 hours")}.`;
    } else {
      el.textContent = "Auto job monitor is paused. Add verified RSS URLs in OFFICIAL_RSS_FEEDS.";
    }
  })
  .catch(() => {});
