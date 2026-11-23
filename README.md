# Latest Release: v5.3.0 Final

See `RELEASE-NOTES-v5.3.0.txt` and `FINAL-DEPLOYMENT-CHECKLIST.md` for the latest features, Render persistent storage setup, limitations, and verification steps. Run `npm run validate` before deployment.

---

# Sarkari Job Universe — Advanced Edition v3.6.0

A responsive India + Jammu & Kashmir career portal with job notices, a protected admin console, official RSS/Atom feed monitoring with human review, and an AI Student Mock Test system.

## Included
- Job / admit card / result / answer key / exam date / syllabus directory
- Search, filters, qualification shortcuts, save jobs, official source links
- Admin login, add/edit/draft/publish/delete
- **Daily official-feed monitor**: checks only feed URLs you configure in `OFFICIAL_RSS_FEEDS`; discovered items enter a review queue and are NOT auto-published
- Admin review queue to approve or dismiss discovered items
- **AI Student Mock Test** page at `/mock-test.html`: exam, topic, difficulty, 5–20 MCQs, score and explanations
- Daily question endpoint and interactive question of the day
- Optional OpenAI API integration on backend only; built-in practice bank fallback
- SEO metadata, canonical URL placeholder, robots.txt, sitemap.xml, responsive pages
- Security headers, API/login rate limits, signed expiring admin session

## Run locally
1. Install Node.js 18+.
2. Extract ZIP and run `npm install`.
3. Copy `.env.example` to `.env`; set `ADMIN_PASSWORD` and a long random `SESSION_SECRET`.
4. Export environment variables in your shell (or install dotenv and load it at the top of server.js).
5. `npm start`; visit `http://localhost:3000`, `/admin.html`, `/mock-test.html`.

## Render deployment
- New Node Web Service, build `npm install`, start `npm start`.
- Add environment variables:
  - `ADMIN_PASSWORD`: strong unique password
  - `SESSION_SECRET`: long random secret
  - `SITE_URL`: exact public HTTPS Render URL
  - `OPENAI_API_KEY`: optional secret, backend only
  - `OPENAI_MODEL`: optional, defaults to `gpt-4o-mini`
  - `OFFICIAL_RSS_FEEDS`: optional semicolon-separated official RSS/Atom feed URLs
- For JSON data to survive restarts, attach a Render persistent disk mounted at `/opt/render/project/src/data` (adjust mount path to actual service root). For production, migrate jobs/queue/users to Supabase/PostgreSQL and enable backups.
- After changing environment variables, redeploy/restart the service.

## Daily job automation — important
The scheduler checks configured RSS/Atom feeds at startup (after 15 seconds) and every 24 hours. Many government recruitment websites do not provide public RSS/Atom feeds, and website HTML changes frequently. Therefore:
- No feed URL is assumed or fabricated.
- Feed discoveries are placed in the admin review queue.
- Admin must open the official source and verify title, dates, vacancies, eligibility and links before approval.
- This system does not scrape every government portal and cannot promise a new job every day.
- For broader automation, integrate a maintained official API/feed or a trusted human-verified data provider. Do not auto-publish unverified AI summaries.

## AI mock tests
- Without `OPENAI_API_KEY`, the page uses a small built-in sample question bank. It remains functional but is not unlimited or truly topic-specific.
- With a valid API key and available model access, questions are generated on the backend. Key is never placed in frontend code.
- OpenAI API usage may incur separate charges. Set usage limits and monitor billing. Never share the API key.
- AI questions can be wrong; label them as practice material and cross-check facts.

## SEO / Google
1. Replace `%SITE_URL%` in `public/index.html` with your canonical HTTPS domain.
2. Set `SITE_URL` in Render.
3. Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console and verify ownership.
4. Add original, accurate, regularly maintained exam guides and dedicated job detail pages.
5. Add About, Contact, Privacy Policy, Terms, Editorial Policy and Disclaimer pages with real contact details before ad-network review.
6. Use descriptive titles, internal links, fast pages, accessible layout and structured data that matches visible page content.
7. Avoid keyword stuffing, copied notices and fake vacancy/date claims.

Google ranking, indexing, AdSense approval, daily vacancy count and feed availability are not guaranteed.

## Official source links
- JKSSB: https://jkssb.nic.in/
- SSC: https://ssc.gov.in/
- UPSC: https://upsc.gov.in/
- RRB: https://www.rrbcdg.gov.in/
- IBPS: https://www.ibps.in/
- Indian Army: https://joinindianarmy.nic.in/
- NCS: https://www.ncs.gov.in/

Independent information portal. Not affiliated with any government department. Always verify recruitment details on the official notification.


## Student Preparation Hub (v3.1 upgrade)
- Open `/student-hub.html` for a 100-chapter starter syllabus across General Knowledge, Mathematics, Reasoning, English, Jammu & Kashmir and Computer Awareness.
- Chapter search/filter can prefill the practice generator.
- Repeatable practice sessions use the existing `/api/mock-test` endpoint (5–20 questions per session). There is no attempt counter or daily attempt quota; normal API rate limits still protect the server.
- Daily study checklist is saved in the student's browser on that device.
- Typing trainer offers 5, 10 and 15-minute sessions with live WPM and accuracy feedback.
- Existing jobs directory, admin panel, official-source review queue and original mock-test page are retained.

### Important accuracy and setup notes
- "Unlimited" means students can start new sessions repeatedly; it does not mean infinite question volume in one test. Current API limits a set to 20 questions.
- Topic-specific fresh AI questions require `OPENAI_API_KEY` to be set as a private Render environment variable. Never put the key in browser JavaScript or HTML.
- Without the AI key, the current backend uses a small demonstration fallback question bank. It is not a full 100-chapter question database.
- The 100 chapter names are a starter syllabus map. Check each exam's latest official syllabus before relying on it.
- Typing practice is a general skill trainer, not an official exam typing evaluation.

## Student Hub daily benefits (v3.2)

The Student Preparation Hub includes date-rotating local practice content: a GK/current-affairs practice question with explanations, a Word of the Day with meaning and example, and a daily revision note. It also links students to the National Scholarship Portal, AICTE student schemes, and the Jammu & Kashmir Higher Education website. These are portal links, not live scholarship-deadline alerts; students should verify current notices and eligibility on the official sites. Daily content rotates from the bundled sample bank and is not a live news feed.

No daily rewards/coins system or student leaderboard is included.


## Student Hub upgrade (v3.3)

The Student Preparation Hub now includes the previous v3.2 daily benefits plus:
- My Application Tracker (student-managed exam/post, application date and status)
- Personal Exam Calendar (student-added dates and optional official notice links; no fabricated exam dates)
- 100-chapter Syllabus Tracker with completion progress
- Official exam-authority links for previous papers and answer keys (students should check each authority's latest downloads)
- Job Eligibility Checker that compares age and education only against criteria entered from a specific notice; it is indicative, not an official decision
- Personal Notes saved locally in the browser
- Percentage, average, profit/loss and simple-interest calculators
- Extra date-rotating reasoning, maths formula, GK fact and English grammar cards

Application records, personal notes, calendar entries and syllabus progress are stored in the browser's localStorage on that device; they are not synced across devices and may be lost if browser site data is cleared. The daily learning cards rotate through bundled sample content and are not a live current-affairs/news feed. Scholarship portals and exam authority links are references only; always verify the current official notification.

No daily rewards/coins system or student leaderboard is included.


## Student Super Tools (v3.4)

The Student Preparation Hub now includes: AI Study Assistant, timed Real Exam Simulator, official Admit Card & Result Center links, local Performance Analysis, Daily Job Notification Center, English/Hindi Unicode Typing Test Pro, Smart Study Timetable, Offline Study Library with JSON export, browser Read Aloud, and State-wise Exam Zone links. Existing daily benefits, 100-chapter syllabus, mock test, typing trainer and student tools are retained. No Daily Rewards system or Student Leaderboard is included.

### Setup and limitations
- For personalised AI Study Assistant responses and topic-specific generated tests, set `OPENAI_API_KEY` privately in the hosting environment. Without it, the assistant provides an offline study guide and mock tests use the built-in practice bank.
- Job updates are sourced from published records in the portal. Configure `OFFICIAL_RSS_FEEDS` to monitor official RSS/Atom feeds; feed discoveries remain in the admin review queue until approved. The student page does not claim that every vacancy is automatically discovered.
- Admit card, result and state-wise sections link to official authority portals; they do not scrape candidate-specific data.
- Timetable, notes, offline library and performance history use this browser's local storage. They are not synced across devices and can be cleared by browser data cleanup. Export the offline library to keep a backup.
- Read Aloud depends on the device/browser Web Speech API and installed voices.
- Exam simulator questions are practice material, not official past papers.


### PWA status (v3.4.1)
- Progressive Web App support has been removed: no service-worker registration or offline cache is shipped.
- The site runs as a normal online website. Local browser storage features (saved notes, timetable and performance history) remain available in the same browser.


## v3.5.0 — Sample Paper PDF Centre
- Added `/papers.html`, a mobile-friendly PDF paper library linked from the main navigation and Student Zone.
- Includes original SSC GD, JKSSB General Awareness and Army GD practice PDFs, each with 15 MCQs and an answer key.
- PDFs are model practice content, not official or previous-year papers.
- Existing server routes, admin workflow, job feed review, Student Hub and AI mock-test endpoints are retained.
- Job notifications still depend on configured official RSS/Atom feeds or verified admin publishing. Browser/email push delivery is not included in this build; do not advertise automatic alerts until a push/email provider and consent flow are configured.


## v3.6.0 — 100-PDF Exam Practice Library
- Expanded `/papers.html` into a searchable and filterable library of 100 downloadable practice PDFs.
- Coverage labels include SSC GD/MTS/CHSL/CGL, RRB NTPC/Group D/ALP, JKSSB, J&K Police, Army GD/Agniveer, Navy, Banking and other state exams.
- Each PDF contains 10 four-option MCQs, an answer key and concise explanations.
- Added a 100-question shared practice bank at `data/practice-question-bank.json`; the offline mock-test endpoint now selects from it, with subject filtering for Mathematics, Reasoning, English, Science, Computer and J&K GK. Exam-labelled PDF sets are mixed practice, so some questions recur between sets.
- Added links to official SSC, Railway, JKSSB, Indian Army, UPSC and IBPS websites for checking genuine previous-year papers, answer keys and current notices.
- **Accuracy/copyright note:** the 100 PDFs are original PYQ-style practice sets, not official past-year papers. They are not copied from protected exam papers. The site clearly labels this distinction.
- Existing job portal, student hub, mock-test routes, admin workflow and original sample PDFs are retained.

## PDF library usage
- Open `/papers.html`, search by exam name or filter by exam category, then download or open a PDF.
- The manifest is served from `/papers/manifest.json`.
- To regenerate the PDF pack collection during development, use the accompanying project data and your own reviewed question bank; generated PDFs are static files in `public/papers/`.


## v3.7.0 – Admin Content Studio

- Admin can upload PDF/JPG/PNG/WEBP study resources (up to 25 MB), publish or save drafts.
- Admin can create question-based mock tests (1–200 MCQs per test) using JSON, then publish them to the student Mock Test page.
- Jobs, resources and tests use recoverable Trash with Restore and Permanent Delete actions.
- Published resources appear in the student Papers library; published mock tests appear on the Mock Test page.
- New upload API uses `multer`; install dependencies with `npm install`.

### Persistent storage on Render (important)

Render service filesystems are ephemeral unless a persistent disk is attached. Attach a disk to the Web Service at mount path `/var/data`, then set `DATA_DIR=/var/data` and `UPLOAD_DIR=/var/data/uploads` in Render Environment. Keep `ADMIN_PASSWORD` and `SESSION_SECRET` set. Without the disk, uploaded files and JSON content may be lost during redeploy/restart. Back up the disk regularly.

### Admin workflow

1. Open `/admin.html` and sign in using `ADMIN_PASSWORD`.
2. Use **Upload PDF / Study Material** to upload a file and publish it.
3. Use **Create a Mock Test** to add MCQs in JSON format. Each question needs `question`, `options`, `answerIndex` (zero-based), and optional `explanation`.
4. Published uploads appear at `/papers.html`; published tests appear at `/mock-test.html`.
5. Deleted jobs, resources and tests move to Trash. Restore them or permanently delete them there.

The file upload feature accepts PDFs and common image formats only. The mock test editor currently accepts JSON question sets; it does not parse questions automatically from an uploaded PDF.

## v3.8.0 Advanced File Manager

Admin `/admin.html` now includes searchable file inventory, folder labels, multi-file uploads (up to 20 per batch), replacement uploads, Trash actions, 15-second inventory refresh, and JSON metadata backup download.

### Required production environment
- `ADMIN_PASSWORD`: strong unique admin password
- `SESSION_SECRET`: long random secret
- `DATA_DIR=/var/data`
- `UPLOAD_DIR=/var/data/uploads`

Attach a Render Persistent Disk mounted at `/var/data`. The JSON backup endpoint exports jobs/resources/tests/trash/queue metadata; it does **not** package uploaded binary files. Back up `/var/data/uploads` separately (or migrate uploads to Supabase Storage/S3) to protect the actual PDFs and images. For multi-instance deployments use a shared database/object storage rather than local JSON files.

Bulk uploads accept PDF/JPG/PNG/WEBP, maximum 20 files per request and 25 MB per file. Student-facing resources remain limited to published, non-deleted items.
