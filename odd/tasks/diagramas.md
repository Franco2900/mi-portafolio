# Feature: the diagrams are read, so the diagrams are sharp

**Status:** complete
**Created:** 2026-11-13
**Locator:** `odd/tasks/diagramas.md` (repo-relative)

## Objective

Publish the entity-relationship diagrams of the eight project pages at the resolution of their
original sources, and settle the rule so nobody optimizes them away again.

## Problem

The whole image pipeline of the site optimized for weight. For photographs that is right. For the DER
images it is wrong twice over:

1. The draw.io diagram of the supermarket was published at 1400x550, a third of its 4201x1651 source.
   The visitor gets that file: `mostrarImagenEnNuevaVentana()` in `public/js/zoomImagenes.js` opens
   `imagen.src` in a new tab, so the intrinsic resolution is exactly what they can zoom into. Table
   names, column names and cardinalities were unreadable.
2. Nothing in `AGENTS.md` or `README.md` said otherwise, so the next optimization pass would have
   done the same thing again.

The author replaced the five files in `public/images/diagramas/` by hand with higher-quality sources:
three PNG screenshots of phpMyAdmin and two JPEG exports (draw.io and phpMyAdmin). The pages
referenced the five `.webp` names, which the replacement had left deleted in the working tree, so the
site was broken until the conversion landed.

## Scope

In scope: the five diagram files, the sizes the pages declare, and the written rule.
Out of scope: the rest of the images (thumbnails, project screenshots, the profile photo), which keep
the optimized treatment they already have.

## Constraints

- The published file name cannot change: three locales reference it.
- Lossless conversion only. A diagram re-encoded with loss is a diagram that lost the reason it exists.
- The conversion is verified, not assumed: the decoded result must be pixel-identical to the source.
- The original sources do not live in `public/`, which is copied into `dist/` and published verbatim.

## Tasks

- [x] T1 Measure the real quality gap: compare each source against the `.webp` published in `HEAD`.
- [x] T2 Convert the five sources at their original size with lossless WebP and prove pixel equality.
- [x] T3 Update `width` and `height` of the draw.io diagram in the three locales to the real size.
- [x] T4 Move the untouched sources out of `public/`.
- [x] T5 Write the rule in `AGENTS.md` (Images, under Styling) and in `README.md` (Imágenes y diagramas).
- [x] T6 Shorten the index subtitle to "Desarrollador" / "Developer" / "Desenvolvedor".

## Acceptance criteria

- The five published diagrams have the exact dimensions of their sources and decode pixel-identical.
- `npm.cmd run build` still prints `28 page(s) built`.
- `check_refs.py` reports 0 broken references on all 28 pages, on disk and over HTTP.
- `node scripts/verify-chatbot.js` passes.
- The three homes show the shortened subtitle.

## Verification evidence

| Step | Command | Result |
| --- | --- | --- |
| Build | `npm.cmd run build` | `28 page(s) built in 2.05s` |
| Metadata and disk | `check_refs.py --meta --ignore "google*.html"` | 28 pages, 0 problems, 27 sitemap URLs |
| Over HTTP | `check_refs.py --all --ignore "google*.html"` | 28 pages, `all 28 pages resolve under both forms` |
| Assistant | `node scripts/verify-chatbot.js` | `ALL PASS` |
| Images over HTTP | `urllib` against the preview | `200 image/webp`, 215420 / 207226 / 23164 bytes |
| Pixel equality | `ImageChops.difference(...).getbbox()` per file | `None` in the five |

Measured before and after (source resolution, published size):

| Diagram | Published before | Source | Published now |
| --- | --- | --- | --- |
| DER autoescuela - phpmyadmin | 998x451, 36 KB | 998x451 PNG | 998x451, 23 KB |
| DER docker - phpmyadmin | 487x241, 4 KB | 487x241 PNG | 487x241, 3 KB |
| DER supermercado - drawio | **1400x550, 22 KB** | 4201x1651 JPG | **4201x1651, 210 KB** |
| DER supermercado - phpmyadmin | 1084x571, 66 KB | 1084x571 PNG | 1084x571, 46 KB |
| DER tienda juegos de mesa - phpmyadmin | 845x563, 35 KB | 845x563 JPG | 845x563, 202 KB |

The phpMyAdmin screenshots shrank: flat colours compress better losslessly than the lossy encoder
managed. The two JPEG exports grew, and that is the point: lossless WebP stores the decoded pixels
exactly, without a second generation of loss.

## Decisions

- **Lossless for all five, including the JPEG sources.** Quality 95 would have been half the weight,
  but it re-encodes already-lossy pixels. A diagram is not a photograph: 200 KB is cheap next to a
  table whose column names cannot be read.
- **No renaming.** The pages, the three locales and any external link keep pointing at the same five
  files; only the bytes change.
- **The sources live in `codigo/diagramas-fuente/`**, a local, git-excluded folder, so `public/` only
  holds what the site serves. If they should be versioned, they belong in a tracked folder outside
  `public/`, never inside it.
- **`width`/`height` declare the real size.** `.img-uniform` uses `height: auto`, so those attributes
  are the aspect ratio the browser reserves before the image loads. They were also lying about the
  draw.io diagram.

## Progress log

- 2026-11-13 — T1: the published draw.io diagram was at a third of its source resolution; the other
  four matched in size but came from more compressed encodings.
- 2026-11-13 — T2, T3, T4: five files converted, pixel verification `None` in all five, sizes updated
  in `es`, `en` and `pt`, sources moved out of `public/`. Commit `525caa0`.
- 2026-11-13 — T5: the rule written in English in `AGENTS.md` and in Spanish in `README.md`. Commit
  `a499362`.
- 2026-11-13 — T6: subtitle shortened in the three locales. Commit `01f50a9`.
- 2026-11-13 — Build, metadata audit, HTTP audit and assistant check all green; nothing pushed.

## Open follow-ups

- The `<title>` of the three homes still reads "Desarrollador Backend Node.js" / "Backend Developer
  (Node.js)" / "Desenvolvedor Backend Node.js". That is search-engine metadata, a separate decision
  from the visible subtitle, and it was left untouched.
