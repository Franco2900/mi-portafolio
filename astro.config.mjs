import { defineConfig } from 'astro/config';

// Project site on GitHub Pages: https://franco2900.github.io/mi-portafolio/
// `base` keeps Astro's bundled assets under the subpath.
// `build.format: 'file'` keeps the published URLs as <page>.html, exactly as they
// were before the migration, so existing links and the sitemap keep working.
export default defineConfig({
  site: 'https://franco2900.github.io',
  base: '/mi-portafolio',
  build: { format: 'file' },
  trailingSlash: 'ignore',
});
