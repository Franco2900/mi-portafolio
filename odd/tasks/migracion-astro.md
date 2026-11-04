# Feature: Migración a Astro (pasos 3 y 4)

**Status:** done
**Created:** 2026-11-03
**Branch:** `astro-migration` (base: `main` @ `6d19d99`)

## Objective

Reemplazar el "SPA" hecho a mano (10 cáscaras HTML + `fetch` para armarse) por un
generador de sitio estático real, para que:

1. Cada página entregue HTML completo desde el servidor (paso 4).
2. Cada página tenga `<title>`, `<meta name="description">`, `<h1>` y Open Graph
   propios (paso 3).
3. El chrome compartido (`<head>`, header, navbars, footer) exista en un solo lugar.

## Problem

- El `<body>` publicado estaba vacío; todo se inyectaba por `fetch` en runtime.
- El `<head>` estaba duplicado en 10 archivos, todos con el mismo `<title>`.
- Cero `og:` / `canonical` / datos estructurados.
- Cero elementos `<h1>` en todo el sitio.

## Constraints

- Las URLs publicadas no cambian (`tesis.html`, `supermercado.html`, …).
- `site` + `base` deben producir `https://franco2900.github.io/mi-portafolio/`.
- Sin rediseño visual: mismo CSS, mismas clases, mismo layout.
- El chatbot sin commitear del usuario debe sobrevivir intacto.

## Decisions

- **Imágenes quedan en `public/` como los WebP ya optimizados.** Repasarlas por
  `<Image />` duplicaría trabajo ya validado. `<Image />` queda documentado como el
  camino para assets futuros.
- **URLs internas relativas, sin prefijo `BASE_URL`.** Con `build.format: 'file'` y
  todas las páginas al mismo nivel, `images/x.webp` e `index.html` resuelven bien
  bajo `/mi-portafolio/`.
- **CSS servido desde `public/css/`, no empaquetado.** Se linkea a mano en el orden
  de cascada original para no romper especificidad.
- **Chatbot no migrado.** Queda en `stash@{0}` para el paso 5.
- **Deploy pasa a GitHub Action.** Requiere un cambio manual único en el repo.

## Tasks

- [x] T1 Parkear el trabajo del chatbot (backup + stash).
- [x] T2 Commitear imágenes/rutas en `main` como base limpia.
- [x] T3 Branch `astro-migration` + scaffold de Astro.
- [x] T4 Mover `images/`, `certificados/`, `cv/`, `robots.txt`, `sitemap.xml` y el
      archivo de verificación a `public/`. Bajar los PNG/JPG originales.
- [x] T5 Mover CSS a `public/css/` y el zoom de imágenes a `public/js/`.
- [x] T6 `Base.astro` + `Header` / `Navbar` / `Footer` / `Fondo`.
- [x] T7 Portar `indexView.html` a `src/pages/index.astro`.
- [x] T8 Portar las 7 vistas de proyecto.
- [x] T9 Metadatos por página + `og:`, `twitter:`, `canonical` y `<h1>`.
- [x] T10 `404.astro` y `sitemap.xml` con `<lastmod>`.
- [x] T11 `.github/workflows/deploy.yml`.
- [x] T12 `npm run build` + verificación del output.
- [x] T13 Partir el commit único en 3 commits legibles (toolchain → sitio → limpieza).
- [x] T14 Accesibilidad: `alt` en las 12 imágenes que no tenían, `width`/`height` y
      `loading` en el icono del CV.
- [x] T15 Contraste del footer: `#389696` (3.52:1) → `#2a7575` (5.38:1).
- [x] T16 `prefers-reduced-motion` para la animación de fondo.
- [x] T17 Sacar Bootstrap JS y Font Awesome JS (no se usaban) y fijar los 4 CSS
      restantes con SRI.

## Acceptance criteria

- `dist/tesis.html` contiene el texto completo del proyecto sin JavaScript. ✅
- Cada página: un `<h1>`, `<title>` único, `meta description`, `og:title`,
  `og:description`, `og:image` absoluta y `canonical`. ✅
- Build sin errores. ✅
- Sin cambios de nombres publicados. ✅

## Verification

```
npm run build                  -> 9 páginas, 0 errores
verify_dist.py                 -> 0 referencias rotas, 10 títulos únicos,
                                  1 <h1> por página, 0 <img> sin alt
sri_verify.py                  -> 4/4 hashes SRI coinciden con el CDN
git diff cc3e109 HEAD          -> vacío (el árbol no cambió al partir commits)
```

## Progress log

- 2026-11-03: creado. Branch cortado desde `6d19d99`.
- 2026-11-03: migración completa, build verde, verificación de `dist/` OK.
- 2026-11-04: commit único partido en 3. Se intentó la revisión nativa de RDD:
  el candidato completo falló con `lens_context_budget_exceeded` (367 paths,
  9 925 líneas) y, ya partido, el runtime devolvió
  `immutable_review_transport_unsupported`. No hubo revisión. Se dejó constancia.
- 2026-11-04: ronda de accesibilidad, contraste, reduced-motion y limpieza de CDN.

## Known issues (no bloqueantes)

- `.email` y `.telefono` se siguen rellenando por script: sin JS el dato de
  contacto no aparece. Decisión pendiente del usuario (era una elección previa
  del sitio, no un descuido de la migración).
- `body class="light-mode"` no lo usa nada: es una clase muerta en `layout.css`.
- `google7c8b7bd2a76e855d.html` no tiene metadata a propósito: es el stub de
  verificación de Search Console.
- La lineage de RDD `review-018ea25633a4a598` quedó en `reviewing`. Abandonarla
  requiere `--maintainer-authorization`.
