# Feature: Campus Virtual project page

**Status:** in progress — the page is live in the three languages; two author decisions are open
**Created:** 2026-11-05
**Branch:** astro-migration

## Objective

Publish an eighth project page for **Campus Virtual**, the integrative assignment of the AI course at
UNLa, alongside the seven projects already on the site, in Spanish, English and Portuguese.

## Problem

The portfolio describes seven projects. Campus Virtual is the most substantial piece of work done so
far — twelve use cases, a layered Flask backend, a React front end and an integrated conversational
assistant — and it was missing from the site entirely.

## Why

The site's only job is that someone evaluating the author's work can see what he has built. The
largest and most recent project being absent is the single biggest gap in that story.

## Scope

In scope:

- A page body for the new project in the three languages, with the same section structure as the
  other seven: `Resumen`, `Tecnologías`, `Descripción`, `Imágenes`, `Lo que aprendí`.
- A card in the academic projects row of each home, next to Tesis.
- Metadata (`title`, `description`, `h1`) for the three locales and registration in the content
  registry.
- Three sitemap groups with `es` / `en` / `pt-BR` / `x-default` alternates.
- Six screenshots plus a card thumbnail, converted to WebP.

Out of scope:

- The demo video. The author records it later; the page has no video section and the
  `NavbarProject` `#video` anchor leads nowhere on this one page.
- Any change to the seven existing pages beyond the home cards.
- Anything inside `codigo/`. It is a local, unversioned copy of `Franco2900/campus-virtual`; it is
  in `.git/info/exclude` and only its evidence images are read.

## Constraints

- English and Portuguese bodies must be **structurally identical** to the Spanish one: same tags in
  the same order, same `class`/`id` values, same attributes, same `url()` calls.
- No text from `codigo/` may be copied into the repository, and no email address may appear
  anywhere.
- `codigo/` must never be staged. No `git add -A`.
- The page must describe the project truthfully. Nothing invented.

## Route

Delegated direct, with a deliberate exception.

- **Spanish body — orchestrator inline.** The Spanish page is the source of truth and the voice
  matters more than the tags. Writing it by hand was the cheapest way to control it.
- **Images, English, Portuguese and the wiring — one writer.** Ten files, so the writer trigger
  fires: one bounded worker rather than ten inline edits in the parent.
- **Verification — orchestrator, then a fresh-context verifier.** The writer ran the
  parent-authorized commands; the orchestrator then wrote and ran an independent end-to-end script
  over HTTP; because the receipt-driven review could not assess the candidate, a fresh-context
  verifier ran an adversarial pass over the committed range.

## Tasks

- [x] T1 Read `codigo/` to establish the facts: stack, layering, auth, chatbot, test count, evidence
      images.
- [x] T2 Write `src/content/es/campusVirtual.astro`.
- [x] T3 Convert seven images from `codigo/evidencias/` to WebP q82 in
      `public/images/proyectos/`.
- [x] T4 Write `src/content/en/campusVirtual.astro` and `src/content/pt/campusVirtual.astro`.
- [x] T5 Add the metadata to `src/data/pages.ts` and register the slug in `src/content/index.ts`.
- [x] T6 Add the card to the three homes.
- [x] T7 Add the three sitemap groups.
- [x] T8 Verify end to end over HTTP in the three languages, and review the pages visually.
- [x] T9 Run an independent adversarial verification pass and fix what it found.

## Acceptance criteria

- Build reports 28 pages.
- Every internal reference on the three new pages resolves.
- Structural parity across the three languages.
- The sitemap lists 27 URLs, each with four alternates, all resolving 200, and `x-default` always
  pointing at the Spanish URL.
- No email address, and no text taken from `codigo/`, in anything committed.
- No broken `/mi-portafolio` base path in any language.

## Verification

```
npm.cmd run build
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --meta --ignore "google*.html"
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --all
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --page campusVirtual.html
python "C:\Users\Administrador\AppData\Local\Temp\opencode\cv_verify.py"
```

`cv_verify.py` is the orchestrator-owned end-to-end check. It fetches the three pages over HTTP and
asserts, per language: status, `<html lang>`, the four alternates in order, `og:locale`, the language
switcher with exactly one `aria-current`, the six images, that every internal reference resolves
against the page's own URL, and that no email address is rendered. It then checks the home cards in
the three languages, the sitemap (27 URLs, four alternates each, symmetry, `x-default`, all 200),
structural parity across the three source files, and that none of the files this change touched
contains an email address.

## Progress log

- 2026-11-05: T1 done. `codigo/` was confirmed to be its own repository
  (`Franco2900/campus-virtual`, public, with CI) and added to `.git/info/exclude`, so nothing under
  it can reach the portfolio's history.
- 2026-11-05: T2–T9 done, in four work units:

  | Commit | Work unit |
  | --- | --- |
  | `809fb60` | `feat(proyectos): add Campus Virtual screenshots` |
  | `8cb6476` | `feat(proyectos): add the Campus Virtual page in three languages` |
  | `eb98a90` | `feat(proyectos): feature Campus Virtual in the home and the sitemap` |
  | `2221964` | `fix(proyectos): keep the space before the inline code spans` |

  Ten files: three page bodies, seven images, three homes, `pages.ts`, `index.ts`, `sitemap.xml`.

### Verification results

```
build                                    28 page(s)
--meta                                   10 of 10 unique titles, 0 problems
--all                                    11 pages, 0 broken
--page campusVirtual.html                0 / 17 broken
--page en/campusVirtual.html             0 / 17 broken
--page pt/campusVirtual.html             0 / 17 broken
cv_verify.py                             VERDICT: verified end to end in the three languages
structural parity                        73 tags / 26 class-id / 43 attributes, identical x3
sitemap                                  27 <loc>, 9 symmetric groups, all 200
images                                   7 WebP, source dimensions preserved
```

Visual review: desktop at 1400 px in the three languages, the home, and a real 390 px layout through
an iframe. The images, the switcher, the tables and the dark theme all render correctly.

### Findings from the independent verification

The verifier re-derived parity with its own parser (121 tags counted its own way), rebuilt the site,
re-checked links, meta and sitemap in the built output, and checked every factual claim on the page
against `codigo/`. It confirmed the claims about the twelve use cases, the 321 tests, the layering,
SQLite + SQLAlchemy, Alembic, the cookie flags, the guards, React + Vite, LangChain + Ollama with
`qwen3:4b`, the role-scoped read-only tools, the student grade isolation, the persisted history,
ChromaDB + `nomic-embed-text` and the Ollama-down behaviour. It found three issues:

1. **Fixed** (`2221964`). Astro trims whitespace at the edge of a line, so a word ending a line next
   to a `<code>` element starting the next one rendered glued. Exactly one such boundary per new
   page, and none anywhere else on the site.
2. **Open — author's call.** The page says validations and business rules live *exclusively* in
   `services/`, never in the blueprints. `codigo/backend/blueprints/auth.py:43-49` validates the
   login payload in the blueprint itself. The project's own `AGENTS.md` states the same absolute
   rule, so the page echoes the project's documented convention rather than inventing anything —
   but the code does not match it.
3. **Open — author's call.** `public/images/proyectos/campus virtual 6.webp` (the dark-theme
   screenshot) shows a course named "Smoke Course V2" with the code `SMKD6C21E`, a smoke-test
   artifact left in the demo data.

## Known gaps

- No video section, and the navbar's `#video` item leads nowhere on this page.
- Receipt-driven review could not run. `gentle-ai review assess` reports `risk: high` with reason
  `unassessable`, because opencode is not an eligible runtime for immutable receipt review, and
  `review status` fails the same way with `immutable_review_transport_unsupported`,
  `mutation_outcome: not_started`, `retry_safe: false`, `next_action: stop`. Nothing was fabricated
  in its place: verification is the writer's parent-authorized run plus the orchestrator's script
  plus the independent verifier.

## Follow-ups

- Record the demo video and add the section.
- Decide on the `services/`-validation wording and on the dark-theme screenshot.
- Reseed the Campus Virtual demo data so the screenshots do not show smoke-test rows.
- Record the final state once the two open decisions are settled.
