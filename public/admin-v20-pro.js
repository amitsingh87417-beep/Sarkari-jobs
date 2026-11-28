(function () {
  "use strict";

  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function authHeaders(json) {
    const h = { Authorization: "Bearer " + (typeof token !== "undefined" ? token : "") };
    if (json) h["Content-Type"] = "application/json";
    return h;
  }

  function mountV20Panels() {
    const qbForm = document.getElementById("questionBankUploadForm");
    if (qbForm && !document.getElementById("adminQbStudioBox")) {
      const qbBox = document.createElement("div");
      qbBox.className = "admin-panel";
      qbBox.id = "adminQbStudioBox";
      qbBox.style.marginTop = "16px";
      qbBox.innerHTML = `
        <h3>❓ Question Bank Studio (Add Single Question + Search / Delete)</h3>
        <p class="muted">Bulk JSON upload ke alawa aap yahan se seedha ek-ek MCQ add kar sakte hain aur poora Question Bank search ya delete kar sakte hain.</p>
        <form id="singleQbForm">
          <div class="form-row">
            <label>Category / Subject *
              <select id="sqbCat">
                <option>GK</option>
                <option>Jammu &amp; Kashmir GK</option>
                <option>Mathematics</option>
                <option>Reasoning</option>
                <option>Science</option>
                <option>Computer</option>
                <option>English</option>
                <option>Polity</option>
                <option>Defence GK</option>
              </select>
            </label>
            <label>Correct Option *
              <select id="sqbAns">
                <option value="0">Option A</option>
                <option value="1">Option B</option>
                <option value="2">Option C</option>
                <option value="3">Option D</option>
              </select>
            </label>
          </div>
          <label>Question Text *<textarea id="sqbQ" rows="2" required maxlength="1200" placeholder="Enter question here..."></textarea></label>
          <div class="form-row">
            <label>Option A *<input id="sqbA" required maxlength="300" placeholder="Option A"></label>
            <label>Option B *<input id="sqbB" required maxlength="300" placeholder="Option B"></label>
          </div>
          <div class="form-row">
            <label>Option C *<input id="sqbC" required maxlength="300" placeholder="Option C"></label>
            <label>Option D *<input id="sqbD" required maxlength="300" placeholder="Option D"></label>
          </div>
          <label>Explanation (Optional)<input id="sqbExp" maxlength="1200" placeholder="Short explanation for students..."></label>
          <div class="form-actions">
            <button class="btn primary" type="submit">+ Add Question to Bank</button>
            <span class="form-msg" id="sqbMsg"></span>
          </div>
        </form>

        <h4 class="list-heading">Manage Saved Questions (<span id="qbTotalLbl">0</span>)</h4>
        <div class="form-row" style="margin-bottom:10px">
          <input id="qbSearchInput" type="search" placeholder="Search questions by text or topic...">
          <select id="qbCatFilter"><option value="all">All categories</option></select>
        </div>
        <div id="adminQbList" style="max-height:360px;overflow-y:auto"><p class="muted">Sign in to manage Question Bank.</p></div>
      `;
      qbForm.insertAdjacentElement("afterend", qbBox);

      async function loadQbList() {
        if (typeof token === "undefined" || !token) return;
        const q = encodeURIComponent(document.getElementById("qbSearchInput")?.value || "");
        const cat = encodeURIComponent(document.getElementById("qbCatFilter")?.value || "all");
        try {
          const r = await fetch(`/api/admin/question-bank?q=${q}&category=${cat}`, { headers: authHeaders(false) });
          if (!r.ok) return;
          const d = await r.json();
          document.getElementById("qbTotalLbl").textContent = `${d.filteredTotal} / ${d.total}`;
          const sel = document.getElementById("qbCatFilter");
          if (sel && Array.isArray(d.categories)) {
            const cur = sel.value;
            sel.innerHTML = '<option value="all">All categories</option>' + d.categories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
            if ([...sel.options].some((o) => o.value === cur)) sel.value = cur;
          }
          const listEl = document.getElementById("adminQbList");
          listEl.innerHTML = (d.items || []).map((item) => `
            <div class="admin-row">
              <div>
                <b>[${esc(item.category)}] ${esc(item.question)}</b>
                <small>Ans: ${esc((item.options || [])[item.answer] || "")}</small>
              </div>
              <button type="button" data-qb-del="${item._idx}">Delete</button>
            </div>
          `).join("") || "<p class='muted'>No matching questions found.</p>";

          listEl.querySelectorAll("[data-qb-del]").forEach((btn) => {
            btn.onclick = async () => {
              if (!confirm("Delete this question from the Question Bank?")) return;
              await fetch("/api/admin/question-bank/" + encodeURIComponent(btn.dataset.qbDel), {
                method: "DELETE",
                headers: authHeaders(false)
              });
              loadQbList();
              if (typeof loadStats === "function") loadStats();
            };
          });
        } catch {}
      }

      document.getElementById("singleQbForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const m = document.getElementById("sqbMsg");
        m.textContent = "Adding…";
        m.className = "form-msg";
        try {
          const r = await fetch("/api/admin/question-bank", {
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({
              category: document.getElementById("sqbCat").value,
              question: document.getElementById("sqbQ").value,
              options: [
                document.getElementById("sqbA").value,
                document.getElementById("sqbB").value,
                document.getElementById("sqbC").value,
                document.getElementById("sqbD").value
              ],
              answer: Number(document.getElementById("sqbAns").value),
              explanation: document.getElementById("sqbExp").value
            })
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || "Failed to add question");
          m.textContent = `✅ Added! Total bank: ${d.total} questions.`;
          m.className = "form-msg ok";
          e.target.reset();
          loadQbList();
          if (typeof loadStats === "function") loadStats();
        } catch (err) {
          m.textContent = err.message;
        }
      });

      document.getElementById("qbSearchInput").addEventListener("input", loadQbList);
      document.getElementById("qbCatFilter").addEventListener("change", loadQbList);

      const loginForm = document.getElementById("loginForm");
      if (loginForm) {
        loginForm.addEventListener("submit", () => {
          setTimeout(loadQbList, 1000);
          setTimeout(loadQbList, 2400);
        });
      }
      if (typeof token !== "undefined" && token) loadQbList();
    }

    // Site Settings & Social Links Panel
    const anchor = document.getElementById("adminCurrentAffairsBox") || document.getElementById("contentManager");
    if (anchor && !document.getElementById("adminSiteSettingsBox")) {
      const sBox = document.createElement("div");
      sBox.className = "admin-panel";
      sBox.id = "adminSiteSettingsBox";
      sBox.style.marginTop = "20px";
      sBox.innerHTML = `
        <h3>⚙️ Website Settings &amp; Social Channel Links (v1.0)</h3>
        <p class="muted">Homepage announcement banner, WhatsApp Channel/Group link aur Telegram Channel link yahan se seedha update karein.</p>
        <form id="siteSettingsForm">
          <div class="form-row">
            <label>Version Badge Label<input id="ssVer" maxlength="40" value="v1.0"></label>
            <label>Contact Email<input id="ssEmail" type="email" maxlength="120" value="sarkarjob5417@gmail.com"></label>
          </div>
          <label>Top Announcement Banner Text<input id="ssAnn" maxlength="300" placeholder="Welcome to Sarkari Job Universe v1.0..."></label>
          <div class="form-row">
            <label>WhatsApp Channel / Group URL<input id="ssWa" type="url" placeholder="https://whatsapp.com/channel/..."></label>
            <label>Telegram Channel URL<input id="ssTg" type="url" placeholder="https://t.me/yourchannel"></label>
          </div>
          <div class="form-actions">
            <button class="btn primary" type="submit">Save Website Settings →</button>
            <span class="form-msg" id="ssMsg"></span>
          </div>
        </form>
      `;
      anchor.insertAdjacentElement("afterend", sBox);

      async function loadSiteSettings() {
        try {
          const r = await fetch("/api/site-settings");
          if (!r.ok) return;
          const d = await r.json();
          if (d.versionLabel) document.getElementById("ssVer").value = d.versionLabel;
          if (d.contactEmail) document.getElementById("ssEmail").value = d.contactEmail;
          if (d.announcement !== undefined) document.getElementById("ssAnn").value = d.announcement;
          if (d.whatsappUrl) document.getElementById("ssWa").value = d.whatsappUrl;
          if (d.telegramUrl) document.getElementById("ssTg").value = d.telegramUrl;
        } catch {}
      }

      document.getElementById("siteSettingsForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const m = document.getElementById("ssMsg");
        m.textContent = "Saving…";
        m.className = "form-msg";
        try {
          const r = await fetch("/api/admin/site-settings", {
            method: "PUT",
            headers: authHeaders(true),
            body: JSON.stringify({
              versionLabel: document.getElementById("ssVer").value,
              contactEmail: document.getElementById("ssEmail").value,
              announcement: document.getElementById("ssAnn").value,
              whatsappUrl: document.getElementById("ssWa").value,
              telegramUrl: document.getElementById("ssTg").value
            })
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error || "Save failed");
          m.textContent = "✅ Website settings live update ho gayi!";
          m.className = "form-msg ok";
        } catch (err) {
          m.textContent = err.message;
        }
      });

      loadSiteSettings();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountV20Panels);
  } else {
    mountV20Panels();
  }
})();
