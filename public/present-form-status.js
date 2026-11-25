(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  let activeMode = "ALL"; // ALL | PRESENT_FORM | RESULT_OUT | ADMIT_CARD

  function detectCardType(cardText, badgeText) {
    const t = (badgeText + " " + cardText).toLowerCase();
    if (t.includes("result")) return "RESULT_OUT";
    if (t.includes("admit")) return "ADMIT_CARD";
    if (t.includes("apply") || t.includes("last date") || t.includes("form") || t.includes("vacancy") || t.includes("posts") || t.includes("job")) {
      return "PRESENT_FORM";
    }
    return "OTHER";
  }

  function decorateCards() {
    const grid = document.getElementById("jobGrid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".job-card"));
    if (!cards.length) return;

    cards.forEach(card => {
      const text = card.textContent || "";
      const badgeEl = card.querySelector(".badge, .tag, .pill, span");
      const badgeTxt = badgeEl ? badgeEl.textContent : "";
      const kind = detectCardType(text, badgeTxt);
      card.dataset.sjuKind = kind;

      if (!card.querySelector(".sju-live-pill")) {
        const pill = document.createElement("span");
        pill.className = "sju-live-pill";
        if (kind === "RESULT_OUT") {
          pill.textContent = "🏆 RESULT OUT";
          pill.style.cssText = "display:inline-block;background:#dcfce7;color:#15803d;font-size:10px;font-weight:800;padding:3px 9px;border-radius:999px;margin-bottom:6px;margin-right:6px;";
        } else if (kind === "ADMIT_CARD") {
          pill.textContent = "🎫 ADMIT CARD";
          pill.style.cssText = "display:inline-block;background:#fef3c7;color:#b45309;font-size:10px;font-weight:800;padding:3px 9px;border-radius:999px;margin-bottom:6px;margin-right:6px;";
        } else {
          pill.textContent = "🟢 FORM OPEN / APPLY";
          pill.style.cssText = "display:inline-block;background:#dbeafe;color:#1d4ed8;font-size:10px;font-weight:800;padding:3px 9px;border-radius:999px;margin-bottom:6px;margin-right:6px;";
        }
        const h3 = card.querySelector("h3");
        if (h3 && h3.parentNode) {
          h3.parentNode.insertBefore(pill, h3);
        } else {
          card.prepend(pill);
        }
      }

      if (activeMode === "ALL") {
        card.style.display = "";
      } else {
        card.style.display = (kind === activeMode) ? "" : "none";
      }
    });
  }

  function initFormStatusBar() {
    const grid = document.getElementById("jobGrid");
    if (!grid || document.getElementById("sjuPresentFormBar")) return;

    const bar = document.createElement("div");
    bar.id = "sjuPresentFormBar";
    bar.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:14px;padding:12px 14px;margin-bottom:14px;";
    bar.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;">
        <span style="font-size:12px;font-weight:800;color:#0f172a;">⚡ Quick Status View:</span>
        <button type="button" data-mode="ALL" class="sju-mode-btn" style="padding:7px 12px;border-radius:9px;border:1px solid #155eef;background:#155eef;color:#fff;font-size:12px;font-weight:800;cursor:pointer;">Sabhi Updates</button>
        <button type="button" data-mode="PRESENT_FORM" class="sju-mode-btn" style="padding:7px 12px;border-radius:9px;border:1px solid #93c5fd;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:800;cursor:pointer;">🟢 Present Form Lag Rahe Hain</button>
        <button type="button" data-mode="RESULT_OUT" class="sju-mode-btn" style="padding:7px 12px;border-radius:9px;border:1px solid #86efac;background:#f0fdf4;color:#15803d;font-size:12px;font-weight:800;cursor:pointer;">🏆 Result Aaya Hai</button>
        <button type="button" data-mode="ADMIT_CARD" class="sju-mode-btn" style="padding:7px 12px;border-radius:9px;border:1px solid #fcd34d;background:#fffbeb;color:#b45309;font-size:12px;font-weight:800;cursor:pointer;">🎫 Admit Card</button>
      </div>
      <span style="font-size:11px;color:#64748b;">Admin panel se jo naya Job, Form ya Result add karenge, yahan turant filter hoga</span>
    `;

    grid.parentNode.insertBefore(bar, grid);

    bar.querySelectorAll(".sju-mode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeMode = btn.dataset.mode;
        bar.querySelectorAll(".sju-mode-btn").forEach(b => {
          const isAct = b.dataset.mode === activeMode;
          b.style.outline = isAct ? "2px solid #0f172a" : "none";
        });
        decorateCards();
      });
    });

    decorateCards();
    const obs = new MutationObserver(decorateCards);
    obs.observe(grid, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFormStatusBar);
  } else {
    initFormStatusBar();
  }
})();
