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

  function mountAdminEngage() {
    const anchor = document.getElementById("dailyUpdatesManager") || document.getElementById("contentManager");
    if (!anchor || document.getElementById("adminEngageSuiteBox")) return;

    const box = document.createElement("div");
    box.className = "admin-panel";
    box.id = "adminEngageSuiteBox";
    box.style.marginTop = "20px";
    box.innerHTML = `
      <h3>🏆 Daily Engagement Suite Control (Quiz Leaderboard, Student Poll, Exam Countdowns & Requests)</h3>
      <p class="muted">Yahan se aap roz ka Live Quiz set kar sakte hain, Student Poll badal sakte hain, Exam Countdown timers add kar sakte hain aur students ki PDF/Job requests padh sakte hain.</p>

      <!-- 1. SET DAILY QUIZ -->
      <h4 class="list-heading">1. Set Today's Live Quiz (Toppers Leaderboard ke liye)</h4>
      <form id="adminSuiteQuizForm">
        <div class="form-row">
          <label>Quiz Heading *<input id="sqTitle" required value="Aaj Ka Live GK & Exam Quiz" maxlength="140"></label>
          <label>Reset Today's Leaderboard?<select id="sqResetBoard"><option value="no">No (Keep scores)</option><option value="yes">Yes (Start fresh board)</option></select></label>
        </div>
        <label>Questions JSON (3 se 5 sawal rakhein) *<textarea id="sqQuestions" rows="8" required spellcheck="false">[
  {"question":"Jammu & Kashmir ki winter capital kaunsi hai?","options":["Srinagar","Jammu","Leh","Anantnag"],"answerIndex":1,"explanation":"Jammu winter capital hai aur Srinagar summer capital hai."},
  {"question":"Indian Constitution ka kaunsa Article Right to Equality deta hai?","options":["Article 14","Article 19","Article 21","Article 32"],"answerIndex":0,"explanation":"Article 14 sabhi ko kanoon ke samne barabari deta hai."},
  {"question":"SSC GD aur Army GD mein Bharat ka Rashtriya Khel kaunsa mana jata hai?","options":["Cricket","Hockey","Kabaddi","Football"],"answerIndex":1,"explanation":"Field Hockey Bharat ka traditional national sport hai."}
]</textarea></label>
        <div class="form-actions">
          <button class="btn primary" type="submit">Publish Daily Quiz →</button>
          <span class="form-msg" id="sqMsg"></span>
        </div>
      </form>

      <!-- 2. SET STUDENT POLL -->
      <h4 class="list-heading">2. Set Daily Student Poll</h4>
      <form id="adminSuitePollForm">
        <label>Poll Question *<input id="spQuestion" required value="Aap abhi kis exam ki taiyari kar rahe hain?" maxlength="180"></label>
        <label>Options (Comma se alag likhein, jaise: JKSSB, SSC GD, Army GD, Railway) *<input id="spOptions" required value="JKSSB Exams, SSC GD / CHSL, Army GD / Police, Railway / Banking"></label>
        <div class="form-actions">
          <button class="btn primary" type="submit">Update Live Poll →</button>
          <span class="form-msg" id="spMsg"></span>
        </div>
      </form>

      <!-- 3. EXAM COUNTDOWN RADAR -->
      <h4 class="list-heading">3. Add Exam Countdown Timer</h4>
      <form id="adminSuiteCountdownForm">
        <div class="form-row">
          <label>Exam Name *<input id="scTitle" required placeholder="e.g. SSC GD Constable CBT Exam 2026" maxlength="120"></label>
          <label>Exam Date *<input id="scDate" type="date" required></label>
        </div>
        <div class="form-row">
          <label>Badge Tag<input id="scTag" value="Admit Card Soon" maxlength="50"></label>
          <label>Official Link (Optional)<input id="scLink" type="url" placeholder="https://ssc.gov.in/"></label>
        </div>
        <div class="form-actions">
          <button class="btn primary" type="submit">Add Countdown →</button>
          <span class="form-msg" id="scMsg"></span>
        </div>
      </form>
      <div id="adminCountdownList" style="margin-top:10px;"></div>

      <!-- 4. STUDENT DEMANDS / REQUESTS INBOX -->
      <h4 class="list-heading">4. 📩 Students Ki PDF / Exam Requests (Inbox)</h4>
      <div id="adminDemandsList"></div>
    `;
    anchor.parentNode.insertBefore(box, anchor.nextSibling);

    async function loadAdminSuite() {
      if (typeof token === "undefined" || !token) return;
      try {
        const r = await fetch("/api/admin/engage-suite", { headers: authHeaders(false) });
        if (!r.ok) return;
        const d = await r.json();

        if (d.quiz && d.quiz.title) document.getElementById("sqTitle").value = d.quiz.title;
        if (d.quiz && Array.isArray(d.quiz.questions) && d.quiz.questions.length) {
          document.getElementById("sqQuestions").value = JSON.stringify(d.quiz.questions, null, 2);
        }
        if (d.poll && d.poll.question) {
          document.getElementById("spQuestion").value = d.poll.question;
          if (Array.isArray(d.poll.options)) {
            document.getElementById("spOptions").value = d.poll.options.map(o => o.label).join(", ");
          }
        }

        const cList = document.getElementById("adminCountdownList");
        cList.innerHTML = (d.countdowns || []).map(c => `
          <div class="admin-row">
            <div><b>${esc(c.title)}</b><small>${esc(c.examDate)} · ${esc(c.tag || "")}</small></div>
            <button type="button" data-del-cd="${esc(c.id)}">Remove</button>
          </div>
        `).join("") || "<p class='muted'>Abhi koi exam countdown add nahi hai.</p>";

        cList.querySelectorAll("[data-del-cd]").forEach(b => {
          b.onclick = async () => {
            await fetch("/api/admin/engage-suite/countdown/" + encodeURIComponent(b.dataset.delCd), {
              method: "DELETE", headers: authHeaders(false)
            });
            loadAdminSuite();
          };
        });

        const dList = document.getElementById("adminDemandsList");
        dList.innerHTML = (d.demands || []).map(req => `
          <div class="admin-row">
            <div>
              <b>${esc(req.name)} (${esc(req.exam)})</b>
              <small>${esc((req.createdAt || "").slice(0, 10))}</small>
              <div style="font-size:13px;color:#334155;margin-top:3px;">${esc(req.message)}</div>
            </div>
            <button type="button" data-del-dem="${esc(req.id)}">Done / Delete</button>
          </div>
        `).join("") || "<p class='muted'>Abhi tak koi student request nahi aayi hai.</p>";

        dList.querySelectorAll("[data-del-dem]").forEach(b => {
          b.onclick = async () => {
            await fetch("/api/admin/engage-suite/demand/" + encodeURIComponent(b.dataset.delDem), {
              method: "DELETE", headers: authHeaders(false)
            });
            loadAdminSuite();
          };
        });
      } catch {}
    }

    document.getElementById("adminSuiteQuizForm").addEventListener("submit", async e => {
      e.preventDefault();
      const m = document.getElementById("sqMsg");
      m.textContent = "Saving…"; m.className = "form-msg";
      try {
        const questions = JSON.parse(document.getElementById("sqQuestions").value);
        const r = await fetch("/api/admin/engage-suite/quiz", {
          method: "POST",
          headers: authHeaders(true),
          body: JSON.stringify({
            title: document.getElementById("sqTitle").value,
            resetBoard: document.getElementById("sqResetBoard").value === "yes",
            questions
          })
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error || "Failed");
        m.textContent = "Daily Quiz publish ho gaya!"; m.className = "form-msg ok";
      } catch (err) { m.textContent = err.message; }
    });

    document.getElementById("adminSuitePollForm").addEventListener("submit", async e => {
      e.preventDefault();
      const m = document.getElementById("spMsg");
      m.textContent = "Updating…"; m.className = "form-msg";
      try {
        const options = document.getElementById("spOptions").value.split(",").map(s => s.trim()).filter(Boolean);
        const r = await fetch("/api/admin/engage-suite/poll", {
          method: "POST",
          headers: authHeaders(true),
          body: JSON.stringify({ question: document.getElementById("spQuestion").value, options })
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error || "Failed");
        m.textContent = "Student Poll live ho gaya!"; m.className = "form-msg ok";
      } catch (err) { m.textContent = err.message; }
    });

    document.getElementById("adminSuiteCountdownForm").addEventListener("submit", async e => {
      e.preventDefault();
      const m = document.getElementById("scMsg");
      m.textContent = "Adding…"; m.className = "form-msg";
      try {
        const r = await fetch("/api/admin/engage-suite/countdown", {
          method: "POST",
          headers: authHeaders(true),
          body: JSON.stringify({
            title: document.getElementById("scTitle").value,
            examDate: document.getElementById("scDate").value,
            tag: document.getElementById("scTag").value,
            link: document.getElementById("scLink").value
          })
        });
        const d = await r.json();
        if (!r.ok) throw Error(d.error || "Failed");
        m.textContent = "Countdown add ho gaya!"; m.className = "form-msg ok";
        e.target.reset();
        loadAdminSuite();
      } catch (err) { m.textContent = err.message; }
    });

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", () => {
        setTimeout(loadAdminSuite, 900);
        setTimeout(loadAdminSuite, 2200);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAdminEngage);
  } else {
    mountAdminEngage();
  }
})();
