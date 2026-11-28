(function () {
  "use strict";

  const USER_ID_KEY = "sju_typing_uid_v1";
  const USER_STATS_KEY = "sju_typing_user_stats_v1";

  function getConfig() {
    const cfg = window.SJU_FIREBASE_CONFIG || {};
    const url = String(cfg.databaseURL || "").trim().replace(/\/+$/, "");
    return {
      databaseURL: url,
      isLive: /^https:\/\/.+\.firebaseio\.com$|^https:\/\/.+\.firebasedatabase\.app$/i.test(url),
      dailyGoalTests: Number(cfg.dailyGoalTests) || 3
    };
  }

  function getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getYesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getUserId() {
    let uid = "";
    try { uid = localStorage.getItem(USER_ID_KEY) || ""; } catch (_) {}
    if (!uid) {
      uid = "u_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
      try { localStorage.setItem(USER_ID_KEY, uid); } catch (_) {}
    }
    return uid;
  }

  function loadLocalStats() {
    const today = getTodayKey();
    const fallback = {
      uid: getUserId(),
      name: "Candidate",
      streak: 0,
      lastActiveDate: "",
      todayDate: today,
      todayTests: 0,
      todayBestWpm: 0,
      todayBestAcc: 0,
      totalTests: 0,
      bestWpm: 0
    };
    try {
      const saved = JSON.parse(localStorage.getItem(USER_STATS_KEY) || "null");
      if (saved && typeof saved === "object") {
        const merged = Object.assign({}, fallback, saved);
        if (merged.todayDate !== today) {
          merged.todayDate = today;
          merged.todayTests = 0;
          merged.todayBestWpm = 0;
          merged.todayBestAcc = 0;
        }
        return merged;
      }
    } catch (_) {}
    return fallback;
  }

  function saveLocalStats(stats) {
    try { localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats)); } catch (_) {}
  }

  function escHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  async function fbGet(path) {
    const cfg = getConfig();
    if (!cfg.isLive) return null;
    const res = await fetch(`${cfg.databaseURL}/${path}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error("Firebase GET failed: " + res.status);
    return await res.json();
  }

  async function fbPut(path, payload) {
    const cfg = getConfig();
    if (!cfg.isLive) return null;
    const res = await fetch(`${cfg.databaseURL}/${path}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Firebase PUT failed: " + res.status);
    return await res.json();
  }

  async function fbPost(path, payload) {
    const cfg = getConfig();
    if (!cfg.isLive) return null;
    const res = await fetch(`${cfg.databaseURL}/${path}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Firebase POST failed: " + res.status);
    return await res.json();
  }

  function renderUserDailyBar(stats) {
    const cfg = getConfig();
    const statusEl = document.getElementById("fbSyncStatusBadge");
    const streakEl = document.getElementById("fbDailyStreak");
    const testsEl = document.getElementById("fbTodayTests");
    const bestEl = document.getElementById("fbTodayBestWpm");
    const goalEl = document.getElementById("fbDailyGoalFill");

    if (statusEl) {
      if (cfg.isLive) {
        statusEl.textContent = "🟢 Firebase Live Sync Active";
        statusEl.style.background = "#ecfdf5";
        statusEl.style.color = "#047857";
        statusEl.style.borderColor = "#a7f3d0";
      } else {
        statusEl.textContent = "🟡 Local Mode (Add Firebase URL in firebase-config.js)";
        statusEl.style.background = "#fffbeb";
        statusEl.style.color = "#b45309";
        statusEl.style.borderColor = "#fde68a";
      }
    }
    if (streakEl) streakEl.textContent = `${stats.streak || 0} Day${(stats.streak || 0) === 1 ? "" : "s"}`;
    if (testsEl) testsEl.textContent = `${stats.todayTests || 0} / ${cfg.dailyGoalTests}`;
    if (bestEl) bestEl.textContent = `${stats.todayBestWpm || 0} WPM`;
    if (goalEl) {
      const pct = Math.min(100, Math.round(((stats.todayTests || 0) / cfg.dailyGoalTests) * 100));
      goalEl.style.width = pct + "%";
    }
  }

  async function syncAndRenderLiveLeaderboard() {
    const cfg = getConfig();
    const el = document.getElementById("dailyLeaderboard");
    if (!cfg.isLive || !el) return null;

    try {
      const today = getTodayKey();
      const raw = await fbGet(`typing_daily/${today}/scores`);
      if (!raw || typeof raw !== "object") return null;

      const myUid = getUserId();
      const byUser = new Map();
      Object.values(raw).forEach(function (row) {
        if (!row || typeof row !== "object") return;
        const wpm = Number(row.wpm) || 0;
        const acc = Number(row.acc) || 0;
        if (wpm <= 0 || wpm > 220) return;
        const key = row.uid || row.name || Math.random().toString(36);
        const prev = byUser.get(key);
        if (!prev || wpm > prev.wpm || (wpm === prev.wpm && acc > prev.acc)) {
          byUser.set(key, {
            uid: row.uid || "",
            name: String(row.name || "Candidate").slice(0, 32),
            exam: String(row.exam || "Daily Test").slice(0, 24),
            wpm: wpm,
            acc: acc,
            isUser: row.uid === myUid
          });
        }
      });

      const list = Array.from(byUser.values())
        .sort(function (a, b) { return b.wpm - a.wpm || b.acc - a.acc; })
        .slice(0, 15);

      if (!list.length) return null;

      el.innerHTML = `<table class="tw-table"><thead><tr><th>Rank</th><th>Candidate</th><th>Exam</th><th>Net Speed</th><th>Accuracy</th></tr></thead><tbody>${
        list.map(function (r, i) {
          const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "#" + (i + 1);
          const star = r.isUser ? " ★" : "";
          return `<tr style="${r.isUser ? "background:#eef4ff;font-weight:800" : ""}"><td>${medal}</td><td>${escHtml(r.name)}${star}</td><td><small>${escHtml(r.exam)}</small></td><td><b>${r.wpm} WPM</b></td><td>${r.acc}%</td></tr>`;
        }).join("")
      }</tbody></table>`;

      return list;
    } catch (err) {
      console.warn("Firebase leaderboard fetch skipped:", err.message);
      return null;
    }
  }

  async function recordDailyTypingTest(payload) {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();
    const stats = loadLocalStats();

    const cleanName = String((payload && payload.name) || stats.name || "Candidate").trim().slice(0, 32) || "Candidate";
    const netWpm = Math.max(0, Math.min(220, Math.round(Number(payload && payload.netWpm) || 0)));
    const acc = Math.max(0, Math.min(100, Math.round(Number(payload && payload.acc) || 0)));
    const exam = String((payload && payload.exam) || "Daily Typing").slice(0, 30);

    // Update streak accurately
    if (stats.lastActiveDate !== today) {
      if (stats.lastActiveDate === yesterday) {
        stats.streak = (stats.streak || 0) + 1;
      } else {
        stats.streak = 1;
      }
      stats.lastActiveDate = today;
    }

    stats.name = cleanName;
    stats.todayDate = today;
    stats.todayTests = (stats.todayTests || 0) + 1;
    stats.totalTests = (stats.totalTests || 0) + 1;
    stats.todayBestWpm = Math.max(stats.todayBestWpm || 0, netWpm);
    stats.todayBestAcc = Math.max(stats.todayBestAcc || 0, acc);
    stats.bestWpm = Math.max(stats.bestWpm || 0, netWpm);
    stats.updatedAt = new Date().toISOString();

    saveLocalStats(stats);
    renderUserDailyBar(stats);

    const cfg = getConfig();
    if (!cfg.isLive) return stats;

    try {
      await fbPut(`typing_users/${stats.uid}`, stats);
      await fbPost(`typing_daily/${today}/scores`, {
        uid: stats.uid,
        name: cleanName,
        exam: exam,
        wpm: netWpm,
        acc: acc,
        ts: Date.now()
      });
      await syncAndRenderLiveLeaderboard();
    } catch (err) {
      console.warn("Firebase typing sync failed (saved locally):", err.message);
    }

    return stats;
  }

  async function initFirebaseTyping() {
    const stats = loadLocalStats();
    renderUserDailyBar(stats);

    const refreshBtn = document.getElementById("refreshFbBoardBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", function () {
        refreshBtn.disabled = true;
        refreshBtn.textContent = "Syncing...";
        syncAndRenderLiveLeaderboard().finally(function () {
          refreshBtn.disabled = false;
          refreshBtn.textContent = "↻ Refresh Live";
        });
      });
    }

    const cfg = getConfig();
    if (cfg.isLive) {
      try {
        const cloudStats = await fbGet(`typing_users/${stats.uid}`);
        if (cloudStats && typeof cloudStats === "object") {
          const today = getTodayKey();
          const merged = Object.assign({}, stats, cloudStats);
          if (merged.todayDate !== today) {
            merged.todayDate = today;
            merged.todayTests = 0;
            merged.todayBestWpm = 0;
            merged.todayBestAcc = 0;
          }
          saveLocalStats(merged);
          renderUserDailyBar(merged);
        }
      } catch (_) {}
      await syncAndRenderLiveLeaderboard();
    }
  }

  window.SJUFirebaseTyping = {
    recordDailyTypingTest: recordDailyTypingTest,
    syncAndRenderLiveLeaderboard: syncAndRenderLiveLeaderboard,
    getStats: loadLocalStats,
    init: initFirebaseTyping
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFirebaseTyping);
  } else {
    initFirebaseTyping();
  }
})();
