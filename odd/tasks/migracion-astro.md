# Feature: Migración a Astro (pasos 3 y 4)

**Status:** in progress
**Created:** 2026-11-03
**Branch:** `astro-migration` (base: `main`)

## Objective

Replace the hand-rolled "SPA" (10 HTML shells + `fetch` to assemble itself) with a
real static site generator, so that:

1. Every page ships complete HTML from the server (step 4).
2. Each page has a unique `<title>`, `<meta name="description">`, a real `<h1>` and
   Open Graph tags for social previews (step 3).
3. The shared chrome (`<head>`, header, navbars, footer) exists in one place.

## Problem

- The deployed HTML body is empty; everything is injected at runtime by `fetch`.
  Crawlers that do not execute JavaScript (LinkedIn, WhatsApp, Bing, Discord) see a
  page with no content and no preview data.
- The `<head>` is duplicated across 10 files, all with the same `<title>`.
- Zero `og:` / `canonical` / structured data tags exist.
- Zero `<h1>` elements in the entire site.

## Constraints

- Published URLs must not change: `tesis.html`, `supermercado.html`, etc. keep working
  (hence `build.format: 'file'`).
- `site` + `base` must produce `https://franco2900.github.io/mi-portafolio/`.
- No visual redesign. Same CSS, same classes, same layout.
- The user's uncommitted chatbot work must survive this migration untouched.

## Decisions

- **Images stay in `public/` as the already-optimized WebP files.** Re-processing them
  through `<Image />` would duplicate work already done and validated. `<Image />` is
  documented as the path for future assets.
- **Relative internal URLs, no `BASE_URL` prefixing.** With `build.format: 'file'` and
  every page at the same directory level, `images/x.webp` and `index.html` resolve
  correctly under `/mi-portafolio/`. Fewer moving parts than prefixing 94 references.
- **CSS imported through Astro**, not linked from `public/`, so it gets bundled and
  base-prefixed by the bundler.
- **Chatbot is not migrated.** It stays parked in a git stash for step 5.
- **Deployment moves to a GitHub Action.** This requires a one-time manual change in
  repo Settings -> Pages -> Source = GitHub Actions. Until the user does it, `main`
  keeps serving the current site.

## Tasks

- [ ] T1 Park the user's uncommitted chatbot work safely (backup + stash).
- [ ] T2 Commit the verified image/routing work on `main` so the branch has a clean base.
- [ ] T3 Create branch `astro-migration`; scaffold `package.json`, `astro.config.mjs`,
      `tsconfig.json`, `.gitignore`.
- [ ] T4 Move `images/`, `certificados/`, `cv/`, `robots.txt`, `sitemap.xml` and the
      verification file into `public/`. Drop the original PNG/JPG (kept on `main`).
- [ ] T5 Move the CSS to `src/styles/` and the image-zoom helper to `public/js/`.
- [ ] T6 Build `Base.astro` layout + `Header` / `Navbar` / `Footer` / `Fondo` components.
- [ ] T7 Port `views/indexView.html` to `src/pages/index.astro`.
- [ ] T8 Port the 7 project views to `src/pages/<name>.astro`.
- [ ] T9 Add a per-page metadata map (title, description, og) and emit `og:`,
      `twitter:`, `canonical` and `<h1>` from the layout.
- [ ] T10 Add `404.astro` and update `sitemap.xml`.
- [ ] T11 Add `.github/workflows/deploy.yml`.
- [ ] T12 `npm install` + `npm run build`; verify output: real HTML bodies, unique
      titles, og tags, assets resolve under `/mi-portafolio/`, visual parity.

## Acceptance criteria

- `dist/tesis.html` contains the full project text without any JavaScript.
- Every generated page has one `<h1>`, a unique `<title>`, a `meta description`,
  `og:title`, `og:description`, `og:image` (absolute URL) and `canonical`.
- `dist/index.html` references its CSS bundle with the `/mi-portafolio/` prefix.
- Build completes with zero errors.
- No published filename changes.

## Verification

```
npm run build
grep -c "<h1" dist/*.html
grep -o 'rel="canonical" href="[^"]*"' dist/index.html
grep -o 'href="[^"]*_astro[^"]*"' dist/index.html
git stash list
```

## Progress log

- 2026-11-03: created. Branch not yet cut.
