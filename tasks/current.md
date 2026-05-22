# Current Task

## Status: ACTIVE

## Task: MeerkatQuiz post-deployment — fix unsubscribe vulnerability + email setup

### Problem
MeerkatQuiz is live at meerkatquiz.com but has a high-severity security issue: the public unsubscribe endpoint accepts bare leadId/scorecardId without signed tokens. Also needs Gmail SMTP credentials for transactional emails.

### Progress
- [x] Deploy app to VPS (port 3002, nginx, SSL)
- [x] Configure Supabase auth (site_url, redirect URLs)
- [x] Set up GitHub SSH + deploy/rollback scripts
- [x] Run Codex adversarial review
- [ ] Fix unsubscribe endpoint with HMAC-signed tokens ← YOU ARE HERE
- [ ] Get Gmail app password from user for SMTP
- [ ] Test full signup → quiz flow on live site
- [ ] Set up GitHub Actions CI/CD

### Context For Next Session
MeerkatQuiz live at meerkatquiz.com, VPS port 3002, PM2 process "meerkatquiz", nginx reverse proxy. GitHub SSH works (github-quiz / github-leads host aliases). Supabase project: kaebgjfqagowcclpduzj. Management API token in /home/coder/.env on VPS. Codex flagged unsubscribe endpoint — needs HMAC signing before real user traffic. User deferred Stripe billing.

---

_Last updated: 2026-05-13 09:00 UTC_
