const $ = (s) => document.querySelector(s);
let token = "", jobs = [], fmTimer = null;

const fields = [
  "title", "organization", "category", "region", "type", "status",
  "notificationNo", "ageLimit", "applicationFee", "applyUrl",
  "qualification", "vacancies", "lastDate", "examDate", "startDate", "totalPosts", "ageRelaxation", "selectionProcess", "howToApply", "notificationPdf", "importantDates", "officialUrl", "description"
];

function msg(el, t, ok = false) {
  if (!el) return;
  el.textContent = t;
  el.className = "form-msg" + (ok ? " ok" : "");
}

function auth() {
  return {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json"
  };
}

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

async function api(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const r = await fetch(path, {
    ...options,
    headers: {
      Authorization: "Bearer " + token,
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {})
    }
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
}

// Login
$("#loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg($("#loginMsg"), "Signing in…");
  try {
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: $("#adminPassword")?.value || "" })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Login failed");
    token = d.token;
    $("#loginPanel")?.classList.add("hidden");
    $("#dashboard")?.classList.remove("hidden");
    await loadAllDashboardData();
    startAutoSync();
  } catch (x) {
    msg($("#loginMsg"), x.message);
  }
});

// Logout
$("#logoutBtn")?.addEventListener("click", () => {
  token = "";
  jobs = [];
  if (fmTimer) {
    clearInterval(fmTimer);
    fmTimer = null;
  }
  $("#dashboard")?.classList.add("hidden");
  $("#loginPanel")?.classList.remove("hidden");
  if ($("#adminPassword")) $("#adminPassword").value = "";
});

// Jobs CRUD
async function loadJobs() {
  try {
    const d = await api("/api/admin/jobs");
    jobs = Array.isArray(d.jobs) ? d.jobs : [];
    renderList();
  } catch (e) {
    msg($("#saveMsg"), e.message);
  }
}

function renderList() {
  const listEl = $("#adminList");
  if (!listEl) return;
  listEl.innerHTML = jobs.map((j) => `
    <div class="admin-row">
      <div>
        <b>${esc(j.title)}</b>
        <small>${esc(j.organization)} · ${esc(j.type)} · ${esc(j.status)}</small>
      </div>
      <div>
        <button type="button" data-edit="${esc(j.id)}">Edit</button>
        <button type="button" data-delete="${esc(j.id)}">Delete</button>
      </div>
    </div>
  `).join("") || "<p>No updates added yet.</p>";

  listEl.querySelectorAll("[data-edit]").forEach((b) => {
    b.onclick = () => editJob(b.dataset.edit);
  });
  listEl.querySelectorAll("[data-delete]").forEach((b) => {
    b.onclick = () => removeJob(b.dataset.delete);
  });
}

function clearForm() {
  $("#jobForm")?.reset();
  if ($("#jobId")) $("#jobId").value = "";
  if ($("#saveBtn")) $("#saveBtn").textContent = "Publish update →";
  msg($("#saveMsg"), "");
}

function editJob(id) {
  const j = jobs.find((x) => String(x.id) === String(id));
  if (!j) return;
  if ($("#jobId")) $("#jobId").value = j.id;
  fields.forEach((k) => {
    const el = $("#" + k);
    if (el) el.value = j[k] ?? "";
  });
  if ($("#saveBtn")) $("#saveBtn").textContent = "Save changes →";
  $("#jobForm")?.scrollIntoView({ behavior: "smooth" });
}

if ($("#clearBtn")) $("#clearBtn").onclick = clearForm;

$("#jobForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {};
  fields.forEach((k) => {
    data[k] = $("#" + k)?.value ?? "";
  });
  const id = $("#jobId")?.value || "";
  msg($("#saveMsg"), "Saving…");
  try {
    await api(id ? "/api/admin/jobs/" + encodeURIComponent(id) : "/api/admin/jobs", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(data)
    });
    msg($("#saveMsg"), id ? "Update saved." : "Update added.", true);
    clearForm();
    await loadJobs();
  } catch (x) {
    msg($("#saveMsg"), x.message);
  }
});

async function removeJob(id) {
  if (!confirm("Delete this update?")) return;
  try {
    await api("/api/admin/jobs/" + encodeURIComponent(id), { method: "DELETE" });
    await loadJobs();
  } catch (e) {
    alert(e.message);
  }
}

// Review Queue
async function loadQueue() {
  const qEl = $("#reviewQueue");
  if (!qEl) return;
  try {
    const d = await api("/api/admin/review-queue");
    const items = Array.isArray(d.items) ? d.items : [];
    qEl.innerHTML = items.map((x) => `
      <div class="admin-row">
        <div>
          <b>${esc(x.title)}</b>
          <small>${esc(x.organization)} · Found ${esc(x.foundAt || "")}</small><br>
          <a href="${esc(x.officialUrl)}" target="_blank" rel="noopener">Open source ↗</a>
        </div>
        <div>
          <button type="button" data-approve="${esc(x.id)}">Approve & publish</button>
          <button type="button" data-reject="${esc(x.id)}">Dismiss</button>
        </div>
      </div>
    `).join("") || "<p>No items waiting for review.</p>";

    qEl.querySelectorAll("[data-approve]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm("Have you verified this notice on the official source? Publish it now?")) return;
        const item = items.find((x) => String(x.id) === String(b.dataset.approve));
        if (!item) return;
        try {
          await api("/api/admin/review-queue/" + encodeURIComponent(item.id) + "/approve", {
            method: "POST",
            body: JSON.stringify({
              title: item.title,
              organization: item.organization,
              type: item.type || "Job",
              category: item.category || "Online Form",
              qualification: item.qualification || "",
              ageLimit: item.ageLimit || "",
              lastDate: item.lastDate || "",
              officialUrl: item.officialUrl,
              description: item.description || "",
              status: "published"
            })
          });
          await Promise.all([loadQueue(), loadJobs()]);
        } catch (dd) {
          alert(dd.message);
        }
      };
    });

    qEl.querySelectorAll("[data-reject]").forEach((b) => {
      b.onclick = async () => {
        try {
          await api("/api/admin/review-queue/" + encodeURIComponent(b.dataset.reject), {
            method: "DELETE"
          });
          await loadQueue();
        } catch (err) {
          alert(err.message);
        }
      };
    });
  } catch (e) {
    qEl.textContent = e.message;
  }
}

$("#checkFeedsBtn")?.addEventListener("click", async () => {
  msg(
    $("#saveMsg"),
    "Feed monitor runs automatically every 24 hours when feeds are configured. Restart service after changing Render environment variables."
  );
  await loadQueue();
});

// Content Manager
async function loadContent() {
  if (!token) return;
  try {
    const [rr, tr, br] = await Promise.all([
      api("/api/admin/resources"),
      api("/api/admin/tests"),
      api("/api/admin/trash")
    ]);

    if ($("#resourceList")) {
      $("#resourceList").innerHTML = "<h4>Uploaded resources</h4>" +
        (rr.resources || []).map((x) => `
          <div class="admin-row">
            <div>
              <b>${esc(x.title)}</b>
              <small>${esc(x.category)} · ${esc(x.status)} · <a href="${esc(x.url)}" target="_blank" rel="noopener">Open file</a></small>
            </div>
            <button type="button" data-rdel="${esc(x.id)}">Delete</button>
          </div>
        `).join("") || "<p>No uploads yet.</p>";
    }

    if ($("#testList")) {
      $("#testList").innerHTML = "<h4>Saved mock tests</h4>" +
        (tr.tests || []).map((x) => `
          <div class="admin-row">
            <div>
              <b>${esc(x.title)}</b>
              <small>${esc(x.exam)} · ${(x.questions || []).length} questions · ${esc(x.status)}</small>
            </div>
            <button type="button" data-tdel="${esc(x.id)}">Delete</button>
          </div>
        `).join("") || "<p>No admin tests yet.</p>";
    }

    if ($("#trashList")) {
      $("#trashList").innerHTML = (br.items || []).map((x) => `
        <div class="admin-row">
          <div>
            <b>${esc(x.item?.title || "Deleted item")}</b>
            <small>${esc(x.kind)} · deleted ${esc(x.item?.deletedAt || "")}</small>
          </div>
          <div>
            <button type="button" data-restore="${esc(x.item?.id)}">Restore</button>
            <button type="button" data-purge="${esc(x.item?.id)}">Permanent delete</button>
          </div>
        </div>
      `).join("") || "<p>Trash is empty.</p>";
    }

    document.querySelectorAll("[data-rdel]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm("Move this resource to Trash?")) return;
        await api("/api/admin/resources/" + b.dataset.rdel, { method: "DELETE" });
        await loadContent();
      };
    });

    document.querySelectorAll("[data-tdel]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm("Move this mock test to Trash?")) return;
        await api("/api/admin/tests/" + b.dataset.tdel, { method: "DELETE" });
        await loadContent();
      };
    });

    document.querySelectorAll("[data-restore]").forEach((b) => {
      b.onclick = async () => {
        await api("/api/admin/trash/" + b.dataset.restore + "/restore", { method: "POST" });
        await Promise.all([loadContent(), loadJobs()]);
      };
    });

    document.querySelectorAll("[data-purge]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm("Permanently delete? This cannot be undone.")) return;
        await api("/api/admin/trash/" + b.dataset.purge, { method: "DELETE" });
        await loadContent();
      };
    });
  } catch (e) {
    if ($("#resourceList")) $("#resourceList").textContent = e.message;
  }
}

$("#resourceForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const m = $("#resourceMsg");
  msg(m, "Uploading…");
  try {
    await api("/api/admin/resources", { method: "POST", body: new FormData(f) });
    msg(m, "Uploaded successfully. Published resources are now available in the student library.", true);
    f.reset();
    await Promise.all([loadContent(), loadFileManager()]);
  } catch (x) {
    msg(m, x.message);
  }
});

$("#testForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const m = $("#testMsg");
  const v = Object.fromEntries(new FormData(f));
  msg(m, "Saving mock test…");
  try {
    v.questions = JSON.parse(v.questions);
    await api("/api/admin/tests", { method: "POST", body: JSON.stringify(v) });
    msg(m, "Mock test saved. Published tests are available to students.", true);
    await loadContent();
  } catch (x) {
    msg(m, x.message);
  }
});

// File Manager
async function loadFileManager() {
  if (!token) return;
  try {
    const q = encodeURIComponent($("#fmSearch")?.value || "");
    const folder = encodeURIComponent($("#fmFolder")?.value || "");
    const d = await api(`/api/admin/file-manager?q=${q}&folder=${folder}`);

    const sel = $("#fmFolder");
    if (sel) {
      const current = sel.value;
      const folders = Array.isArray(d.folders) ? d.folders : [];
      sel.innerHTML = '<option value="">All folders</option>' +
        folders.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join("");
      sel.value = current;
    }

    const fmList = $("#fmList");
    if (fmList) {
      fmList.innerHTML = (d.resources || []).map((x) => `
        <div class="admin-row">
          <div>
            <b>${esc(x.title)}</b>
            <small>${esc(x.folder || "General")} · ${esc(x.category)} · ${Math.ceil((x.size || 0) / 1024)} KB · ${esc(x.status)}<br>
            <a href="${esc(x.url)}" target="_blank" rel="noopener">Open file</a></small>
          </div>
          <div>
            <button type="button" data-replace="${esc(x.id)}">Replace</button>
            <button type="button" data-fmdelete="${esc(x.id)}">Trash</button>
            <input hidden type="file" accept="application/pdf,image/jpeg,image/png,image/webp" data-replace-input="${esc(x.id)}">
          </div>
        </div>
      `).join("") || "<p>No matching files.</p>";

      fmList.querySelectorAll("[data-fmdelete]").forEach((b) => {
        b.onclick = async () => {
          if (!confirm("Move this file to Trash?")) return;
          await api("/api/admin/resources/" + b.dataset.fmdelete, { method: "DELETE" });
          await Promise.all([loadContent(), loadFileManager()]);
        };
      });

      fmList.querySelectorAll("[data-replace]").forEach((b) => {
        b.onclick = () => fmList.querySelector(`[data-replace-input="${b.dataset.replace}"]`)?.click();
      });

      fmList.querySelectorAll("[data-replace-input]").forEach((inp) => {
        inp.onchange = async () => {
          if (!inp.files.length) return;
          const fd = new FormData();
          fd.append("file", inp.files[0]);
          try {
            await api(`/api/admin/resources/${inp.dataset.replace}/replace`, {
              method: "POST",
              body: fd
            });
            alert("File replaced successfully");
            await Promise.all([loadContent(), loadFileManager()]);
          } catch (e) {
            alert(e.message);
          }
        };
      });
    }

    if ($("#fmUpdated")) {
      $("#fmUpdated").textContent = "Last synced: " + new Date().toLocaleTimeString();
    }
  } catch (e) {
    if ($("#fmList")) $("#fmList").textContent = e.message;
  }
}

$("#fmSearch")?.addEventListener("input", () => loadFileManager());
$("#fmFolder")?.addEventListener("change", () => loadFileManager());

$("#bulkUploadForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  const files = $("#bulkFiles")?.files || [];
  if (!files.length) return;
  if (files.length > 20) {
    msg($("#bulkMsg"), "Maximum 20 files per batch.");
    return;
  }
  const fd = new FormData(f);
  msg($("#bulkMsg"), "Uploading " + files.length + " files…");
  try {
    const d = await api("/api/admin/resources/bulk", { method: "POST", body: fd });
    msg($("#bulkMsg"), (d.count ?? files.length) + " files uploaded successfully.", true);
    f.reset();
    await Promise.all([loadContent(), loadFileManager()]);
  } catch (x) {
    msg($("#bulkMsg"), x.message);
  }
});

$("#backupBtn")?.addEventListener("click", async () => {
  try {
    const r = await fetch("/api/admin/backup", {
      headers: { Authorization: "Bearer " + token }
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e.error || "Backup failed");
    }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sarkari-job-universe-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert(e.message);
  }
});

async function loadAllDashboardData() {
  if (!token) return;
  await Promise.allSettled([loadJobs(), loadQueue(), loadContent(), loadFileManager()]);
}

function startAutoSync() {
  if (fmTimer) clearInterval(fmTimer);
  fmTimer = setInterval(() => {
    if (token && document.visibilityState === "visible") {
      loadFileManager();
    }
  }, 15000);
}


// Bulk question bank uploader (admin-authenticated).
$("#questionBankUploadForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = $("#questionBankFile")?.files?.[0];
  if (!file) return msg($("#questionBankUploadMsg"), "Choose a JSON file first.");
  try {
    const parsed = JSON.parse(await file.text());
    const questions = Array.isArray(parsed) ? parsed : parsed.questions;
    if (!Array.isArray(questions) || !questions.length) throw new Error("JSON must contain an array of questions.");
    const result = await api("/api/admin/question-bank/bulk", { method: "POST", body: JSON.stringify({ questions }) });
    msg($("#questionBankUploadMsg"), `Added ${result.added}; skipped ${result.skipped}; total bank ${result.total}.`, true);
    event.target.reset();
  } catch (error) { msg($("#questionBankUploadMsg"), error.message || "Upload failed."); }
});
