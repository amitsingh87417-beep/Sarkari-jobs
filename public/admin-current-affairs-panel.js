(function () {
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function authHeaders(json) {
    const h = { Authorization: "Bearer " + (typeof token !== "undefined" ? token : "") };
    if (json) h["Content-Type"] = "application/json";
    return h;
  }

  function mountAdminCA() {
    const anchor = document.getElementById("adminEngageSuiteBox") || document.getElementById("dailyUpdatesManager") || document.getElementById("contentManager");
    if (!anchor || document.getElementById("adminCurrentAffairsBox")) return;

    const box = document.createElement("div");
    box.className = "admin-panel";
    box.id = "adminCurrentAffairsBox";
    box.style.marginTop = "20px";
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <h3 style="margin:0;">📰 Current Affairs Manager (Auto Important Sync + Manual Add)</h3>
          <p class="muted" style="margin:4px 0 0;">Yahan se aap Important Current Affairs manually add kar sakte hain ya 1-click Auto Sync chala sakte hain.</p>
        </div>
        <button class="btn ghost" type="button" id="caAutoSyncBtn">🔄 Auto-Sync Important Current Affairs Now</button>
      </div>
      <div class="form-msg" id="caSyncMsg" style="margin-top:6px;"></div>

      <h4 class="list-heading">Add New Current Affair</h4>
      <form id="adminCaForm">
        <div class="form-row">
          <label>Headline / Title *<input id="caTitle" required maxlength="180" placeholder="e.g. J&K Khelo India Winter Games 2026 Inaugurated in Gulmarg"></label>
          <label>Category<select id="caCategory">
            <option>Jammu & Kashmir</option>
            <option>National & Polity</option>
            <option>Defence & National</option>
            <option>Economy & Banking</option>
            <option>Sports & Awards</option>
            <option>Science & Tech</option>
          </select></label>
        </div>
        <div class="form-row">
          <label>Date<input type="date" id="caDate" value="${new Date().toISOString().slice(0, 10)}"></label>
          <label>Source Name<input id="caSource" placeholder="e.g. PIB / DIPR J&K / Hindu" value="Admin Desk"></label>
          <label>Important Status<select id="caImportant"><option value="yes">★ Mark as Important</option><option value="no">Regular Update</option></select></label>
        </div>
        <label>Source Link (Optional)<input type="url" id="caSourceUrl" placeholder="https://pib.gov.in/..."></label>
        <label>Exam Notes / Short Summary *<textarea id="caSummary" rows="3" required maxlength="800" placeholder="Exam point-of-view se 2-3 line mein key facts likhein..."></textarea></label>
        <div class="form-actions">
          <button class="btn primary" type="submit">Publish Current Affair →</button>
          <span class="form-msg" id="caFormMsg"></span>
        </div>
      </form>

      <h4 class="list-heading">Published Current Affairs (<span id="caTotalCount">0</span>)</h4>
      <div id="adminCaList"><p class="muted">Sign in to load current affairs.</p></div>
    `;

    anchor.insertAdjacentElement("afterend", box);

    async function loadAdminCA() {
      if (typeof token === "undefined" || !token) return;
      try {
        const r = await fetch("/api/admin/current-affairs", { headers: authHeaders(false) });
        if (!r.ok) return;
        const d = await r.json();
        const items = Array.isArray(d.items) ? d.items : [];
        document.getElementById("caTotalCount").textContent = items.length;
        const listEl = document.getElementById("adminCaList");
        listEl.innerHTML = items.slice(0, 40).map(item => `
          <div class="admin-row">
            <div>
              <b>${item.isImportant ? "⭐ " : ""}${esc(item.title)}</b>
              <small>${esc(item.category)} · ${esc(item.date)} · ${item.addedBy === "admin" ? "Admin" : "Auto"} · ${esc(item.source || "")}</small>
            </div>
            <div>
              <button type="button" data-ca-star="${esc(item.id)}">${item.isImportant ? "Unstar" : "Mark Important"}</button>
              <button type="button" data-ca-del="${esc(item.id)}">Delete</button>
            </div>
          </div>
        `).join("") || "<p>No current affairs published yet.</p>";

        listEl.querySelectorAll("[data-ca-star]").forEach(btn => {
          btn.onclick = async () => {
            await fetch("/api/admin/current-affairs/" + encodeURIComponent(btn.dataset.caStar) + "/important", {
              method: "PATCH",
              headers: authHeaders(false)
            });
            loadAdminCA();
          };
        });

        listEl.querySelectorAll("[data-ca-del]").forEach(btn => {
          btn.onclick = async () => {
            if (!confirm("Delete this current affair?")) return;
            await fetch("/api/admin/current-affairs/" + encodeURIComponent(btn.dataset.caDel), {
              method: "DELETE",
              headers: authHeaders(false)
            });
            loadAdminCA();
          };
        });
      } catch {}
    }

    document.getElementById("adminCaForm").addEventListener("submit", async e => {
      e.preventDefault();
      const msgEl = document.getElementById("caFormMsg");
      msgEl.textContent = "Publishing…";
      msgEl.className = "form-msg";
      try {
        const r = await fetch("/api/admin/current-affairs", {
          method: "POST",
          headers: authHeaders(true),
          body: JSON.stringify({
            title: document.getElementById("caTitle").value,
            category: document.getElementById("caCategory").value,
            date: document.getElementById("caDate").value,
            source: document.getElementById("caSource").value,
            sourceUrl: document.getElementById("caSourceUrl").value,
            summary: document.getElementById("caSummary").value,
            isImportant: document.getElementById("caImportant").value === "yes"
          })
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error || "Failed to publish");
        msgEl.textContent = "✅ Current Affair live ho gaya!";
        msgEl.className = "form-msg ok";
        e.target.reset();
        document.getElementById("caDate").value = new Date().toISOString().slice(0, 10);
        document.getElementById("caSource").value = "Admin Desk";
        loadAdminCA();
      } catch (err) {
        msgEl.textContent = err.message;
      }
    });

    document.getElementById("caAutoSyncBtn").addEventListener("click", async () => {
      const msgEl = document.getElementById("caSyncMsg");
      msgEl.textContent = "Syncing official PIB / News feeds…";
      msgEl.className = "form-msg";
      try {
        const r = await fetch("/api/admin/current-affairs/auto-sync", {
          method: "POST",
          headers: authHeaders(false)
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error || "Sync failed");
        msgEl.textContent = `✅ Auto-sync complete: ${d.added || 0} new items added (Total: ${d.total || 0}).`;
        msgEl.className = "form-msg ok";
        loadAdminCA();
      } catch (err) {
        msgEl.textContent = err.message;
      }
    });

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", () => {
        setTimeout(loadAdminCA, 900);
        setTimeout(loadAdminCA, 2200);
      });
    }
    if (typeof token !== "undefined" && token) {
      loadAdminCA();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAdminCA);
  } else {
    mountAdminCA();
  }
})();
