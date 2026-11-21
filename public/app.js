const $ = (s) => document.querySelector(s);
let allJobs = [], activeChip = "", savedOnly = false;
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

    if ($("#updatedAt")) {
      $("#updatedAt").textContent = "Data checked: " + formatUpdatedDate(d.updatedAt);
    }
    if ($("#heroCount")) {
      $("#heroCount").textContent = String(allJobs.length);
    }
    if ($("#statJobs")) {
      $("#statJobs").textContent = String(allJobs.filter((x) => x.type === "Job").length);
    }
    render();
  } catch {
    if ($("#jobGrid")) {
      $("#jobGrid").innerHTML = '<div class="loading">Could not load updates. Please refresh the page.</div>';
    }
  }
}

function render() {
  const q = ($("#searchInput")?.value || "").toLowerCase().trim();
  const type = activeChip || ($("#typeFilter")?.value || "");
  const region = $("#regionFilter")?.value || "";
  const cat = $("#categoryFilter")?.value || "";
  const keep = saved();

  let list = allJobs.filter((j) => {
    const hay = [
      j.title, j.organization, j.category, j.description,
      j.qualification, j.ageLimit, j.type, j.region
    ].join(" ").toLowerCase();

    return (
      (!q || hay.includes(q)) &&
      (!type || j.type === type) &&
      (!region || j.region === region) &&
      (!cat || j.category === cat) &&
      (!savedOnly || keep.includes(j.id))
    );
  });

  if ($("#sortFilter")?.value === "date") {
    list = [...list].sort((a, b) => (Date.parse(a.lastDate) || Infinity) - (Date.parse(b.lastDate) || Infinity));
  }

  if ($("#resultCount")) {
    $("#resultCount").textContent = `Showing ${list.length} update${list.length === 1 ? "" : "s"}`;
  }
  $("#jobGrid")?.classList.toggle("hidden", !list.length);
  $("#emptyState")?.classList.toggle("hidden", !!list.length);

  if ($("#jobGrid")) {
    $("#jobGrid").innerHTML = list.map((j) => {
      const cls = j.type === "Result" ? "result" : j.type === "Admit Card" ? "admit" : "";
      const isSaved = keep.includes(j.id);
      const applyHref = safeUrl(j.applyUrl || j.officialUrl);
      const notifHref = safeUrl(j.officialUrl);

      return `
        <article class="job-card">
          <div class="card-top">
            <span class="tag ${cls}">${esc(j.type || "Job")}</span>
            <span class="region">${esc(j.region || "All India")}</span>
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
            <small>Verify details on official site</small>
            <a class="apply-link" href="${notifHref}" target="_blank" rel="noopener noreferrer">Notification ↗</a>
            ${applyHref !== "#" ? `<a class="apply-link" href="${applyHref}" target="_blank" rel="noopener noreferrer">Apply online ↗</a>` : ""}
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

["searchInput", "typeFilter", "regionFilter", "categoryFilter", "sortFilter"].forEach((id) => {
  $("#" + id)?.addEventListener(id === "searchInput" ? "input" : "change", () => {
    activeChip = "";
    savedOnly = false;
    $("#savedOnlyBtn")?.classList.remove("active");
    document.querySelectorAll(".chip[data-chip]").forEach((x) => x.classList.toggle("active", x.dataset.chip === ""));
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

$("#savedOnlyBtn")?.addEventListener("click", () => {
  savedOnly = !savedOnly;
  $("#savedOnlyBtn")?.classList.toggle("active", savedOnly);
  render();
});

$("#resetBtn")?.addEventListener("click", () => {
  if ($("#searchInput")) $("#searchInput").value = "";
  ["typeFilter", "regionFilter", "categoryFilter"].forEach((x) => {
    if ($("#" + x)) $("#" + x).value = "";
  });
  activeChip = "";
  savedOnly = false;
  $("#savedOnlyBtn")?.classList.remove("active");
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

loadJobs();

fetch("/api/automation/status")
  .then((r) => r.json())
  .then((s) => {
    const el = document.querySelector("#automationNotice");
    if (!el) return;
    el.textContent = s.enabled
      ? "Daily official feed monitor is configured. New discoveries are sent to the admin review queue before publishing."
      : "Daily automatic job discovery is not configured yet. Add verified official RSS/Atom feed URLs to OFFICIAL_RSS_FEEDS in Render. Student daily question and mock tests remain available.";
  })
  .catch(() => {});
