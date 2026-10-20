# Browser regression checks

Install Playwright separately with `npm install --no-save --package-lock=false playwright` and `npx playwright install chromium`.
Run from the repository root. Set `QA_LIVE=https://ibme-quiz.vercel.app/` for the live site; without it the core checks start a local Vite preview or dev server.

- `node scripts/qa/qa.mjs`: main pages and study tools at 360/390/768/1280, DPR 3, Large text, layout bounds and page errors.
- `node scripts/qa/qa-session.mjs`: all 80 quiz questions at 360x780, Large text, scroll-to-last-option reachability.
- `node scripts/qa/qa-update.mjs`: intercepts version.txt only in the test browser; verifies notice, dismiss/reload persistence, next-version prompt, Update navigation and preserved progress, invalid HTML rejection.
- `node scripts/qa/qa-scale.mjs`: onboarding, simulated 200% text sizing, popover, feedback, exit modal.
- `node scripts/qa/qa-extra.mjs`: live light-theme PDFs and settings at 360/390/412/768/1280 with animations enabled.

Screenshots are written to `/downloads/`. Screenshot composition and pixel review are still required; numeric bounds alone are not a visual test. DPR and doubled browser text are emulation, not proof of behavior on every physical Android/iOS device or OS font setting. Quiz checks use an isolated browser profile and do not change the owner's study progress.
