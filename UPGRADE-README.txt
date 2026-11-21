SARKARI JOB UNIVERSE — v5.1 ADVANCE AUTO-JOBS UPGRADE PACK
==========================================================

Yeh Upgrade Pack aapke existing project (`Sarkari-Job-Universe-v3.7.0-Admin-Studio`) ke
saath 100% compatible hai. Aapke purane 100+ PDFs, Mock Test, Typing Wall, Student Hub,
Admin Studio, aur sabhi 11 widgets bilkul safe rahenge.

IS ZIP ME KYA-KYA UPGRADE KIYA GAYA HAI:
1. Live Jobs Sabse Upar (`public/index.html`):
   - `#latest` section ko hero aur quick-stats ke turant neeche set kar diya gaya hai.
   - Sabhi 11 existing widgets (Engage, Current Affairs, Photo Resizer, Age Calculator,
     Mock Suites, Explain Wall, etc.) neeche 100% intact hain.
2. All India + All 28 States & 8 UTs + District-wise + Qualification Filter:
   - Top par State shortcut pills + full 36 States/UTs dropdown.
   - Searchable District filter (J&K ke sabhi districts + major Indian districts).
   - Qualification filter (10th, 12th, ITI, Diploma, Graduate, PG, Engineering, Medical).
3. Present / Active Jobs First + Official PDF Button (`public/app.js`):
   - Har job par automatic status badge: `Closing Soon`, `● Present Active`, ya `Closed / Expired`.
   - Active jobs sabse upar aur expired jobs automatically neeche aati hain.
   - Direct `Official PDF ↗` aur `Apply Online ↗` buttons.
4. Auto Real Govt Jobs Engine (`server.js`):
   - Server start hone ke 12 second baad aur har 2 ghante me live govt job feeds se
     real jobs automatically fetch hokar `data/jobs.json` me publish hoti rahengi.
   - Title & description se State, District, Qualification, Vacancies, Last Date, aur
     PDF link automatically detect hota hai.
   - Koi extra npm package install karne ki zaroorat nahi hai!

MOBILE (ZARCHIVER) SE KAISE INSTALL KAREIN:
1. Apne purane `Sarkari-Job-Universe-v3.7.0-Admin-Studio` folder ko open karein.
2. Is ZIP ke andar ki 3 files ko extract karke replace kar dein:
   - `server.js`  --->  root folder me replace karein
   - `public/index.html`  --->  `public/` folder me replace karein
   - `public/app.js`  --->  `public/` folder me replace karein
3. GitHub par push karein — Render automatically deploy kar dega!

OPTIONAL RENDER ENVIRONMENT VARIABLES:
- `OFFICIAL_RSS_FEEDS`: Agar aap apni pasand ki extra official RSS feed URLs add karna
  chahein toh `;` (semicolon) se separate karke daal sakte hain. (Blank chhodne par
  built-in real Indian govt job feeds automatically chalengi.)
- `AUTO_PUBLISH_JOBS`: Default `true` hai (auto publish). Agar kabhi manual approval
  chahiye ho toh `false` set kar sakte hain.
