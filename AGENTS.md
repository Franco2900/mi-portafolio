# AGENTS.md

Operating notes for anyone — human or AI agent — changing this repository.

The site is a **static Astro build** published to GitHub Pages at
`https://franco2900.github.io/mi-portafolio/`. There is no server, no database and no runtime
framework: every page is plain HTML produced at build time. Keep it that way.

## Commands

Windows shell; `npm` and `npx` must be called as `npm.cmd` / `npx.cmd`.

```bash
npm.cmd install      # first time only
npm.cmd run dev      # http://localhost:4321/mi-portafolio/
npm.cmd run build    # writes dist/
npm.cmd run preview  # serves dist/ on port 4321
```

A healthy build prints `28 page(s) built`. If that number changes, either a page was added or
something broke — check which before continuing.

## Non-negotiables

1. **Never hardcode the base path.** Every internal `href` and `src` goes through `url()` from
   `src/lib/url.ts`, which prepends `/mi-portafolio`. `localizePath()` already calls `url()`, so a
   localized link must not be wrapped in `url()` again.
   A bare relative path breaks the moment the visitor lands on `/mi-portafolio` without the
   trailing slash: the browser resolves it against `/` and every asset 404s at once.
2. **Three locales, structurally identical.** Spanish at `/`, English at `/en/`, Portuguese at
   `/pt/`. A page added in one language is added in all three, in the same order, with the same
   section anchors.
3. **No new dependencies.** `package.json` has exactly one: `astro`. The browser code is plain
   JavaScript in `public/js/`, loaded with a `<script src>` tag.
4. **No `innerHTML` with data or visitor input.** Build nodes and set `textContent`. The assistant's
   predecessor was compromised by interpolating the visitor's question into `innerHTML`.
5. **Do not invent content about the author.** Answers, project descriptions and the CV come from
   Franco. If a fact is missing, ask instead of filling the gap.

## Layout

```
astro.config.mjs            site, base, build.format, i18n
src/
  layouts/Base.astro        the single HTML shell: head, header, navbar, main, footer, scripts
  pages/
    [...slug].astro         Spanish routes (home is the root)
    404.astro               the only page with no locale
    sitemap.xml.ts          sitemap endpoint, generated from the content registry
    en/index.astro          English home
    en/[...slug].astro      English project pages
    pt/index.astro          Portuguese home
    pt/[...slug].astro      Portuguese project pages
  content/index.ts          registry: locale -> slug -> body component
  content/<lang>/<slug>.astro   the body markup of each page
  data/pages.ts             <title>, meta description and <h1> per page per locale
  data/chatbot.ts           the assistant's curated Q&A set
  components/               header, navbars, footer, background, language switcher, assistant
  i18n/ui.ts                locale keys, BCP 47 tags, short UI strings
  i18n/utils.ts             useTranslations, localizePath, slugPath
  lib/url.ts                url()
public/
  css/                      stylesheets, served as-is
  js/                       browser scripts, served as-is
  images/                   WebP images
  cv/, certificados/        downloadable PDFs
  robots.txt                points at the sitemap
scripts/
  verify-chatbot.js         independent check of the assistant
odd/tasks/                  feature documents (objective, tasks, verification, decisions)
```

## How a page is built

`Base.astro` receives `title`, `description`, `lang`, `slug`, `nav` and the list of stylesheets.
The route file looks up the metadata in `data/pages.ts`, finds the body in `content/index.ts`, and
renders `<Body h1={meta.h1} ... />` inside the layout.

`build.format: 'preserve'` publishes normal pages as `<slug>.html` and index routes as
`<dir>/index.html`. That is why the Spanish home is the root `index.html` and the other locales are
`en/index.html` and `pt/index.html` instead of `en.html`. The published URLs are the same ones the
site had before the Astro migration, so external links keep working.

`trailingSlash: 'ignore'` keeps both `/mi-portafolio/casino` and `/mi-portafolio/casino.html`
resolvable.

## Internationalization

- Locale keys are `es`, `en`, `pt`. The BCP 47 tag lives in `languages[lang].tag` and is what goes
  into `<html lang>` and `hreflang`; for Portuguese it is `pt-BR`, not `pt`. Never use the locale
  key where a tag is expected.
- Long prose belongs in `src/content/<lang>/<slug>.astro`. Short labels belong in
  `src/i18n/ui.ts`, read through `useTranslations(lang)`. Do not put paragraphs in `ui.ts`.
- `localizePath(path, lang)` builds a link for another locale. `slugPath(slug)` turns a slug into
  its published file name (`home` becomes the empty string).
- A locale may be incomplete and still compile: routes are generated from the keys present in
  `content/index.ts`. In practice all three are kept complete.
- The chosen language is remembered in `localStorage` under `mi-portafolio:lang`. `public/js/lang.js`
  runs in the `<head>`, without `defer`, so the redirect happens before the first paint; its data
  (current locale, default locale, home path per locale) travels as attributes of its own `<script>`
  tag, read through `document.currentScript`, because the DOM does not exist yet. Two rules keep it
  from breaking shared links: it only redirects from the default-locale home, never from an explicit
  `/en/` or `/pt/` URL, and it only stores what the visitor clicks in the selector, never the locale
  they happened to land on. The key is prefixed because `franco2900.github.io` is one origin for
  every GitHub Pages repo of the author.

### Adding a project page

1. `src/content/{es,en,pt}/<slug>.astro` — the three bodies.
2. Register the three bodies in `src/content/index.ts`.
3. Add metadata for the three in `src/data/pages.ts`.
4. Add the images under `public/images/proyectos/` (WebP, no spaces in new file names).
5. Add the card to the three home bodies, in the same row and position.
6. Nothing else: the sitemap is generated from the registry, so a page registered in step 2 is
   listed automatically.

Missing step 2 or 3 makes the route throw at build time; missing step 5 makes the page unreachable.
Step 2 also puts the page in the sitemap; a page that is in `dist/` but not in the registry cannot
exist, because the route comes from the registry.

## The assistant

`src/data/chatbot.ts` is the whole brain: 13 entries per locale, each with a canonical `question`,
`aliases`, an `answer` and optional `links`. `src/components/Chatbot.astro` renders the section,
the JSON payload, six primary chips and a native `<details>` that holds all 13 grouped by topic.
`public/js/chatbot.js` matches the visitor's question locally, with no network access.

The chip lists are two constants in the component: `PRIMARY_IDS` (the six shown by default) and
`GROUP_IDS` (all 13, with the headings taken from `copy.groupProfile`, `copy.groupTech`,
`copy.groupProjects` and `copy.groupContact`). `GROUP_IDS` is the complete set, so every entry
appears in exactly one group, and the six primary ones appear twice in the DOM on purpose: when the
disclosure opens, `.chatbot:has(.chatbot-more[open]) .chatbot-suggestions` hides the top block and
the same six are already waiting in their category. The grouped chips live in the DOM from the
start, so the matcher binds them with the same `querySelectorAll` even while the disclosure is
closed.

It is deliberately **not** a language model. Every answer is curated prose. When adding an entry:

- Add it to all three locales, same `id`, same position.
- Write aliases the way a visitor would actually type, without accents or punctuation.
- Add the new `id` to exactly one `GROUP_IDS` list, otherwise the entry exists in the payload but no
  chip ever offers it. Add it to `PRIMARY_IDS` only if it deserves one of the six slots above.
- Do not rank the projects against each other in the answers. Campus Virtual was once called "the
  largest" and "the clearest example" in three answers, and the author corrected it: it is one
  project among eight.
- Link with `slug` for a project page or `hash` for an anchor on the home — exactly one of the two.
- The matcher answers with the highest-scoring entry above `0.55`, otherwise the fallback. Two
  entries that a visitor cannot tell apart will shadow each other; check the pair you add.

## Styling

Bootstrap 5.3, Bootstrap Icons, Font Awesome and flag-icons come from a CDN. The project's own CSS
lives in `public/css/` and is linked by the layout: `layout.css`, `fondo.css`, `footer.css`,
`index.css` (home only) and `proyectos.css` (project pages only). Reuse the existing tokens — white
surfaces, `border-radius: 8px`, soft shadow, `#0d6efd` for accents, `#6c757d` for muted text. There
is no dark mode.

## Astro gotchas

- Astro trims whitespace at line edges. An inline element (`<a>`, `<code>`, `<strong>`) that must sit
  next to a word has to share the line with it, or the space disappears and the words glue together.
- Content files use inconsistent indentation on purpose; match the surrounding lines instead of
  reformatting the file.
- `set:html` is for trusted, pre-serialized strings only (the assistant payload). Escape `<` before
  injecting JSON into a `<script>` tag.
- `is:inline` keeps Astro from processing a script tag. Both assistant tags use it on purpose.
- A JPEG converted to WebP keeps its pixels but loses the EXIF orientation tag. The profile photo is
  a 2556×3408 portrait stored with orientation 8, so a plain conversion produced a sideways
  600×450 file that looked horizontal everywhere. Run `ImageOps.exif_transpose` before resizing;
  the file is now a real 600×800 portrait and `.img-profile` shows it whole, without cropping.

## Verification before saying it is done

```bash
npm.cmd run build
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --page index.html
node scripts/verify-chatbot.js
```

`check_refs.py` walks every `.html` in `dist/`, resolves each reference against the URL of its own
page and checks that every `<loc>` in the sitemap exists on disk. It reports `0 / N broken` when every
`href` and `src` resolves under both forms of the base. `--all` runs it over HTTP against a live
server; `--meta` audits metadata and on-disk references without one.

`verify-chatbot.js` reads the assistant payload from the three built homes and runs the real matcher
in a minimal DOM: every question and alias must land on its own entry, every anchor and project link
must resolve, and a question outside the set must return the fallback.

Also worth checking: the built HTML actually contains what you added, and no page lost its section
anchors. `dist/` is the source of truth, not the dev server.

## Deploy

`.github/workflows/deploy.yml` runs on every push to `main`: `npm ci`, `npm run build`, the two
checks above against `dist/` with the preview server up, upload `dist/`, deploy. A push with a broken
reference, a stale sitemap or a broken assistant link fails before publishing. It requires, once,
**Settings → Pages → Source: GitHub Actions**. Until that is selected, the published site is the one
served from the `main` branch and a push will not update it.

## Git conventions

- Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`), lowercase after the colon,
  imperative mood.
- No `Co-Authored-By` trailers and no AI attribution.
- One commit per reviewable work unit: tests, docs and the behaviour they describe travel together.
- `PENDIENTES.md` and `codigo/` are local only — they live in `.git/info/exclude`. Never commit
  them, never `git add -A` blindly.
- Do not push, merge or open a pull request without an explicit instruction.

## Feature documents

Substantial changes get a document in `odd/tasks/<feature>.md`: objective, problem, scope,
constraints, tasks, acceptance criteria, verification commands and a progress log with commit
hashes. Read the relevant one before touching a feature; update it when you close work.
