# Feature: the build verifies itself

**Status:** complete
**Created:** 2026-11-12
**Locator:** `odd/tasks/verificacion.md` (repo-relative)

## Objective

Close the gap between "it works on my machine" and "it is published": the sitemap is generated from
the content registry instead of being maintained by hand, the checks that were manual run in the
deploy workflow over all three locales, and the workflow stops using actions pinned to a runtime
GitHub already deprecated.

## Problem

Three things could reach production without anyone noticing:

1. `public/sitemap.xml` was a 27-URL file maintained by hand, with `<lastmod>2026-11-05` frozen.
   Adding a page meant remembering a sixth step, and forgetting it made the page invisible to search
   engines with no error anywhere.
2. `check_refs.py` was manual, so a broken push deployed anyway. It was also not recursive: without
   `--page`, it only looked at `dist/*.html` and never saw `dist/en/` or `dist/pt/`, and in `--all`
   mode it resolved every page against the site root, which is wrong for a nested page.
3. `checkout@v4`, `setup-node@v4`, `upload-pages-artifact@v3` and `deploy-pages@v4` target Node 20;
   every run is forced onto Node 24 and prints a deprecation annotation.

## Scope

- `src/pages/sitemap.xml.ts` replaces `public/sitemap.xml`.
- `check_refs.py` walks the whole `dist/` and resolves each page against its own URL.
- `scripts/verify-chatbot.js` is the independent pass T9 of `odd/tasks/chatbot.md` was missing.
- `.github/workflows/deploy.yml` gains a verification step and current action versions.
- Docs: `AGENTS.md`, `README.md`.

Out of scope: the CV, the email decision, the human reading of `en`/`pt`, the RDD lineages.

## Constraints

- No new dependencies. `python3` and `node` are on the runner; the site still ships one dependency,
  `astro`.
- The 27 published URLs must not change.
- The workflow must fail before uploading the artifact, not after deploying.

## Tasks

- [x] T1 Sitemap endpoint generated from `content`/`locales`, with the four alternates per URL and
      `x-default` to the default locale. Delete the static file.
- [x] T2 `check_refs.py`: `rglob`, per-page document URL, relative references resolved from the
      page directory, `--ignore` honored in both modes, one HTTP request per distinct URL.
- [x] T3 `check_refs.py --meta`: verify every `<loc>` of the generated sitemap exists in `dist/`.
- [x] T4 Workflow: run both checks after the build, with `astro preview` up and a bounded wait.
- [x] T5 Bump the four actions to the current major (Node 24).
- [x] T6 `scripts/verify-chatbot.js` and close T9 of the chatbot feature.
- [x] T7 Docs and local roadmap.

## Acceptance criteria

- Build still reports 28 pages; the sitemap has 27 `<loc>`, four alternates each, and every URL
  answers 200.
- `check_refs.py --meta` covers 28 pages across the three locales with 0 problems.
- `check_refs.py --all` covers 28 pages and resolves them under both forms.
- A broken reference in a nested page fails the check (proven with a probe page).
- `scripts/verify-chatbot.js` exits 0 and catches a broken anchor (it found one).
- The workflow has no Node 20 deprecation annotation after the bump.

## Verification

```bash
npm.cmd run build
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --meta --ignore 'google*.html'
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --all --ignore 'google*.html'
node scripts/verify-chatbot.js
```

Plus the same two commands the workflow runs, executed through Git Bash exactly as the step does.

## Decisions

- **No `<lastmod>`.** The honest value is the date of the last commit that touched each page, and the
  build cannot know it: the CI checkout is shallow. Writing the build date would change 27 URLs on
  every deploy, and Google ignores a `lastmod` it cannot trust. The field is optional.
- **Order of the sitemap follows the registry**, not the old hand-written order. The order has no
  meaning to a crawler, and deriving it from the registry is the point: one source of truth.
- **`python3` in the workflow**, not `python`: the runner guarantees `python3`, and the script is
  Python 3.
- **The preview wait is bounded** (40 attempts, one second apart). A hung preview fails the job with
  the server log instead of hanging until the six-hour timeout.
- **`scripts/verify-chatbot.js` is committed** rather than thrown away: it caught a real bug and runs
  in CI, so the curated set cannot silently drift.

## Progress log

- 2026-11-12: T1. `src/pages/sitemap.xml.ts` builds the URLs from `slugsFor`/`localizePath`, with
  `x-default` falling back to the first locale that has the page. `public/sitemap.xml` deleted.
  Build: 27 `<loc>`, 108 alternates, 27 `x-default`, 27/27 answering 200 over HTTP.
- 2026-11-12: T2/T3. `check_refs.py` now walks `dist/` recursively and derives each page's URL from
  its path (`index.html` becomes its directory). `--meta` audits 28 pages across three locales, 0
  problems. `--all` audits 28 pages in 2.2 s with the request cache. A probe page with a relative
  reference in `en/` resolved against `/en/` and the injected broken link was caught, which is the
  regression the old `--all` could not detect.
- 2026-11-12: T4. The workflow runs the metadata audit, then starts `astro preview`, waits for it
  with `curl`, and runs the HTTP audit. The step was executed verbatim through Git Bash against the
  real build: exit 0.
- 2026-11-12: T5. `checkout@v7`, `setup-node@v7`, `upload-pages-artifact@v5`, `deploy-pages@v5`.
  Checked the release notes for breaking changes: checkout v6/v7 changed how credentials are
  persisted and blocks fork checkout under `pull_request_target`, which this workflow does not use;
  setup-node v5–v7 changed automatic cache detection, and this workflow declares `cache: npm`
  explicitly; upload-pages-artifact v4 stopped including dotfiles, and `dist/` has none.
- 2026-11-12: T6. `scripts/verify-chatbot.js` found three Portuguese links pointing at `#projetos`
  when the anchor is `#proyectos`. Fixed in `src/data/chatbot.ts`. See `odd/tasks/chatbot.md` (T9).
- 2026-11-12: T7. `AGENTS.md` (layout, adding a page, verification, deploy) and `README.md`
  (structure, verification, deploy). `PENDIENTES.md` updated locally.
