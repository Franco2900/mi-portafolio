import { defineConfig } from 'astro/config';

// Project site on GitHub Pages: https://franco2900.github.io/mi-portafolio/
// `base` keeps Astro's bundled assets under the subpath.
// `build.format: 'file'` keeps the published URLs as <page>.html, exactly as they
// were before the migration, so existing links and the sitemap keep working.
// `prefixDefaultLocale: false` keeps Spanish on the current URLs and publishes
// English under /en/. Adding a locale later is one entry in `locales` plus its
// content folder and one route file.
// `build.format: 'preserve'` publica las paginas normales como `<page>.html`
// (igual que 'file', las URLs existentes no cambian) pero las rutas index como
// `<dir>/index.html`, que es lo que necesita `/en/` para no quedar en `/en.html`.
export default defineConfig({
  site: 'https://franco2900.github.io',
  base: '/mi-portafolio',
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
