# Feature: portfolio assistant (curated Q&A chatbot)

**Status:** complete, except T9 (independent pass) — see Known gaps
**Created:** 2026-11-06
**Branch:** astro-migration
**Locator:** `odd/tasks/chatbot.md` (repo-relative)

## Objective

Bring back the portfolio's chatbot on the home page, in Spanish, English and Portuguese, as a
client-side assistant over a curated question/answer set. No backend, no API keys, no third-party
service: it has to keep working on GitHub Pages exactly as the site does today.

## Problem

The original chatbot was left behind during the Astro migration. Its markup and styles sit in
`stash@{0}`, and its logic and data (`js/chatbot.js`, `json/preguntasChatbot.json`) survive in the
stash's untracked commit `97f61a4`. It was twelve Q&A pairs matched with Fuse.js in the browser.

That set is now out of date: it never mentions Campus Virtual, the largest project on the site, it
answers the AI question with "I'm studying the concepts" when the site already ships an integrated
assistant, and its skills answer stops at MySQL. A visitor who asks the assistant about the best
work on the portfolio gets an answer that describes a smaller portfolio than the one they are
looking at.

## Why

The home is the only page every visitor reads. A client or a recruiter who wants to know whether
Franco is worth a call should be able to ask, in their own language, and get an answer that points
at the right project. It is also the cheapest possible form of "AI" on a static site: the data is
part of the page, the matching runs locally, and there is nothing to pay for or to abuse.

## Scope

In scope:

- A curated Q&A set per locale in `src/data/chatbot.ts`, with aliases, answers, optional links and
  the UI copy.
- A `Chatbot` component rendering the section, its suggested-question chips and the data payload.
- A dependency-free matcher in `public/js/chatbot.js`.
- The section on the three homes, a navbar entry pointing at it, and its styles.
- Passing `lang` down to the home body, which today only receives `h1`.

Out of scope:

- Any LLM, API key, serverless proxy or third-party widget.
- Answering from the project pages' content. The answers are curated prose, not scraped text.
- Translating the CV or the certificate.
- Changing the site's email strategy. The address stays in the contact answer as plain text, by the
  author's decision: a possible client needs a way to reach him.

## Constraints

- No new dependency. `package.json` has only `astro` and stays that way.
- No network request at runtime: the Q&A set ships inside the page.
- The three locales must be structurally identical, as every other page on the site is.
- Answers may only state what the site already states. Nothing invented about the author.
- The section must work with JavaScript disabled by not looking broken: the markup is static, the
  script only adds behaviour.

## Route

Delegated direct.

- **Content authoring — orchestrator inline.** The curated set is the substance of the feature and
  the voice has to be his, so `src/data/chatbot.ts` is written by hand.
- **Wiring — one writer.** Component, matcher, styles, three home bodies, three route files, the
  navbar and the dictionary keys are eight files: one bounded writer, not eight inline edits.

## Tasks

- [x] T1 Audit the twelve recovered Q&A against the current site content.
- [x] T2 Author `src/data/chatbot.ts` for the three locales.
- [x] T3 Write the matcher in `public/js/chatbot.js`.
- [x] T4 Build `src/components/Chatbot.astro`.
- [x] T5 Wire the section into the three homes, pass `lang`, add the navbar entry and `nav.assistant`.
- [x] T6 Style the section in `public/css/index.css` to match the existing cards.
- [x] T7 Build and verify the three languages over HTTP.
- [x] T8 Review visually at 1400 px and at a real 390 px.
- [ ] T9 Independent verification pass. **Not run.** The delegation route was unavailable
      (provider usage limit), so every check below was executed by the orchestrator inline. The
      checks are reproducible and their output is recorded, but no second pair of eyes ran.
- [x] T10 Remove `cnc` and `cobol-plans`, on the author's decision.
- [x] T11 Correct the `campus-virtual` answer in the three locales: it is a course assignment, not
      the degree's capstone.
- [x] T12 Write `AGENTS.md` and expand `README.md`.

## Acceptance criteria

- Build still reports 28 pages; the chatbot adds no route.
- The section is present in the three homes, structurally identical, with the `#asistente` anchor
  resolving in each language.
- A known question returns its own answer in each language; an unknown question returns the
  fallback without throwing.
- No runtime network request and no new dependency.
- No console error in any of the three pages.

## Verification

```
npm.cmd run build
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --page index.html
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --page en/index.html
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --page pt/index.html
```

Plus a headless run of the page that asks three questions per locale and asserts the answers.

## Progress log

- 2026-11-06: T1 started. The twelve pairs were recovered from `97f61a4` and read in full.
- 2026-11-07: T1 closed. Audit result, per entry:

  | Old entry | Outcome |
  |---|---|
  | who, services, studies, languages, contact | kept, answers unchanged apart from the C1 wording |
  | skills | rewritten: added Flask, SQLite, MongoDB, React, Docker |
  | projects | rewritten: the old one listed six projects and never mentioned Campus Virtual |
  | ai | rewritten: it said "I'm studying the concepts"; the site now ships an assistant |
  | studies-portfolio | rewritten: it described the degree, not the portfolio |
  | cobol, cobol-plans | kept; they are now distinguishable by the matcher |
  | cnc | kept, flagged to the author as a removal candidate |
  | — | added `campus-virtual`, `source-code`, `available` |

  Net: 12 → 15 entries, same for the three locales. T10 later takes it to 13.
- 2026-11-07: T2–T6 done. `src/data/chatbot.ts` (551 lines, 15 entries × 3 locales plus copy),
  `public/js/chatbot.js` (IIFE, no dependencies), `src/components/Chatbot.astro`,
  `public/css/index.css` (+ about 150 lines), three home bodies, three route files, the navbar and
  `nav.assistant` in `src/i18n/ui.ts`.
- 2026-11-07: T7 done. `npm.cmd run build` → 28 pages. The payload is present in the three homes
  with 15 entries, 6 chips and the section anchor. `check_refs.py --page` → 0/34 broken in
  `index.html`, `en/index.html` and `pt/index.html`. The build-time links resolve to
  `/mi-portafolio/campusVirtual.html`, `/mi-portafolio/en/campusVirtual.html` and
  `/mi-portafolio/pt/campusVirtual.html`.
- 2026-11-07: T7 done, headless run. `chatbot_probe.py` drove the real script: 10 of 10 expected
  Spanish questions returned their own answer, `hola que tal` fell back, 6 chips rendered, 10 user
  messages rendered. `sabes cobol` and `que planes tenes con cobol` now reach different entries,
  which is the exact collision the Fuse.js threshold caused.
- 2026-11-07: T8 done. 1400 px and a real 390 px (iframe, because Edge will not lay out below
  about 540 px). The form stacks and the chips wrap at 390 px with no horizontal overflow.
- 2026-11-07: Committed as work units: `b8e2e20` (data, component, script, styles) and `fc0a62c`
  (three homes, three routes, navbar, dictionary). This document closes the third.
- 2026-11-07: T10 done. `cnc` and `cobol-plans` removed from the three locales: 15 → 13 entries.
  `cnc` was about something the site never mentions; `cobol-plans` shadowed `cobol` and overstated
  a skill the author describes as basic. "¿Qué planes tenés con COBOL?" now resolves to `cobol`
  (score 0.70 through the bare alias), which is the right answer.
- 2026-11-07: T11 done. The `campus-virtual` answer was wrong in a way the audit missed: Campus
  Virtual is not the degree's capstone, it is a practical assignment from a UNLa course on software
  development and AI agent architecture. The answer now says so, and states what the course was
  actually about — the programmer orchestrates and reviews agents instead of writing the code.
  `projects` and `studies-portfolio` repeated the capstone claim and were corrected too, otherwise
  the same file would contradict itself.
- 2026-11-07: T12 done. `AGENTS.md` covers the non-negotiables, routing, i18n, the checklist for a
  new project page, the assistant's contract, the Astro whitespace trap, verification and git
  conventions. `README.md` now explains how the site is assembled and how the assistant works,
  instead of only listing commands.

## Findings

- `stash@{0}` does contain the untracked commit (`97f61a4`), so nothing was lost.
- The old matcher used Fuse.js at `threshold: 0.4` over twelve short Spanish questions. That
  threshold makes "¿Sabés COBOL?" and "¿Qué planes tenés con COBOL?" collide.
- The old JSON carries the real address in plain text, which the author decided to keep.
- The home bodies receive only `h1`; a component that needs the locale has to be given it.
- The old implementation interpolated the visitor's question into `innerHTML`. The new script only
  creates nodes and sets `textContent`, so a question can never become markup.
- The payload escapes `<` as `\u003c` before `set:html`, so no answer text can close the script tag.
  Both the data tag and the script tag use `is:inline`, which keeps Astro from rewriting them.
- `.chatbot-log:empty { display: none }` keeps an empty bordered box out of the first paint; the
  log appears with the first question.
- The audit missed one wrong fact that only the author could catch: Campus Virtual is not the
  degree's capstone. It is a practical assignment from a UNLa course on software development and AI
  agent architecture, and the point of the exercise was orchestrating agents, not writing code. The
  project pages already said "Curso de IA"; only the assistant's answers were wrong.
- Two entries for one basic skill shadow each other. `cobol` and `cobol-plans` proved it: the second
  one added no fact, it only inflated the first.

## Known gaps

- Receipt-driven review does not run in this runtime (same limitation recorded in
  `odd/tasks/campus-virtual.md`). Verification is the build, the HTTP checks and an independent
  pass.
- T9 is the one task not closed: no independent pass ran, because the delegation route was
  unavailable. Everything else was verified by the orchestrator itself.

## Follow-ups

- If the author ever wants a real conversational assistant, the only sound path is a serverless
  proxy holding the key; that is a separate feature with a cost.
