# Topic-by-topic lesson reading

## Scope

All 40 lessons in Weeks 1-8 are rewritten as 135 connected topic cards, replacing 638 fragmented cards. Each topic has three explanatory paragraphs. Topics group related facts before moving on. Weekly cheat sheets, questions, answer keys and lesson source URLs are unchanged.

The baseline is commit 28b023e. `scripts/content/topic-plans.json` contains the ordered topic plans and source-card mappings. Rebuild lesson data with `python3 scripts/content/rewrite-lessons.py`.

## Grounding and course-specific qualifications

The content is based on the existing lecture-derived baseline, its visual specifications and the unchanged quiz explanations. This revision did not independently re-transcribe the source lectures. All 80 quiz explanations were checked against the new lesson text. Each consolidated topic was compared with the baseline cards' titles, text and visual facts. The mapping keeps each original source ID and fact ID exactly once.

Historical figures, company examples, financing terms and legal examples are identified as course material rather than current advice. In particular, Week 5 Q4's keyed set is distinguished from Bright's broader stages, the course-era MSME limits and KVIC wording are labelled as course recall, and Week 8's angel-investor key is distinguished from the slide's self-funding order.

## Reading behaviour

- Three numbered paragraphs, readable at the user's chosen text size.
- Long topics scroll independently of the fixed Back/Continue controls.
- A visible scroll hint disappears when the end is reached.
- Old lesson positions restart at the beginning once, because the card grouping changed. Completion flags, quiz progress and XP are retained.
- Quiz is offered only after the week's final lesson. It opens the Learn path rather than starting a surprise question.
- Topic styles are isolated from cheat-sheet styles.

## Checks performed locally

- Production build passes, with the existing chunk-size/glimm warnings.
- `python3 scripts/qa/qa-topic-content.py`: source coverage, three-paragraph structure, unchanged source URLs and unchanged cheat sheets for all eight weeks.
- Every topic exercised at 320, 360, 390, 768 and 1280 px in light and dark themes with large text. A 320 px long-word overflow was found and fixed.
- Browser checks cover no horizontal overflow or clipped top content, reachable final paragraph, lesson resume, old-progress migration, preserved XP, and end-of-week-only quiz navigation.
- All 135 topic captures visually inspected in contact sheets. Representative real-size top/bottom views checked at 320, 360, 390 and 1280 px.
- All cheat-sheet cards traversed in light/dark themes at 390 px; original rendering retained and topic styles absent.

Run the browser sweep with `WIDTHS=360 THEMES=light,dark node scripts/qa/qa-topics.mjs`. `WEEKS=1,2` limits it to selected weeks for shorter runs. `SHOTS=yes WIDTHS=390 THEMES=light` also saves full topic screenshots under /downloads.

## Release

This batch has not been pushed or deployed. It is waiting for the previously reported deployment limit reset. Do not create several deployments or upgrade the plan. Push the single batch once and verify the production build and live lesson content afterward.
