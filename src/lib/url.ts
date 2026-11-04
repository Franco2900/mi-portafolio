/**
 * Builds an absolute path under the site base.
 *
 * The site is published at /mi-portafolio/, so every internal href/src has to
 * carry that prefix. Relative paths alone are not enough: they only resolve
 * correctly while the address bar ends in a slash. Opening
 * `https://host/mi-portafolio` (no slash) makes the browser resolve
 * `images/x.webp` against `/`, and the stylesheet, the images and every sibling
 * page 404 at once.
 *
 * Astro exposes `BASE_URL` as the configured `base` with its trailing slash
 * stripped (`/mi-portafolio`), so it is normalized here. Normalizing keeps the
 * helper correct whether or not the value already ends in `/`.
 */
const raw = import.meta.env.BASE_URL;
const base = raw.endsWith('/') ? raw : `${raw}/`;

export function url(path: string): string {
  return base + path.replace(/^\/+/, '');
}
