# Sarkari Job Universe — Import-Ready Guide

This package is based on the supplied v3.8.0 ZIP. Existing app files are preserved.

## GitHub
1. Extract this ZIP.
2. Create a GitHub repository.
3. Upload the extracted folder's *contents* to the repository root, not the ZIP itself.
4. Keep package.json, server.js, public/ and existing data folders at root.
5. Never upload .env, API keys, passwords or private user data.

## Render
1. Create a Render Web Service connected to the repository.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables from .env.example/README, if present.
5. Use a strong unique admin password and session secret.
6. If the app stores data/uploads on local disk, attach a Render Persistent Disk and configure the app paths to its mount. Otherwise data may be lost on redeploy/restart.
7. Test homepage, admin login, upload/download, Student Hub and mock tests.

## Automatic job updates
Deployment alone does not enable automatic discovery. Configure verified official RSS/Atom feed URLs only if supported by this project. Review every discovery before publishing. Many official recruitment sites do not provide feeds. Reference listings must not be described as newly announced vacancies.

## AI
If AI is supported, add the OpenAI key only as a server-side Render environment variable. Never put it in public HTML or browser JavaScript. API use may incur separate charges; check AI-generated questions for accuracy.

## Backup
Export a backup before importing or replacing data. Check whether it includes actual PDF/image bytes; JSON backups may contain metadata only. Back up the uploads directory separately and test restore on a copy first.

## Growth checklist
- Publish verified notices with official links.
- Distinguish reference listings from currently open vacancies.
- Add original exam-specific study guides and practice explanations.
- Submit sitemap.xml in Google Search Console.
- Improve mobile usability and page speed.
- Review feed discoveries manually.
- Re-test admin, uploads, backups and student tools after each deployment.

This guide does not configure Render, add feed URLs, provide API credentials, or guarantee every vacancy is detected. Those require account-side setup and ongoing verification.
