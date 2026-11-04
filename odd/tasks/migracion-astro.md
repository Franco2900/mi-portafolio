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
- **URLs internas prefijadas con `BASE_URL` a través de `src/lib/url.ts`.**
  **Decisión invertida.** La versión original de este documento decía "URLs
  internas relativas, sin prefijo `BASE_URL`", con el argumento de que con
  `build.format: 'file'` y todas las páginas al mismo nivel alcanzaba. Es falso:
  una ruta relativa solo resuelve bien mientras la barra de direcciones termina
  en `/`. Sin la barra, `images/x.webp` se resuelve contra `/` y se caen de golpe
  la hoja de estilos, las imágenes y todas las páginas hermanas — con el build en
  verde. Verificado: 0/30 referencias rotas con barra contra 23/30 sin barra.
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
- [x] T18 Prefijar las 110 referencias internas con `BASE_URL` vía `src/lib/url.ts`.
- [x] T19 Normalizar la barra final: `import.meta.env.BASE_URL` viene como
      `/mi-portafolio`, sin barra. El helper la agrega.
- [x] T20 Frontmatter con `import { url }` en los 3 componentes que no tenían
      frontmatter (Header, NavbarIndex, NavbarProject).
- [x] T21 Skill `visual-qa`: matriz HTTP en ambas formas de URL + `--meta` para
      metadata sin servidor + `--all` para todas las páginas.
- [x] T22 Skill `astro-pages`: la regla del base path y dónde vive cada cosa.
- [x] T23 Agente `site-verifier`: verificación read-only con reporte compacto.
- [x] T24 Eliminar el teléfono del sitio: tarjeta de contacto, footer, script de
      relleno y el asset `telefono.webp`.

## Acceptance criteria

- `dist/tesis.html` contiene el texto completo del proyecto sin JavaScript. ✅
- Cada página: un `<h1>`, `<title>` único, `meta description`, `og:title`,
  `og:description`, `og:image` absoluta y `canonical`. ✅
- Build sin errores. ✅
- Sin cambios de nombres publicados. ✅

## Verification

```
npm run build                  -> 9 páginas, 0 errores
check_refs.py --meta           -> 0 problemas, 9/9 títulos únicos, 1 <h1> por página
check_refs.py --all            -> 0/175 referencias rotas en las 9 páginas reales,
                                  en ambas formas de URL (con y sin barra final)
sri_verify.py                  -> 4/4 hashes SRI coinciden con el CDN
git diff cc3e109 HEAD          -> vacío (el árbol no cambió al partir commits)
```

Evidencia visual (headless Edge, 1400x2200, mismo servidor):

```
/mi-portafolio/   576 KB   renderiza completo
/mi-portafolio    575 KB   renderiza completo  (antes: 116 KB, sin CSS ni imágenes)
```

## Progress log

- 2026-11-03: creado. Branch cortado desde `6d19d99`.
- 2026-11-03: migración completa, build verde, verificación de `dist/` OK.
- 2026-11-04: commit único partido en 3. Se intentó la revisión nativa de RDD:
  el candidato completo falló con `lens_context_budget_exceeded` (367 paths,
  9 925 líneas) y, ya partido, el runtime devolvió
  `immutable_review_transport_unsupported`. No hubo revisión. Se dejó constancia.
- 2026-11-04: ronda de accesibilidad, contraste, reduced-motion y limpieza de CDN.
- 2026-11-04: el usuario reporta el sitio roto. Evidencia: matriz HTTP + capturas.
  Causa raíz: URLs relativas. Se revierte la decisión y se prefijan las 110
  referencias con `BASE_URL`. Se agregan el skill `visual-qa`, el skill
  `astro-pages` y el agente `site-verifier`.
- 2026-11-04: auditoría de exposición de datos de contacto. Verificado: el sitio
  publicado nunca estuvo roto (GitHub Pages redirige la URL sin barra final); el
  email está en crudo en 4 commits públicos y en 25 metadatos de commit vía la API
  pública. El usuario decide eliminar el teléfono.

## Known issues (no bloqueantes)

- `.email` se sigue rellenando por script: sin JS el email no aparece, y Google
  tampoco lo indexa. El teléfono **se eliminó del sitio** (`col-4` en las tarjetas
  de contacto, dos columnas en el footer). Decisión pendiente del usuario sobre
  cómo publicar el email: ver `security/contact-data-exposure`.
- **El teléfono y el email están en crudo en 4 commits públicos**:
  `7518e5a`, `74bffcc`, `c69ea92`, `a0c7a5d` — en `partials/footer.html`
  (`franco2900@gmail.com`). Además `franco2900@gmail.com` figura como autor en
  25 commits y la API pública de GitHub lo devuelve sin autenticación.
- El email y el teléfono también están en crudo en `json/preguntasChatbot.json`,
  que está en el stash (`5bc1062`), **no publicado**. Si el chatbot se commitea
  tal cual, se publican.
- **Código muerto preexistente en `public/js/zoomImagenes.js`**: de las 3 funciones,
  `hacerZoomImagen` y `mostrarImagenEnOverlay` no las llama nadie y la segunda
  depende de `#overlay` y `#overlay-img`, elementos que **no existen en ninguna
  página ni existieron nunca** (verificado en `6d19d99`). No se tocó a propósito:
  parece una funcionalidad a medio hacer, no basura. Si se la llama, rompe con
  `Cannot read properties of null`.
- `body class="light-mode"` no lo usa nada: es una clase muerta en `layout.css`.
- `google7c8b7bd2a76e855d.html` no tiene metadata a propósito: es el stub de
  verificación de Search Console. Por eso el chequeo de metadata corre con
  `--ignore 'google*.html'`.
- Los nombres de archivo con espacios (`images/proyectos/tesis 3-thumb.webp`)
  funcionan, pero son frágiles para cualquier herramienta que no los codifique.
- La lineage de RDD `review-018ea25633a4a598` quedó en `reviewing`. Abandonarla
  requiere `--maintainer-authorization`.
