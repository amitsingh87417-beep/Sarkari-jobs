(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function initCurrentAffairs() {
    const mount = document.getElementById("current-affairs-suite");
    if (!mount) return;

    let allItems = [];
    let lastSync = null;
    let selectedCategory = "All";
    let onlyImportant = false;
    let searchQuery = "";
    let showAll = false;

    async function loadCA() {
      try {
        const r = await fetch("/api/current-affairs");
        if (r.ok) {
          const d = await r.json();
          allItems = Array.isArray(d.items) ? d.items : [];
          lastSync = d.lastSync || null;
        }
      } catch {}
    }

    await loadCA();

    function getCategories() {
      const base = ["All", "Jammu & Kashmir", "National & Polity", "Defence & National", "Economy & Banking", "Sports & Awards", "Science & Tech"];
      allItems.forEach(x => {
        if (x.category && !base.includes(x.category)) base.push(x.category);
      });
      return base;
    }

    function render() {
      const categories = getCategories();
      let filtered = allItems.filter(item => {
        if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
        if (onlyImportant && !item.isImportant) return false;
        if (searchQuery) {
          const hay = (item.title + " " + item.summary + " " + item.category + " " + (item.source || "")).toLowerCase();
          if (!hay.includes(searchQuery)) return false;
        }
        return true;
      });

      const visible = showAll ? filtered : filtered.slice(0, 6);

      mount.innerHTML = `
        <section style="max-width:1160px;margin:24px auto;padding:0 16px;" id="daily-current-affairs">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;padding:22px;box-shadow:0 10px 28px rgba(15,23,42,0.05);">
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
              <div>
                <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:800;letter-spacing:.4px;">📰 DAILY EXAM CAPSULE • AUTO + ADMIN VERIFIED</span>
                <h2 style="margin:6px 0 4px;font-size:clamp(22px,3.5vw,28px);color:#0f172a;">Important Current Affairs 2026</h2>
                <p style="margin:0;color:#64748b;font-size:13px;">JKSSB, SSC GD/CHSL, Army, Railway aur Banking exams ke liye rozana important current affairs.</p>
              </div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <button type="button" id="caImpToggle" style="padding:8px 13px;border-radius:10px;border:1px solid ${onlyImportant ? "#d97706" : "#cbd5e1"};background:${onlyImportant ? "#fef3c7" : "#f8fafc"};color:${onlyImportant ? "#b45309" : "#334155"};font-weight:700;font-size:12px;cursor:pointer;">
                  ${onlyImportant ? "⭐ Showing Important Only" : "☆ Filter Important Only"}
                </button>
              </div>
            </div>

            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
              <input type="search" id="caSearchInput" value="${esc(searchQuery)}" placeholder="Search topic (e.g. J&K, ISRO, RBI, Defence, Award)..." style="flex:1;min-width:210px;padding:10px 13px;border:1px solid #cbd5e1;border-radius:10px;font:inherit;font-size:13px;">
            </div>

            <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px;">
              ${categories.map(cat => `
                <button type="button" data-ca-cat="${esc(cat)}" style="padding:6px 12px;border-radius:999px;border:1px solid ${selectedCategory === cat ? "#155eef" : "#e2e8f0"};background:${selectedCategory === cat ? "#155eef" : "#f8fafc"};color:${selectedCategory === cat ? "#ffffff" : "#334155"};font-size:12px;font-weight:700;cursor:pointer;">
                  ${esc(cat)}
                </button>
              `).join("")}
            </div>

            ${visible.length === 0 ? `
              <div style="padding:22px;text-align:center;border:1px dashed #cbd5e1;border-radius:14px;color:#64748b;font-size:13px;">
                Is filter mein abhi koi current affair nahi mila.
              </div>
            ` : `
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:14px;">
                ${visible.map(item => `
                  <article style="border:1px solid ${item.isImportant ? "#bfdbfe" : "#e2e8f0"};background:${item.isImportant ? "#f8fbff" : "#ffffff"};border-radius:15px;padding:15px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
                    <div>
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:7px;">
                        <span style="padding:3px 9px;border-radius:999px;background:#e0e7ff;color:#1e40af;font-size:11px;font-weight:700;">${esc(item.category || "National")}</span>
                        <div style="display:flex;gap:5px;align-items:center;">
                          ${item.isImportant ? `<span style="padding:2px 7px;border-radius:6px;background:#fef3c7;color:#b45309;font-size:10px;font-weight:800;">★ IMPORTANT</span>` : ""}
                          <span style="padding:2px 7px;border-radius:6px;background:${item.addedBy === "admin" ? "#dcfce7" : "#f1f5f9"};color:${item.addedBy === "admin" ? "#15803d" : "#475569"};font-size:10px;font-weight:700;">${item.addedBy === "admin" ? "Admin Pick" : "Auto Feed"}</span>
                        </div>
                      </div>
                      <h3 style="margin:0 0 6px;font-size:15px;line-height:1.45;color:#0f172a;">${esc(item.title)}</h3>
                      <p style="margin:0;font-size:13px;line-height:1.6;color:#475569;">${esc(item.summary)}</p>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding-top:8px;border-top:1px solid #f1f5f9;font-size:11px;color:#64748b;">
                      <span>📅 ${esc(item.date || "")} • ${esc(item.source || "Official")}</span>
                      <div style="display:flex;gap:8px;align-items:center;">
                        ${item.sourceUrl ? `<a href="${esc(item.sourceUrl)}" target="_blank" rel="noopener" style="color:#155eef;font-weight:700;text-decoration:none;">Source ↗</a>` : ""}
                        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent("📰 Important Current Affair (" + (item.date || "") + "):
*" + item.title + "*
" + item.summary + "

Padhein: " + window.location.origin)}" target="_blank" rel="noopener" style="color:#15803d;font-weight:700;text-decoration:none;">Share</a>
                      </div>
                    </div>
                  </article>
                `).join("")}
              </div>
            `}

            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-top:14px;">
              <small style="color:#94a3b8;font-size:11px;">
                Total: ${filtered.length} updates ${lastSync ? " • Last auto-sync: " + new Date(lastSync).toLocaleString() : ""}
              </small>
              ${filtered.length > 6 ? `
                <button type="button" id="caShowMoreBtn" style="padding:8px 14px;border-radius:10px;border:1px solid #cbd5e1;background:#f8fafc;color:#0f172a;font-size:12px;font-weight:700;cursor:pointer;">
                  ${showAll ? "Show Less ↑" : "View All (" + filtered.length + ") ↓"}
                </button>
              ` : ""}
            </div>
          </div>
        </section>
      `;

      document.querySelectorAll("[data-ca-cat]").forEach(btn => {
        btn.addEventListener("click", () => {
          selectedCategory = btn.dataset.caCat;
          showAll = false;
          render();
        });
      });

      const impBtn = document.getElementById("caImpToggle");
      if (impBtn) {
        impBtn.addEventListener("click", () => {
          onlyImportant = !onlyImportant;
          showAll = false;
          render();
        });
      }

      const searchInp = document.getElementById("caSearchInput");
      if (searchInp) {
        searchInp.addEventListener("input", e => {
          searchQuery = e.target.value.trim().toLowerCase();
          showAll = false;
          render();
          const newInp = document.getElementById("caSearchInput");
          if (newInp) {
            newInp.focus();
            newInp.setSelectionRange(newInp.value.length, newInp.value.length);
          }
        });
      }

      const moreBtn = document.getElementById("caShowMoreBtn");
      if (moreBtn) {
        moreBtn.addEventListener("click", () => {
          showAll = !showAll;
          render();
        });
      }
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCurrentAffairs);
  } else {
    initCurrentAffairs();
  }
})();
