# mi-portafolio

Portafolio personal de Franco Figueroa — Licenciado en Sistemas, desarrollador
backend con Node.js, Express y MySQL.

Sitio publicado: https://franco2900.github.io/mi-portafolio/

## Stack

- [Astro](https://astro.build) como generador de sitio estático.
- Bootstrap 5, Bootstrap Icons, Font Awesome y flag-icons (por CDN).
- Sin framework de frontend: las páginas se generan como HTML plano.

## Estructura

```
src/
  layouts/Base.astro        head, meta tags, header, navbar, footer
  components/               header, navbars, footer, fondo animado
  data/pages.ts             <title>, meta description y <h1> de cada pagina
  pages/                    una pagina por proyecto -> <nombre>.html
public/
  css/                      hojas de estilo (se sirven tal cual)
  js/                       zoom de imagenes
  images/                   imagenes ya optimizadas en WebP
  cv/, certificados/        PDFs descargables
  robots.txt, sitemap.xml
```

## Comandos

```bash
npm install      # primera vez
npm run dev      # http://localhost:4321/mi-portafolio/
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

## Deploy

El deploy corre en GitHub Actions (`.github/workflows/deploy.yml`) y publica
`dist/` en GitHub Pages.

**Requiere una configuracion manual, una sola vez:** en el repositorio,
Settings -> Pages -> Source: **GitHub Actions**. Mientras esa opcion no este
seleccionada, el sitio publicado es el que se sirve desde la rama `main`.

## Notas

- Las URLs publicadas se mantienen igual que antes de la migracion
  (`build.format: 'file'` en `astro.config.mjs`), asi no se rompen enlaces ni el
  sitemap.
- `base: '/mi-portafolio'` en la config apunta al subpath de GitHub Pages. Si el
  sitio pasa a un dominio propio, hay que cambiarlo a `/`.
- Las imagenes nuevas conviene agregarlas con `<Image />` de `astro:assets` para
  que se optimicen solas en el build.
