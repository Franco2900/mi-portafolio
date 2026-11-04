---
name: visual-qa
description: "Trigger: static site looks broken, images or links 404, deploy looks wrong, verify a build in a browser, URL base path bugs. Get evidence over HTTP and from a real browser before changing code."
license: MIT
compatibility: opencode
metadata:
  author: franco-figueroa
  version: "1.0"
  domain: static-sites
---

## What I do

Turn "the site is broken" into a reproducible evidence table, then and only then
into a fix. Two halves: an HTTP matrix over the built output, and pixels from a
real browser.

## When to use me

- A static site renders wrong, or assets/links 404.
- A site is published under a subpath (`/repo-name/`) and uses a `base` option.
- You are about to call a build "verified" and have only checked the filesystem.

## Hard rules

1. **A green build is not verification.** `astro build` succeeding says nothing
   about URL resolution. Neither does "every referenced file exists in `dist/`".
   Both were true on a site that rendered with zero CSS and eight broken images.
2. **Always test both URL forms.** For any site served under a subpath, test
   `http://host/subpath/` AND `http://host/subpath`. A missing trailing slash
   changes the base of every relative URL. Never test only the slashed form.
3. **Resolve references with `urljoin(base, ref)`, never string concatenation.**
   `base + "/" + ref` on a base that already ends in `/` produces `//` and fake
   404s. This exact mistake produced a false "8 broken references" report.
4. **Percent-encode before requesting.** Raw spaces in filenames make Python's
   `urllib` raise `InvalidURL`, which reads as a failure when the file is fine.
   That produced a false "11 broken references" report. Use `quote(url, safe=":/?&=#%")`.
5. **Filenames with spaces are a real risk.** They work in browsers, but every
   script, `robots.txt` and `sitemap.xml` consumer handles them differently.
   Flag them; do not fail on them.
6. **Screenshots before, screenshots after.** Never describe a visual change in
   words only. A 577 KB vs 116 KB screenshot pair is evidence; "it looks fine" is not.
7. **Compare file size as a cheap signal.** A page that loses its CSS and images
   drops by ~80% of its byte size. Two screenshots of the same viewport are a
   fast, honest smoke test.
8. **Do not invent tools.** If a browser-automation MCP is not installed, say so
   and use headless Edge/Chrome instead. Do not claim a tool you did not call.

## Procedure

### 1. Reproduce over HTTP

Never open `dist/index.html` via `file://` for diagnosis: `file://` resolves
relative URLs differently from the server and hides the real bug.

```bash
npx serve dist -l 4321      # or: python -m http.server 4321 --directory dist
```

Then run the matrix. It prints every reference that is not `200` for both URL
forms:

```bash
python .opencode/skills/visual-qa/scripts/check_refs.py \
  --dist dist --base http://localhost:4321/mi-portafolio --all
```

Use `--all` for every built page; `--page index.html` for one. Read the two
blocks per page. If they disagree, the bug is the trailing slash or the base
path, not the assets.

### 1b. Audit the metadata without a server

```bash
python .opencode/skills/visual-qa/scripts/check_refs.py \
  --dist dist --base http://localhost:4321/mi-portafolio \
  --meta --ignore 'google*.html'
```

Checks one `<h1>` per page, unique `<title>`, description, canonical, `og:title`,
`og:image` on disk, and every local reference resolvable in the output
directory. `--ignore` is for pages that are intentionally not real pages, such
as a Search Console verification stub.

Two traps this mode already handles, both of which produce false positives:
a directory URL (`/base/`) resolves to `index.html`, not to an empty filename;
and an absolute reference under the base path must have the prefix stripped
before joining it to the output directory.

### 2. Get pixels

```powershell
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
& $edge --headless=new --disable-gpu --hide-scrollbars --no-first-run `
  --user-data-dir="$env:TEMP\edge-qa" --window-size=1400,2200 `
  --screenshot="shots\01-with-slash.png" "http://localhost:4321/mi-portafolio/"
```

Repeat at the same viewport for the other URL form, then read both images.
Also capture 390x2400 for mobile: absolute paths and `base` bugs often surface
only there once a breakpoint changes the layout.

### 3. Read the pixels

Check, in order:

- Is the page styled at all? Unstyled HTML means the stylesheet 404'd.
- Are images drawn, or broken-image icons? Broken icons mean a wrong path.
- Do icons from a webfont render? If yes, that CDN is fine and unrelated.
- Is there exactly one visible `<h1>`?
- Does the first viewport show real content?

### 4. Report before fixing

Present: the failing URL, the HTTP status per reference, the screenshot pair,
and the one-line root cause. Only then change code.

## The base-path trap

If a site is published at `/repo-name/` and uses relative URLs (`images/x.webp`),
it is correct only while the document URL ends in `/`. The moment someone types
`https://host/repo-name`, the browser resolves `images/x.webp` against `/`, and
the stylesheet, images and every sibling page 404 at once.

Fixes, ranked:

1. **Prefix every internal URL with the base.** Astro's documented answer:
   `import.meta.env.BASE_URL` (`/repo-name/`). Immune to how the URL is typed.
2. **Root-absolute paths** (`/repo-name/images/x.webp`). Works, but hardcodes the
   repo name and breaks on a custom domain.
3. **A server redirect** to the trailing slash. Cannot be relied on: `astro preview`
   returns `200` with no redirect on the unslashed path, so local QA stays broken.

Never reach for `<base href="...">` as a quick fix. It rewrites the base of
in-page anchors too, so `#section` on a subpage navigates to the index page
instead of scrolling.

## Do not

- Do not "fix" a 404 by copying files until an untested guess happens to work.
- Do not delete assets to make a broken-reference count reach zero.
- Do not report a screenshot you did not read.
