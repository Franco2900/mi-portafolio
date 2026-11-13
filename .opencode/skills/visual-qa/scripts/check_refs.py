#!/usr/bin/env python3
"""Static-site verification: metadata audit plus reference checking over real HTTP.

Two modes:

  metadata (--meta)   Filesystem audit of every built page: one <h1>, a unique
                      <title>, a meta description, a canonical URL, og:title and
                      og:image, and that every local reference resolves inside
                      the output directory.

  references (--all)  HTTP audit. Resolves every reference the way a browser
                      does, under both the slashed and unslashed form of the
                      page URL, because a missing trailing slash changes the base
                      of every relative URL and breaks all of them at once.

Both modes walk the whole output directory, so nested locales (en/, pt/) are
audited too, and each page is resolved against its own URL: a reference in
en/casino.html resolves from /en/, not from the site root.

Usage:
    python check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --meta
    python check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --all
    python check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --page en/casino.html

Exit code 0 only when nothing is broken.
"""

import argparse
import posixpath
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import quote, unquote, urljoin, urlparse

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


def document_url(base: str, rel_path: Path) -> str:
    """URL the server serves for a built file.

    `index.html` is served as its directory, so `en/index.html` is `/base/en/`.
    Every other file keeps its name. Getting this wrong is what made the old
    `--all` check every page as if it lived at the site root.
    """
    rel = rel_path.as_posix()
    if rel == "index.html":
        rel = ""
    elif rel.endswith("/index.html"):
        rel = rel[: -len("index.html")]
    return f"{base}/{rel}"


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


def check(document_url: str, refs, label: str, verbose: bool, cache: dict):
    print(f"=== {label}")
    print(f"    document : {document_url}")
    print(f"    base     : {urljoin(document_url, '.')}")

    broken = []
    for ref in refs:
        target = urljoin(document_url, ref)
        if target in cache:
            code = cache[target]
        else:
            code = status_of(target)
            cache[target] = code
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
    pages = [p for p in sorted(dist.rglob("*.html")) if not any(p.match(g) for g in ignore)]
    if not pages:
        print(f"no .html files in {dist}", file=sys.stderr)
        return 2

    problems = []
    titles = []
    rows = []
    print(f"{'page':40s} {'h1':>3s} {'text':>6s}  title")
    print("-" * 102)

    for page in pages:
        name = page.relative_to(dist).as_posix()
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
            problems.append(f"{name}: {len(h1)} <h1>")
        for label, match in found.items():
            if not match:
                problems.append(f"{name}: missing {label}")

        # og:image es una URL absoluta: hay que sacarle el origen y el base path
        # antes de buscarla en disco.
        if found["og:image"]:
            rel = urlparse(found["og:image"].group(1)).path
            rel = rel[len(base_path):].lstrip("/") if rel.startswith(base_path) else rel.lstrip("/")
            if not (dist / rel).is_file():
                problems.append(f"{name}: og:image not on disk -> {rel}")

        # Referencias internas. Con rutas absolutas bajo el base path, un join
        # ingenuo contra dist/ produce falsos positivos: hay que recortar el
        # prefijo primero. Una ruta relativa se resuelve desde el directorio de
        # la pagina, que es lo que hace el navegador: `en/casino.html` busca en
        # `dist/en/`, no en la raiz.
        for raw in set(REF_RE.findall(text)):
            ref = raw.strip()
            if not ref or ref.startswith(SKIP_PREFIXES):
                continue
            # El navegador codifica los espacios; en disco el archivo tiene el
            # nombre literal, asi que se decodifica antes de buscarlo.
            decoded = unquote(ref)
            if decoded.startswith(base_path):
                candidate = dist / decoded[len(base_path):].lstrip("/")
            elif decoded.startswith("/"):
                problems.append(f"{name}: root-absolute, not under base -> {ref}")
                continue
            else:
                candidate = page.parent / posixpath.normpath(decoded)

            # Un servidor estatico resuelve una URL de directorio a su index.html,
            # asi que '/mi-portafolio/' apunta a dist/index.html y no a un archivo
            # llamado ''. Comprobar solo is_file() reporta eso como roto.
            if candidate.is_file() or (candidate / "index.html").is_file():
                continue
            problems.append(f"{name}: broken reference -> {ref}")

        title = found["title"].group(1).strip() if found["title"] else ""
        titles.append(title)
        rows.append((name, len(h1), len(body), title[:46]))

    for name, n, chars, title in rows:
        print(f"{name:40s} {n:3d} {chars:6d}  {title}")

    check_sitemap(dist, base_path, problems)

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


def check_sitemap(dist: Path, base_path: str, problems: list) -> None:
    """Every <loc> in the generated sitemap has to point at a real file.

    A sitemap that lists a URL the build never produced is worse than no
    sitemap: it tells Google to index a 404. The list is generated from the same
    registry as the routes, so the only way it can drift is a route that stopped
    being emitted.
    """
    sitemap = dist / "sitemap.xml"
    if not sitemap.is_file():
        return

    text = sitemap.read_text(encoding="utf-8")
    locs = re.findall(r"<loc>([^<]+)</loc>", text)
    for loc in locs:
        path = urlparse(loc).path
        rel = path[len(base_path):].lstrip("/") if path.startswith(base_path) else path.lstrip("/")
        candidate = dist / rel if rel else dist
        if not (candidate.is_file() or (candidate / "index.html").is_file()):
            problems.append(f"sitemap: {loc} not on disk -> {rel or '.'}")
    print(f"sitemap              : {len(locs)} URLs")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", default="dist", help="build output directory")
    ap.add_argument("--base", required=True, help="site base URL, e.g. http://localhost:4321/mi-portafolio")
    ap.add_argument("--page", default="index.html", help="page inside dist to inspect, e.g. en/casino.html")
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
    dist = Path(args.dist)

    if args.meta:
        return check_meta(dist, urlparse(base).path.rstrip("/"), args.ignore, args.verbose)

    if args.all:
        pages = [p for p in sorted(dist.rglob("*.html")) if not any(p.match(g) for g in args.ignore)]
        if not pages:
            print(f"no .html files in {args.dist}", file=sys.stderr)
            return 2
        failures = 0
        # Las mismas hojas de estilo y las mismas imagenes se repiten en cada
        # pagina: un solo request por URL alcanza y baja el tiempo a la mitad.
        cache: dict = {}
        for page in pages:
            name = page.relative_to(dist).as_posix()
            refs = local_refs(page.read_text(encoding="utf-8"))
            if not refs:
                print(f"--- {name}: no local references, skipped")
                continue
            doc = document_url(base, page.relative_to(dist))
            print(f"--- {name} ({len(refs)} local references)")
            with_slash = check(doc, refs, "slashed URL", args.verbose, cache)
            # Solo las URLs de directorio tienen dos formas: en un archivo
            # (`/casino.html`) quitarle la barra no cambia nada.
            without_slash = (
                check(doc.rstrip("/"), refs, "unslashed URL", args.verbose, cache)
                if doc.endswith("/")
                else []
            )
            if with_slash or without_slash:
                failures += 1
        total = len(pages)
        if failures:
            print(f"VERDICT: {failures} of {total} pages have broken references.")
            return 1
        print(f"VERDICT: all {total} pages resolve under both forms.")
        return 0

    page = dist / args.page
    if not page.is_file():
        print(f"missing page: {page}", file=sys.stderr)
        return 2

    refs = local_refs(page.read_text(encoding="utf-8"))
    if not refs:
        print("no local references found", file=sys.stderr)
        return 2

    doc = document_url(base, page.relative_to(dist))
    cache: dict = {}
    with_slash = check(doc, refs, "slashed URL (as the server serves it)", args.verbose, cache)
    without_slash = (
        check(doc.rstrip("/"), refs, "unslashed URL (as people type it)", args.verbose, cache)
        if doc.endswith("/")
        else []
    )

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
