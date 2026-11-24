(function () {
  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function init() {
    const mount = document.getElementById("admin-daily-updates-widget");
    if (!mount) return;

    try {
      const res = await fetch("/api/daily-updates");
      if (!res.ok) return;
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      if (!items.length) return;

      const tickerItems = items.slice(0, 6);
      const cards = items.slice(0, 4);

      mount.innerHTML = `
        <div style="max-width:1160px;margin:18px auto;padding:0 16px;">
          <div style="background:#0f2957;color:#fff;border-radius:14px;padding:10px 16px;display:flex;align-items:center;gap:12px;overflow:hidden;box-shadow:0 8px 24px rgba(15,41,87,0.14);">
            <span style="background:#ef4444;color:#fff;font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;white-space:nowrap;letter-spacing:.5px;">📢 LIVE NOTICE</span>
            <div style="display:flex;gap:18px;overflow-x:auto;white-space:nowrap;scrollbar-width:none;font-size:13px;">
              ${tickerItems.map(x => `
                <span>
                  <b style="color:#93c5fd;">[${esc(x.tag || "UPDATE")}]</b> ${esc(x.title)}
                  ${x.link ? `<a href="${esc(x.link)}" target="_blank" rel="noopener" style="color:#fde047;font-weight:700;margin-left:5px;text-decoration:underline;">Open ↗</a>` : ""}
                </span>
              `).join('<span style="opacity:.4;">•</span>')}
            </div>
          </div>

          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;padding:18px 20px;margin-top:12px;box-shadow:0 10px 28px rgba(15,23,42,0.05);">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
              <div>
                <span style="font-size:11px;font-weight:800;color:#155eef;background:#edf4ff;padding:4px 10px;border-radius:999px;">ADMIN VERIFIED BULLETIN</span>
                <h3 style="margin:6px 0 0;font-size:19px;color:#0f172a;">Aaj Ke Important Notices, Notes & Alerts</h3>
              </div>
              <span style="font-size:12px;color:#64748b;">Admin dwara seedha update kiya gaya</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
              ${cards.map(x => `
                <div style="border:1px solid #e5eaf2;border-radius:13px;padding:14px;background:#f8fafc;display:flex;flex-direction:column;justify-content:space-between;">
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;">
                      <span style="font-size:10px;font-weight:800;color:#155eef;background:#dbeafe;padding:3px 8px;border-radius:999px;">${esc(x.tag || "Daily Update")}</span>
                      <span style="font-size:11px;color:#64748b;">${esc((x.createdAt || "").slice(0, 10))}</span>
                    </div>
                    <h4 style="margin:4px 0 6px;font-size:15px;color:#0f172a;">${esc(x.title)}</h4>
                    ${x.body ? `<p style="margin:0 0 10px;font-size:13px;color:#475569;line-height:1.55;">${esc(x.body)}</p>` : ""}
                  </div>
                  ${x.link ? `<a href="${esc(x.link)}" target="_blank" rel="noopener" style="display:inline-block;font-size:12px;font-weight:700;color:#155eef;text-decoration:none;margin-top:4px;">Check Link / PDF ↗</a>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      `;
    } catch {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
