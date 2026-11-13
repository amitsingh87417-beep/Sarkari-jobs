# Sarkari Job Universe — Final Advanced Edition v3.0

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


## Student Hub final feature upgrade (v3.5.0)
The student hub adds three client-side tools without removing the existing features:
- **Advanced Age Calculator**: exact calendar age (years/months/days), total completed days, next birthday, and age on a selected recruitment cut-off date. It validates dates and handles month lengths/leap years.
- **Exam Score & Negative Marking Calculator**: correct/wrong/unattempted counts, positive marks, penalty and percentage with input validation.
- **Exam Deadline Countdown**: days remaining / event today / days passed for a user-entered date.

These three tools run in the browser and do not send the entered dates or score details to the server. For recruitment eligibility, always follow the exact age cut-off, relaxation and date-counting rules in the official notification. The age calculator is informational and does not decide eligibility.

### Existing functionality retained
The upgrade preserves the existing job portal, admin panel, official-feed review workflow, student syllabus, practice generator, typing trainer, application tracker, exam calendar, notes, study library, timetable, read-aloud, state portals and mock-test simulator. The AI generator still requires a valid private `OPENAI_API_KEY` for fresh model-generated questions; fallback content is limited.
