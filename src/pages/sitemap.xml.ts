import type { APIRoute } from 'astro';
import { hasSlug, slugsFor } from '../content';
import { defaultLang, languages, locales, type Lang } from '../i18n/ui';
import { localizePath, slugPath } from '../i18n/utils';

/**
 * Sitemap generado en el build.
 *
 * La lista de URLs sale del registro de contenido (`src/content/index.ts`), que
 * es el mismo que genera las rutas: una pagina nueva entra aca sin que nadie se
 * acuerde de tocar un XML a mano. Eso reemplaza el `public/sitemap.xml` estatico,
 * que habia que mantener en paralelo y se desincronizaba en silencio.
 *
 * Cada URL declara sus versiones en los tres idiomas y un `x-default`. Si una
 * traduccion falta, esa pagina simplemente no lista el idioma que no existe, y
 * `x-default` cae al primer idioma que si la tenga.
 *
 * Sin `<lastmod>`: el valor honesto seria la fecha del ultimo commit que toco
 * cada pagina, y el build no la conoce (en CI el checkout es shallow). Poner la
 * fecha del build haria que las 27 URLs cambien en cada deploy, que es peor que
 * no declarar nada: Google ignora un `lastmod` que no es confiable. El campo es
 * opcional en el protocolo.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://franco2900.github.io');

  // URL absoluta de una pagina en un idioma, tal como se publica.
  const href = (lang: Lang, slug: string) =>
    new URL(localizePath(slugPath(slug), lang), origin).href;

  // Idiomas que tienen esa pagina, en el orden de `locales` (el default primero).
  const langsWith = (slug: string) => locales.filter((lang) => hasSlug(lang, slug));

  const escape = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const entries: string[] = [];

  for (const lang of locales) {
    for (const slug of slugsFor(lang)) {
      const alternates = langsWith(slug);
      // x-default: la version del idioma por defecto si existe; si no, la primera.
      const fallback = alternates.includes(defaultLang) ? defaultLang : alternates[0];

      const links = alternates
        .map(
          (code) =>
            `    <xhtml:link rel="alternate" hreflang="${languages[code].tag}" href="${escape(href(code, slug))}"/>`,
        )
        .concat(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${escape(href(fallback, slug))}"/>`,
        )
        .join('\n');

      entries.push(
        [
          '  <url>',
          `    <loc>${escape(href(lang, slug))}</loc>`,
          `    <priority>${slug === 'home' ? '1.0' : '0.8'}</priority>`,
          links,
          '  </url>',
        ].join('\n'),
      );
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    '',
    ...entries,
    '',
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
