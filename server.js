const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const questionEngine = require("./lib/question-engine");

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
const FEEDS = (process.env.OFFICIAL_RSS_FEEDS || "").split(";").map((x) => x.trim()).filter(Boolean);

if (!ADMIN_PASSWORD || !SESSION_SECRET) {
  console.warn("Set ADMIN_PASSWORD and SESSION_SECRET in your hosting environment before using the admin panel.");
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "10mb" }));
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

function readJobsPayload() {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (Array.isArray(raw)) {
      return { jobs: raw, updatedAt: new Date().toISOString() };
    }
    if (raw && Array.isArray(raw.jobs)) {
      return { jobs: raw.jobs, updatedAt: raw.updatedAt || new Date().toISOString() };
    }
    return { jobs: [], updatedAt: new Date().toISOString() };
  } catch {
    return { jobs: [], updatedAt: new Date().toISOString() };
  }
}

function readJobs() {
  return readJobsPayload().jobs;
}

function writeJobs(jobs, updatedAt = new Date().toISOString()) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  const payload = { updatedAt, jobs };
  fs.writeFileSync(tmp, JSON.stringify(payload, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

// ==================== V100.1 / 2050-READY: AUTOMATIC JOB EXPIRY & AUTO-REMOVE ENGINE ====================
function parseJobLastDate(lastDateStr) {
  const s = String(lastDateStr || "").trim();
  if (!s || /see notice|check|ongoing|always|open|active|district|result|admit|n\/a|announced/i.test(s)) return null;
  // Match DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/);
  if (dmy) {
    const dt = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]), 23, 59, 59, 999);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  // Match YYYY-MM-DD
  const ymd = s.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (ymd) {
    const dt = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]), 23, 59, 59, 999);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  // Match DD Mon YYYY (e.g. 21 Nov 2026, 25 Dec 2026)
  const monMap = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  const dMonY = s.match(/\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})\b/i);
  if (dMonY) {
    const dt = new Date(Number(dMonY[3]), monMap[dMonY[2].slice(0, 3).toLowerCase()], Number(dMonY[1]), 23, 59, 59, 999);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  return null;
}

function isJobExpired(job) {
  if (!job) return false;
  // Only auto-expire recruitment forms (Job) that have an explicit past lastDate; preserve Results, Admit Cards, Syllabus, Certificates
  if (job.type && job.type !== "Job") return false;
  if (job.section && ["Certificate", "Syllabus", "Results", "Admit Card", "Answer Key"].includes(job.section)) return false;
  const dt = parseJobLastDate(job.lastDate);
  if (!dt) return false;
  // Use IST (+05:30) end-of-day grace so jobs stay visible throughout their last date in India
  const nowIstMs = Date.now() + (5.5 * 60 * 60 * 1000);
  const todayIst = new Date(nowIstMs);
  const startOfTodayIst = new Date(todayIst.getUTCFullYear(), todayIst.getUTCMonth(), todayIst.getUTCDate(), 0, 0, 0, 0).getTime();
  return dt.getTime() < startOfTodayIst;
}

function autoRemoveExpiredJobs() {
  const jobs = readJobs();
  const active = [];
  const expired = [];
  for (const j of jobs) {
    if (isJobExpired(j)) expired.push(j);
    else active.push(j);
  }
  if (expired.length) {
    const trash = readJson(TRASH_FILE, []);
    const nowIso = new Date().toISOString();
    for (const item of expired) {
      trash.unshift({ kind: "job", reason: "Auto-removed after last date expired", item: { ...item, deletedAt: nowIso } });
    }
    writeJson(TRASH_FILE, trash.slice(0, 300));
    writeJobs(active, nowIso);
    console.log(`[Auto-Expiry] Moved ${expired.length} expired job(s) to Trash.`);
  }
  return { removedCount: expired.length, remainingCount: active.length };
}
// ==================== END AUTOMATIC JOB EXPIRY ENGINE ====================

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

app.get("/api/health", (req, res) => res.json({ ok: true, service: "Sarkari Job Universe" }));

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(
    "User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /api/\nSitemap: " +
      (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`) +
      "/sitemap.xml\n"
  );
});

app.get("/sitemap.xml", (req, res) => {
  const base = (process.env.SITE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url><url><loc>${base}/mock-test.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url><url><loc>${base}/papers.html</loc><changefreq>weekly</changefreq><priority>0.7</priority></url><url><loc>${base}/student-hub.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url><url><loc>${base}/typing-wall.html</loc><changefreq>weekly</changefreq><priority>0.8</priority></url></urlset>`
  );
});

app.get("/api/jobs", (req, res) => {
  const payload = readJobsPayload();
  const jobs = payload.jobs
    .filter((j) => (!j.status || j.status === "published") && !isJobExpired(j))
    .map((j) => ({ ...j, status: j.status || "published" }));
  res.json({ jobs, updatedAt: payload.updatedAt || new Date().toISOString(), autoExpiryEnabled: true });
});

app.post("/api/admin/jobs/cleanup-expired", requireAdmin, (req, res) => {
  const result = autoRemoveExpiredJobs();
  res.json({ ok: true, ...result });
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

app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const jobs = readJobs();
  const publishedJobs = jobs.filter((j) => !j.status || j.status === "published").length;
  const draftJobs = jobs.length - publishedJobs;
  const resources = readArray(RESOURCES_FILE).filter((r) => !r.deletedAt);
  const tests = readArray(TESTS_FILE).filter((t) => !t.deletedAt);
  const trash = readArray(TRASH_FILE);
  const queue = readJson(QUEUE_FILE, []);
  const questions = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  const ca = readCurrentAffairs();
  res.json({
    totalJobs: jobs.length,
    publishedJobs,
    draftJobs,
    resources: resources.length,
    tests: tests.length,
    trash: trash.length,
    reviewQueue: queue.length,
    questionBank: Array.isArray(questions) ? questions.length : 0,
    currentAffairs: ca.length
  });
});

app.patch("/api/admin/jobs/:id/toggle-status", requireAdmin, (req, res) => {
  const jobs = readJobs();
  const i = jobs.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Job not found" });
  const cur = jobs[i].status || "published";
  jobs[i].status = cur === "published" ? "draft" : "published";
  jobs[i].updatedAt = new Date().toISOString();
  writeJobs(jobs);
  res.json({ ok: true, job: jobs[i] });
});

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
  const jobs = readJobs();
  const i = jobs.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Job not found" });
  jobs[i] = { ...jobs[i], ...j.value, updatedAt: new Date().toISOString() };
  writeJobs(jobs);
  res.json({ job: jobs[i] });
});

app.delete("/api/admin/jobs/:id", requireAdmin, (req, res) => {
  const jobs = readJobs();
  const i = jobs.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Job not found" });
  const [removed] = jobs.splice(i, 1);
  removed.deletedAt = new Date().toISOString();
  const trash = readJson(TRASH_FILE, []);
  trash.unshift({ kind: "job", item: removed });
  writeJson(TRASH_FILE, trash);
  writeJobs(jobs);
  res.json({ ok: true });
});

function validateJob(b) {
  const title = String(b.title || "").trim();
  const organization = String(b.organization || "").trim();
  const url = String(b.officialUrl || "").trim();
  if (!title || !organization) return { error: "Title and organization are required" };
  try {
    const u = new URL(url);
    if (!["https:", "http:"].includes(u.protocol)) throw 0;
  } catch {
    return { error: "Enter a valid official notification URL" };
  }
  const allowed = new Set(["All India", "India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"]);
  return {
    value: {
      title: title.slice(0, 160),
      organization: organization.slice(0, 120),
      category: String(b.category || "Other").slice(0, 50),
      region: allowed.has(b.region) ? b.region : "All India",
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
      description: String(b.description || "").slice(0, 4000),
      importantDates: String(b.importantDates || "").slice(0, 3000),
      ageRelaxation: String(b.ageRelaxation || "See notification").slice(0, 500),
      selectionProcess: String(b.selectionProcess || "See notification").slice(0, 1200),
      howToApply: String(b.howToApply || "See official notification").slice(0, 2000),
      totalPosts: String(b.totalPosts || b.vacancies || "Not specified").slice(0, 80),
      notificationPdf: String(b.notificationPdf || "").slice(0, 500),
      section: String(b.section || "").slice(0, 50),
      badge: String(b.badge || "").slice(0, 30)
    }
  };
}

const seed = [
  { id: "sample-ssc-gd", title: "SSC Constable (GD) — check latest notice", organization: "Staff Selection Commission", category: "SSC", region: "All India", qualification: "See official notification", vacancies: "As notified", lastDate: "Check official site", examDate: "To be announced", status: "published", type: "Job", officialUrl: "https://ssc.gov.in/", description: "Reference listing only. Check SSC for the current recruitment notice, eligibility, dates and application status." },
  { id: "sample-jkssb", title: "JKSSB recruitment updates", organization: "Jammu & Kashmir Services Selection Board", category: "JKSSB", region: "Jammu & Kashmir", qualification: "Varies by post", vacancies: "As notified", lastDate: "Check official site", examDate: "Check notices", status: "published", type: "Job", officialUrl: "https://jkssb.nic.in/", description: "Reference listing only. Verify advertisement number, domicile rules, eligibility and dates on the JKSSB website." }
];
if (!fs.existsSync(DATA_FILE)) writeJobs(seed);

function readJson(file, fallback = []) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}
function stripHtml(s) {
  return String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}
function tag(xml, name) {
  const m = xml.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">", "i"));
  return m ? stripHtml(m[1]) : "";
}

async function checkOfficialFeeds() {
  if (!FEEDS.length) return { checked: 0, added: 0, message: "No official RSS feeds configured. Add verified RSS URLs in OFFICIAL_RSS_FEEDS." };
  let queue = readJson(QUEUE_FILE, []), added = 0, checked = 0;
  for (const feedUrl of FEEDS) {
    try {
      const u = new URL(feedUrl);
      if (!["https:", "http:"].includes(u.protocol)) continue;
      const response = await fetch(u, { headers: { "User-Agent": "SarkariJobUniverseBot/1.0 (official notice monitor)" }, signal: AbortSignal.timeout(12000) });
      if (!response.ok) continue;
      const xml = await response.text();
      checked++;
      const items = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map((x) => x[0]).slice(0, 30);
      for (const item of items) {
        const title = tag(item, "title");
        const link = tag(item, "link") || ((item.match(/<link[^>]+href=["']([^"']+)/i) || [])[1] || "");
        const desc = tag(item, "description") || tag(item, "summary") || tag(item, "content");
        if (!title || !link) continue;
        let parsed;
        try { parsed = new URL(link, u.href); } catch { continue; }
        if (!["https:", "http:"].includes(parsed.protocol)) continue;
        const id = crypto.createHash("sha256").update(parsed.href).digest("hex").slice(0, 20);
        if (queue.some((x) => x.id === id) || readJobs().some((x) => x.sourceUrl === parsed.href)) continue;
        queue.unshift({
          id,
          title: title.slice(0, 160),
          organization: u.hostname,
          category: "Other",
          region: "All India",
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
  return { checked, added, message: "New feed items are waiting for admin verification; nothing is auto-published." };
}

app.get("/api/automation/status", (req, res) =>
  res.json({
    enabled: FEEDS.length > 0,
    feedsConfigured: FEEDS.length,
    lastRun: readJson(path.join(DATA_DIR, "automation.json"), {}).lastRun || null,
    nextRun: FEEDS.length ? "Within 24 hours" : "Not scheduled",
    note: FEEDS.length ? "Feed discoveries require admin review before publishing." : "Configure OFFICIAL_RSS_FEEDS with verified official RSS/Atom feed URLs."
  })
);

app.get("/api/practice-questions", (req, res) => {
  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  const category = String(req.query.category || "").trim().toLowerCase();
  const limit = Math.max(1, Math.min(5000, Number(req.query.limit) || 5000));
  const questions = (Array.isArray(savedBank) ? savedBank : [])
    .filter((item) => !category || String(item.category || "").toLowerCase() === category)
    .slice(0, limit)
    .map((item) => ({
      category: String(item.category || "General"),
      question: String(item.question || ""),
      options: Array.isArray(item.options) ? item.options.map(String) : [],
      answer: Number(item.answer ?? item.answerIndex ?? 0),
      explanation: String(item.explanation || "")
    }))
    .filter((item) => item.question && item.options.length >= 2 &&
      Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length);
  res.set("Cache-Control", "public, max-age=300");
  res.json({ questions, total: questions.length });
});

app.get("/api/daily-question", (req, res) => {
  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  const fallback = [
    { category: "Science", question: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], answer: 1, explanation: "Nitrogen makes up about 78% of dry air." },
    { category: "Science", question: "What is the SI unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: 2, explanation: "Force is measured in newtons (N)." }
  ];
  const questions = savedBank.length ? savedBank : fallback;
  const day = Math.floor(Date.now() / 86400000);
  const item = questions[day % questions.length];
  res.json({ q: item.question, options: item.options, answer: Number(item.answer ?? item.answerIndex ?? 0), explanation: item.explanation || "Review the related topic after answering.", category: item.category || "General", date: new Date().toISOString().slice(0, 10), bankSize: questions.length });
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
        headers: { Authorization: "Bearer " + OPENAI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "Create accurate educational multiple-choice practice questions. Return JSON only: {questions:[{question,options:[four strings],answerIndex:0,explanation}]}. Exactly requested count. One correct answer. Do not invent current affairs." },
            { role: "user", content: `Create ${count} ${difficulty} difficulty ${exam} practice MCQs on ${topic}. Include concise explanations. Use English.` }
          ]
        })
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error?.message || "AI request failed");
      const parsed = JSON.parse(d.choices[0].message.content);
      if (!Array.isArray(parsed.questions) || parsed.questions.length < count) throw Error("AI returned an incomplete test");
      return res.json({
        source: "AI-generated",
        topic,
        exam,
        difficulty,
        questions: parsed.questions.slice(0, count).map((q) => ({
          question: String(q.question),
          options: q.options.slice(0, 4).map(String),
          answerIndex: Math.max(0, Math.min(3, Number(q.answerIndex) || 0)),
          explanation: String(q.explanation || "")
        }))
      });
    } catch (e) {
      console.error("AI mock test fallback:", e.message);
    }
  }

  const bank = [
    ["Which is the largest planet in our Solar System?", ["Earth", "Jupiter", "Saturn", "Mars"], 1, "Jupiter is the largest planet."],
    ["What is the chemical symbol for Sodium?", ["So", "S", "Na", "N"], 2, "Na comes from the Latin name natrium."],
    ["Which Article of the Indian Constitution deals with equality before law?", ["Article 14", "Article 19", "Article 21", "Article 32"], 0, "Article 14 guarantees equality before law and equal protection of laws."],
    ["Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "B. R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], 1, "Dr. B. R. Ambedkar chaired the Drafting Committee."],
    ["What is 15% of 200?", ["20", "25", "30", "35"], 2, "200 × 15/100 = 30."],
    ["Choose the correctly spelled word.", ["Accomodation", "Accommodation", "Acommodation", "Accommadation"], 1, "Accommodation has double c and double m."],
    ["Which blood cells help fight infection?", ["Red blood cells", "White blood cells", "Platelets", "Plasma"], 1, "White blood cells are part of the immune system."],
    ["The SI unit of electric current is:", ["Volt", "Ohm", "Ampere", "Watt"], 2, "Electric current is measured in amperes."],
    ["Which river is often called the Dakshin Ganga?", ["Narmada", "Godavari", "Krishna", "Kaveri"], 1, "The Godavari is also called the Dakshin Ganga."],
    ["A train travels 120 km in 2 hours. Its average speed is:", ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], 2, "Speed = distance ÷ time = 120 ÷ 2 = 60 km/h."]
  ];

  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  let pool = savedBank.length
    ? savedBank.map((q) => ({ question: q.question, options: q.options, answerIndex: q.answer, explanation: q.explanation, category: q.category }))
    : bank.map((q) => ({ question: q[0], options: q[1], answerIndex: q[2], explanation: q[3], category: "General" }));

  const topicKey = topic.toLowerCase().trim();
  const categoryRules = [
    ["math", ["Mathematics"]], ["quant", ["Mathematics"]], ["reason", ["Reasoning"]],
    ["english", ["English"]], ["grammar", ["English"]], ["science", ["Science"]],
    ["computer", ["Computer"]], ["jammu", ["Jammu & Kashmir GK"]], ["kashmir", ["Jammu & Kashmir GK"]], ["jk gk", ["Jammu & Kashmir GK"]],
    ["polity", ["GK"]], ["history", ["GK"]], ["geography", ["GK", "Jammu & Kashmir GK"]]
  ];
  const rule = categoryRules.find(([key]) => topicKey.includes(key));
  if (rule) {
    const filtered = pool.filter((q) => rule[1].includes(q.category));
    if (filtered.length) pool = filtered;
  }

  const examKey = exam.toLowerCase().trim();
  if (!rule && (topicKey.includes("mixed") || topicKey.includes("general knowledge"))) {
    if (examKey.includes("jkssb") || examKey.includes("j&k") || examKey.includes("jammu")) {
      const jkPool = pool.filter((q) => /jammu|jkssb/i.test(String(q.category || "")));
      const otherPool = pool.filter((q) => !/jammu|jkssb/i.test(String(q.category || "")));
      if (jkPool.length && otherPool.length) {
        const jkTake = Math.min(jkPool.length, Math.max(3, Math.round((unlimited ? jkPool.length : count) * 0.35)));
        pool = [
          ...jkPool.slice().sort(() => Math.random() - 0.5).slice(0, jkTake),
          ...otherPool.slice().sort(() => Math.random() - 0.5)
        ];
      }
    }
  }
  const seedNum = Math.max(1, Number(req.body.seed) || Math.floor(Math.random() * 100000) + 1);
  const targetCount = unlimited ? Math.max(100, pool.length) : count;
  let selected;
  if (targetCount > pool.length || difficulty === "Hard") {
    const dyn = questionEngine.buildDynamicPool({
      count: targetCount,
      seed: seedNum,
      category: topic,
      difficulty,
      baseBank: pool.map((q) => ({ category: q.category, question: q.question, options: q.options, answer: q.answerIndex, explanation: q.explanation }))
    });
    selected = dyn.map((q) => ({ question: q.question, options: q.options, answerIndex: q.answer, explanation: q.explanation, category: q.category }));
  } else {
    const shuffled = pool.slice().sort(() => Math.random() - 0.5);
    selected = shuffled.slice(0, targetCount);
  }
  const questions = selected.map((q) => ({
    question: q.question,
    options: q.options.slice(0, 4).map(String),
    answerIndex: Math.max(0, Math.min(3, Number(q.answerIndex) || 0)),
    explanation: String(q.explanation || "")
  }));

  res.json({
    source: savedBank.length ? "Question bank" : "Built-in practice bank",
    topic,
    exam,
    difficulty,
    questions,
    note: unlimited
      ? `Unlimited mode: loaded all ${questions.length} questions currently available in this question bank.`
      : OPENAI_API_KEY
        ? "AI temporarily unavailable; using the reviewed offline practice bank."
        : `Offline mode: questions are selected from the verified ${savedBank.length || bank.length}-question practice bank. Add OPENAI_API_KEY privately on Render to enable AI-generated topic-specific tests.`
  });
});

app.post("/api/study-assistant", async (req, res) => {
  const question = String(req.body.question || "").trim().slice(0, 2500);
  if (!question) return res.status(400).json({ error: "Enter a study question." });
  if (OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: "Bearer " + OPENAI_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          temperature: 0.3,
          messages: [
            { role: "system", content: "You are a careful Indian competitive-exam study tutor. Explain clearly for a student, use simple English or Hindi according to the question, show steps for calculations, distinguish stable facts from current affairs, and never invent official dates or vacancies. Keep the answer structured and concise." },
            { role: "user", content: question }
          ]
        })
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error?.message || "AI request failed");
      const answer = d.choices?.[0]?.message?.content;
      if (!answer) throw Error("Empty AI response");
      return res.json({ source: "AI study assistant", answer: String(answer).slice(0, 12000) });
    } catch (e) {
      console.error("Study assistant fallback:", e.message);
    }
  }
  res.json({
    source: "Offline study guide",
    answer: "Study guide (offline mode)\n\n1. Identify the exact concept and write its definition in one sentence.\n2. Break it into 3–5 key points and note important terms.\n3. Work through one example or previous-year style question.\n4. Recall the points without looking, then check your notes.\n5. Finish with 5 practice MCQs and review every incorrect answer.\n\nYour server does not currently have OPENAI_API_KEY configured, so personalised AI explanations are unavailable. Add the key privately in your hosting environment to enable AI answers. Do not paste API keys into this page."
  });
});

app.post("/api/admin/question-bank/bulk", requireAdmin, (req, res) => {
  const incoming = Array.isArray(req.body.questions) ? req.body.questions : [];
  if (!incoming.length || incoming.length > 5000) return res.status(400).json({ error: "Upload between 1 and 5000 questions per batch." });
  const file = path.join(DATA_DIR, "practice-question-bank.json");
  const bank = readJson(file, []);
  const seen = new Set(bank.map(q => String(q.question || "").trim().toLowerCase()));
  const accepted = [];
  for (const q of incoming) {
    const question = String(q.question || "").trim().slice(0, 1200);
    const options = Array.isArray(q.options) ? q.options.map(x => String(x).slice(0, 300)).slice(0, 6) : [];
    const answer = Number(q.answer ?? q.answerIndex);
    if (!question || options.length < 2 || !Number.isInteger(answer) || answer < 0 || answer >= options.length || seen.has(question.toLowerCase())) continue;
    seen.add(question.toLowerCase());
    accepted.push({ category: String(q.category || "General").slice(0, 80), question, options, answer, explanation: String(q.explanation || "").slice(0, 1200) });
  }
  const combined = bank.concat(accepted);
  writeJson(file, combined);
  res.status(201).json({ added: accepted.length, skipped: incoming.length - accepted.length, total: combined.length });
});

// ==================== V20 PRO: ADMIN QUESTION BANK STUDIO & SITE SETTINGS ====================
app.get("/api/admin/question-bank", requireAdmin, (req, res) => {
  const file = path.join(DATA_DIR, "practice-question-bank.json");
  const bank = readJson(file, []);
  const q = String(req.query.q || "").trim().toLowerCase();
  const cat = String(req.query.category || "").trim().toLowerCase();
  const indexed = (Array.isArray(bank) ? bank : []).map((item, idx) => ({ ...item, _idx: idx }));
  const filtered = indexed.filter((item) => {
    const catOk = !cat || cat === "all" || String(item.category || "").toLowerCase() === cat;
    const qOk = !q || [item.question, item.category, item.explanation, ...(item.options || [])].join(" ").toLowerCase().includes(q);
    return catOk && qOk;
  });
  const categories = [...new Set(indexed.map((x) => String(x.category || "General")))].sort();
  res.json({ total: indexed.length, filteredTotal: filtered.length, categories, items: filtered.slice(-80).reverse() });
});

app.post("/api/admin/question-bank", requireAdmin, (req, res) => {
  const question = String(req.body.question || "").trim().slice(0, 1200);
  const options = Array.isArray(req.body.options) ? req.body.options.map((x) => String(x).trim().slice(0, 300)).filter(Boolean).slice(0, 6) : [];
  const answer = Number(req.body.answer ?? req.body.answerIndex);
  if (!question || options.length < 2 || !Number.isInteger(answer) || answer < 0 || answer >= options.length) {
    return res.status(400).json({ error: "Provide a valid question, at least 2 options, and correct answer index." });
  }
  const file = path.join(DATA_DIR, "practice-question-bank.json");
  const bank = readJson(file, []);
  const item = {
    category: String(req.body.category || "GK").trim().slice(0, 80) || "GK",
    question,
    options,
    answer,
    explanation: String(req.body.explanation || "").trim().slice(0, 1200)
  };
  bank.push(item);
  writeJson(file, bank);
  res.status(201).json({ ok: true, item, total: bank.length });
});

app.delete("/api/admin/question-bank/:index", requireAdmin, (req, res) => {
  const idx = Number(req.params.index);
  const file = path.join(DATA_DIR, "practice-question-bank.json");
  const bank = readJson(file, []);
  if (!Number.isInteger(idx) || idx < 0 || idx >= bank.length) {
    return res.status(404).json({ error: "Question not found" });
  }
  bank.splice(idx, 1);
  writeJson(file, bank);
  res.json({ ok: true, total: bank.length });
});

const SITE_SETTINGS_FILE = path.join(DATA_DIR, "site-settings.json");
function readSiteSettings() {
  return readJson(SITE_SETTINGS_FILE, {
    versionLabel: "v1.0",
    announcement: "Welcome to Sarkari Job Universe v1.0 — Live Govt Jobs, Real CBT Mock Tests, 1,00,00,000+ (1 Crore) Hard Questions, 1,00,000+ Hard PDFs & Typing Pro!",
    whatsappUrl: "https://api.whatsapp.com/send?text=Check%20Sarkari%20Job%20Universe%20for%20Latest%20Govt%20Jobs%2C%20Admit%20Cards%20%26%20Free%20Mock%20Tests",
    telegramUrl: "https://t.me/",
    contactEmail: "sarkarjob5417@gmail.com"
  });
}

app.get("/api/site-settings", (req, res) => res.json(readSiteSettings()));

app.put("/api/admin/site-settings", requireAdmin, (req, res) => {
  const cur = readSiteSettings();
  const cleanUrl = (val, fallback) => {
    const s = String(val || "").trim();
    if (!s) return "";
    try {
      const u = new URL(s);
      return ["https:", "http:"].includes(u.protocol) ? u.href.slice(0, 500) : fallback;
    } catch {
      return fallback;
    }
  };
  const next = {
    versionLabel: String(req.body.versionLabel || cur.versionLabel || "v1.0").slice(0, 40),
    announcement: String(req.body.announcement ?? cur.announcement).slice(0, 300),
    whatsappUrl: cleanUrl(req.body.whatsappUrl, cur.whatsappUrl),
    telegramUrl: cleanUrl(req.body.telegramUrl, cur.telegramUrl),
    contactEmail: String(req.body.contactEmail || cur.contactEmail).slice(0, 120),
    updatedAt: new Date().toISOString()
  };
  writeJson(SITE_SETTINGS_FILE, next);
  res.json({ ok: true, settings: next });
});
// ==================== END V20 PRO ====================


app.get("/api/admin/review-queue", requireAdmin, (req, res) => res.json({ items: readJson(QUEUE_FILE, []) }));

app.post("/api/admin/review-queue/:id/approve", requireAdmin, (req, res) => {
  const queue = readJson(QUEUE_FILE, []);
  const i = queue.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Queue item not found" });
  const item = queue.splice(i, 1)[0];
  const j = validateJob({ ...item, ...req.body, status: "published" });
  if (j.error) return res.status(400).json({ error: j.error });
  const jobs = readJobs();
  jobs.unshift({ ...j.value, id: crypto.randomUUID(), createdAt: new Date().toISOString(), sourceUrl: item.sourceUrl });
  writeJobs(jobs);
  writeJson(QUEUE_FILE, queue);
  res.json({ ok: true, job: jobs[0] });
});

app.delete("/api/admin/review-queue/:id", requireAdmin, (req, res) => {
  const q = readJson(QUEUE_FILE, []);
  const n = q.filter((x) => x.id !== req.params.id);
  writeJson(QUEUE_FILE, n);
  res.json({ ok: true });
});

function readArray(file) { return readJson(file, []); }
function writeArray(file, data) { writeJson(file, data); }

app.get("/api/resources", (req, res) => res.json({ resources: readArray(RESOURCES_FILE).filter((x) => x.status === "published" && !x.deletedAt) }));
app.get("/api/admin/resources", requireAdmin, (req, res) => res.json({ resources: readArray(RESOURCES_FILE) }));

app.get("/api/admin/file-manager", requireAdmin, (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const folder = String(req.query.folder || "");
  const all = readArray(RESOURCES_FILE).filter((x) => !x.deletedAt);
  const resources = all.filter((x) => (!folder || x.folder === folder) && (!q || [x.title, x.fileName, x.category, x.description, x.folder].join(" ").toLowerCase().includes(q)));
  res.json({ resources, folders: [...new Set(all.map((x) => x.folder || "General"))].sort() });
});

app.post("/api/admin/resources/bulk", requireAdmin, upload.array("files", 20), (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: "Choose at least one file" });
  const titles = String(req.body.titles || "").split("\n");
  const folder = String(req.body.folder || "General").trim().slice(0, 80) || "General";
  const category = String(req.body.category || "Study Material").slice(0, 60);
  const status = req.body.status === "draft" ? "draft" : "published";
  const all = readArray(RESOURCES_FILE);
  const created = files.map((f, i) => ({
    id: crypto.randomUUID(),
    title: (titles[i] || path.parse(f.originalname).name).trim().slice(0, 160),
    category,
    folder,
    description: String(req.body.description || "").slice(0, 600),
    fileName: f.originalname.slice(0, 180),
    url: "/uploads/" + f.filename,
    mimeType: f.mimetype,
    size: f.size,
    status,
    createdAt: new Date().toISOString()
  }));
  writeArray(RESOURCES_FILE, [...created, ...all]);
  res.status(201).json({ resources: created, count: created.length });
});

app.post("/api/admin/resources/:id/replace", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Choose replacement file" });
  const all = readArray(RESOURCES_FILE);
  const i = all.findIndex((x) => x.id === req.params.id);
  if (i < 0) {
    fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: "Resource not found" });
  }
  const old = all[i];
  if (old.url) {
    const oldPath = path.join(UPLOAD_DIR, path.basename(old.url));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }
  all[i] = { ...old, fileName: req.file.originalname.slice(0, 180), url: "/uploads/" + req.file.filename, mimeType: req.file.mimetype, size: req.file.size, updatedAt: new Date().toISOString() };
  writeArray(RESOURCES_FILE, all);
  res.json({ resource: all[i] });
});

app.get("/api/admin/backup", requireAdmin, (req, res) => {
  const snapshot = { createdAt: new Date().toISOString(), jobs: readJobs(), resources: readArray(RESOURCES_FILE), tests: readArray(TESTS_FILE), trash: readArray(TRASH_FILE), reviewQueue: readJson(QUEUE_FILE, []) };
  res.setHeader("Content-Disposition", 'attachment; filename="sarkari-job-universe-backup.json"');
  res.type("application/json").send(JSON.stringify(snapshot, null, 2));
});

app.post("/api/admin/resources", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Choose a PDF or image file" });
  const title = String(req.body.title || "").trim();
  if (!title) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "Resource title is required" });
  }
  const item = {
    id: crypto.randomUUID(),
    title: title.slice(0, 160),
    folder: String(req.body.folder || "General").slice(0, 80),
    category: String(req.body.category || "Study Material").slice(0, 60),
    description: String(req.body.description || "").slice(0, 600),
    fileName: req.file.originalname.slice(0, 180),
    url: "/uploads/" + req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    status: req.body.status === "draft" ? "draft" : "published",
    createdAt: new Date().toISOString()
  };
  const all = readArray(RESOURCES_FILE);
  all.unshift(item);
  writeArray(RESOURCES_FILE, all);
  res.status(201).json({ resource: item });
});

app.put("/api/admin/resources/:id", requireAdmin, (req, res) => {
  const all = readArray(RESOURCES_FILE);
  const i = all.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Resource not found" });
  all[i] = { ...all[i], title: String(req.body.title || all[i].title).slice(0, 160), category: String(req.body.category || all[i].category).slice(0, 60), folder: String(req.body.folder || all[i].folder || "General").slice(0, 80), description: String(req.body.description || "").slice(0, 600), status: req.body.status === "draft" ? "draft" : "published", updatedAt: new Date().toISOString() };
  writeArray(RESOURCES_FILE, all);
  res.json({ resource: all[i] });
});

app.delete("/api/admin/resources/:id", requireAdmin, (req, res) => {
  const all = readArray(RESOURCES_FILE);
  const i = all.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Resource not found" });
  all[i].deletedAt = new Date().toISOString();
  const t = readArray(TRASH_FILE);
  t.unshift({ kind: "resource", item: all[i] });
  writeArray(TRASH_FILE, t);
  writeArray(RESOURCES_FILE, all);
  res.json({ ok: true });
});

app.get("/api/tests", (req, res) => res.json({ tests: readArray(TESTS_FILE).filter((x) => x.status === "published" && !x.deletedAt).map(({ questions, ...x }) => ({ ...x, questionCount: questions.length })) }));
app.get("/api/tests/:id", (req, res) => {
  const t = readArray(TESTS_FILE).find((x) => x.id === req.params.id && x.status === "published" && !x.deletedAt);
  if (!t) return res.status(404).json({ error: "Test not found" });
  res.json({ test: t });
});
app.get("/api/admin/tests", requireAdmin, (req, res) => res.json({ tests: readArray(TESTS_FILE) }));

app.post("/api/admin/tests", requireAdmin, (req, res) => {
  const title = String(req.body.title || "").trim();
  let questions = req.body.questions;
  if (typeof questions === "string") {
    try { questions = JSON.parse(questions); } catch { return res.status(400).json({ error: "Questions must be valid JSON" }); }
  }
  if (!title || !Array.isArray(questions) || !questions.length || questions.length > 200) {
    return res.status(400).json({ error: "Add a title and 1–200 questions" });
  }
  for (const q of questions) {
    if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length) {
      return res.status(400).json({ error: "Each question needs question, options array and valid answerIndex" });
    }
  }
  const item = {
    id: crypto.randomUUID(),
    title: title.slice(0, 160),
    exam: String(req.body.exam || "General Practice").slice(0, 80),
    duration: Number(req.body.duration) || 30,
    status: req.body.status === "draft" ? "draft" : "published",
    questions: questions.map((q) => ({ question: String(q.question).slice(0, 1000), options: q.options.slice(0, 6).map((x) => String(x).slice(0, 300)), answerIndex: q.answerIndex, explanation: String(q.explanation || "").slice(0, 1000) })),
    createdAt: new Date().toISOString()
  };
  const all = readArray(TESTS_FILE);
  all.unshift(item);
  writeArray(TESTS_FILE, all);
  res.status(201).json({ test: { ...item, questionCount: item.questions.length } });
});

app.put("/api/admin/tests/:id", requireAdmin, (req, res) => {
  const all = readArray(TESTS_FILE);
  const i = all.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Test not found" });
  if (req.body.status) all[i].status = req.body.status === "draft" ? "draft" : "published";
  if (req.body.title) all[i].title = String(req.body.title).slice(0, 160);
  writeArray(TESTS_FILE, all);
  res.json({ ok: true, test: all[i] });
});

app.delete("/api/admin/tests/:id", requireAdmin, (req, res) => {
  const all = readArray(TESTS_FILE);
  const i = all.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Test not found" });
  all[i].deletedAt = new Date().toISOString();
  const t = readArray(TRASH_FILE);
  t.unshift({ kind: "test", item: all[i] });
  writeArray(TRASH_FILE, t);
  writeArray(TESTS_FILE, all);
  res.json({ ok: true });
});

app.get("/api/admin/trash", requireAdmin, (req, res) => res.json({ items: readArray(TRASH_FILE) }));

app.post("/api/admin/trash/:id/restore", requireAdmin, (req, res) => {
  const t = readArray(TRASH_FILE);
  const i = t.findIndex((x) => x.item.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Trash item not found" });
  const entry = t.splice(i, 1)[0];
  const file = entry.kind === "job" ? DATA_FILE : entry.kind === "resource" ? RESOURCES_FILE : TESTS_FILE;
  const all = readArray(file);
  delete entry.item.deletedAt;
  all.unshift(entry.item);
  writeArray(file, all);
  writeArray(TRASH_FILE, t);
  res.json({ ok: true });
});

app.delete("/api/admin/trash/:id", requireAdmin, (req, res) => {
  const t = readArray(TRASH_FILE);
  const i = t.findIndex((x) => x.item.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Trash item not found" });
  const entry = t.splice(i, 1)[0];
  if (entry.kind === "resource" && entry.item.url) {
    const f = path.join(UPLOAD_DIR, path.basename(entry.item.url));
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
  writeArray(TRASH_FILE, t);
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
  if (err) return res.status(400).json({ error: err.message || "Upload failed" });
  next();
});

const DAILY_UPDATES_FILE = path.join(DATA_DIR, "daily-updates.json");
app.get("/api/daily-updates", (req, res) => {
  const all = readArray(DAILY_UPDATES_FILE);
  res.json({ items: all.filter((x) => x.status === "published") });
});
app.get("/api/admin/daily-updates", requireAdmin, (req, res) => {
  res.json({ items: readArray(DAILY_UPDATES_FILE) });
});
app.post("/api/admin/daily-updates", requireAdmin, (req, res) => {
  const title = String(req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "Title is required" });
  const item = {
    id: crypto.randomUUID(),
    title: title.slice(0, 160),
    tag: String(req.body.tag || "Breaking Alert").slice(0, 60),
    body: String(req.body.body || "").slice(0, 1000),
    link: String(req.body.link || "").trim().slice(0, 500),
    status: req.body.status === "draft" ? "draft" : "published",
    createdAt: new Date().toISOString()
  };
  const all = readArray(DAILY_UPDATES_FILE);
  all.unshift(item);
  writeArray(DAILY_UPDATES_FILE, all);
  res.status(201).json({ item });
});
app.put("/api/admin/daily-updates/:id", requireAdmin, (req, res) => {
  const all = readArray(DAILY_UPDATES_FILE);
  const i = all.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Update not found" });
  if (req.body.title !== undefined) all[i].title = String(req.body.title).trim().slice(0, 160);
  if (req.body.tag !== undefined) all[i].tag = String(req.body.tag).slice(0, 60);
  if (req.body.body !== undefined) all[i].body = String(req.body.body).slice(0, 1000);
  if (req.body.link !== undefined) all[i].link = String(req.body.link).trim().slice(0, 500);
  if (req.body.status !== undefined) all[i].status = req.body.status === "draft" ? "draft" : "published";
  all[i].updatedAt = new Date().toISOString();
  writeArray(DAILY_UPDATES_FILE, all);
  res.json({ item: all[i] });
});
app.delete("/api/admin/daily-updates/:id", requireAdmin, (req, res) => {
  const all = readArray(DAILY_UPDATES_FILE).filter((x) => x.id !== req.params.id);
  writeArray(DAILY_UPDATES_FILE, all);
  res.json({ ok: true });
});

const ENGAGE_SUITE_FILE = path.join(DATA_DIR, "engage-suite.json");
function readEngageSuite() {
  const def = {
    quiz: {
      title: "Aaj Ka Live GK & Exam Quiz",
      questions: [
        { question: "Jammu & Kashmir ki winter capital kaunsi hai?", options: ["Srinagar", "Jammu", "Leh", "Anantnag"], answerIndex: 1, explanation: "Jammu winter capital hai aur Srinagar summer capital hai." },
        { question: "Indian Constitution ka kaunsa Article Right to Equality deta hai?", options: ["Article 14", "Article 19", "Article 21", "Article 32"], answerIndex: 0, explanation: "Article 14 sabhi ko kanoon ke samne barabari deta hai." },
        { question: "Bharat mein 'Iron Man of India' kise kaha jata hai?", options: ["Subhas Chandra Bose", "Sardar Vallabhbhai Patel", "Bhagat Singh", "Lal Bahadur Shastri"], answerIndex: 1, explanation: "Sardar Vallabhbhai Patel ko Iron Man of India kaha jata hai." }
      ]
    },
    leaderboard: [],
    poll: {
      id: "poll-default-1",
      question: "Aap abhi kis exam ki taiyari kar rahe hain?",
      options: [
        { label: "JKSSB Exams", votes: 14 },
        { label: "SSC GD / CHSL", votes: 22 },
        { label: "Army GD / Police", votes: 18 },
        { label: "Railway / Banking", votes: 11 }
      ]
    },
    countdowns: [
      { id: "cd-1", title: "SSC GD Constable Exam Preparation Target", examDate: "2026-12-20", tag: "Mission 2026", link: "/mock-test.html" },
      { id: "cd-2", title: "JKSSB Upcoming CBT Practice Drive", examDate: "2026-12-15", tag: "J&K Special", link: "/papers.html" }
    ],
    demands: []
  };
  return readJson(ENGAGE_SUITE_FILE, def);
}

app.get("/api/engage-suite", (req, res) => {
  const s = readEngageSuite();
  const todayStr = new Date().toISOString().slice(0, 10);
  const batch = Math.max(0, Math.min(5000, Number(req.query.batch) || 0));
  const count = Math.max(5, Math.min(25, Number(req.query.count) || 5));
  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  const seed = questionEngine.getDailySeed(todayStr, "daily-engage-quiz-" + batch);
  const dynQs = questionEngine.buildDynamicPool({
    count,
    seed,
    category: String(req.query.category || ""),
    difficulty: "Hard",
    baseBank: savedBank
  }).map((q) => ({
    category: q.category || "GK",
    question: q.question,
    options: q.options,
    answerIndex: q.answer,
    explanation: q.explanation
  }));
  const quizPayload = {
    title: (s.quiz && s.quiz.title) || "Aaj Ka Live GK & Exam Quiz",
    date: todayStr,
    batch,
    bankCapacity: questionEngine.VIRTUAL_BANK_CAPACITY,
    questions: dynQs
  };
  res.json({ quiz: quizPayload, leaderboard: (s.leaderboard || []).slice(0, 10), poll: s.poll, countdowns: s.countdowns || [] });
});

app.post("/api/engage-suite/quiz-score", (req, res) => {
  const s = readEngageSuite();
  const name = String(req.body.name || "Student").trim().slice(0, 40) || "Student";
  const city = String(req.body.city || "").trim().slice(0, 40);
  const score = Math.max(0, Math.min(50, Number(req.body.score) || 0));
  const total = Math.max(1, Math.min(50, Number(req.body.total) || 3));
  s.leaderboard = Array.isArray(s.leaderboard) ? s.leaderboard : [];
  s.leaderboard.push({ name, city, score, total, at: new Date().toISOString() });
  s.leaderboard.sort((a, b) => (b.score / b.total) - (a.score / a.total) || new Date(a.at) - new Date(b.at));
  s.leaderboard = s.leaderboard.slice(0, 25);
  writeJson(ENGAGE_SUITE_FILE, s);
  res.json({ leaderboard: s.leaderboard.slice(0, 10) });
});

app.post("/api/engage-suite/poll-vote", (req, res) => {
  const s = readEngageSuite();
  const idx = Number(req.body.optionIndex);
  if (s.poll && Array.isArray(s.poll.options) && s.poll.options[idx]) {
    s.poll.options[idx].votes = (Number(s.poll.options[idx].votes) || 0) + 1;
    writeJson(ENGAGE_SUITE_FILE, s);
  }
  res.json({ poll: s.poll });
});

app.post("/api/engage-suite/demand", (req, res) => {
  const message = String(req.body.message || "").trim();
  if (!message) return res.status(400).json({ error: "Message required" });
  const s = readEngageSuite();
  s.demands = Array.isArray(s.demands) ? s.demands : [];
  s.demands.unshift({
    id: crypto.randomUUID(),
    name: String(req.body.name || "Student").trim().slice(0, 50) || "Student",
    exam: String(req.body.exam || "General").trim().slice(0, 50),
    message: message.slice(0, 300),
    createdAt: new Date().toISOString()
  });
  s.demands = s.demands.slice(0, 100);
  writeJson(ENGAGE_SUITE_FILE, s);
  res.status(201).json({ ok: true });
});

app.get("/api/admin/engage-suite", requireAdmin, (req, res) => res.json(readEngageSuite()));

app.post("/api/admin/engage-suite/quiz", requireAdmin, (req, res) => {
  const title = String(req.body.title || "").trim();
  const questions = req.body.questions;
  if (!title || !Array.isArray(questions) || !questions.length || questions.length > 5000) {
    return res.status(400).json({ error: "Add title and 1-5000 valid questions per quiz upload" });
  }
  for (const q of questions) {
    if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length) {
      return res.status(400).json({ error: "Invalid question format" });
    }
  }
  const s = readEngageSuite();
  s.quiz = {
    title: title.slice(0, 140),
    questions: questions.map((q) => ({
      question: String(q.question).slice(0, 600),
      options: q.options.slice(0, 5).map((o) => String(o).slice(0, 200)),
      answerIndex: q.answerIndex,
      explanation: String(q.explanation || "").slice(0, 500)
    }))
  };
  if (req.body.resetBoard) s.leaderboard = [];
  writeJson(ENGAGE_SUITE_FILE, s);
  res.json({ ok: true });
});

app.post("/api/admin/engage-suite/poll", requireAdmin, (req, res) => {
  const question = String(req.body.question || "").trim();
  const options = req.body.options;
  if (!question || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: "Question and at least 2 options required" });
  }
  const s = readEngageSuite();
  s.poll = {
    id: "poll-" + Date.now(),
    question: question.slice(0, 180),
    options: options.slice(0, 6).map((lbl) => ({ label: String(lbl).slice(0, 80), votes: 0 }))
  };
  writeJson(ENGAGE_SUITE_FILE, s);
  res.json({ ok: true });
});

app.post("/api/admin/engage-suite/countdown", requireAdmin, (req, res) => {
  const title = String(req.body.title || "").trim();
  const examDate = String(req.body.examDate || "").trim();
  if (!title || !examDate) return res.status(400).json({ error: "Title and date required" });
  const s = readEngageSuite();
  s.countdowns = Array.isArray(s.countdowns) ? s.countdowns : [];
  s.countdowns.unshift({
    id: crypto.randomUUID(),
    title: title.slice(0, 120),
    examDate: examDate.slice(0, 20),
    tag: String(req.body.tag || "Upcoming").slice(0, 50),
    link: String(req.body.link || "").trim().slice(0, 400)
  });
  writeJson(ENGAGE_SUITE_FILE, s);
  res.json({ ok: true });
});

app.delete("/api/admin/engage-suite/countdown/:id", requireAdmin, (req, res) => {
  const s = readEngageSuite();
  s.countdowns = (s.countdowns || []).filter((x) => x.id !== req.params.id);
  writeJson(ENGAGE_SUITE_FILE, s);
  res.json({ ok: true });
});

app.delete("/api/admin/engage-suite/demand/:id", requireAdmin, (req, res) => {
  const s = readEngageSuite();
  s.demands = (s.demands || []).filter((x) => x.id !== req.params.id);
  writeJson(ENGAGE_SUITE_FILE, s);
  res.json({ ok: true });
});

// ==================== CURRENT AFFAIRS MODULE (AUTO + ADMIN) ====================
const CURRENT_AFFAIRS_FILE = path.join(DATA_DIR, "current-affairs.json");
const CURRENT_AFFAIRS_META_FILE = path.join(DATA_DIR, "current-affairs-meta.json");
const CA_RSS_FEEDS = (process.env.CURRENT_AFFAIRS_RSS_FEEDS || "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3;https://www.newsonair.gov.in/feed/")
  .split(";").map((x) => x.trim()).filter(Boolean);

function readCurrentAffairs() {
  try {
    const arr = JSON.parse(fs.readFileSync(CURRENT_AFFAIRS_FILE, "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeCurrentAffairs(items) {
  fs.mkdirSync(path.dirname(CURRENT_AFFAIRS_FILE), { recursive: true });
  const tmp = CURRENT_AFFAIRS_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(items, null, 2));
  fs.renameSync(tmp, CURRENT_AFFAIRS_FILE);
}

function classifyCurrentAffair(text) {
  const t = String(text || "").toLowerCase();
  if (/jammu|kashmir|jkssb|srinagar|ladakh|gulmarg|rajouri|poonch/.test(t)) return "Jammu & Kashmir";
  if (/army|navy|air force|drdo|defence|missile|border|bsf|crpf/.test(t)) return "Defence & National";
  if (/rbi|bank|gdp|economy|budget|tax|gst|inflation|export/.test(t)) return "Economy & Banking";
  if (/sport|cricket|olympic|khelo|medal|award|padma|nobel|championship/.test(t)) return "Sports & Awards";
  if (/isro|space|ai|satellite|science|tech|digital|cyber/.test(t)) return "Science & Tech";
  return "National & Polity";
}

function isExamImportantCA(text) {
  const t = String(text || "").toLowerCase();
  return /scheme|yojana|policy|summit|award|medal|isro|drdo|rbi|constitution|bill|act|jammu|kashmir|army|defence|index|report|mission|treaty|appointment|governor|chief justice/.test(t);
}

async function syncAutoCurrentAffairs() {
  let list = readCurrentAffairs();
  let added = 0;
  let checked = 0;

  for (const feedUrl of CA_RSS_FEEDS) {
    try {
      const u = new URL(feedUrl);
      if (!["https:", "http:"].includes(u.protocol)) continue;
      const resp = await fetch(u, {
        headers: { "User-Agent": "SarkariJobUniverse-CA-Bot/1.0" },
        signal: AbortSignal.timeout(10000)
      });
      if (!resp.ok) continue;
      const xml = await resp.text();
      checked++;
      const entries = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]).slice(0, 25);
      for (const entry of entries) {
        const title = tag(entry, "title");
        const link = tag(entry, "link") || ((entry.match(/<link[^>]+href=["']([^"']+)/i) || [])[1] || "");
        const desc = tag(entry, "description") || tag(entry, "summary") || tag(entry, "content");
        const pubDateRaw = tag(entry, "pubDate") || tag(entry, "updated") || tag(entry, "published");
        if (!title || title.length < 12) continue;

        const normTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        const exists = list.some((x) => String(x.title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() === normTitle);
        if (exists) continue;

        let parsedDate = new Date().toISOString().slice(0, 10);
        if (pubDateRaw) {
          const d = new Date(pubDateRaw);
          if (!isNaN(d.getTime())) parsedDate = d.toISOString().slice(0, 10);
        }

        let safeUrl = "";
        try {
          const pu = new URL(link, u.href);
          if (["https:", "http:"].includes(pu.protocol)) safeUrl = pu.href;
        } catch {}

        const combined = title + " " + desc;
        const important = isExamImportantCA(combined);
        if (!important && added >= 5) continue;

        list.unshift({
          id: "ca-" + crypto.randomBytes(6).toString("hex"),
          title: title.slice(0, 180),
          summary: (desc || title).slice(0, 500),
          category: classifyCurrentAffair(combined),
          date: parsedDate,
          source: u.hostname.replace(/^www\./, ""),
          sourceUrl: safeUrl,
          isImportant: important || true,
          addedBy: "auto",
          createdAt: new Date().toISOString()
        });
        added++;
        if (added >= 12) break;
      }
    } catch (err) {
      console.warn("Current affairs feed check skipped:", feedUrl, err.message);
    }
  }

  list.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  list = list.slice(0, 250);
  writeCurrentAffairs(list);

  const meta = { lastSync: new Date().toISOString(), checked, added, total: list.length };
  writeJson(CURRENT_AFFAIRS_META_FILE, meta);
  return meta;
}

app.get("/api/current-affairs", (req, res) => {
  let items = readCurrentAffairs();
  const cat = String(req.query.category || "").trim();
  const q = String(req.query.q || "").trim().toLowerCase();
  const importantOnly = req.query.important === "1";

  if (cat && cat !== "All") items = items.filter((x) => x.category === cat);
  if (importantOnly) items = items.filter((x) => Boolean(x.isImportant));
  if (q) items = items.filter((x) => (x.title + " " + x.summary + " " + x.category).toLowerCase().includes(q));

  const meta = readJson(CURRENT_AFFAIRS_META_FILE, { lastSync: null });
  res.json({ items, lastSync: meta.lastSync || null });
});

app.get("/api/admin/current-affairs", requireAdmin, (req, res) => {
  const items = readCurrentAffairs();
  const meta = readJson(CURRENT_AFFAIRS_META_FILE, { lastSync: null });
  res.json({ items, meta });
});

app.post("/api/admin/current-affairs", requireAdmin, (req, res) => {
  const title = String(req.body.title || "").trim();
  const summary = String(req.body.summary || "").trim();
  if (!title || !summary) return res.status(400).json({ error: "Title and exam summary are required" });

  let sourceUrl = String(req.body.sourceUrl || "").trim();
  if (sourceUrl) {
    try {
      const u = new URL(sourceUrl);
      if (!["https:", "http:"].includes(u.protocol)) sourceUrl = "";
    } catch {
      sourceUrl = "";
    }
  }

  const item = {
    id: "ca-" + crypto.randomBytes(6).toString("hex"),
    title: title.slice(0, 180),
    summary: summary.slice(0, 800),
    category: String(req.body.category || "National & Polity").slice(0, 50),
    date: String(req.body.date || new Date().toISOString().slice(0, 10)).slice(0, 20),
    source: String(req.body.source || "Admin Desk").trim().slice(0, 80) || "Admin Desk",
    sourceUrl: sourceUrl.slice(0, 400),
    isImportant: req.body.isImportant !== false,
    addedBy: "admin",
    createdAt: new Date().toISOString()
  };

  const list = readCurrentAffairs();
  list.unshift(item);
  list.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  writeCurrentAffairs(list);
  res.status(201).json({ ok: true, item });
});

app.patch("/api/admin/current-affairs/:id/important", requireAdmin, (req, res) => {
  const list = readCurrentAffairs();
  const idx = list.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Item not found" });
  list[idx].isImportant = !list[idx].isImportant;
  writeCurrentAffairs(list);
  res.json({ ok: true, item: list[idx] });
});

app.delete("/api/admin/current-affairs/:id", requireAdmin, (req, res) => {
  const list = readCurrentAffairs().filter((x) => x.id !== req.params.id);
  writeCurrentAffairs(list);
  res.json({ ok: true });
});

app.post("/api/admin/current-affairs/auto-sync", requireAdmin, async (req, res) => {
  const result = await syncAutoCurrentAffairs();
  res.json({ ok: true, ...result });
});

setTimeout(() => { syncAutoCurrentAffairs().catch(() => {}); }, 20000);
setInterval(() => { syncAutoCurrentAffairs().catch(() => {}); }, 12 * 60 * 60 * 1000);
// ==================== END CURRENT AFFAIRS MODULE ====================

// ==================== ALL EXPLAIN WALL (AI-CONNECTED) ====================
app.get("/api/ai-explain-wall/status", (req, res) => {
  res.json({
    connected: Boolean(OPENAI_API_KEY),
    model: OPENAI_API_KEY ? OPENAI_MODEL : "offline-study-engine"
  });
});

app.post("/api/ai-explain-wall", async (req, res) => {
  const mode = String(req.body.mode || "solve").slice(0, 40);
  const exam = String(req.body.exam || "SSC / JKSSB / General").slice(0, 80);
  const promptText = String(req.body.prompt || "").trim().slice(0, 3000);
  const count = Math.max(3, Math.min(25, Number(req.body.count) || 10));

  if (!promptText) {
    return res.status(400).json({ error: "Kripya apna sawal, topic, ya math/reasoning problem likhein." });
  }

  if (OPENAI_API_KEY) {
    try {
      const systemMsg = mode === "mcqs"
        ? "You are an expert Indian competitive-exam tutor (SSC, JKSSB, Railway, Army, Banking). Return JSON only: {title: string, summary: string, mcqs: [{question: string, options: [four strings], answerIndex: 0, explanation: string}]}. Generate exact requested count. Do not invent fake job dates."
        : "You are an expert Indian competitive-exam tutor (SSC, JKSSB, Railway, Army, Banking). Solve or explain the user's query step-by-step in clear Hinglish/English with formulas, shortcuts, and 3 quick practice MCQs at the end. Return JSON only: {title: string, explanation: string, steps: [strings], shortcut: string, mcqs: [{question: string, options: [four strings], answerIndex: 0, explanation: string}]}.";

      const userMsg = mode === "mcqs"
        ? `Exam: ${exam}. Generate ${count} unique practice MCQs with 4 options, answerIndex (0-3), and concise explanation on: ${promptText}`
        : `Exam: ${exam}. Solve/Explain in detail with step-by-step solution, shortcut trick, and 3 practice MCQs: ${promptText}`;

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + OPENAI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          temperature: 0.35,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemMsg },
            { role: "user", content: userMsg }
          ]
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || "OpenAI request failed");
      const parsed = JSON.parse(d.choices?.[0]?.message?.content || "{}");
      return res.json({
        source: "AI Connected (" + OPENAI_MODEL + ")",
        connected: true,
        title: String(parsed.title || promptText.slice(0, 80)),
        explanation: String(parsed.explanation || parsed.summary || ""),
        steps: Array.isArray(parsed.steps) ? parsed.steps.map(String) : [],
        shortcut: String(parsed.shortcut || ""),
        mcqs: Array.isArray(parsed.mcqs) ? parsed.mcqs.map((q) => ({
          question: String(q.question || ""),
          options: Array.isArray(q.options) ? q.options.slice(0, 4).map(String) : ["Option A", "Option B", "Option C", "Option D"],
          answerIndex: Math.max(0, Math.min(3, Number(q.answerIndex) || 0)),
          explanation: String(q.explanation || "")
        })) : []
      });
    } catch (err) {
      console.error("All Explain Wall AI fallback:", err.message);
    }
  }

  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  const key = promptText.toLowerCase();
  let matched = savedBank.filter((q) =>
    (q.question + " " + q.category + " " + (q.explanation || "")).toLowerCase().includes(key)
  );
  if (!matched.length) {
    matched = savedBank.slice().sort(() => Math.random() - 0.5);
  }
  const picked = matched.slice(0, mode === "mcqs" ? count : 3).map((q) => ({
    question: q.question,
    options: (q.options || []).slice(0, 4).map(String),
    answerIndex: Math.max(0, Math.min(3, Number(q.answer) || 0)),
    explanation: String(q.explanation || "")
  }));

  return res.json({
    source: "Offline Practice Engine (Add OPENAI_API_KEY on server for live AI)",
    connected: false,
    title: "Topic Guide: " + promptText.slice(0, 80),
    explanation: "1. Pehle concept ki basic definition aur formula samjhein.\n2. Har step ko alag-alag likh kar solve karein taaki calculation mistake na ho.\n3. Neeche diye gaye practice MCQs solve karke apni accuracy check karein.",
    steps: [
      "Step 1: Diye gaye data aur keywords ko note karein.",
      "Step 2: Relevant formula ya rule apply karein.",
      "Step 3: Answer verify karke neeche MCQs attempt karein."
    ],
    shortcut: "Key concepts aur formulas ko short notes mein likh kar daily revise karein.",
    mcqs: picked
  });
});
// ==================== END ALL EXPLAIN WALL ====================


// ==================== V50 PRO: 10,000+ ON-DEMAND 100-QUESTION HARD PDF ENGINE ====================
function buildServerPdfBuffer(lines) {
  const parts = [];
  let offset = 0;
  const offsets = [0];
  function pushStr(s) {
    const buf = Buffer.from(s, "latin1");
    parts.push(buf);
    offset += buf.length;
  }
  function pdfEsc(s) {
    return String(s || "")
      .replace(/[^\x20-\x7E]/g, " ")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }
  const perPage = 48;
  const pages = [];
  for (let i = 0; i < lines.length; i += perPage) pages.push(lines.slice(i, i + perPage));
  if (!pages.length) pages.push(["Sarkari Job Universe v1.0 Practice Paper"]);

  pushStr("%PDF-1.4\n");
  let nextId = 4;
  const pageObjs = pages.map((l) => ({ pId: nextId++, cId: nextId++, lines: l }));
  const totalObjs = nextId - 1;

  offsets[1] = offset;
  pushStr("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  offsets[2] = offset;
  pushStr(`2 0 obj\n<< /Type /Pages /Kids [ ${pageObjs.map((p) => `${p.pId} 0 R`).join(" ")} ] /Count ${pageObjs.length} >>\nendobj\n`);
  offsets[3] = offset;
  pushStr("3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

  for (const po of pageObjs) {
    offsets[po.pId] = offset;
    pushStr(`${po.pId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${po.cId} 0 R >>\nendobj\n`);
    let stream = "BT\n/F1 9.5 Tf\n38 804 Td\n15.5 TL\n";
    po.lines.forEach((ln, idx) => {
      const clean = pdfEsc(ln).slice(0, 102);
      stream += idx === 0 ? `(${clean}) Tj\n` : `T* (${clean}) Tj\n`;
    });
    stream += "ET\n";
    const sBuf = Buffer.from(stream, "latin1");
    offsets[po.cId] = offset;
    pushStr(`${po.cId} 0 obj\n<< /Length ${sBuf.length} >>\nstream\n`);
    parts.push(sBuf);
    offset += sBuf.length;
    pushStr("\nendstream\nendobj\n");
  }

  const xrefPos = offset;
  pushStr(`xref\n0 ${totalObjs + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i <= totalObjs; i++) {
    pushStr(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  }
  pushStr(`trailer\n<< /Size ${totalObjs + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);
  return Buffer.concat(parts);
}


// ==================== V52 ULTIMATE PRO: 1,00,00,000+ (1 Crore) DYNAMIC ENGINE & REAL EXAM CBT ====================
app.get("/api/question-engine/pool", (req, res) => {
  const todayStr = String(req.query.date || new Date().toISOString().slice(0, 10)).slice(0, 10);
  const batch = Math.max(0, Math.min(50000, Number(req.query.batch) || 0));
  const count = Math.max(1, Math.min(200, Number(req.query.count) || 25));
  const category = String(req.query.category || "").trim();
  const difficulty = ["Easy", "Medium", "Hard"].includes(req.query.difficulty) ? req.query.difficulty : "Hard";
  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  const seed = req.query.seed
    ? Math.max(1, Number(req.query.seed) || 1)
    : questionEngine.getDailySeed(todayStr, `pool-${category.toLowerCase()}-${difficulty}-${batch}`);

  const questions = questionEngine.buildDynamicPool({
    count,
    seed,
    category: category === "All" || category === "ALL" ? "" : category,
    difficulty,
    baseBank: savedBank
  });

  res.set("Cache-Control", "no-store");
  res.json({
    date: todayStr,
    batch,
    seed,
    difficulty,
    category: category || "All",
    virtualCapacity: questionEngine.VIRTUAL_BANK_CAPACITY,
    curatedCount: Array.isArray(savedBank) ? savedBank.length : 0,
    total: questions.length,
    questions
  });
});

app.post("/api/mock-test/real-paper", (req, res) => {
  const exam = String(req.body.exam || "SSC GD").slice(0, 40);
  const difficulty = ["Easy", "Medium", "Hard"].includes(req.body.difficulty) ? req.body.difficulty : "Hard";
  const todayStr = new Date().toISOString().slice(0, 10);
  const paperNo = Math.max(1, Math.min(10000, Number(req.body.paperNo) || (Math.floor(Math.random() * 9999) + 1)));
  const seed = questionEngine.getDailySeed(todayStr, `real-${exam}-${paperNo}`);
  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);

  const paper = questionEngine.buildRealExamPaper({ exam, seed, difficulty, baseBank: savedBank });
  res.json({
    source: `Real CBT Paper Engine (1,00,00,000+ (1 Crore) Bank • Paper #${paperNo})`,
    exam: paper.exam,
    title: paper.title,
    paperNo,
    difficulty,
    durationMin: paper.durationMin,
    negative: paper.negative,
    sections: paper.sections,
    questions: paper.questions.map((q) => ({
      section: q.section,
      category: q.category,
      question: q.question,
      options: q.options,
      answerIndex: q.answer,
      explanation: q.explanation
    })),
    note: `Real-Exam CBT Pattern: ${paper.title} • ${paper.questions.length} Hard Questions • ${paper.durationMin} min • Negative Marking -${paper.negative}`
  });
});
// ==================== END V52 ULTIMATE PRO ENGINE ====================


// ==================== V100 ULTIMATE: DAILY TYPING TOPPERS LEADERBOARD ====================
const TYPING_LB_FILE = path.join(DATA_DIR, "typing-leaderboard.json");
function readTypingLeaderboard() {
  return readJson(TYPING_LB_FILE, []);
}

app.get("/api/typing-leaderboard", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const all = readTypingLeaderboard();
  const todayList = all.filter((x) => String(x.date || "").slice(0, 10) === today);
  res.json({
    date: today,
    today: todayList.slice(0, 15),
    allTime: all.slice(0, 15)
  });
});

app.post("/api/typing-leaderboard", (req, res) => {
  const name = String(req.body.name || "Typist").trim().slice(0, 40) || "Typist";
  const exam = String(req.body.exam || "General").trim().slice(0, 50);
  const language = String(req.body.language || "en").trim().slice(0, 10);
  const netWpm = Math.max(0, Math.min(220, Math.round(Number(req.body.netWpm) || 0)));
  const accuracy = Math.max(0, Math.min(100, Math.round(Number(req.body.accuracy) || 0)));
  const kdph = Math.max(0, Math.min(60000, Math.round(Number(req.body.kdph) || 0)));

  if (accuracy < 90) {
    return res.status(400).json({ error: "Minimum 90% accuracy is required to submit to the Toppers Board." });
  }
  const all = readTypingLeaderboard();
  all.push({
    id: crypto.randomUUID(),
    name,
    exam,
    language,
    netWpm,
    accuracy,
    kdph,
    date: new Date().toISOString()
  });
  all.sort((a, b) => b.netWpm - a.netWpm || b.accuracy - a.accuracy);
  const trimmed = all.slice(0, 100);
  writeJson(TYPING_LB_FILE, trimmed);
  const today = new Date().toISOString().slice(0, 10);
  res.status(201).json({
    ok: true,
    today: trimmed.filter((x) => String(x.date || "").slice(0, 10) === today).slice(0, 15),
    allTime: trimmed.slice(0, 15)
  });
});
// ==================== END V100 TYPING LEADERBOARD ====================

app.get("/api/pdf-sets/meta", (req, res) => {
  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);
  res.json({
    curatedQuestions: Array.isArray(savedBank) ? savedBank.length : 0,
    virtualQuestionCapacity: questionEngine.VIRTUAL_BANK_CAPACITY,
    totalPdfSets: questionEngine.VIRTUAL_PDF_SETS,
    questionsPerPdf: 100
  });
});

app.get("/api/pdf-sets/generate", (req, res) => {
  const setNo = Math.max(1, Math.min(100000, Number(req.query.set) || 1));
  const exam = String(req.query.exam || "SSC / JKSSB / All-India").slice(0, 60);
  const difficulty = ["Easy", "Medium", "Hard"].includes(req.query.difficulty) ? req.query.difficulty : "Hard";
  const category = String(req.query.category || "All").slice(0, 50);
  const savedBank = readJson(path.join(DATA_DIR, "practice-question-bank.json"), []);

  const qs = questionEngine.buildDynamicPool({
    count: 100,
    seed: setNo,
    category: category === "All" ? "" : category,
    difficulty,
    baseBank: savedBank
  });

  const lines = [
    `SARKARI JOB UNIVERSE v1.0 - 100 HARD QUESTIONS EXAM PAPER (SET #${setNo} / 1,00,000)`,
    `Exam: ${exam} | Difficulty: ${difficulty} | Questions: 100 | Negative Marking: -0.25`,
    "==============================================================================================",
    ""
  ];
  qs.forEach((q, idx) => {
    lines.push(`Q${idx + 1}. [${q.category || "GK"}] ${q.question}`);
    const opts = (q.options || []).map((o, j) => `${String.fromCharCode(65 + j)}) ${o}`);
    lines.push(`    ${opts.slice(0, 2).join("   |   ")}`);
    if (opts.length > 2) lines.push(`    ${opts.slice(2, 4).join("   |   ")}`);
  });
  lines.push("");
  lines.push("================================= ANSWER KEY (SET #" + setNo + ") =================================");
  for (let i = 0; i < qs.length; i += 5) {
    const chunk = qs.slice(i, i + 5).map((q, j) => `Q${i + j + 1}:${String.fromCharCode(65 + (q.answer || 0))}`).join("   ");
    lines.push(chunk);
  }

  const pdfBuf = buildServerPdfBuffer(lines);
  const safeExam = exam.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "exam";
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `${req.query.preview === "1" ? "inline" : "attachment"}; filename="sju-${safeExam}-set-${setNo}-100q-${difficulty.toLowerCase()}.pdf"`);
  res.send(pdfBuf);
});
// ==================== END V50 PRO PDF ENGINE ====================

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

async function dailyRun() {
  const result = await checkOfficialFeeds().catch((e) => ({ checked: 0, added: 0, message: e.message }));
  writeJson(path.join(DATA_DIR, "automation.json"), { lastRun: new Date().toISOString(), ...result });
  console.log("Daily official feed monitor:", result);
}

if (FEEDS.length) {
  setTimeout(dailyRun, 15000);
  setInterval(dailyRun, 24 * 60 * 60 * 1000);
}

setTimeout(() => { try { autoRemoveExpiredJobs(); } catch (e) { console.warn("Auto-expiry check:", e.message); } }, 5000);
setInterval(() => { try { autoRemoveExpiredJobs(); } catch {} }, 6 * 60 * 60 * 1000);

app.listen(PORT, () => console.log(`Sarkari Job Universe running on ${PORT}`));
