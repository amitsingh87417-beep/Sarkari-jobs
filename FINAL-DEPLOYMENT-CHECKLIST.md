# Final deployment checklist

## Render setup
1. Use the included `render.yaml` Blueprint. It uses a Starter web service and a 2 GB persistent disk mounted at `/var/data`. A free Render web service can sleep after inactivity; no code can guarantee it stays awake. The Starter plan is configured to avoid free-instance sleeping. Confirm current Render pricing before deploying.
2. Set `ADMIN_PASSWORD` to a strong unique password and set `SITE_URL` to the deployed HTTPS URL. Keep `OPENAI_API_KEY` only in Render environment variables.
3. Persistent disk storage is used for `data/` and uploads. Do not remove the disk or change its mount path without backing up `/var/data`.
4. Admin uploads and changes are stored on the persistent disk. Export `/api/admin/backup` periodically while signed in.

## Real features and limits
- Jobs, Results, Admit Cards and Answer Keys are shown from the site's job database. Add verified notices through Admin; no live official vacancy feed is assumed. RSS/Atom monitoring only works when verified feed URLs are configured in `OFFICIAL_RSS_FEEDS`, and discoveries wait for admin approval.
- State and UT filters are available. A state with no matching records will correctly show no results; the filter does not invent vacancies.
- Job detail pages show saved fields and official links. Missing details are marked as unavailable/see notification, not fabricated.
- Mock tests use the saved question bank. Daily automatic new questions require configured AI or admin publishing; a daily schedule is not guaranteed on a sleeping/free server.
- Typing test reports actual WPM and accuracy. It does not promise impossible 100,000-word or 100,000-character-per-minute results.
- Hindi, English, Simple Hindi and Simple English selector translates common navigation and filter labels; individual job notices remain in their source language.

## Smoke tests
Run `npm install`, `npm start`, then open `/api/health`, `/api/jobs`, `/`, `/job.html?id=sample-ssc-gd`, `/typing-wall.html`, `/mock-test.html`, and `/admin.html`. Confirm Admin login and upload using your configured secrets.
