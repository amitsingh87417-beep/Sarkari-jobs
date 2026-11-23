(function () {
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function getAuthHeaders(json) {
    const h = { Authorization: "Bearer " + (typeof token !== "undefined" ? token : "") };
    if (json) h["Content-Type"] = "application/json";
    return h;
  }

  function mountAdminSection() {
    const contentMgr = document.getElementById("contentManager");
    if (!contentMgr || document.getElementById("dailyUpdatesManager")) return;

    const section = document.createElement("div");
    section.className = "admin-panel";
    section.id = "dailyUpdatesManager";
    section.style.marginTop = "20px";
    section.innerHTML = `
      <h3>📢 Live Notice Ticker & Daily Student Updates (Admin Control)</h3>
      <p class="muted">Yahan se aap jo bhi notice, exam alert, shortcut trick, ya link add karenge wo seedha Home Page aur Student Hub ke top par live dikhega.</p>
      <form id="duForm">
        <input type="hidden" id="duId">
        <div class="form-row">
          <label>Heading / Title *<input id="duTitle" required maxlength="160" placeholder="e.g. JKSSB Constable Admit Card Out / Aaj Ka GK Capsule"></label>
          <label>Badge / Tag<select id="duTag">
            <option>Breaking Alert</option>
            <option>Exam Update</option>
            <option>Daily GK Note</option>
            <option>Admit Card</option>
            <option>Result</option>
            <option>Scholarship</option>
          </select></label>
        </div>
        <label>Details / Short Message<textarea id="duBody" rows="2" maxlength="1000" placeholder="Students ke liye zaroori jankari likhein..."></textarea></label>
        <div class="form-row">
          <label>Direct Link / PDF URL (Optional)<input id="duLink" type="url" placeholder="https://... ya /papers/practice-pack-001.pdf"></label>
          <label>Status<select id="duStatus"><option value="published">Published (Live)</option><option value="draft">Draft (Hidden)</option></select></label>
        </div>
        <div class="form-actions">
          <button class="btn primary" type="submit" id="duSaveBtn">Publish Live Update →</button>
          <button class="btn ghost" type="button" id="duClearBtn">Clear</button>
          <span class="form-msg" id="duMsg"></span>
        </div>
      </form>
      <div id="duList" style="margin-top:14px;"></div>
    `;
    contentMgr.parentNode.insertBefore(section, contentMgr.nextSibling);

    let itemsCache = [];

    async function loadUpdates() {
      if (typeof token === "undefined" || !token) return;
      try {
        const r = await fetch("/api/admin/daily-updates", { headers: getAuthHeaders(false) });
        const d = await r.json();
        if (!r.ok) throw Error(d.error || "Failed");
        itemsCache = d.items || [];
        const list = document.getElementById("duList");
        list.innerHTML = itemsCache.map(x => `
          <div class="admin-row">
            <div>
              <b>${esc(x.title)}</b>
              <small>${esc(x.tag)} · ${esc(x.status)} ${x.link ? `· <a href="${esc(x.link)}" target="_blank" rel="noopener">Link ↗</a>` : ""}</small>
              ${x.body ? `<div style="font-size:12px;color:#64748b;margin-top:3px;">${esc(x.body)}</div>` : ""}
            </div>
            <div>
              <button type="button" data-du-edit="${esc(x.id)}">Edit</button>
              <button type="button" data-du-del="${esc(x.id)}">Delete</button>
            </div>
          </div>
        `).join("") || "<p class='muted'>Abhi koi live notice add nahi kiya gaya hai.</p>";

        list.querySelectorAll("[data-du-edit]").forEach(btn => {
          btn.onclick = () => {
            const it = itemsCache.find(i => i.id === btn.dataset.duEdit);
            if (!it) return;
            document.getElementById("duId").value = it.id;
            document.getElementById("duTitle").value = it.title || "";
            document.getElementById("duTag").value = it.tag || "Breaking Alert";
            document.getElementById("duBody").value = it.body || "";
            document.getElementById("duLink").value = it.link || "";
            document.getElementById("duStatus").value = it.status || "published";
            document.getElementById("duSaveBtn").textContent = "Save Changes →";
            section.scrollIntoView({ behavior: "smooth" });
          };
        });

        list.querySelectorAll("[data-du-del]").forEach(btn => {
          btn.onclick = async () => {
            if (!confirm("Is live update ko delete karein?")) return;
            await fetch("/api/admin/daily-updates/" + encodeURIComponent(btn.dataset.duDel), {
              method: "DELETE",
              headers: getAuthHeaders(false)
            });
            loadUpdates();
          };
        });
      } catch (e) {
        const list = document.getElementById("duList");
        if (list) list.textContent = e.message;
      }
    }

    document.getElementById("duClearBtn").onclick = () => {
      document.getElementById("duForm").reset();
      document.getElementById("duId").value = "";
      document.getElementById("duSaveBtn").textContent = "Publish Live Update →";
      document.getElementById("duMsg").textContent = "";
    };

    document.getElementById("duForm").addEventListener("submit", async e => {
      e.preventDefault();
      const id = document.getElementById("duId").value;
      const m = document.getElementById("duMsg");
      m.textContent = "Saving…";
      m.className = "form-msg";
      const payload = {
        title: document.getElementById("duTitle").value,
        tag: document.getElementById("duTag").value,
        body: document.getElementById("duBody").value,
        link: document.getElementById("duLink").value,
        status: document.getElementById("duStatus").value
      };
      try {
        const url = id ? "/api/admin/daily-updates/" + encodeURIComponent(id) : "/api/admin/daily-updates";
        const r = await fetch(url, {
          method: id ? "PUT" : "POST",
          headers: getAuthHeaders(true),
          body: JSON.stringify(payload)
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error || "Save failed");
        m.textContent = id ? "Update save ho gaya!" : "Live update publish ho gaya!";
        m.className = "form-msg ok";
        document.getElementById("duForm").reset();
        document.getElementById("duId").value = "";
        document.getElementById("duSaveBtn").textContent = "Publish Live Update →";
        loadUpdates();
      } catch (err) {
        m.textContent = err.message;
      }
    });

    // Hook into existing login flow cleanly without modifying admin.js
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", () => {
        setTimeout(loadUpdates, 800);
        setTimeout(loadUpdates, 2000);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAdminSection);
  } else {
    mountAdminSection();
  }
})();
