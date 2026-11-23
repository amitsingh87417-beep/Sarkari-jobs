(function () {
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  let activeMode = "ALL"; // ALL | PRESENT_FORM | RESULT_OUT | ADMIT_CARD
  let searchFilterText = "";

  function detectCardType(cardText, badgeText) {
    const badge = String(badgeText || "").toLowerCase().trim();
    const full = (badge + " " + String(cardText || "")).toLowerCase();

    if (badge.includes("result") || full.includes("result out") || full.includes("final result") || full.includes("merit list") || full.includes("result")) {
      return "RESULT_OUT";
    }
    if (badge.includes("admit") || full.includes("admit card") || full.includes("hall ticket") || full.includes("call letter") || full.includes("admit")) {
      return "ADMIT_CARD";
    }
    if (
      badge.includes("job") ||
      full.includes("apply online") ||
      full.includes("last date") ||
      full.includes("online form") ||
      full.includes("vacancy") ||
      full.includes("vacancies") ||
      full.includes("posts") ||
      full.includes("recruitment") ||
      full.includes("form") ||
      full.includes("job")
    ) {
      return "PRESENT_FORM";
    }
    return "OTHER";
  }

  function updateCounts(counts, totalVisible) {
    const allCnt = document.getElementById("sjuCntAll");
    const formCnt = document.getElementById("sjuCntForm");
    const resCnt = document.getElementById("sjuCntResult");
    const admCnt = document.getElementById("sjuCntAdmit");
    const sumEl = document.getElementById("sjuStatusSummary");

    if (allCnt) allCnt.textContent = String(counts.total);
    if (formCnt) formCnt.textContent = String(counts.PRESENT_FORM);
    if (resCnt) resCnt.textContent = String(counts.RESULT_OUT);
    if (admCnt) admCnt.textContent = String(counts.ADMIT_CARD);
    if (sumEl) {
      sumEl.textContent = `Visible: ${totalVisible} / ${counts.total}`;
    }
  }

  function decorateCards() {
    const grid = document.getElementById("jobGrid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".job-card"));
    if (!cards.length) {
      updateCounts({ total: 0, PRESENT_FORM: 0, RESULT_OUT: 0, ADMIT_CARD: 0 }, 0);
      return;
    }

    const counts = { total: cards.length, PRESENT_FORM: 0, RESULT_OUT: 0, ADMIT_CARD: 0 };
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = card.textContent || "";
      const badgeEl = card.querySelector(".card-top .tag, .badge, .tag, .pill, span");
      const badgeTxt = badgeEl ? badgeEl.textContent : "";
      const kind = detectCardType(text, badgeTxt);
      card.dataset.sjuKind = kind;

      if (kind === "RESULT_OUT") counts.RESULT_OUT++;
      else if (kind === "ADMIT_CARD") counts.ADMIT_CARD++;
      else if (kind === "PRESENT_FORM") counts.PRESENT_FORM++;

      let pill = card.querySelector(".sju-live-pill");
      if (!pill) {
        pill = document.createElement("span");
        pill.className = "sju-live-pill";
        const h3 = card.querySelector("h3");
        if (h3 && h3.parentNode) {
          h3.parentNode.insertBefore(pill, h3);
        } else {
          card.prepend(pill);
        }
      }

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

      const matchesMode = activeMode === "ALL" || kind === activeMode;
      const matchesSearch = !searchFilterText || text.toLowerCase().includes(searchFilterText);
      const shouldShow = matchesMode && matchesSearch;
      card.style.display = shouldShow ? "" : "none";
      if (shouldShow) visibleCount++;
    });

    updateCounts(counts, visibleCount);
  }

  function initFormStatusBar() {
    const grid = document.getElementById("jobGrid");
    if (!grid || document.getElementById("sjuPresentFormBar")) return;

    const bar = document.createElement("div");
    bar.id = "sjuPresentFormBar";
    bar.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:14px;padding:12px 14px;margin-bottom:14px;";
    bar.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;">
        <span style="font-size:12px;font-weight:800;color:#0f172a;">&#9889; Quick Status View:</span>
        <button type="button" data-mode="ALL" class="sju-mode-btn" style="padding:7px 12px;border-radius:9px;border:1px solid #155eef;background:#155eef;color:#fff;font-size:12px;font-weight:800;cursor:pointer;outline:2px solid #0f172a;">Sabhi Updates (<span id="sjuCntAll">0</span>)</button>
        <button type="button" data-mode="PRESENT_FORM" class="sju-mode-btn" style="padding:7px 12px;border-radius:9px;border:1px solid #93c5fd;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:800;cursor:pointer;">&#128994; Present Form Lag Rahe Hain (<span id="sjuCntForm">0</span>)</button>
        <button type="button" data-mode="RESULT_OUT" class="sju-mode-btn" style="padding:7px 12px;border-radius:9px;border:1px solid #86efac;background:#f0fdf4;color:#15803d;font-size:12px;font-weight:800;cursor:pointer;">&#127942; Result Aaya Hai (<span id="sjuCntResult">0</span>)</button>
        <button type="button" data-mode="ADMIT_CARD" class="sju-mode-btn" style="padding:7px 12px;border-radius:9px;border:1px solid #fcd34d;background:#fffbeb;color:#b45309;font-size:12px;font-weight:800;cursor:pointer;">&#127915; Admit Card (<span id="sjuCntAdmit">0</span>)</button>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <input id="sjuQuickStatusSearch" type="search" placeholder="${esc("Quick filter (JKSSB, SSC, Admit...)")}" aria-label="Quick status filter" style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;background:#fff;min-width:170px;">
        <span id="sjuStatusSummary" style="font-size:11px;font-weight:700;color:#475569;">Visible: 0 / 0</span>
        <span style="font-size:11px;color:#64748b;">Admin panel se jo naya Job, Form ya Result add karenge, yahan turant filter hoga</span>
      </div>
    `;

    grid.parentNode.insertBefore(bar, grid);

    bar.querySelectorAll(".sju-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeMode = btn.dataset.mode || "ALL";
        bar.querySelectorAll(".sju-mode-btn").forEach((b) => {
          const isAct = b.dataset.mode === activeMode;
          b.style.outline = isAct ? "2px solid #0f172a" : "none";
        });
        decorateCards();
      });
    });

    const quickInp = document.getElementById("sjuQuickStatusSearch");
    quickInp?.addEventListener("input", () => {
      searchFilterText = (quickInp.value || "").trim().toLowerCase();
      decorateCards();
    });

    decorateCards();
    const obs = new MutationObserver(() => {
      decorateCards();
    });
    obs.observe(grid, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFormStatusBar);
  } else {
    initFormStatusBar();
  }
})();
