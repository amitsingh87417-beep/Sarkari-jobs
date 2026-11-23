const chapters = [
  {"subject": "General Knowledge", "title": "Indian History: Ancient India", "id": "general-knowledge-1"},
  {"subject": "General Knowledge", "title": "Indian History: Medieval India", "id": "general-knowledge-2"},
  {"subject": "General Knowledge", "title": "Indian History: Modern India", "id": "general-knowledge-3"},
  {"subject": "General Knowledge", "title": "Indian National Movement", "id": "general-knowledge-4"},
  {"subject": "General Knowledge", "title": "Indian Constitution: Preamble & Features", "id": "general-knowledge-5"},
  {"subject": "General Knowledge", "title": "Fundamental Rights and Duties", "id": "general-knowledge-6"},
  {"subject": "General Knowledge", "title": "Parliament and Law-making", "id": "general-knowledge-7"},
  {"subject": "General Knowledge", "title": "President, Prime Minister & Council", "id": "general-knowledge-8"},
  {"subject": "General Knowledge", "title": "Judiciary and Constitutional Bodies", "id": "general-knowledge-9"},
  {"subject": "General Knowledge", "title": "Indian Geography: Physical Features", "id": "general-knowledge-10"},
  {"subject": "General Knowledge", "title": "Indian Geography: Rivers and Lakes", "id": "general-knowledge-11"},
  {"subject": "General Knowledge", "title": "Climate, Soil and Agriculture", "id": "general-knowledge-12"},
  {"subject": "General Knowledge", "title": "World Geography Basics", "id": "general-knowledge-13"},
  {"subject": "General Knowledge", "title": "Indian Economy: Basic Concepts", "id": "general-knowledge-14"},
  {"subject": "General Knowledge", "title": "Budget, Banking and RBI", "id": "general-knowledge-15"},
  {"subject": "General Knowledge", "title": "Science: Physics Fundamentals", "id": "general-knowledge-16"},
  {"subject": "General Knowledge", "title": "Science: Chemistry Fundamentals", "id": "general-knowledge-17"},
  {"subject": "General Knowledge", "title": "Science: Biology Fundamentals", "id": "general-knowledge-18"},
  {"subject": "General Knowledge", "title": "Environment and Ecology", "id": "general-knowledge-19"},
  {"subject": "General Knowledge", "title": "Awards, Books, Sports and Important Days", "id": "general-knowledge-20"},
  {"subject": "Mathematics", "title": "Number System", "id": "mathematics-1"},
  {"subject": "Mathematics", "title": "Simplification and BODMAS", "id": "mathematics-2"},
  {"subject": "Mathematics", "title": "HCF and LCM", "id": "mathematics-3"},
  {"subject": "Mathematics", "title": "Fractions and Decimals", "id": "mathematics-4"},
  {"subject": "Mathematics", "title": "Percentage", "id": "mathematics-5"},
  {"subject": "Mathematics", "title": "Ratio and Proportion", "id": "mathematics-6"},
  {"subject": "Mathematics", "title": "Average", "id": "mathematics-7"},
  {"subject": "Mathematics", "title": "Profit and Loss", "id": "mathematics-8"},
  {"subject": "Mathematics", "title": "Discount", "id": "mathematics-9"},
  {"subject": "Mathematics", "title": "Simple Interest", "id": "mathematics-10"},
  {"subject": "Mathematics", "title": "Compound Interest", "id": "mathematics-11"},
  {"subject": "Mathematics", "title": "Time and Work", "id": "mathematics-12"},
  {"subject": "Mathematics", "title": "Pipes and Cisterns", "id": "mathematics-13"},
  {"subject": "Mathematics", "title": "Time, Speed and Distance", "id": "mathematics-14"},
  {"subject": "Mathematics", "title": "Trains and Boats", "id": "mathematics-15"},
  {"subject": "Mathematics", "title": "Mensuration: 2D", "id": "mathematics-16"},
  {"subject": "Mathematics", "title": "Mensuration: 3D", "id": "mathematics-17"},
  {"subject": "Mathematics", "title": "Algebra Basics", "id": "mathematics-18"},
  {"subject": "Mathematics", "title": "Geometry and Triangles", "id": "mathematics-19"},
  {"subject": "Mathematics", "title": "Data Interpretation", "id": "mathematics-20"},
  {"subject": "Reasoning", "title": "Analogy", "id": "reasoning-1"},
  {"subject": "Reasoning", "title": "Classification", "id": "reasoning-2"},
  {"subject": "Reasoning", "title": "Number Series", "id": "reasoning-3"},
  {"subject": "Reasoning", "title": "Alphabet Series", "id": "reasoning-4"},
  {"subject": "Reasoning", "title": "Coding and Decoding", "id": "reasoning-5"},
  {"subject": "Reasoning", "title": "Blood Relations", "id": "reasoning-6"},
  {"subject": "Reasoning", "title": "Direction Sense", "id": "reasoning-7"},
  {"subject": "Reasoning", "title": "Order and Ranking", "id": "reasoning-8"},
  {"subject": "Reasoning", "title": "Word Arrangement", "id": "reasoning-9"},
  {"subject": "Reasoning", "title": "Syllogism", "id": "reasoning-10"},
  {"subject": "Reasoning", "title": "Venn Diagrams", "id": "reasoning-11"},
  {"subject": "Reasoning", "title": "Statement and Conclusion", "id": "reasoning-12"},
  {"subject": "Reasoning", "title": "Seating Arrangement", "id": "reasoning-13"},
  {"subject": "Reasoning", "title": "Puzzle Test", "id": "reasoning-14"},
  {"subject": "Reasoning", "title": "Calendar", "id": "reasoning-15"},
  {"subject": "Reasoning", "title": "Clock", "id": "reasoning-16"},
  {"subject": "Reasoning", "title": "Mirror and Water Images", "id": "reasoning-17"},
  {"subject": "Reasoning", "title": "Paper Folding and Cutting", "id": "reasoning-18"},
  {"subject": "Reasoning", "title": "Embedded Figures", "id": "reasoning-19"},
  {"subject": "Reasoning", "title": "Non-verbal Reasoning", "id": "reasoning-20"},
  {"subject": "English", "title": "Parts of Speech", "id": "english-1"},
  {"subject": "English", "title": "Nouns and Pronouns", "id": "english-2"},
  {"subject": "English", "title": "Verbs and Tenses", "id": "english-3"},
  {"subject": "English", "title": "Subject-Verb Agreement", "id": "english-4"},
  {"subject": "English", "title": "Articles and Determiners", "id": "english-5"},
  {"subject": "English", "title": "Prepositions", "id": "english-6"},
  {"subject": "English", "title": "Conjunctions", "id": "english-7"},
  {"subject": "English", "title": "Active and Passive Voice", "id": "english-8"},
  {"subject": "English", "title": "Direct and Indirect Speech", "id": "english-9"},
  {"subject": "English", "title": "Error Spotting", "id": "english-10"},
  {"subject": "English", "title": "Sentence Improvement", "id": "english-11"},
  {"subject": "English", "title": "Fill in the Blanks", "id": "english-12"},
  {"subject": "English", "title": "Synonyms and Antonyms", "id": "english-13"},
  {"subject": "English", "title": "One-word Substitution", "id": "english-14"},
  {"subject": "English", "title": "Idioms and Phrases", "id": "english-15"},
  {"subject": "English", "title": "Spelling Correction", "id": "english-16"},
  {"subject": "English", "title": "Cloze Test", "id": "english-17"},
  {"subject": "English", "title": "Reading Comprehension", "id": "english-18"},
  {"subject": "English", "title": "Para Jumbles", "id": "english-19"},
  {"subject": "English", "title": "Vocabulary Practice", "id": "english-20"},
  {"subject": "Jammu & Kashmir", "title": "J&K History", "id": "jammu-and-kashmir-1"},
  {"subject": "Jammu & Kashmir", "title": "J&K Geography", "id": "jammu-and-kashmir-2"},
  {"subject": "Jammu & Kashmir", "title": "Districts and Divisions", "id": "jammu-and-kashmir-3"},
  {"subject": "Jammu & Kashmir", "title": "Rivers and Lakes of J&K", "id": "jammu-and-kashmir-4"},
  {"subject": "Jammu & Kashmir", "title": "Mountains and Passes", "id": "jammu-and-kashmir-5"},
  {"subject": "Jammu & Kashmir", "title": "Climate and Agriculture", "id": "jammu-and-kashmir-6"},
  {"subject": "Jammu & Kashmir", "title": "National Parks and Wildlife", "id": "jammu-and-kashmir-7"},
  {"subject": "Jammu & Kashmir", "title": "Culture, Languages and Festivals", "id": "jammu-and-kashmir-8"},
  {"subject": "Jammu & Kashmir", "title": "Famous Personalities", "id": "jammu-and-kashmir-9"},
  {"subject": "Jammu & Kashmir", "title": "J&K Administration and Economy", "id": "jammu-and-kashmir-10"},
  {"subject": "Computer Awareness", "title": "Computer Fundamentals", "id": "computer-awareness-1"},
  {"subject": "Computer Awareness", "title": "Hardware and Software", "id": "computer-awareness-2"},
  {"subject": "Computer Awareness", "title": "Input and Output Devices", "id": "computer-awareness-3"},
  {"subject": "Computer Awareness", "title": "Memory and Storage", "id": "computer-awareness-4"},
  {"subject": "Computer Awareness", "title": "Operating Systems", "id": "computer-awareness-5"},
  {"subject": "Computer Awareness", "title": "MS Word and Spreadsheet Basics", "id": "computer-awareness-6"},
  {"subject": "Computer Awareness", "title": "Internet and Networking", "id": "computer-awareness-7"},
  {"subject": "Computer Awareness", "title": "Email and Cyber Safety", "id": "computer-awareness-8"},
  {"subject": "Computer Awareness", "title": "Digital Payments and UPI", "id": "computer-awareness-9"},
  {"subject": "Computer Awareness", "title": "Computer Abbreviations", "id": "computer-awareness-10"}
];

const $ = (s) => document.querySelector(s);
const today = new Date().toLocaleDateString("en-CA");
const planKey = "sju_daily_plan_v1";
let typingTimer = null, typingEnd = 0, typingStarted = 0, typingActive = false;

const escapeHTML = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

function loadPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(planKey) || "{}");
    const values = saved.date === today && Array.isArray(saved.done) ? saved.done : [];
    document.querySelectorAll("#dailyPlan input").forEach((x) => {
      x.checked = values.includes(x.value);
    });
  } catch {}
  updatePlan();
}

function updatePlan() {
  const checks = [...document.querySelectorAll("#dailyPlan input")];
  const done = checks.filter((x) => x.checked).length;
  if ($("#doneCount")) $("#doneCount").textContent = done + "/4";
  if ($("#planMessage")) {
    $("#planMessage").textContent = done === 4
      ? "Daily goals complete — excellent consistency!"
      : `${done} of 4 goals completed. Keep your pace steady.`;
  }
  try {
    localStorage.setItem(planKey, JSON.stringify({
      date: today,
      done: checks.filter((x) => x.checked).map((x) => x.value)
    }));
  } catch {}
}

document.querySelectorAll("#dailyPlan input").forEach((x) => x.addEventListener("change", updatePlan));
loadPlan();

const subjects = [...new Set(chapters.map((c) => c.subject))];
subjects.forEach((s) => $("#subjectFilter")?.insertAdjacentHTML("beforeend", `<option>${escapeHTML(s)}</option>`));

const syllabusKey = "sju_syllabus_done_v1";
function getSyllabusDone() {
  try {
    return JSON.parse(localStorage.getItem(syllabusKey) || "[]");
  } catch {
    return [];
  }
}

function updateSyllabusProgress() {
  const done = getSyllabusDone();
  const total = chapters.length;
  const pct = Math.round((done.length / total) * 100);
  ["#syllabusCount", "#chapterProgressText"].forEach((sel) => {
    const el = $(sel);
    if (el) el.textContent = `${done.length} / ${total} completed`;
  });
  ["#syllabusPercent"].forEach((sel) => {
    const el = $(sel);
    if (el) el.textContent = pct + "%";
  });
  ["#syllabusBar", "#chapterProgressBar"].forEach((sel) => {
    const el = $(sel);
    if (el) el.style.width = pct + "%";
  });
}

function renderChapters() {
  const q = ($("#chapterSearch")?.value || "").toLowerCase();
  const sub = $("#subjectFilter")?.value || "";
  const done = getSyllabusDone();
  const items = chapters.filter((c) => (!sub || c.subject === sub) && (!q || (c.title + " " + c.subject).toLowerCase().includes(q)));
  const grid = $("#chapterGrid");
  if (!grid) return;

  grid.innerHTML = items.map((c) => `
    <div class="chapter">
      <label><input type="checkbox" data-syllabus="${escapeHTML(c.id)}" ${done.includes(c.id) ? "checked" : ""}> Completed</label>
      <button class="chapter-open" type="button" data-chapter="${escapeHTML(c.title)}"><small>${escapeHTML(c.subject)}</small><b>${escapeHTML(c.title)}</b></button>
    </div>
  `).join("") || "<p>No chapters match your search.</p>";

  document.querySelectorAll("[data-chapter]").forEach((b) => {
    b.addEventListener("click", () => {
      if ($("#qTopic")) $("#qTopic").value = b.dataset.chapter;
      $("#quickquiz")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-syllabus]").forEach((box) => {
    box.addEventListener("change", () => {
      const next = new Set(getSyllabusDone());
      if (box.checked) next.add(box.dataset.syllabus);
      else next.delete(box.dataset.syllabus);
      try {
        localStorage.setItem(syllabusKey, JSON.stringify([...next]));
      } catch {}
      updateSyllabusProgress();
    });
  });

  updateSyllabusProgress();
}

$("#chapterSearch")?.addEventListener("input", renderChapters);
$("#subjectFilter")?.addEventListener("change", renderChapters);
renderChapters();

$("#quickQuizForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const out = $("#quizOutput");
  if (!out) return;
  out.innerHTML = '<div class="study-panel">Preparing your practice set&hellip;</div>';
  try {
    const r = await fetch("/api/mock-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam: $("#qExam")?.value || "SSC GD",
        topic: $("#qTopic")?.value || "General Knowledge",
        difficulty: $("#qLevel")?.value || "Medium",
        count: Number($("#qCount")?.value || 10)
      })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Could not create practice set");
    const qs = Array.isArray(d.questions) ? d.questions : [];
    const answers = {};

    out.innerHTML = `
      <div class="pill-note">${escapeHTML(d.source || "Practice set")} &middot; ${qs.length} questions</div>
      <div id="quickQuestions">
        ${qs.map((q, i) => `
          <article class="quiz-q">
            <b>${i + 1}. ${escapeHTML(q.question)}</b>
            <div>${(q.options || []).map((o, j) => `<button type="button" data-q="${i}" data-a="${j}">${String.fromCharCode(65 + j)}. ${escapeHTML(o)}</button>`).join("")}</div>
            <div class="muted-small" id="explain-${i}"></div>
          </article>
        `).join("")}
      </div>
      <button class="btn primary" id="submitQuick" type="button">Check my answers</button>
      <div id="quickScore"></div>
      <p class="muted-small">${escapeHTML(d.note || "Review each explanation after submitting.")}</p>
    `;

    out.querySelectorAll("[data-q]").forEach((b) => {
      b.addEventListener("click", () => {
        answers[b.dataset.q] = Number(b.dataset.a);
        out.querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach((x) => x.classList.toggle("chosen", x === b));
      });
    });

    $("#submitQuick")?.addEventListener("click", () => {
      let score = 0;
      qs.forEach((q, i) => {
        if (answers[i] === q.answerIndex) score++;
        const expEl = $(`#explain-${i}`);
        if (expEl) {
          expEl.textContent = `${answers[i] === q.answerIndex ? "Correct." : "Correct answer: " + ((q.options || [])[q.answerIndex] || "") + ". "} ${q.explanation || ""}`;
        }
      });
      if ($("#quickScore")) {
        $("#quickScore").innerHTML = `<div class="study-panel"><h2>Score: ${score}/${qs.length}</h2><p>${Math.round((score / Math.max(1, qs.length)) * 100)}% &middot; ${score === qs.length ? "Perfect set!" : "Review the explanations and practise again."}</p></div>`;
      }
      if ($("#submitQuick")) $("#submitQuick").disabled = true;
    });
  } catch (err) {
    out.innerHTML = `<div class="study-panel">${escapeHTML(err.message)}</div>`;
  }
});

const PASSAGE_BANKS = {
  hard: [
    "Constitutional jurisprudence, administrative accountability, statutory interpretation, fiscal federalism, and judicial review demand rigorous analytical precision under high-pressure examination conditions. Every aspirant must master complex syntax, hyphenated compound terms, numerical ratios (18:24:36), punctuation marks (;:—), and dense paragraphs without sacrificing accuracy or rhythm.",
    "Jammu and Kashmir geography spans Pir Panjal and Zanskar ranges, alpine passes like Zoji La (3,528m) and Banihal, tectonic and glacial lakes including Wular, Dal, Mansar, and Surinsar, and river basins of Jhelum, Chenab, Ravi, and Tawi. High-speed typing across technical terminology builds mental stamina for SSC, JKSSB, RRB, and defence clerical tests.",
    "Cryptography, distributed consensus, asynchronous event loops, relational indexing, memory-mapped files, and zero-trust authentication form the backbone of modern computing systems. Practicing sustained keystrokes across dense multi-clause sentences sharpens finger endurance and reduces typographical errors during long exam shifts.",
    "Macroeconomic stabilization, monetary transmission mechanisms, capital account convertibility, sovereign bond yields, inflation targeting, and supply-chain resilience require disciplined comprehension and rapid recall. Keep typing continuously: if you select Unlimited Auto-Extending Wall, new hard passages keep loading automatically."
  ],
  medium: [
    "Government recruitment examinations test clarity of thought, speed with accuracy, and calm decision making within strict time limits. Regular daily revision of polity, geography, arithmetic, and reasoning helps candidates stay confident across every shift.",
    "Consistent practice improves typing rhythm and reduces unnecessary pauses between words. Focus on smooth finger movement, proper posture, and reading two or three words ahead while typing each sentence.",
    "A structured study routine combines short topic notes, timed practice sets, error review, and daily typing drills. Checking mistakes after every session ensures the same error is not repeated in the final test."
  ],
  easy: [
    "Practice every day to build speed and accuracy. Read each word carefully and type with steady rhythm.",
    "Hard work and daily revision help you succeed in exams. Stay calm, keep learning, and track your progress.",
    "Simple daily habits create big results over time. Type each line cleanly and check your score after the timer ends."
  ]
};

let passageIndex = 0;
let customPassageText = "";
let activeHindiWall = false;
const WALL_500K_TARGET = 500000;
const KEY_GOAL_1MIN = 20000;
const TYPING_STATS_KEY = "sju_typing_advance_stats_v1";
const typingHindi = "भारत का संविधान देश का सर्वोच्च कानून है। नियमित अभ्यास, सही योजना और समय का अच्छा उपयोग प्रतियोगी परीक्षाओं की तैयारी में मदद करता है। प्रत्येक प्रश्न को ध्यान से पढ़ें और अपनी गलतियों से सीखें।";

let totalKeystrokesTyped = 0;
let backspaceCount = 0;
let lastInputLen = 0;
let lastValidValue = "";

function loadTypingAdvanceStats() {
  try {
    return JSON.parse(localStorage.getItem(TYPING_STATS_KEY) || "null") || {
      streak: 0,
      lastDate: "",
      bestWpm: 0,
      weakWords: {},
      sessions: []
    };
  } catch {
    return { streak: 0, lastDate: "", bestWpm: 0, weakWords: {}, sessions: [] };
  }
}

function saveTypingAdvanceStats(st) {
  try { localStorage.setItem(TYPING_STATS_KEY, JSON.stringify(st)); } catch {}
}

function renderTypingAdvancePanels() {
  const st = loadTypingAdvanceStats();
  const badge = $("#typingStreakBadge");
  if (badge) {
    badge.textContent = `Streak: ${st.streak || 0} days | Best: ${st.bestWpm || 0} WPM`;
  }
  const weakBox = $("#typingWeakWordsBox");
  if (weakBox) {
    const entries = Object.entries(st.weakWords || {}).sort((a, b) => b[1] - a[1]).slice(0, 8);
    weakBox.textContent = entries.length
      ? "Weak / Mistake Words (Practice these): " + entries.map(([w, c]) => `${w} (${c}x)`).join(", ")
      : "Weak / Mistake Words: Abhi koi galti record nahi hui.";
  }
  const histBox = $("#typingHistoryBox");
  if (histBox) {
    const sess = Array.isArray(st.sessions) ? st.sessions.slice(0, 5) : [];
    histBox.textContent = sess.length
      ? "Recent Typing Sessions: " + sess.map((s) => `[${s.date}] ${s.wpm} WPM | ${s.acc}% | ${s.keys} keys`).join(" • ")
      : "Recent Typing Sessions: Abhi koi session save nahi hai.";
  }
}

function recordTypingSession(wpmVal, accVal, keysVal) {
  const st = loadTypingAdvanceStats();
  const todayStr = new Date().toISOString().slice(0, 10);
  if (st.lastDate !== todayStr) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    st.streak = st.lastDate === yesterday ? (st.streak || 0) + 1 : 1;
    st.lastDate = todayStr;
  }
  if (wpmVal > (st.bestWpm || 0)) st.bestWpm = wpmVal;

  const typed = $("#typingInput")?.value || "";
  const expectedWords = passage.slice(0, typed.length).split(/\s+/);
  const typedWords = typed.split(/\s+/);
  st.weakWords = st.weakWords || {};
  const minW = Math.min(expectedWords.length, typedWords.length);
  for (let i = 0; i < minW; i++) {
    const exp = (expectedWords[i] || "").replace(/[^a-zA-Z0-9ऀ-ॿ]/g, "");
    const got = (typedWords[i] || "").replace(/[^a-zA-Z0-9ऀ-ॿ]/g, "");
    if (exp && got && exp !== got) {
      const key = exp.slice(0, 24);
      st.weakWords[key] = (st.weakWords[key] || 0) + 1;
    }
  }

  st.sessions = Array.isArray(st.sessions) ? st.sessions : [];
  st.sessions.unshift({
    date: todayStr,
    wpm: wpmVal,
    acc: accVal,
    keys: keysVal
  });
  st.sessions = st.sessions.slice(0, 15);
  saveTypingAdvanceStats(st);
  renderTypingAdvancePanels();
}

function buildWall(seedIdx, minChars, diffKey) {
  const bank = PASSAGE_BANKS[diffKey] || PASSAGE_BANKS.hard;
  const chunks = [];
  let len = 0;
  let k = seedIdx;
  while (len < minChars) {
    const base = bank[k % bank.length];
    const part = `[Set #${k + 1} • ${diffKey.toUpperCase()}] ${base} `;
    chunks.push(part);
    len += part.length;
    k++;
  }
  return chunks.join("");
}

function buildHindiWall(minChars) {
  let out = "";
  let idx = 1;
  while (out.length < minChars) {
    out += `[अनुच्छेद #${idx}] ${typingHindi} `;
    idx++;
  }
  return out;
}

function getActivePassage() {
  const mins = Number($("#typingDuration")?.value || 15);
  const mode = $("#typingMode")?.value || "hard_wall";
  const targetLen = mode === "hard_wall" || mins === 5 ? WALL_500K_TARGET : 12000;

  if (customPassageText && customPassageText.trim().length > 0) {
    let out = customPassageText.trim() + " ";
    const customTarget = mode === "hard_wall" || mins === 5 ? WALL_500K_TARGET : Math.max(4000, out.length * 4);
    while (out.length < customTarget) out += customPassageText.trim() + " ";
    return out;
  }

  if (activeHindiWall) {
    return buildHindiWall(targetLen);
  }

  const diff = $("#typingDifficulty")?.value || "hard";
  if (mode === "hard_wall" || mins === 5) {
    return buildWall(passageIndex, WALL_500K_TARGET, diff);
  }
  if (mode === "unlimited_stream") {
    return buildWall(passageIndex, 12000, diff);
  }
  return buildWall(passageIndex, 4000, diff);
}

let passage = getActivePassage();

function ensureUnlimitedWall() {
  const mode = $("#typingMode")?.value || "hard_wall";
  if (mode !== "unlimited_stream") return;
  const typedLen = ($("#typingInput")?.value || "").length;
  if (passage.length - typedLen < 1200) {
    passageIndex++;
    if (activeHindiWall) {
      passage += buildHindiWall(12000);
    } else {
      const diff = $("#typingDifficulty")?.value || "hard";
      passage += buildWall(passageIndex, 12000, diff);
    }
    if ($("#typingPassage")) $("#typingPassage").textContent = passage;
  }
}

function resetTyping() {
  clearInterval(typingTimer);
  typingTimer = null;
  typingActive = false;
  typingStarted = 0;
  typingEnd = 0;
  totalKeystrokesTyped = 0;
  backspaceCount = 0;
  lastInputLen = 0;
  lastValidValue = "";
  passage = getActivePassage();
  if ($("#typingInput")) {
    $("#typingInput").value = "";
    $("#typingInput").disabled = true;
  }
  if ($("#typingPassage")) $("#typingPassage").textContent = passage;
  const mins = Number($("#typingDuration")?.value || 15);
  if ($("#timeLeft")) $("#timeLeft").textContent = String(mins).padStart(2, "0") + ":00";
  if ($("#wpm")) $("#wpm").textContent = "0";
  if ($("#accuracy")) $("#accuracy").textContent = "100%";
  if ($("#typingProgress")) $("#typingProgress").style.width = "0%";
  const modeLabel = $("#typingMode")?.value === "unlimited_stream"
    ? "Unlimited Auto-Extending Wall"
    : ($("#typingMode")?.value === "hard_wall" || mins === 5
      ? `500,000-Char Wall (${passage.length.toLocaleString()} chars)`
      : "20,000-Key Speed Drill");
  if ($("#typingResult")) {
    $("#typingResult").textContent = `Ready [${modeLabel}] • 1-Min Target: ${KEY_GOAL_1MIN.toLocaleString()} keys • Press Start to begin.`;
  }
  renderTypingAdvancePanels();
}

function typingMetrics() {
  const typed = $("#typingInput")?.value || "";
  const elapsedMins = Math.max(1 / 60, (Date.now() - typingStarted) / 60000);
  const elapsedWholeMins = Math.max(1, (Date.now() - typingStarted) / 60000);
  let correct = 0;
  let hasErrorNow = false;
  const checkLen = Math.min(typed.length, passage.length);
  for (let i = 0; i < checkLen; i++) {
    if (typed[i] === passage[i]) correct++;
    else hasErrorNow = true;
  }
  const accuracy = typed.length ? Math.round((correct / checkLen) * 100) : 100;
  const wordsCount = typed.trim() ? typed.trim().split(/\s+/).length : 0;
  const wpmVal = Math.round(wordsCount / elapsedWholeMins);
  const kpmVal = Math.round(totalKeystrokesTyped / elapsedMins);
  if ($("#wpm")) $("#wpm").textContent = String(wpmVal);
  if ($("#accuracy")) $("#accuracy").textContent = accuracy + "%";
  const pct = Math.min(100, Math.round((typed.length / Math.max(1, passage.length)) * 10000) / 100);
  if ($("#typingProgress")) $("#typingProgress").style.width = pct + "%";
  const mins = Number($("#typingDuration")?.value || 15);
  const strictVal = $("#typingStrict")?.value || "alert";
  const errNote = strictVal === "alert" && hasErrorNow ? " ⚠️ Wrong character detected!" : "";
  if ($("#typingResult")) {
    if (mins === 1 || $("#typingMode")?.value === "exam_drill") {
      $("#typingResult").textContent = `Keys: ${totalKeystrokesTyped.toLocaleString()} / ${KEY_GOAL_1MIN.toLocaleString()} (${kpmVal.toLocaleString()}/min) • ${wpmVal} WPM • ${accuracy}% acc • Backspace: ${backspaceCount}${errNote}`;
    } else if (strictVal !== "free") {
      $("#typingResult").textContent = `Timer running • Keys: ${totalKeystrokesTyped.toLocaleString()} • Backspace: ${backspaceCount}${errNote}`;
    }
  }
}

function finishTyping() {
  clearInterval(typingTimer);
  typingActive = false;
  if ($("#typingInput")) $("#typingInput").disabled = true;
  typingMetrics();
  const wpmVal = Number($("#wpm")?.textContent) || 0;
  const accVal = Number(String($("#accuracy")?.textContent || "100").replace("%", "")) || 100;
  recordTypingSession(wpmVal, accVal, totalKeystrokesTyped);
  if ($("#typingResult")) {
    $("#typingResult").textContent = `Session complete. Total Keys: ${totalKeystrokesTyped.toLocaleString()} · Backspace: ${backspaceCount} · ${wpmVal} WPM · ${accVal}% accuracy.`;
  }
  const plan = [...document.querySelectorAll("#dailyPlan input")];
  const t = plan.find((x) => x.value === "3");
  if (t && !t.checked) {
    t.checked = true;
    updatePlan();
  }
}

$("#typingStart")?.addEventListener("click", () => {
  if (typingActive) return;
  resetTyping();
  const mins = Number($("#typingDuration")?.value || 15);
  typingStarted = Date.now();
  typingEnd = typingStarted + mins * 60000;
  typingActive = true;
  if ($("#typingInput")) {
    $("#typingInput").disabled = false;
    $("#typingInput").focus();
  }
  if ($("#typingResult")) $("#typingResult").textContent = "Timer running — type the passage above.";
  typingTimer = setInterval(() => {
    const left = Math.max(0, typingEnd - Date.now());
    const sec = Math.ceil(left / 1000);
    if ($("#timeLeft")) {
      $("#timeLeft").textContent = String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
    }
    typingMetrics();
    if (left <= 0) finishTyping();
  }, 250);
});

$("#typingInput")?.addEventListener("keydown", (e) => {
  if (!typingActive) return;
  if (e.key === "Backspace") backspaceCount++;
});

$("#typingInput")?.addEventListener("input", () => {
  if (!typingActive) return;
  const strictVal = $("#typingStrict")?.value || "alert";
  let curVal = $("#typingInput")?.value || "";
  if (strictVal === "strict_lock") {
    for (let i = 0; i < curVal.length; i++) {
      if (curVal[i] !== passage[i]) {
        curVal = lastValidValue;
        if ($("#typingInput")) $("#typingInput").value = curVal;
        if ($("#typingResult")) $("#typingResult").textContent = "Strict Lock: Wrong character blocked. Type the exact character shown.";
        break;
      }
    }
  }
  lastValidValue = curVal;
  const curLen = curVal.length;
  if (curLen > lastInputLen) totalKeystrokesTyped += (curLen - lastInputLen);
  lastInputLen = curLen;
  ensureUnlimitedWall();
  typingMetrics();
});

$("#typingNextPassage")?.addEventListener("click", () => {
  customPassageText = "";
  const bank = PASSAGE_BANKS[$("#typingDifficulty")?.value || "hard"] || PASSAGE_BANKS.hard;
  passageIndex = (passageIndex + 1) % bank.length;
  resetTyping();
});

$("#typingUseCustomBtn")?.addEventListener("click", () => {
  const raw = ($("#typingCustomPassage")?.value || "").trim();
  if (!raw) {
    alert("Pehle upar box mein apna passage paste karein.");
    return;
  }
  customPassageText = raw;
  activeHindiWall = false;
  resetTyping();
  if ($("#typingResult")) $("#typingResult").textContent = "Custom passage loaded! Press 'Start typing test' to begin.";
});

$("#typingReset")?.addEventListener("click", resetTyping);
$("#typingDuration")?.addEventListener("change", resetTyping);
$("#typingMode")?.addEventListener("change", resetTyping);
$("#typingDifficulty")?.addEventListener("change", () => {
  customPassageText = "";
  activeHindiWall = false;
  resetTyping();
});
$("#typingStrict")?.addEventListener("change", typingMetrics);
resetTyping();

// Daily student benefits: date-based rotation, with content bundled locally.
const dailyQuestions = [
  { q: "Which part of the Indian Constitution contains the Fundamental Rights?", o: ["Part II", "Part III", "Part IV", "Part V"], a: 1, e: "Fundamental Rights are set out in Part III (Articles 12–35)." },
  { q: "The headquarters of the Reserve Bank of India is in which city?", o: ["New Delhi", "Kolkata", "Mumbai", "Chennai"], a: 2, e: "The RBI's central office is in Mumbai." },
  { q: "Which river is known as the 'Sorrow of Bihar'?", o: ["Kosi", "Narmada", "Godavari", "Tapi"], a: 0, e: "The Kosi has historically caused severe flooding in Bihar." },
  { q: "Who was the chairman of the Drafting Committee of the Constituent Assembly?", o: ["Rajendra Prasad", "B. R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], a: 1, e: "Dr. B. R. Ambedkar chaired the Drafting Committee." },
  { q: "Which gas is most abundant in Earth's atmosphere?", o: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], a: 2, e: "Nitrogen makes up about 78% of dry air." },
  { q: "The 73rd Constitutional Amendment is associated with which institution?", o: ["Municipalities", "Panchayati Raj", "Supreme Court", "Election Commission"], a: 1, e: "The 73rd Amendment gave constitutional status to Panchayati Raj institutions." },
  { q: "Where is the headquarters of the United Nations?", o: ["Geneva", "Paris", "New York City", "Vienna"], a: 2, e: "The UN headquarters is in New York City." }
];

const dailyWords = [
  ["Abundant", "Available in large quantities", "Fresh water is abundant in this region.", "Plentiful; ample"],
  ["Diligent", "Showing careful and steady effort", "A diligent student revises every day.", "Hardworking; industrious"],
  ["Concise", "Giving information clearly in few words", "Write a concise answer in the exam.", "Brief; succinct"],
  ["Resilient", "Able to recover quickly from difficulty", "Resilient learners keep trying after setbacks.", "Tough; adaptable"],
  ["Impartial", "Treating all sides fairly", "A judge must remain impartial.", "Fair; unbiased"],
  ["Inevitable", "Certain to happen", "Change is inevitable.", "Unavoidable; certain"],
  ["Meticulous", "Very careful about details", "Check your form with meticulous care.", "Thorough; precise"],
  ["Prudent", "Showing good judgement and care", "It is prudent to verify an official notice.", "Wise; sensible"]
];

const dailyNotes = [
  ["Fundamental Rights", "Part III of the Constitution (Articles 12–35) contains Fundamental Rights. The six broad categories include equality, freedom, protection against exploitation, freedom of religion, cultural and educational rights, and constitutional remedies.", "Exam tip: Article 32 provides the right to move the Supreme Court for enforcement of Fundamental Rights."],
  ["Number System: Divisibility by 3", "A number is divisible by 3 when the sum of its digits is divisible by 3. Example: 5,472 → 5+4+7+2 = 18, so 5,472 is divisible by 3.", "Try it: Is 8,136 divisible by 3? Add its digits first."],
  ["Indian Geography: Tropic of Cancer", "The Tropic of Cancer (23½° N approximately) passes through eight Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.", "Memory tip: revise the states from west to east on an outline map."],
  ["English Grammar: Subject–Verb Agreement", "A singular subject generally takes a singular verb, while a plural subject takes a plural verb. Example: 'She writes' and 'They write'. Words between the subject and verb do not change the subject's number.", "Exam tip: identify the main subject before choosing the verb."],
  ["Percentage Shortcut", "To find x% of y, calculate (x × y) ÷ 100. Example: 15% of 240 = 15 × 240 ÷ 100 = 36.", "Shortcut: 10% of a number is one-tenth; 5% is half of 10%."],
  ["Indian Polity: Directive Principles", "Directive Principles of State Policy are contained in Part IV (Articles 36–51). They guide the state in making laws and policies and are not enforceable by courts in the same way as Fundamental Rights.", "Remember: Fundamental Rights = Part III; Directive Principles = Part IV."],
  ["Reasoning: Number Series", "In a number series, check common differences first, then differences of differences, multiplication/division, squares, cubes or alternating patterns.", "Exam tip: avoid assuming a pattern after checking only the first two terms."]
];

function dayIndex(length) {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const day = Math.floor((d - start) / 86400000);
  return day % length;
}

function renderDailyBenefits() {
  const qi = dayIndex(dailyQuestions.length);
  const wi = dayIndex(dailyWords.length);
  const ni = dayIndex(dailyNotes.length);
  const qset = dailyQuestions[qi];
  const word = dailyWords[wi];
  const note = dailyNotes[ni];

  if ($("#affairsIntro")) $("#affairsIntro").textContent = `Practice set ${qi + 1} of ${dailyQuestions.length} · ${today}`;
  if ($("#affairsQuestions")) {
    $("#affairsQuestions").innerHTML = `
      <div class="daily-question">
        <b>${escapeHTML(qset.q)}</b>
        ${qset.o.map((v, i) => `<button type="button" data-daily-answer="${i}">${String.fromCharCode(65 + i)}. ${escapeHTML(v)}</button>`).join("")}
        <p class="muted-small" id="dailyExplanation"></p>
      </div>
    `;
    $("#affairsQuestions").querySelectorAll("[data-daily-answer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = Number(btn.dataset.dailyAnswer);
        const all = $("#affairsQuestions").querySelectorAll("button");
        all.forEach((b, i) => {
          b.disabled = true;
          if (i === qset.a) b.classList.add("correct");
          if (i === chosen && chosen !== qset.a) b.classList.add("wrong");
        });
        if ($("#dailyExplanation")) $("#dailyExplanation").textContent = `${chosen === qset.a ? "Correct!" : "Not quite."} ${qset.e}`;
        if ($("#affairsScore")) $("#affairsScore").textContent = chosen === qset.a ? "Well done — answer correct." : "Review the explanation and try another topic.";
      });
    });
  }

  if ($("#dailyWord")) $("#dailyWord").textContent = word[0];
  if ($("#wordMeaning")) $("#wordMeaning").textContent = word[1];
  if ($("#wordExample")) $("#wordExample").textContent = `Example: ${word[2]}`;
  if ($("#wordSynonyms")) $("#wordSynonyms").textContent = `Synonyms: ${word[3]}`;
  if ($("#noteTitle")) $("#noteTitle").textContent = note[0];
  if ($("#noteBody")) $("#noteBody").textContent = note[1];
  if ($("#noteTip")) $("#noteTip").textContent = note[2];
}
renderDailyBenefits();

// Additional daily micro-lessons. These rotate through a local sample bank, not live news.
const dailyReasoning = [
  ["Number pattern", "2, 6, 12, 20, 30, ?", "42", "The differences are +4, +6, +8, +10, then +12."],
  ["Odd one out", "Apple, Mango, Carrot, Banana", "Carrot", "Carrot is generally classified as a vegetable; the others are fruits."],
  ["Direction sense", "A person walks 4 km north, then 3 km east. In which direction is the starting point?", "South-west", "From the final position, the starting point lies south-west."],
  ["Alphabet series", "A, C, F, J, O, ?", "U", "The letter gaps increase by 1: +2, +3, +4, +5, then +6."]
];

const dailyFormulas = [
  ["Average", "Average = Sum of observations ÷ Number of observations", "Example: (10 + 20 + 30) ÷ 3 = 20."],
  ["Simple Interest", "SI = (Principal × Rate × Time) ÷ 100", "Example: ₹1,000 at 5% for 2 years gives ₹100 SI."],
  ["Speed", "Speed = Distance ÷ Time", "Example: 120 km ÷ 2 hours = 60 km/h."],
  ["Percentage", "Percentage = (Part ÷ Whole) × 100", "Example: 45 out of 60 = 75%."],
  ["Profit percentage", "Profit % = (Profit ÷ Cost Price) × 100", "Example: CP ₹200, SP ₹250 → profit 25%."]
];

const dailyFacts = [
  ["Indian Constitution", "The Constitution of India was adopted on 26 November 1949 and came into effect on 26 January 1950."],
  ["Space science", "The Indian Space Research Organisation (ISRO) was established in 1969."],
  ["Indian geography", "The Tropic of Cancer passes through eight states in India."],
  ["Parliament", "The Parliament of India consists of the President and two Houses: Lok Sabha and Rajya Sabha."]
];

const dailyGrammar = [
  ["Articles", "Use 'an' before a vowel sound, not simply a vowel letter. Example: an honest person; a university."],
  ["Subject–verb agreement", "A singular subject generally takes a singular verb: 'She writes'. A plural subject takes a plural verb: 'They write'."],
  ["Prepositions", "Use 'since' for a starting point in time and 'for' for a duration: since Monday; for three days."],
  ["Tenses", "Use the present perfect for an action connected to the present: 'I have finished my work'."]
];

function renderDailyExtras() {
  const i = dayIndex(dailyReasoning.length);
  const r = dailyReasoning[i];
  const f = dailyFormulas[dayIndex(dailyFormulas.length)];
  const fact = dailyFacts[dayIndex(dailyFacts.length)];
  const g = dailyGrammar[dayIndex(dailyGrammar.length)];

  if ($("#reasoningTitle")) $("#reasoningTitle").textContent = "🧠 " + r[0];
  if ($("#reasoningPrompt")) $("#reasoningPrompt").textContent = r[1];
  if ($("#reasoningAnswer")) $("#reasoningAnswer").textContent = "Answer: " + r[2] + " — " + r[3];
  $("#reasoningReveal")?.addEventListener("click", () => {
    if ($("#reasoningAnswer")) $("#reasoningAnswer").hidden = false;
  });
  if ($("#formulaTitle")) $("#formulaTitle").textContent = "➗ " + f[0];
  if ($("#formulaBody")) $("#formulaBody").textContent = f[1];
  if ($("#formulaExample")) $("#formulaExample").textContent = f[2];
  if ($("#factTitle")) $("#factTitle").textContent = "🌍 " + fact[0];
  if ($("#factBody")) $("#factBody").textContent = fact[1];
  if ($("#grammarTitle")) $("#grammarTitle").textContent = "✍️ " + g[0];
  if ($("#grammarBody")) $("#grammarBody").textContent = g[1];
}
renderDailyExtras();

// Local-only student tools. Entries remain in this browser unless its site data is cleared.
function readStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const appKey = "sju_applications_v1", eventKey = "sju_exam_events_v1", notesKey = "sju_personal_notes_v1";

function renderApplications() {
  const box = $("#applicationList");
  if (!box) return;
  const list = readStore(appKey);
  box.replaceChildren();
  if (!list.length) {
    box.textContent = "No applications saved yet.";
    return;
  }
  list.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "tool-item";
    const info = document.createElement("div");
    const title = document.createElement("b");
    const meta = document.createElement("small");
    const del = document.createElement("button");
    title.textContent = item.exam;
    meta.textContent = `${item.date} · ${item.status}`;
    info.append(title, document.createElement("br"), meta);
    del.className = "small-action";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      const a = readStore(appKey);
      a.splice(i, 1);
      writeStore(appKey, a);
      renderApplications();
    });
    row.append(info, del);
    box.append(row);
  });
}

$("#applicationForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const a = readStore(appKey);
  a.unshift({ exam: $("#appExam").value.trim(), date: $("#appDate").value, status: $("#appStatus").value });
  writeStore(appKey, a);
  e.target.reset();
  renderApplications();
});
renderApplications();

function safeExternalUrl(value) {
  try {
    const u = new URL(value);
    return ["https:", "http:"].includes(u.protocol) ? u.href : "";
  } catch {
    return "";
  }
}

function renderEvents() {
  const box = $("#eventList");
  if (!box) return;
  const list = readStore(eventKey).sort((a, b) => a.date.localeCompare(b.date));
  box.replaceChildren();
  if (!list.length) {
    box.textContent = "No personal reminders added yet.";
    return;
  }
  list.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "tool-item";
    const info = document.createElement("div");
    const title = document.createElement("b");
    const meta = document.createElement("small");
    const del = document.createElement("button");
    title.textContent = item.title;
    meta.textContent = item.date;
    info.append(title, document.createElement("br"), meta);
    const url = safeExternalUrl(item.url);
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Official notice ↗";
      info.append(document.createElement("br"), link);
    }
    del.className = "small-action";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      const a = readStore(eventKey);
      a.splice(i, 1);
      writeStore(eventKey, a);
      renderEvents();
    });
    row.append(info, del);
    box.append(row);
  });
}

$("#eventForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = $("#eventUrl").value.trim();
  if (url && !safeExternalUrl(url)) {
    alert("Please enter a valid http or https official link.");
    return;
  }
  const a = readStore(eventKey);
  a.push({ title: $("#eventTitle").value.trim(), date: $("#eventDate").value, url });
  writeStore(eventKey, a);
  e.target.reset();
  renderEvents();
});
renderEvents();

$("#eligibilityForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const age = Number($("#eligAge").value);
  const min = Number($("#eligMin").value);
  const max = Number($("#eligMax").value);
  const relax = Number($("#eligRelax").value);
  const edu = $("#eligEducation").value;
  const result = $("#eligibilityResult");
  if (!result) return;
  if (max < min) {
    result.textContent = "Maximum age must be equal to or greater than minimum age.";
    return;
  }
  const upper = max + relax;
  const ageOk = age >= min && age <= upper;
  if (edu === "no" || !ageOk) {
    result.textContent = "Based only on the values entered, you do not meet all the entered criteria. Check the official notice for exact rules and cut-off date.";
  } else if (edu === "unknown") {
    result.textContent = "Age is within the entered range, but education is unconfirmed. Verify the qualification and all other conditions in the official notice.";
  } else {
    result.textContent = "Your entered age and education appear to match these entered criteria. This is not an official eligibility decision; verify every condition in the notification.";
  }
});

function renderNotes() {
  const box = $("#notesList");
  if (!box) return;
  const list = readStore(notesKey);
  box.replaceChildren();
  if (!list.length) {
    box.textContent = "No notes saved yet.";
    return;
  }
  list.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "tool-item";
    const info = document.createElement("div");
    const title = document.createElement("b");
    const body = document.createElement("p");
    const del = document.createElement("button");
    title.textContent = item.title;
    body.textContent = item.body;
    info.append(title, body);
    del.className = "small-action";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      const a = readStore(notesKey);
      a.splice(i, 1);
      writeStore(notesKey, a);
      renderNotes();
    });
    row.append(info, del);
    box.append(row);
  });
}

$("#notesForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const a = readStore(notesKey);
  a.unshift({ title: $("#noteHeading").value.trim(), body: $("#noteText").value.trim() });
  writeStore(notesKey, a);
  e.target.reset();
  renderNotes();
});
renderNotes();

const calcDefinitions = {
  percentage: [{ id: "calcA", label: "Percentage (%)", placeholder: "e.g. 15" }, { id: "calcB", label: "Number", placeholder: "e.g. 240" }],
  average: [{ id: "calcA", label: "Numbers (comma-separated)", placeholder: "e.g. 10, 20, 30" }],
  profit: [{ id: "calcA", label: "Cost price", placeholder: "e.g. 200" }, { id: "calcB", label: "Selling price", placeholder: "e.g. 250" }],
  interest: [{ id: "calcA", label: "Principal", placeholder: "e.g. 1000" }, { id: "calcB", label: "Annual rate (%)", placeholder: "e.g. 5" }, { id: "calcC", label: "Time (years)", placeholder: "e.g. 2" }]
};

function renderCalcFields() {
  const type = $("#calcType")?.value || "percentage";
  const box = $("#calcFields");
  if (!box) return;
  box.replaceChildren();
  (calcDefinitions[type] || []).forEach((field) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.textContent = field.label;
    input.id = field.id;
    input.placeholder = field.placeholder;
    input.type = "text";
    input.inputMode = "decimal";
    label.append(input);
    box.append(label);
  });
  if ($("#calcResult")) $("#calcResult").textContent = "Enter values and calculate.";
}

$("#calcType")?.addEventListener("change", renderCalcFields);
renderCalcFields();

$("#calculateBtn")?.addEventListener("click", () => {
  const type = $("#calcType")?.value || "percentage";
  const read = (id) => ($("#" + id)?.value || "").trim();
  const num = (id) => Number(read(id));
  const out = $("#calcResult");
  if (!out) return;
  let answer = "";
  if (type === "percentage") {
    const a = num("calcA"), b = num("calcB");
    if (!read("calcA") || !read("calcB") || !Number.isFinite(a) || !Number.isFinite(b)) {
      out.textContent = "Enter both values.";
      return;
    }
    answer = `${a}% of ${b} = ${((a * b) / 100).toFixed(2)}`;
  }
  if (type === "average") {
    const values = read("calcA").split(",").map((x) => x.trim()).filter(Boolean).map(Number);
    if (!values.length || values.some((x) => !Number.isFinite(x))) {
      out.textContent = "Enter valid numbers separated by commas.";
      return;
    }
    answer = `Average = ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)} (count: ${values.length})`;
  }
  if (type === "profit") {
    const cp = num("calcA"), sp = num("calcB");
    if (!read("calcA") || !read("calcB") || !Number.isFinite(cp) || !Number.isFinite(sp) || cp <= 0) {
      out.textContent = "Enter a positive cost price and a selling price.";
      return;
    }
    const diff = sp - cp;
    answer = diff >= 0
      ? `Profit = ${diff.toFixed(2)} · Profit % = ${((diff / cp) * 100).toFixed(2)}%`
      : `Loss = ${Math.abs(diff).toFixed(2)} · Loss % = ${((Math.abs(diff) / cp) * 100).toFixed(2)}%`;
  }
  if (type === "interest") {
    const p = num("calcA"), r = num("calcB"), t = num("calcC");
    if (!read("calcA") || !read("calcB") || !read("calcC") || [p, r, t].some((v) => !Number.isFinite(v) || v < 0)) {
      out.textContent = "Enter valid non-negative values.";
      return;
    }
    const si = (p * r * t) / 100;
    answer = `Simple interest = ${si.toFixed(2)} · Total amount = ${(p + si).toFixed(2)}`;
  }
  out.textContent = answer;
});

// v3.4 student super-tools. Personal records are local to this browser.
const performanceKey = "sju_exam_performance_v1", timetableKey = "sju_smart_timetable_v1", libraryKey = "sju_offline_library_v1";
const safeText = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

$("#askAssistant")?.addEventListener("click", async () => {
  const q = ($("#assistantQuestion")?.value || "").trim();
  const out = $("#assistantAnswer");
  if (!out) return;
  if (!q) {
    out.textContent = "Please enter a question first.";
    return;
  }
  out.textContent = "Preparing your explanation…";
  try {
    const r = await fetch("/api/study-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });
    const d = await r.json().catch(() => ({}));
    out.textContent = d.answer || d.error || "No answer returned.";
  } catch {
    out.textContent = "Could not connect. Check your internet connection and try again.";
  }
});

$("#clearAssistant")?.addEventListener("click", () => {
  if ($("#assistantQuestion")) $("#assistantQuestion").value = "";
  if ($("#assistantAnswer")) $("#assistantAnswer").textContent = "Your answer will appear here.";
});

let simQuestions = [], simAnswers = {}, simStarted = 0, simDeadline = 0, simTimer = null, simFinished = false;

function renderSimulator() {
  const box = $("#simArea");
  if (!box) return;
  if (!simQuestions.length) {
    box.textContent = "Your test will appear here.";
    return;
  }
  const left = Math.max(0, Math.ceil((simDeadline - Date.now()) / 1000));
  box.innerHTML = `
    <div><b>${safeText($("#simExam")?.value || "Exam")} practice test</b> · <b id="simClock">${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</b></div>
    <p>${Object.keys(simAnswers).filter((k) => k !== "score").length} / ${simQuestions.length} answered</p>
    <div class="tool-actions">${simQuestions.map((_, i) => `<button class="small-action" type="button" data-jump="${i}">Q${i + 1}</button>`).join("")}</div>
    ${simQuestions.map((q, i) => `
      <div class="quiz-q">
        <b>Q${i + 1}. ${safeText(q.question)}</b>
        ${(q.options || []).map((o, j) => `<button type="button" data-q="${i}" data-a="${j}" class="${simAnswers[i] === j ? "chosen" : ""}" ${simFinished ? "disabled" : ""}>${String.fromCharCode(65 + j)}. ${safeText(o)}</button>`).join("")}
        ${simFinished ? `<p class="muted-small">Correct answer: ${safeText((q.options || [])[q.answerIndex] || "Not available")}. ${safeText(q.explanation || "")}</p>` : ""}
      </div>
    `).join("")}
    ${simFinished
      ? `<div class="tool-result">Test submitted. Score: ${simAnswers.score || 0}/${simQuestions.length} (${Math.round(((simAnswers.score || 0) / Math.max(1, simQuestions.length)) * 100)}%).</div>`
      : `<button class="btn primary" id="simSubmit" type="button">Submit test</button>`}
  `;

  box.querySelectorAll("button[data-q]").forEach((b) => {
    b.addEventListener("click", () => {
      if (simFinished) return;
      simAnswers[Number(b.dataset.q)] = Number(b.dataset.a);
      renderSimulator();
    });
  });

  box.querySelectorAll("button[data-jump]").forEach((b) => {
    b.addEventListener("click", () => {
      box.querySelectorAll(".quiz-q")[Number(b.dataset.jump)]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  $("#simSubmit")?.addEventListener("click", () => finishSimulator(false));
}

async function startSimulator() {
  clearInterval(simTimer);
  const box = $("#simArea");
  if (!box) return;
  box.textContent = "Preparing your practice paper…";
  try {
    const r = await fetch("/api/mock-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        exam: $("#simExam")?.value || "JKSSB",
        topic: ($("#simTopic")?.value || "").trim() || "General Knowledge",
        difficulty: "Medium",
        count: Number($("#simCount")?.value || 10)
      })
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !Array.isArray(d.questions) || !d.questions.length) {
      throw new Error(d.error || "Question set unavailable");
    }
    simQuestions = d.questions;
    simAnswers = {};
    simFinished = false;
    simStarted = Date.now();
    simDeadline = simStarted + Number($("#simDuration")?.value || 20) * 60000;
    renderSimulator();
    simTimer = setInterval(() => {
      if (Date.now() >= simDeadline) finishSimulator(true);
      else {
        const c = $("#simClock");
        if (c) {
          const n = Math.ceil((simDeadline - Date.now()) / 1000);
          c.textContent = `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
        }
      }
    }, 500);
  } catch (e) {
    box.textContent = "Unable to start test: " + e.message;
  }
}

function finishSimulator(auto) {
  if (simFinished || !simQuestions.length) return;
  simFinished = true;
  clearInterval(simTimer);
  let score = 0;
  simQuestions.forEach((q, i) => {
    if (simAnswers[i] === Number(q.answerIndex)) score++;
  });
  simAnswers.score = score;
  const history = readStore(performanceKey);
  history.unshift({
    exam: $("#simExam")?.value || "Exam",
    topic: ($("#simTopic")?.value || "").trim() || "General Knowledge",
    score,
    total: simQuestions.length,
    percent: Math.round((score / Math.max(1, simQuestions.length)) * 100),
    date: new Date().toISOString(),
    durationSeconds: Math.round((Date.now() - simStarted) / 1000)
  });
  writeStore(performanceKey, history.slice(0, 100));
  renderSimulator();
  renderPerformance();
  if (auto && $("#simArea")) {
    $("#simArea").insertAdjacentHTML("afterbegin", "<p><b>Time is up — your test was submitted automatically.</b></p>");
  }
}

$("#simStart")?.addEventListener("click", startSimulator);

function renderPerformance() {
  const h = readStore(performanceKey);
  const avg = h.length ? Math.round(h.reduce((s, x) => s + x.percent, 0) / h.length) : null;
  const best = h.length ? Math.max(...h.map((x) => x.percent)) : null;
  if ($("#perfAttempts")) $("#perfAttempts").textContent = String(h.length);
  if ($("#perfAverage")) $("#perfAverage").textContent = avg === null ? "—" : avg + "%";
  if ($("#perfBest")) $("#perfBest").textContent = best === null ? "—" : best + "%";
  const box = $("#performanceHistory");
  if (!box) return;
  box.replaceChildren();
  if (!h.length) {
    box.textContent = "Complete a simulator test to see your progress here.";
    return;
  }
  h.slice(0, 8).forEach((x) => {
    const d = document.createElement("div");
    d.className = "tool-item";
    const span = document.createElement("span");
    span.textContent = `${x.exam} · ${x.topic} — ${x.score}/${x.total} (${x.percent}%)`;
    const small = document.createElement("small");
    small.textContent = new Date(x.date).toLocaleDateString();
    d.append(span, small);
    box.append(d);
  });
}
renderPerformance();

let cachedJobs = [];

async function loadStudentJobs() {
  const box = $("#dailyJobs");
  if (!box) return;
  box.textContent = "Loading published updates…";
  try {
    const r = await fetch("/api/jobs", { cache: "no-store" });
    const d = await r.json().catch(() => ({}));
    cachedJobs = Array.isArray(d.jobs) ? d.jobs : [];
    renderStudentJobs();
    if ($("#jobsUpdated")) {
      $("#jobsUpdated").textContent = "Last checked: " + new Date(d.updatedAt || Date.now()).toLocaleString();
    }
  } catch {
    box.textContent = "Could not load updates. Please retry when connected.";
  }
}

function renderStudentJobs() {
  const box = $("#dailyJobs");
  if (!box) return;
  const filter = $("#jobFilter")?.value || "";
  const list = cachedJobs.filter((x) => !filter || x.type === filter);
  box.replaceChildren();
  if (!list.length) {
    box.textContent = "No matching published updates. Check official portals for the latest notices.";
    return;
  }
  list.slice(0, 30).forEach((j) => {
    const row = document.createElement("div");
    row.className = "tool-item";
    const info = document.createElement("div");
    const title = document.createElement("b");
    const meta = document.createElement("small");
    const link = document.createElement("a");
    title.textContent = j.title;
    meta.textContent = `${j.organization || "Recruitment authority"} · ${j.type || "Update"} · ${j.region || "India"} · Last date: ${j.lastDate || "See notice"}`;
    link.href = safeExternalUrl(j.officialUrl) || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Official notice ↗";
    info.append(title, document.createElement("br"), meta, document.createElement("br"), link);
    row.append(info);
    box.append(row);
  });
}

$("#refreshJobs")?.addEventListener("click", loadStudentJobs);
$("#jobFilter")?.addEventListener("change", renderStudentJobs);
loadStudentJobs();

$("#typingProApply")?.addEventListener("click", () => {
  const hi = $("#typingLanguage")?.value === "hi";
  activeHindiWall = hi;
  customPassageText = "";
  resetTyping();
  if ($("#typingProInfo")) {
    $("#typingProInfo").textContent = hi
      ? "Hindi Unicode hard passage wall applied."
      : "English hard passage wall applied.";
  }
});

function renderTimetable() {
  const box = $("#timetableList");
  if (!box) return;
  const list = readStore(timetableKey).sort((a, b) => a.time.localeCompare(b.time));
  box.replaceChildren();
  if (!list.length) {
    box.textContent = "No study sessions planned yet.";
    return;
  }
  list.forEach((x, i) => {
    const row = document.createElement("div");
    row.className = "tool-item";
    const info = document.createElement("span");
    info.textContent = `${x.time} · ${x.task} (${x.duration})`;
    const del = document.createElement("button");
    del.className = "small-action";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      const a = readStore(timetableKey);
      a.splice(i, 1);
      writeStore(timetableKey, a);
      renderTimetable();
    });
    row.append(info, del);
    box.append(row);
  });
}

$("#timetableForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const a = readStore(timetableKey);
  a.push({ task: $("#timetableTask").value.trim(), time: $("#timetableTime").value, duration: $("#timetableDuration").value });
  writeStore(timetableKey, a);
  e.target.reset();
  renderTimetable();
});
renderTimetable();

function renderLibrary() {
  const box = $("#libraryList");
  if (!box) return;
  const a = readStore(libraryKey);
  box.replaceChildren();
  if (!a.length) {
    box.textContent = "Your saved library is empty.";
    return;
  }
  a.forEach((x, i) => {
    const row = document.createElement("div");
    row.className = "tool-item";
    const info = document.createElement("div");
    const title = document.createElement("b");
    const body = document.createElement("p");
    const del = document.createElement("button");
    title.textContent = x.title;
    body.textContent = x.body;
    info.append(title, body);
    del.className = "small-action";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => {
      const n = readStore(libraryKey);
      n.splice(i, 1);
      writeStore(libraryKey, n);
      renderLibrary();
    });
    row.append(info, del);
    box.append(row);
  });
}

$("#saveLibrary")?.addEventListener("click", () => {
  const title = ($("#libraryTitle")?.value || "").trim();
  const body = ($("#libraryBody")?.value || "").trim();
  if (!title || !body) {
    alert("Enter both a title and study content.");
    return;
  }
  const a = readStore(libraryKey);
  a.unshift({ title, body, savedAt: new Date().toISOString() });
  writeStore(libraryKey, a);
  if ($("#libraryTitle")) $("#libraryTitle").value = "";
  if ($("#libraryBody")) $("#libraryBody").value = "";
  renderLibrary();
});

$("#exportLibrary")?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(readStore(libraryKey), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sju-offline-study-library.json";
  a.click();
  URL.revokeObjectURL(url);
});
renderLibrary();

$("#speakText")?.addEventListener("click", () => {
  const text = ($("#readAloudText")?.value || "").trim();
  const status = $("#speechStatus");
  if (!status) return;
  if (!text) {
    status.textContent = "Enter some text to read first.";
    return;
  }
  if (!("speechSynthesis" in window)) {
    status.textContent = "Read aloud is not supported by this browser.";
    return;
  }
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = $("#readAloudLang")?.value || "hi-IN";
  utter.onend = () => {
    status.textContent = "Finished reading.";
  };
  utter.onerror = () => {
    status.textContent = "The selected device voice could not read this text.";
  };
  speechSynthesis.speak(utter);
  status.textContent = "Reading aloud…";
});

$("#pauseSpeech")?.addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  if (speechSynthesis.paused) speechSynthesis.resume();
  else speechSynthesis.pause();
});

$("#stopSpeech")?.addEventListener("click", () => {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if ($("#speechStatus")) $("#speechStatus").textContent = "Stopped.";
});

const statePortals = {
  jk: [["JKSSB", "https://jkssb.nic.in/"], ["JKPSC", "https://jkpsc.nic.in/"], ["J&K Police", "https://jkpolice.gov.in/"]],
  national: [["UPSC", "https://upsc.gov.in/"], ["SSC", "https://ssc.gov.in/"], ["Railway RRB", "https://www.rrbcdg.gov.in/"], ["IBPS", "https://www.ibps.in/"], ["National Career Service", "https://www.ncs.gov.in/"]],
  up: [["UPPSC", "https://uppsc.up.nic.in/"], ["UPSSSC", "https://upsssc.gov.in/"]],
  bihar: [["BPSC", "https://bpsc.bih.nic.in/"], ["BSSC", "https://bssc.bihar.gov.in/"]],
  rajasthan: [["RPSC", "https://rpsc.rajasthan.gov.in/"], ["RSSB", "https://rssb.rajasthan.gov.in/"]],
  haryana: [["HPSC", "https://hpsc.gov.in/"], ["HSSC", "https://www.hssc.gov.in/"]],
  punjab: [["PPSC", "https://ppsc.gov.in/"]],
  delhi: [["DSSSB", "https://dsssb.delhi.gov.in/"], ["Delhi Police", "https://delhipolice.gov.in/"]],
  mp: [["MPPSC", "https://mppsc.mp.gov.in/"], ["MPESB", "https://esb.mp.gov.in/"]],
  maharashtra: [["MPSC", "https://mpsc.gov.in/"]]
};

function renderStatePortals() {
  const box = $("#stateZoneLinks");
  if (!box) return;
  box.replaceChildren();
  (statePortals[$("#stateZoneSelect")?.value || "jk"] || []).forEach(([name, url]) => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = name + " official portal ↗";
    box.append(a);
  });
}

$("#stateZoneSelect")?.addEventListener("change", renderStatePortals);
renderStatePortals();
