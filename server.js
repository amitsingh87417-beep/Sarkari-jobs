const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "jobs.json");
const QUEUE_FILE = path.join(DATA_DIR, "review-queue.json");
const RESOURCES_FILE = path.join(DATA_DIR, "resources.json");
const TESTS_FILE = path.join(DATA_DIR, "admin-tests.json");
const TRASH_FILE = path.join(DATA_DIR, "trash.json");
const DAILY_UPDATES_FILE = path.join(DATA_DIR, "daily-updates.json");
const ENGAGE_SUITE_FILE = path.join(DATA_DIR, "engage-suite.json");
const CURRENT_AFFAIRS_FILE = path.join(DATA_DIR, "current-affairs.json");
const CURRENT_AFFAIRS_META_FILE = path.join(DATA_DIR, "current-affairs-meta.json");
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(DATA_DIR, "uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("Only PDF, JPG, PNG and WEBP files are allowed"), ok);
  }
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const FEEDS = (process.env.OFFICIAL_RSS_FEEDS || "").split(";").map(x => x.trim()).filter(Boolean);
const CA_RSS_FEEDS = (process.env.CURRENT_AFFAIRS_RSS_FEEDS || "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3;https://www.newsonair.gov.in/feed/")
  .split(";").map(x => x.trim()).filter(Boolean);

if (!ADMIN_PASSWORD || !SESSION_SECRET) {
  console.warn("Set ADMIN_PASSWORD and SESSION_SECRET in your hosting environment before using the admin panel.");
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "200kb" }));
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." }
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(UPLOAD_DIR, { fallthrough: false, maxAge: "1h" }));

function readJson(file, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}

function readJobs() {
  const data = readJson(DATA_FILE, []);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.jobs)) return data.jobs;
  return [];
}

function writeJobs(jobs) {
  writeJson(DATA_FILE, jobs);
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

function sign(value) {
  return crypto.createHmac("sha256", SESSION_SECRET || "missing-secret").update(value).digest("hex");
}

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  if (!token) return res.status(401).json({ error: "Admin login required" });
  const parts = token.split(".");
  if (parts.length !== 2 || !safeEqual(parts[1], sign(parts[0]))) {
    return res.status(401).json({ error: "Session expired. Sign in again." });
  }
  try {
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    if (payload.exp < Date.now()) return res.status(401).json({ error: "Session expired. Sign in again." });
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
  next();
}

function validateJob(b) {
  const title = String(b.title || "").trim();
  const organization = String(b.organization || "").trim();
  const url = String(b.officialUrl || "").trim();
  if (!title || !organization) return { error: "Title and organization are required" };
  try {
    const u = new URL(url);
    if (!["https:", "http:"].includes(u.protocol)) throw new Error("Invalid protocol");
  } catch {
    return { error: "Enter a valid official notification URL" };
  }
  const allowedRegions = ["India", "Jammu & Kashmir"];
  return {
    value: {
      title: title.slice(0, 160),
      organization: organization.slice(0, 120),
      category: String(b.category || "Other").slice(0, 50),
      region: allowedRegions.includes(b.region) ? b.region : "India",
      notificationNo: String(b.notificationNo || "").slice(0, 80),
      ageLimit: String(b.ageLimit || "See notification").slice(0, 80),
      applicationFee: String(b.applicationFee || "See notification").slice(0, 80),
      applyUrl: String(b.applyUrl || "").slice(0, 500),
      qualification: String(b.qualification || "See notification").slice(0, 100),
      vacancies: String(b.vacancies || "Not specified").slice(0, 40),
      lastDate: String(b.lastDate || "").slice(0, 30),
      examDate: String(b.examDate || "").slice(0, 30),
      status: ["published", "draft"].includes(b.status) ? b.status : "published",
      type: ["Job", "Admit Card", "Result", "Answer Key", "Exam Date", "Syllabus"].includes(b.type) ? b.type : "Job",
      officialUrl: url.slice(0, 500),
      description: String(b.description || "").slice(0, 1200)
    }
  };
}

const seed = [
  {
    id: "sample-ssc-gd",
    title: "SSC Constable (GD) — check latest notice",
    organization: "Staff Selection Commission",
    category: "SSC",
    region: "India",
    qualification: "See official notification",
    vacancies: "As notified",
    lastDate: "Check official site",
    examDate: "To be announced",
    status: "published",
    type: "Job",
    officialUrl: "https://ssc.gov.in/",
    description: "Reference listing only. Check SSC for the current recruitment notice, eligibility, dates and application status."
  },
  {
    id: "sample-jkssb",
    title: "JKSSB recruitment updates",
    organization: "Jammu & Kashmir Services Selection Board",
    category: "JKSSB",
    region: "Jammu & Kashmir",
    qualification: "Varies by post",
    vacancies: "As notified",
    lastDate: "Check official site",
    examDate: "Check notices",
    status: "published",
    type: "Job",
    officialUrl: "https://jkssb.nic.in/",
    description: "Reference listing only. Verify advertisement number, domicile rules, eligibility and dates on the JKSSB website."
  }
];

if (!fs.existsSync(DATA_FILE)) writeJobs(seed);

function stripHtml(s) {
  return String(s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function tag(xml, name) {
  const m = xml.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">", "i"));
  return m ? stripHtml(m[1]) : "";
}

async function checkOfficialFeeds() {
  if (!FEEDS.length) return { checked: 0, added: 0, message: "No official RSS feeds configured." };
  let queue = readJson(QUEUE_FILE, []), added = 0, checked = 0;
  for (const feedUrl of FEEDS) {
    try {
      const u = new URL(feedUrl);
      if (!["https:", "http:"].includes(u.protocol)) continue;
      const response = await fetch(u, { headers: { "User-Agent": "SarkariJobUniverseBot/1.0" }, signal: AbortSignal.timeout(12000) });
      if (!response.ok) continue;
      const xml = await response.text();
      checked++;
      const items = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map(x => x[0]).slice(0, 30);
      for (const item of items) {
        const title = tag(item, "title");
        const link = tag(item, "link") || ((item.match(/<link[^>]+href=["']([^"']+)/i) || [])[1] || "");
        const desc = tag(item, "description") || tag(item, "summary") || tag(item, "content");
        if (!title || !link) continue;
        let parsed;
        try { parsed = new URL(link, u.href); } catch { continue; }
        if (!["https:", "http:"].includes(parsed.protocol)) continue;
        const id = crypto.createHash("sha256").update(parsed.href).digest("hex").slice(0, 20);
        if (queue.some(x => x.id === id) || readJobs().some(x => x.sourceUrl === parsed.href)) continue;
        queue.unshift({
          id,
          title: title.slice(0, 160),
          organization: u.hostname,
          category: "Other",
          region: "India",
          type: /admit|call letter/i.test(title) ? "Admit Card" : /result/i.test(title) ? "Result" : /answer key/i.test(title) ? "Answer Key" : "Job",
          status: "pending",
          officialUrl: parsed.href,
          description: desc.slice(0, 1000),
          sourceUrl: parsed.href,
          foundAt: new Date().toISOString(),
          sourceFeed: u.href
        });
        added++;
      }
    } catch (e) {
      console.warn("Feed check failed:", feedUrl, e.message);
    }
  }
  writeJson(QUEUE_FILE, queue);
  return { checked, added, message: "New feed items are waiting for admin verification." };
}

app.get("/api/health", (req, res) => res.json({ ok: true, service: "Sarkari Job Universe" }));

app.get("/robots.txt", (req, res) => {
  const base = process.env.SITE_URL || `${req.protocol}://${req.get("host")}`;
  res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`);
});

app.get("/sitemap.xml", (req, res) => {
  const base = (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url><url><loc>${base}/mock-test.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url><url><loc>${base}/papers.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url></urlset>`);
});

app.get("/api/jobs", (req, res) => {
  const jobs = readJobs().filter(j => !j.status || j.status === "published");
  res.json({ jobs, updatedAt: new Date().toISOString() });
});

app.post("/api/admin/login", loginLimiter, (req, res) => {
  if (!ADMIN_PASSWORD || !SESSION_SECRET) {
    return res.status(503).json({ error: "Admin is not configured. Set ADMIN_PASSWORD and SESSION_SECRET." });
  }
  if (!safeEqual(req.body.password || "", ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  res.json({ token: payload + "." + sign(payload), expiresIn: 28800 });
});

app.get("/api/admin/jobs", requireAdmin, (req, res) => res.json({ jobs: readJobs() }));

app.post("/api/admin/jobs", requireAdmin, (req, res) => {
  const j = validateJob(req.body);
  if (j.error) return res.status(400).json({ error: j.error });
  const jobs = readJobs();
  jobs.unshift({ ...j.value, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  writeJobs(jobs);
  res.status(201).json({ job: jobs[0] });
});

app.put("/api/admin/jobs/:id", requireAdmin, (req, res) => {
  const j = validateJob(req.body);
  if (j.error) return res.status(400).json({ error: j.error });
  const jobs = readJobs(), i = jobs.findIndex(x => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Job not found" });
  jobs[i] = { ...jobs[i], ...j.value, updatedAt: new Date().toISOString() };
  writeJobs(jobs);
  res.json({ job: jobs[i] });
});

app.delete("/api/admin/jobs/:id", requireAdmin, (req, res) => {
  const jobs = readJobs(), i = jobs.findIndex(x => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Job not found" });
  const [removed] = jobs.splice(i, 1);
  removed.deletedAt = new Date().toISOString();
  const trash = readJson(TRASH_FILE, []);
  trash.unshift({ kind: "job", item: removed });
  writeJson(TRASH_FILE, trash);
  writeJobs(jobs);
  res.json({ ok: true });
});

app.get("/api/automation/status", (req, res) => {
  res.json({
    enabled: FEEDS.length > 0,
    feedsConfigured: FEEDS.length,
    lastRun: readJson(path.join(DATA_DIR, "automation.json"), {}).lastRun || null,
    nextRun: FEEDS.length ? "Within 24 hours" : "Not scheduled"
  });
});

app.get("/api/daily-question", (req, res) => {
  const questions = [
    { q: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: 1, explanation: "Nitrogen makes up about 78% of dry air." },
    { q: "What is the SI unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: 2, explanation: "Force is measured in newtons (N)." },
    { q: "What is the capital of Jammu and Kashmir during the winter secretariat?", options: ["Srinagar", "Jammu", "Leh", "Kargil"], answer: 1, explanation: "Jammu is the winter capital/seat of the seasonal secretariat." }
  ];
  const day = Math.floor(Date.now() / 86400000);
  res.json({ ...questions[day % questions.length], date: new Date().toISOString().slice(0, 10) });
});

app.post("/api/mock-test", async (req, res) => {
  const topic = String(req.body.topic || "General Knowledge").slice(0, 100);
  const exam = String(req.body.exam || "SSC GD").slice(0, 80);
  const difficulty = ["Easy", "Medium", "Hard"].includes(req.body.difficulty) ? req.body.difficulty : "Medium";
  const unlimited = String(req.body.count || "").toLowerCase() === "all";
  const requested = unlimited ? 0 : Number(req.body.count) || 10;
  const count = Math.max(5, Math.min(500, requested));

  if (OPENAI_API_KEY && !unlimited) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": "Bearer " + OPENAI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "Create accurate educational multiple-choice practice questions. Return JSON only: {questions:[{question,options:[four strings],answerIndex:0,explanation}]}." },
            { role: "user", content: `Create ${count} ${difficulty} difficulty ${exam} practice MCQs on ${topic}.` }
          ]
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || "AI request failed");
      const parsed = JSON.parse(d.choices[0].message.content);
      if (Array.isArray(parsed.questions) && parsed.questions.length >= count) {
        return res.json({
          source: "AI-generated",
          topic,
          exam,
          difficulty,
          questions: parsed.questions.slice(0, count).map(q => ({
            question: String(q.question),
            options: q.options.slice(0, 4).map(String),
            answerIndex: Math.max(0, Math.min(3, Number(q.answerIndex) || 0)),
            explanation: String(q.explanation || "")
          }))
        });
      }
    } catch (e) {
      console.error("AI mock test fallback:", e.message);
    }
  }

  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  const pool = savedBank.length
    ? savedBank.map(q => ({ question: q.question, options: q.options, answerIndex: q.answer, explanation: q.explanation, category: q.category }))
    : [{ question: "Which is the largest planet in our Solar System?", options: ["Earth", "Jupiter", "Saturn", "Mars"], answerIndex: 1, explanation: "Jupiter is the largest planet.", category: "General" }];

  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const selected = unlimited ? shuffled : shuffled.slice(0, Math.min(count, shuffled.length));
  res.json({
    source: savedBank.length ? "Question bank" : "Built-in practice bank",
    topic,
    exam,
    difficulty,
    questions: selected.map(q => ({
      question: q.question,
      options: (q.options || []).slice(0, 4).map(String),
      answerIndex: Math.max(0, Math.min(3, Number(q.answerIndex) || 0)),
      explanation: String(q.explanation || "")
    }))
  });
});

app.get("/api/resources", (req, res) => {
  res.json({ resources: readJson(RESOURCES_FILE, []).filter(x => x.status === "published" && !x.deletedAt) });
});

app.get("/api/tests", (req, res) => {
  res.json({
    tests: readJson(TESTS_FILE, [])
      .filter(x => x.status === "published" && !x.deletedAt)
      .map(({ questions, ...x }) => ({ ...x, questionCount: Array.isArray(questions) ? questions.length : 0 }))
  });
});

app.get("/api/daily-updates", (req, res) => {
  res.json({ items: readJson(DAILY_UPDATES_FILE, []).filter(x => x.status === "published") });
});

app.get("/api/current-affairs", (req, res) => {
  let items = readJson(CURRENT_AFFAIRS_FILE, []);
  const cat = String(req.query.category || "").trim();
  const q = String(req.query.q || "").trim().toLowerCase();
  if (cat && cat !== "All") items = items.filter(x => x.category === cat);
  if (q) items = items.filter(x => (x.title + " " + x.summary + " " + x.category).toLowerCase().includes(q));
  const meta = readJson(CURRENT_AFFAIRS_META_FILE, { lastSync: null });
  res.json({ items, lastSync: meta.lastSync || null });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function dailyRun() {
  const result = await checkOfficialFeeds().catch(e => ({ checked: 0, added: 0, message: e.message }));
  writeJson(path.join(DATA_DIR, "automation.json"), { lastRun: new Date().toISOString(), ...result });
}

if (FEEDS.length) {
  setTimeout(dailyRun, 15000);
  setInterval(dailyRun, 24 * 60 * 60 * 1000);
}

app.listen(PORT, () => console.log(`Sarkari Job Universe running on ${PORT}`));
