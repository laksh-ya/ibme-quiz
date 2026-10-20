# ibme-quiz

Duolingo-style practice app for the NPTEL course **Innovation, Business Models and Entrepreneurship** (noc26_mg145), weeks 1-8.

- Live: https://ibme-quiz.vercel.app
- `index.html` - the whole app, built as a single self-contained file (fonts, images, questions inlined).
- `src/data.json` - all 80 questions with options, answer keys and explanations (source of truth).
- `assets/` - the 4 diagram images used by questions W1 Q3, W1 Q9, W2 Q2, W4 Q10, extracted from the official PDFs.
- `pdfs/` - the official NPTEL course PDFs the questions come from, served in-app on the PDFs tab.
- `glimm.js` - vendored copy of [glimm](https://glimm.dev) (npm package `glimm`, MIT licence, (c) Noman Ijaz) used for the wave page transition. Licence in `glimm-LICENSE.txt`.

Modes: week Learn (instant feedback + fix-your-mistakes round), week Quiz (10 questions, results at the end with per-question review and retry-missed), plus practice rounds (daily, mistakes, shuffle and more under Practice).

Deploy: static upload of this folder to Vercel (`vercel deploy --prod`).
