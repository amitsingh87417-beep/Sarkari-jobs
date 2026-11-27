(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function extractDomain(urlStr) {
    try {
      const u = new URL(urlStr);
      return u.hostname.replace(/^www\./i, "");
    } catch {
      return "";
    }
  }

  function injectTrustBar() {
    const latestSec = document.getElementById("latest");
    if (!latestSec || document.getElementById("sjuOfficialTrustBar")) return;

    const bar = document.createElement("div");
    bar.id = "sjuOfficialTrustBar";
    bar.style.cssText = "background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:12px 16px;margin:12px 0 14px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;";
    bar.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-size:12px;color:#1e3a8a;">
        <span style="background:#1d4ed8;color:#fff;font-weight:800;padding:4px 10px;border-radius:999px;font-size:10px;letter-spacing:.5px;">🛡️ OFFICIAL SOURCE DIRECTORY</span>
        <span><b>✓ Direct Official Portal Links</b></span>
        <span>•</span>
        <span><b>✓ Notification PDF / Notice Reference</b></span>
        <span>•</span>
        <span><b>✓ Active Form & Result Status</b></span>
      </div>
      <span style="font-size:11px;color:#3b82f6;font-weight:700;">Har vacancy apply karne se pehle official notice zaroor check karein</span>
    `;
    const head = latestSec.querySelector(".section-head");
    if (head && head.nextSibling) {
      latestSec.insertBefore(bar, head.nextSibling);
    } else {
      latestSec.prepend(bar);
    }
  }

  function enhanceJobCards() {
    const grid = document.getElementById("jobGrid");
    if (!grid) return;

    grid.querySelectorAll(".job-card").forEach(card => {
      if (card.dataset.sjuProofEnhanced === "1") return;
      card.dataset.sjuProofEnhanced = "1";

      const links = Array.from(card.querySelectorAll("a[href]"));
      const officialLink = links.find(a => {
        const h = (a.getAttribute("href") || "").trim();
        return h.startsWith("http://") || h.startsWith("https://") || h.toLowerCase().endsWith(".pdf");
      });

      const href = officialLink ? officialLink.getAttribute("href") : "";
      const domain = extractDomain(href);
      const isPdf = href.toLowerCase().includes(".pdf");

      const strip = document.createElement("div");
      strip.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;padding-top:8px;border-top:1px dashed #e2e8f0;font-size:11px;";

      const leftHtml = domain
        ? `<span style="color:#0f172a;font-weight:700;">🔗 Source: <span style="color:#155eef;">${esc(domain)}</span></span>`
        : `<span style="color:#64748b;">📌 Official Notification Reference</span>`;

      const rightHtml = href
        ? `<a href="${esc(href)}" target="_blank" rel="noopener" style="background:#eef2ff;color:#1d4ed8;padding:4px 9px;border-radius:7px;font-weight:800;text-decoration:none;">${isPdf ? "📄 Open Notice PDF ↗" : "🌐 Official Notice / Link ↗"}</a>`
        : "";

      strip.innerHTML = `<div>${leftHtml}</div><div>${rightHtml}</div>`;
      card.appendChild(strip);
    });
  }

  function init() {
    injectTrustBar();
    enhanceJobCards();
    const grid = document.getElementById("jobGrid");
    if (grid) {
      const obs = new MutationObserver(() => {
        injectTrustBar();
        enhanceJobCards();
      });
      obs.observe(grid, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
