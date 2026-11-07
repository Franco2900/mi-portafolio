# Feature: Campus Virtual project page

**Status:** done — the page is live in the three languages, demo video included; a reseed upstream remains
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
  other seven: `Resumen`, `Tecnologías`, `Descripción`, `Imágenes`, `Video`, `Lo que aprendí`.
- A card in the academic projects row of each home, next to Tesis.
- Metadata (`title`, `description`, `h1`) for the three locales and registration in the content
  registry.
- Three sitemap groups with `es` / `en` / `pt-BR` / `x-default` alternates.
- Six screenshots plus a card thumbnail, converted to WebP.
- A `Video` section on the three pages, between `Imágenes` and `Lo que aprendí`, embedding the
  author's demo video from Google Drive.

Out of scope:

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
- [x] T10 Add the demo video section to the three pages and verify it renders.

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
against the page's own URL, the video section with its Drive embed and iframe `title`, and that no
email address is rendered. It then checks the home cards in
the three languages, the sitemap (27 URLs, four alternates each, symmetry, `x-default`, all 200),
structural parity across the three source files, and that none of the files this change touched
contains an email address.

## Progress log

- 2026-11-05: T1 done. `codigo/` was confirmed to be its own repository
  (`Franco2900/campus-virtual`, public, with CI) and added to `.git/info/exclude`, so nothing under
  it can reach the portfolio's history.
- 2026-11-05: T2–T9 done, in six work units:

  | Commit | Work unit |
  | --- | --- |
  | `809fb60` | `feat(proyectos): add Campus Virtual screenshots` |
  | `8cb6476` | `feat(proyectos): add the Campus Virtual page in three languages` |
  | `eb98a90` | `feat(proyectos): feature Campus Virtual in the home and the sitemap` |
  | `2221964` | `fix(proyectos): keep the space before the inline code spans` |
  | `30574cc` | `chore(proyectos): use a dark screenshot without test data` |
  | `8671e32` | `fix(proyectos): scope the layering claim to the business rules` |

  Ten files: three page bodies, seven images, three homes, `pages.ts`, `index.ts`, `sitemap.xml`.

- 2026-11-06: T10 done. The demo video is public on Google Drive, so the section embeds
  `https://drive.google.com/file/d/1KMpxcFd_Npg5A5FFzSr4ny40t8SF-JM5/preview` in an iframe with a
  per-language `title`, `allow="autoplay; fullscreen; encrypted-media"`, `allowfullscreen` and the
  same 500 px height the existing `#video` sections use. The `/preview` endpoint was probed before
  embedding: HTTP 200, the file's own title in `<title>`, no "Request access" wall. Two work units:

  | Commit | Work unit |
  | --- | --- |
  | `bb5479d` | `feat(proyectos): embed the Campus Virtual demo video in three languages` |
  | `9dbf198` | `docs(proyectos): record the Campus Virtual demo video work unit` |

  Parity moved from 73 to 77 tags with no divergence between the languages, because the iframe is
  identical apart from its translated `title`.

### Verification results

```
build                                    28 page(s)
--meta                                   10 of 10 unique titles, 0 problems
--all                                    11 pages, 0 broken
--page campusVirtual.html                0 / 17 broken
--page en/campusVirtual.html             0 / 17 broken
--page pt/campusVirtual.html             0 / 17 broken
cv_verify.py                             VERDICT: verified end to end in the three languages
structural parity                        77 tags / 26 class-id / 43 attributes, identical x3
sitemap                                  27 <loc>, 9 symmetric groups, all 200
images                                   7 WebP, source dimensions preserved
video section                            3 pages, Drive embed + nav anchor + iframe title
```

Visual review: desktop at 1400 px in the three languages, the home, and a real 390 px layout through
an iframe. The images, the switcher, the tables and the dark theme all render correctly.

The video section was reviewed the same way after T10: at 1400 px the Drive player renders with its
play button and fullscreen control between `Imágenes` and `Lo que aprendí`, and at a real 390 px the
iframe keeps the full page width without overflow.

After the two decisions were applied the whole check ran again: 28 pages, `cv_verify.py` passing in
the three languages, every internal reference resolving, and a scan for text glued to an inline
element returning only the two footer hits that all 28 pages share.

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
2. **Fixed** (`8671e32`). The page said validations and business rules live *exclusively* in
   `services/`, never in the blueprints. `codigo/backend/blueprints/auth.py:43-49` validates the
   login payload in the blueprint itself. The project's own `AGENTS.md` states the same absolute
   rule, so the page was echoing the project's documented convention rather than inventing
   anything — but the code did not match it. The wording now says what the code does: the business
   rules live in `services/`, and the blueprints only validate the shape of the request. The author
   chose the reword over leaving the claim as written.
3. **Fixed** (`30574cc`). `public/images/proyectos/campus virtual 6.webp` showed a course named
   "Smoke Course V2" with the code `SMKD6C21E`, a smoke-test artifact left in the demo data. Every
   image in the `03`–`06` range of `design-system/` carries it, so the image was swapped for the
   sign-in screen in dark theme from the same set, and its `alt` text updated in `8671e32`.

## Known gaps

- Receipt-driven review could not run. `gentle-ai review assess` reports `risk: high` with reason
  `unassessable`, because opencode is not an eligible runtime for immutable receipt review, and
  `review status` fails the same way with `immutable_review_transport_unsupported`,
  `mutation_outcome: not_started`, `retry_safe: false`, `next_action: stop`. Nothing was fabricated
  in its place: verification is the writer's parent-authorized run plus the orchestrator's script
  plus the independent verifier.

## Follow-ups

- The two decisions the verification left open are settled, and the demo video is published on the
  page; nothing is pending on the page itself.
- The video lives in Google Drive. If that file is ever moved, made private or deleted, all three
  pages break at once, because they share the same file id.
- Upstream, in `campus-virtual`: reseed the demo data and re-capture the `design-system/`
  screenshots, which all still show the smoke-test row.
- Receipt-driven review will not run in this runtime; that is an environment limitation, not a debt
  on this page.
