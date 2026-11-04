#!/usr/bin/env python3
"""Static-site verification: metadata audit plus reference checking over real HTTP.

Two modes:

  metadata (--meta)   Filesystem audit of every built page: one <h1>, a unique
                      <title>, a meta description, a canonical URL, og:title and
                      og:image, and that every local reference resolves inside
                      the output directory.

  references (--all)  HTTP audit. Resolves every reference the way a browser
                      does, under both the slashed and unslashed form of the
                      site base, because a missing trailing slash changes the
                      base of every relative URL and breaks all of them at once.

Usage:
    python check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --meta
    python check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --all
    python check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --page index.html

Exit code 0 only when nothing is broken.
"""

import argparse
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import quote, urljoin, urlparse

SKIP_PREFIXES = ("http://", "https://", "//", "mailto:", "tel:", "data:", "javascript:")

# <img src>, <link href>, <script src>, <a href>, <source src>, <video poster>
REF_RE = re.compile(r'(?:src|href|poster)="([^"#?]+)"')


def local_refs(html: str):
    seen = []
    for raw in REF_RE.findall(html):
        ref = raw.strip()
        if not ref or ref.startswith("#") or ref.startswith(SKIP_PREFIXES):
            continue
        if ref not in seen:
            seen.append(ref)
    return seen


def status_of(url: str, timeout: float = 20.0) -> int:
    # Percent-encode only what urllib chokes on. Without this, filenames with
    # spaces raise InvalidURL and look like failures when the file is fine.
    safe_url = quote(url, safe=":/?&=#%")
    req = urllib.request.Request(safe_url, headers={"User-Agent": "visual-qa/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status
    except urllib.error.HTTPError as exc:
        return exc.code
    except Exception:
        return 0


def check(document_url: str, refs, label: str, verbose: bool):
    print(f"=== {label}")
    print(f"    document : {document_url}")
    print(f"    base     : {urljoin(document_url, '.')}")

    broken = []
    for ref in refs:
        target = urljoin(document_url, ref)
        code = status_of(target)
        if code != 200:
            broken.append((code, ref, target))
        elif verbose:
            print(f"    200  {ref}")

    total = len(refs)
    print(f"    -> {len(broken)} / {total} broken")
    for code, ref, target in broken:
        print(f"       {code or 'ERR':>4}  {ref}")
        if verbose:
            print(f"             {target}")
    print()
    return broken


def check_meta(dist: Path, base_path: str, ignore: list, verbose: bool) -> int:
    """Audit built pages without a server: metadata and on-disk references."""
    pages = [p for p in sorted(dist.glob("*.html")) if not any(p.match(g) for g in ignore)]
    if not pages:
        print(f"no .html files in {dist}", file=sys.stderr)
        return 2

    problems = []
    titles = []
    rows = []
    print(f"{'page':34s} {'h1':>3s} {'text':>6s}  title")
    print("-" * 96)

    for page in pages:
        text = page.read_text(encoding="utf-8")

        # El texto real que ve un buscador: sin scripts y sin etiquetas.
        body = re.sub(r"<script.*?</script>|<style.*?</style>|<[^>]+>", "", text, flags=re.S)
        body = re.sub(r"\s+", " ", body).strip()

        h1 = re.findall(r"<h1[^>]*>(.*?)</h1>", text, re.S)
        found = {
            "title": re.search(r"<title>(.*?)</title>", text, re.S),
            "description": re.search(r'<meta name="description" content="([^"]*)"', text),
            "canonical": re.search(r'<link rel="canonical" href="([^"]*)"', text),
            "og:title": re.search(r'<meta property="og:title" content="([^"]*)"', text),
            "og:image": re.search(r'<meta property="og:image" content="([^"]*)"', text),
        }

        if len(h1) != 1:
            problems.append(f"{page.name}: {len(h1)} <h1>")
        for label, match in found.items():
            if not match:
                problems.append(f"{page.name}: missing {label}")

        # og:image es una URL absoluta: hay que sacarle el origen y el base path
        # antes de buscarla en disco.
        if found["og:image"]:
            rel = urlparse(found["og:image"].group(1)).path
            rel = rel[len(base_path):].lstrip("/") if rel.startswith(base_path) else rel.lstrip("/")
            if not (dist / rel).is_file():
                problems.append(f"{page.name}: og:image not on disk -> {rel}")

        # Referencias internas. Con rutas absolutas bajo el base path, un join
        # ingenuo contra dist/ produce falsos positivos: hay que recortar el
        # prefijo primero.
        for raw in set(REF_RE.findall(text)):
            ref = raw.strip()
            if not ref or ref.startswith(SKIP_PREFIXES):
                continue
            if ref.startswith(base_path):
                rel = ref[len(base_path):].lstrip("/")
            elif ref.startswith("/"):
                problems.append(f"{page.name}: root-absolute, not under base -> {ref}")
                continue
            else:
                rel = ref

            # Un servidor estatico resuelve una URL de directorio a su index.html,
            # asi que '/mi-portafolio/' apunta a dist/index.html y no a un archivo
            # llamado ''. Comprobar solo is_file() reporta eso como roto.
            candidate = dist / rel if rel else dist
            if candidate.is_file() or (candidate / "index.html").is_file():
                continue
            problems.append(f"{page.name}: broken reference -> {ref}")

        title = found["title"].group(1).strip() if found["title"] else ""
        titles.append(title)
        rows.append((page.name, len(h1), len(body), title[:50]))

    for name, n, chars, title in rows:
        print(f"{name:34s} {n:3d} {chars:6d}  {title}")

    duplicates = sorted({t for t in titles if t and titles.count(t) > 1})

    print()
    print(f"pages                : {len(pages)}")
    print(f"unique titles        : {len(set(titles))} of {len(titles)}")
    print(f"duplicate titles     : {duplicates if duplicates else 'none'}")
    print(f"problems             : {len(problems)}")
    for problem in problems:
        print(f"  ! {problem}")
    print()

    if problems or duplicates:
        print("VERDICT: metadata audit found problems.")
        return 1
    print("VERDICT: every page has one <h1>, unique metadata and resolvable references.")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default="dist", help="build output directory")
    ap.add_argument("--base", required=True, help="site base URL, e.g. http://localhost:4321/mi-portafolio")
    ap.add_argument("--page", default="index.html", help="page inside dist to inspect")
    ap.add_argument("--all", action="store_true", help="check every .html file in --dist instead of one page")
    ap.add_argument(
        "--meta",
        action="store_true",
        help="filesystem metadata audit instead of the HTTP reference check",
    )
    ap.add_argument(
        "--ignore",
        action="append",
        default=[],
        metavar="GLOB",
        help="skip pages matching this glob (repeatable), e.g. --ignore 'google*.html'",
    )
    ap.add_argument("--verbose", action="store_true", help="also list the references that pass")
    args = ap.parse_args()

    base = args.base.rstrip("/")

    if args.meta:
        return check_meta(Path(args.dist), urlparse(base).path.rstrip("/"), args.ignore, args.verbose)

    if args.all:
        pages = sorted(Path(args.dist).glob("*.html"))
        if not pages:
            print(f"no .html files in {args.dist}", file=sys.stderr)
            return 2
        failures = 0
        for page in pages:
            refs = local_refs(page.read_text(encoding="utf-8"))
            if not refs:
                print(f"--- {page.name}: no local references, skipped")
                continue
            print(f"--- {page.name} ({len(refs)} local references)")
            with_slash = check(base + "/", refs, "slashed base", args.verbose)
            without_slash = check(base, refs, "unslashed base", args.verbose)
            if with_slash or without_slash:
                failures += 1
        total = len(pages)
        if failures:
            print(f"VERDICT: {failures} of {total} pages have broken references.")
            return 1
        print(f"VERDICT: all {total} pages resolve under both forms.")
        return 0

    page = Path(args.dist) / args.page
    if not page.is_file():
        print(f"missing page: {page}", file=sys.stderr)
        return 2

    refs = local_refs(page.read_text(encoding="utf-8"))
    if not refs:
        print("no local references found", file=sys.stderr)
        return 2

    with_slash = check(base + "/", refs, "slashed base (as the server serves it)", args.verbose)
    without_slash = check(base, refs, "unslashed base (as people type it)", args.verbose)

    if without_slash and not with_slash:
        print("VERDICT: relative URLs. The site only works when the URL ends in '/'.")
        print("         Prefix internal URLs with the base path instead.")
        return 1

    if with_slash:
        print("VERDICT: broken even with the trailing slash. Assets or paths are wrong.")
        return 1

    print("VERDICT: all references resolve under both forms.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
