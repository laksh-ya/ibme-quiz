# ibme-quiz

Duolingo-style practice app for the NPTEL course **Innovation, Business Models and Entrepreneurship** (noc26_mg145), weeks 1-8. 80 questions, learn and quiz modes, practice rounds, flashcards, official solution PDFs.

Live: https://ibme-quiz.vercel.app

## Run

```bash
npm install
npm run dev        # Vite dev server
npm run build      # type-check + static build into dist/
npm run preview    # serve dist/ locally
```

Node 18+. The build output is plain static files (`dist/`), deployed on Vercel (`vercel.json` sets the Vite preset and `dist` as output).

## Structure

```
index.html              page shell, loads src/main.ts
src/
  main.ts               entry: imports styles, data, images; mounts the app
  app.ts                mount(), render(), click / input / keyboard handlers
  ui.ts                 shared UI state (current page, session, popover, flashcards)
  state.ts              saved progress (localStorage), settings, streak
  quiz.ts               question helpers, week stats, practice modes
  screens/
    shell.ts            sidebar / bottom nav, right rail, stats
    learn.ts            Learn path + Week popover attached to the node
    practice.ts, review.ts, cards.ts, profile.ts, pdfs.ts, gate.ts
    session.ts          lesson and quiz session, feedback, results
  lib/
    wave.ts             page transition on top of the glimm npm package
    audio.ts            WebAudio sound effects, haptics
    icons.ts            SVG icons, mascot, avatars
    confetti.ts, util.ts, update.ts, build.ts
  styles/               CSS split by area, imported in order by index.css
                        (later files override earlier ones)
  fonts/                Titan One + M PLUS Rounded 1c as woff2
  data/questions.json   all 80 questions, answers and explanations (source of truth)
  assets/               the 4 diagram images used by questions
public/pdfs/            official NPTEL solution PDFs, served on the PDFs tab
```

TypeScript is on (`npm run typecheck`) with `strict` off: the code was carried over from untyped JavaScript and is typed loosely for now.

## Page transition

`src/lib/wave.ts` uses [glimm](https://glimm.dev) (npm `glimm`, MIT, (c) Noman Ijaz). One visible layer: the glimm WebGL band. The outgoing page stays as a browser View Transition snapshot ahead of the band, the new page is revealed behind it with a mask that follows `ctrl.getProgress()`. No curtain, no blank frame in between.

Which path runs: glimm band + View Transitions (normal) > glimm band alone, page swaps at the band midpoint (no View Transitions) > plain masked wipe (no WebGL) > instant swap (reduced motion).

## Updates

The build writes `version.txt`; the running app polls it and offers a reload when the build id changes.
