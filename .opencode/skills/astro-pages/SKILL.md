---
name: astro-pages
description: "Trigger: add or edit a page, layout, component, asset or internal link in this Astro portfolio. The base-path rule, where each thing lives, and the check that proves it before commit."
license: MIT
compatibility: opencode
metadata:
  author: franco-figueroa
  version: "1.0"
  domain: static-sites
---

## Activation Contract

Load this before creating a page, editing a layout or component, adding an asset,
or changing any internal link in this repository's Astro site.

## The one rule that breaks everything

**Every internal `href` or `src` must go through `url()` from `src/lib/url.ts`.**

```astro
---
import { url } from '../lib/url';
---
<a href={url("tesis.html")}>Tesis</a>
<img src={url("images/style/email.webp")} alt="" width="160" height="160">
```

Never a bare relative path (`images/x.webp`). Never a hand-written
`/mi-portafolio/...` string. Never `<base href>`.

Why, in order:

1. The site is published at `https://franco2900.github.io/mi-portafolio/`.
2. Astro exposes `import.meta.env.BASE_URL` as `/mi-portafolio` — **no trailing
   slash**. `url()` normalizes it; do not bypass `url()` and assume otherwise.
3. A relative path only resolves correctly while the address bar ends in `/`.
   Opening `https://host/mi-portafolio` (no slash) makes the browser resolve
   `images/x.webp` against `/`. Every stylesheet, image and sibling page 404s
   **at once**, and the build still reports success.

That combination shipped once: 23 of 30 references broken on a green build. The
failure is silent — no error, no warning, no failing test — which is exactly why
the rule is absolute instead of a guideline.

In-page anchors (`href="#contacto"`) are the one exception: they carry no path.

## Where things live

| Thing | Location | Note |
|---|---|---|
| Pages | `src/pages/<name>.astro` | One file per published URL |
| Page metadata | `src/data/pages.ts` | `title`, `description` (~155 chars), `h1` |
| Shared chrome | `src/components/` | `Header`, `NavbarIndex`, `NavbarProject`, `Footer`, `Fondo` |
| Layout | `src/layouts/Base.astro` | head, meta, canonical, og, CSS cascade |
| URL helper | `src/lib/url.ts` | the only correct way to build an internal path |
| Stylesheets | `public/css/` | linked manually, **not** bundled |
| Images | `public/images/` | already-optimized WebP |
| Scripts | `public/js/` | plain files, served as-is |

## Adding a page

Four places, or the page exists but is invisible:

1. `src/pages/<name>.astro` — the markup, wrapped in `<Base>`.
2. `src/data/pages.ts` — the metadata entry.
3. `src/pages/index.astro` — the thumbnail link on the home page.
4. `public/sitemap.xml` — a `<url>` entry, matching the published URL.

## Deliberate constraints

- **`build.format: 'file'`** keeps URLs as `<page>.html`. Do not switch to
  `directory`: it would change every published URL.
- **CSS is not bundled.** Files stay in `public/css/` and are linked in the
  original cascade order (`layout.css` before Bootstrap). Bundling reorders
  specificity-sensitive rules and changes the rendering.
- **No `<Image />` for existing assets.** They are already the optimized WebP.
  Reach for it only for new, unprocessed images.
- **Stylesheets carry SRI.** Any CDN `<link>` needs `integrity` + `crossorigin`.
  Any JS CDN needs a reason: the two that used to be here (Bootstrap bundle,
  Font Awesome JS) were unused and cost 1.53 MB per page.
- **Filenames with spaces** are in use (`images/proyectos/tesis 3-thumb.webp`).
  They work, but they are fragile for scripts and tooling. New assets should not
  add more.

## Verify before commit

```bash
npm.cmd run build          # PowerShell blocks npm.ps1
python .opencode/skills/visual-qa/scripts/check_refs.py \
  --dist dist --base http://localhost:4321/mi-portafolio --meta --ignore 'google*.html'
python .opencode/skills/visual-qa/scripts/check_refs.py \
  --dist dist --base http://localhost:4321/mi-portafolio --all
```

The build passing proves nothing about URL resolution. The second check must
report `0 / N broken` for **both** the slashed and unslashed base, on **every**
page. See the `visual-qa` skill for the screenshots.

## Do not

- Do not "fix" a 404 by copying files into more locations.
- Do not delete an asset to make a broken count reach zero.
- Do not rename a published `.html`. External links and Google point at those.
- Do not edit `dist/`. It is generated and git-ignored.
