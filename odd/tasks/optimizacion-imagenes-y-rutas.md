# Feature: Image optimization + relative routing

**Status:** in progress
**Created:** 2026-11-03
**Branch:** main

## Objective

Cut homepage transfer weight from ~11.3 MB to under 1 MB and eliminate the broken
`Home` navigation link that returns 404 on the deployed GitHub Pages site.

## Problem

1. The homepage requests ~11.3 MB of images. 98 image files total 52 MB in the repo,
   with screenshots up to 5.2 MB each. No `loading="lazy"`, no `decoding="async"`,
   no modern format. First paint on mobile is 15-20s.
2. `partials/navbar_index.html` links to `/`. On a GitHub Pages *project* site that
   resolves to `https://franco2900.github.io/`, which returns HTTP 404 (verified).
   `partials/navbar_proyectos.html` links to the hardcoded `/mi-portafolio/`, which
   works today but breaks on a custom domain.

## Why

- Weight is the single highest-impact defect for a portfolio whose only job is that a
  recruiter stays on the page.
- A navigation link that 404s is a correctness defect, not a preference.

## Scope

In scope:
- Generate WebP variants (full + thumbnail) for every image referenced by HTML.
- Switch all image references to WebP.
- Add `loading="lazy"` + `decoding="async"` to every image not above the fold.
- Add `width`/`height` attributes so lazy loading does not cause layout shift.
- Replace absolute `href="/"` and `href="/mi-portafolio/"` with relative paths.

Out of scope (recorded as follow-ups, not done here):
- Deleting the original PNG/JPG files.
- `<h1>`, `og:` tags, unique `<title>` per page.
- Any change to the chatbot.
- Splitting the two 7000px-tall full-page screenshots.

## Constraints

- Originals are preserved on disk; the change must be revertible with `git checkout`.
- Zero broken image references after the migration.
- No visual layout change: same aspect ratios, same cropping behaviour.
- File encoding (UTF-8 / BOM) and CRLF line endings must be preserved so the diff stays
  reviewable.

## Route

Direct inline, scripted. Evidence: the change is one mechanical transformation (binary
conversion + reference swap) applied with a deterministic script, not 20 hand-written
files. Verification is byte-level and must be owned by the orchestrator. Delegating the
script execution to a fresh-context writer would add a failure layer without reducing
parent context meaningfully.

## Tasks

- [x] T1 Detect available image tooling; install Pillow with WebP support.
- [x] T2 Inventory every image referenced by HTML and its target dimensions.
- [x] T3 Generate WebP full variants (max width 1400, quality 80) and thumbnails
      (max width 800, quality 78) for homepage cards.
- [x] T4 Generate hero assets: avatar (600px), banner (1600px), icons (160px).
- [x] T5 Rewrite image references in `views/` and `partials/` to the WebP variants.
- [x] T6 Add `loading="lazy"`, `decoding="async"`, `width`, `height` to `<img>` tags;
      exclude above-the-fold assets (banner, avatar).
- [x] T7 Add `height: auto` to `.img-uniform` in `css/proyectos.css` so attribute-based
      aspect ratio does not fix the rendered height.
- [x] T8 Fix `href="/"` in `partials/navbar_index.html` and `/mi-portafolio/` in
      `partials/navbar_proyectos.html` to relative `index.html`.
- [x] T9 Verify: zero broken refs, zero remaining `.png`/`.jpg` image refs, measured
      homepage payload, dimensions match declared attributes.

## Acceptance criteria

- Homepage total image payload <= 1 MB.
- `Select-String` finds no `href="/"` or `href="/mi-portafolio/"` in any HTML partial.
- Every `src` in every `<img>` resolves to an existing file.
- Every `<img>` with `loading="lazy"` also has `width` and `height`.
- `git status` shows only the intended files (plus new `.webp` assets).

## Verification

```
# payload
python tools/measure_home.py            # sums bytes of every asset the homepage loads
# broken refs
powershell -f tools/check_refs.ps1      # every src/href local target exists
# leftover legacy refs
Select-String -Path *.html,views/**/*.html,partials/*.html -Pattern 'src="[^"]+\.(png|jpg|jpeg)"'
```

## Progress log

- 2026-11-03: T1/T2 done. Tooling: Pillow 13.0.0, WebP codec available. Homepage
  baseline measured at 11.3 MB across 14 assets.
- 2026-11-03: T3-T9 done. 94 WebP files generated from 87 sources (7,3 MB total for
  every image on the site). 94 `<img>` tags rewritten across 9 view/partial files.
  92 got `loading="lazy" decoding="async"`; the banner and the avatar were excluded
  as above-the-fold. All 94 got `width`/`height`.

### Verification results

```
paginas analizadas: 23
imgs rotas: 0
refs locales rotas (href/src): 0
links absolutos internos restantes: 0
src legacy png/jpg en <img>: 0
<img loading=lazy>: 92 | sin width/height: 0
assets propios de la home: 21 | payload: 523 KB (0.51 MB)
```

Before/after homepage image payload: 11.3 MB -> 495 KB (-95.7%).

Transparency check: `email.png` and `linkedin.png` had a fully opaque alpha channel, so
RGB output is visually identical. `supermercado 4/5.png` carried real alpha and kept
RGBA. `portafolio.png` had no transparency.

### Not done on purpose

- Nothing was committed. The working tree already carried unrelated uncommitted
  chatbot work (`js/chatbot.js`, `json/`, and edits to `index.html` / `css/index.css`
  that are NOT part of this change). Committing here would have mixed both changes.
- Original PNG/JPG files were left in place so the change is revertible.

## Follow-ups

- Remove original PNG/JPG after review (second commit).
- Then: `<h1>`, unique titles + meta descriptions, `og:` tags.
- Then: decide the chatbot's fate.
