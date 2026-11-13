# mi-portafolio

Portafolio personal de Franco Figueroa — Licenciado en Sistemas, desarrollador backend con Node.js,
Express y MySQL.

Sitio publicado: https://franco2900.github.io/mi-portafolio/

## Qué es

Un sitio **estático**: no hay servidor, ni base de datos, ni framework de frontend. Astro recorre
`src/` en el build, arma cada página como HTML plano y la deja en `dist/`. Eso es lo único que se
publica. Como no hay nada que ejecutar del lado del servidor, el sitio entra entero en GitHub Pages
y no cuesta nada mantenerlo.

Hay tres idiomas:

| Idioma | Prefijo | Ejemplo |
| --- | --- | --- |
| Español (por defecto) | `/` | `/mi-portafolio/casino.html` |
| Inglés | `/en/` | `/mi-portafolio/en/casino.html` |
| Portugués | `/pt/` | `/mi-portafolio/pt/casino.html` |

## Cómo se arma una página

Cada ruta es la combinación de tres piezas:

1. **El cuerpo** — `src/content/<idioma>/<slug>.astro`: el HTML de esa página en ese idioma.
2. **Los metadatos** — `src/data/pages.ts`: `<title>`, meta description y `<h1>`, por página y por
   idioma.
3. **El molde** — `src/layouts/Base.astro`: un único shell con el `<head>`, el header, la navbar, el
   footer y los scripts. Todas las páginas lo comparten.

`src/content/index.ts` es el registro que une idioma + slug con su cuerpo. Las rutas se generan a
partir de ese registro, así que si una página no está ahí, no existe.

Los archivos de `src/pages/` solo hacen de puente:

- `[...slug].astro` — las nueve rutas en español, con la home en la raíz.
- `en/index.astro`, `en/[...slug].astro` — lo mismo para inglés.
- `pt/index.astro`, `pt/[...slug].astro` — lo mismo para portugués.
- `404.astro` — la única página sin idioma.

`build.format: 'preserve'` mantiene las URLs publicadas como `<pagina>.html`, igual que antes de la
migración a Astro, y publica las portadas de idioma como `<idioma>/index.html`. Por eso los enlaces
viejos y el sitemap siguen funcionando sin redirecciones.

El idioma que elige el visitante en el selector queda guardado en `localStorage` (clave
`mi-portafolio:lang`) y se vuelve a aplicar cuando entra por la raíz del sitio. Dos reglas: solo se
redirige desde la home en español, nunca desde una URL explícita `/en/` o `/pt/` (si alguien comparte
una página en inglés, se respeta), y solo se guarda lo que el visitante elige con un clic. Sin
cookies, sin backend y sin banner.

## Textos: prosa contra interfaz

- **Prosa larga** (descripciones, explicaciones, "lo que aprendí") vive en
  `src/content/<idioma>/<slug>.astro`.
- **Etiquetas cortas** (títulos de navegación, botones, mensajes del 404) viven en `src/i18n/ui.ts` y
  se leen con `useTranslations(lang)`.

Separarlos evita que un diccionario se llene de párrafos y que una página se llene de strings
sueltos.

## Rutas y enlaces

El sitio no vive en la raíz del dominio, sino en el subpath `/mi-portafolio`. Por eso ningún enlace
interno se escribe a mano: todos pasan por `url()` (`src/lib/url.ts`), que antepone el base.

```astro
import { url } from '../../lib/url';

<img src={url('images/style/mi cara.webp')} alt="Franco Figueroa">
```

Para enlazar a otra página en el mismo idioma se usa `localizePath(slugPath('casino'), lang)`.
`slugPath` convierte el slug en el nombre del archivo publicado y `localizePath` agrega el prefijo
del idioma. Ninguno de los dos necesita saber cuál es el base.

Un detalle que rompe sitios enteros: si el visitante entra a `/mi-portafolio` **sin** barra final, el
navegador resuelve los `src` relativos contra `/` y se cae todo — CSS, imágenes y páginas hermanas.
Por eso los enlaces son absolutos bajo el base y no relativos.

## El asistente

La home tiene un asistente que responde preguntas sobre el perfil, los proyectos y el contacto.

No es un modelo de lenguaje: es un set curado de 13 preguntas por idioma
(`src/data/chatbot.ts`), con sus respuestas ya escritas. El componente `Chatbot.astro` las mete en
la página como JSON y `public/js/chatbot.js` compara la pregunta del visitante contra ese set en el
navegador. Sin red, sin claves, sin costo, y sin poder inventar nada: si no encuentra una respuesta
suficientemente parecida, lo dice.

Las respuestas se arman una vez y viajan dentro del HTML. Un visitante no dispara ninguna petición
al preguntar.

Para que el set no quede escondido, seis preguntas se ofrecen como botones a la vista y las trece
están agrupadas por tema en un desplegable «Ver todas las preguntas»: perfil, tecnologías, proyectos
y contacto. Al abrirlo, los seis botones de arriba desaparecen y esas mismas preguntas aparecen
dentro de su categoría, así no se leen dos veces. Es un `<details>` nativo y el ocultamiento es una
regla CSS (`:has`): se abre sin JavaScript y trae teclado y accesibilidad resueltos. El script
engancha todos los botones por igual, así que los del desplegable responden como los de arriba.

## Stack

- [Astro](https://astro.build) como generador de sitio estático.
- Bootstrap 5, Bootstrap Icons, Font Awesome y flag-icons (por CDN).
- JavaScript plano en `public/js/`, sin bundler ni dependencias.
- Imágenes ya optimizadas en WebP.

## Estructura

```
src/
  layouts/Base.astro        head, meta tags, header, navbar, footer, scripts
  components/               header, navbars, footer, fondo animado, selector de idioma, asistente
  content/index.ts          registro idioma -> slug -> cuerpo de la página
  content/<idioma>/         el HTML de cada página en cada idioma
  data/pages.ts             <title>, meta description y <h1> de cada página
  data/chatbot.ts           el set de preguntas y respuestas del asistente
  i18n/                     idiomas, etiquetas BCP 47 y textos cortos de interfaz
  lib/url.ts                url(): antepone el base a cada ruta interna
  pages/                    rutas: español en la raíz, inglés y portugués con prefijo
  pages/sitemap.xml.ts      sitemap generado desde el registro de contenido
public/
  css/                      hojas de estilo (se sirven tal cual)
  js/                       asistente y zoom de imágenes
  images/                   imágenes ya optimizadas en WebP
  cv/, certificados/        PDFs descargables
  robots.txt                apunta al sitemap
scripts/
  verify-chatbot.js         verificación independiente del asistente
```

## Imágenes y diagramas

Las fotos y el arte decorativo van en WebP y se redimensionan al tamaño más grande en que se muestran.

**Los diagramas son la excepción, y la excepción es una regla.** Los diagramas entidad-relación de
`public/images/diagramas/` no son decoración: se leen celda por celda —nombres de tablas, columnas,
claves, cardinalidades— y al hacer clic se abre el archivo a tamaño completo (`zoomImagenes()` en
`public/js/zoomImagenes.js` abre `imagen.src`, así que el visitante recibe la resolución real del
archivo). En los diagramas manda la calidad, por encima del peso y de la velocidad de carga. No se
reducen, no se recomprimen y no se reemplazan por una versión "más liviana" para ahorrar unos
kilobytes: un diagrama de 200 KB es barato, un diagrama donde no se leen los nombres de las columnas
no sirve para nada.

Para convertir un diagrama desde su fuente original sin tocar sus píxeles:

```python
from PIL import Image
Image.open(src).convert('RGB').save(out, 'WEBP', lossless=True, method=6)
```

Después se reabre el resultado y se compara con la fuente usando `ImageChops.difference`: el bounding
box tiene que ser `None` y los tamaños tienen que coincidir. Los PNG de phpMyAdmin pesan menos en WebP
sin pérdida; los JPG pesan un poco más, y está bien: el WebP sin pérdida guarda exactamente los
píxeles decodificados, sin una segunda generación de pérdida.

El `<img>` declara el tamaño real en píxeles con `width` y `height`, igual en las tres locales;
`.img-uniform` usa `height: auto`, así que esos números son la proporción que reserva el navegador.
Las fuentes sin tocar se guardan fuera de `public/`, porque todo lo que está ahí se copia a `dist/` y
se publica.

## Comandos

Windows: `npm` y `npx` se llaman `npm.cmd` y `npx.cmd`.

```bash
npm.cmd install      # primera vez
npm.cmd run dev      # http://localhost:4321/mi-portafolio/
npm.cmd run build    # genera dist/ (28 páginas)
npm.cmd run preview  # sirve dist/ localmente
```

## Verificación

Un build sano imprime `28 page(s) built`. Si el número cambia, o se agregó una página o algo se
rompió.

Para comprobar que no hay enlaces ni imágenes rotas en lo que se tocó:

```bash
python .opencode/skills/visual-qa/scripts/check_refs.py --dist dist --base http://localhost:4321/mi-portafolio --page index.html
```

El script es recursivo: sin `--page` recorre las tres locales, resuelve cada referencia contra la URL
de su propia página y verifica que cada `<loc>` del sitemap exista en `dist/`. Para el asistente:

```bash
node scripts/verify-chatbot.js
```

Lee el set que quedó dentro de las tres homes, ejecuta el matcher real y comprueba que cada pregunta
y cada alias caiga en su propia entrada, que las anclas existan y que una pregunta fuera del set
devuelva el fallback.

## Deploy

El deploy corre en GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main`: instala,
buildea, verifica y publica en GitHub Pages. El paso de verificación corre los dos chequeos de
arriba contra `dist/`, con el preview levantado, así que un push con una referencia rota o con el
sitemap desincronizado falla antes de llegar a producción.

**Requiere una configuración manual, una sola vez:** en el repositorio, Settings → Pages → Source:
**GitHub Actions**. Mientras esa opción no esté seleccionada, el sitio publicado es el que se sirve
desde la rama `main` y un push no lo actualiza.

## Notas

- Las URLs publicadas se mantienen igual que antes de la migración (`build.format: 'preserve'` en
  `astro.config.mjs`), así no se rompen enlaces ni el sitemap.
- `base: '/mi-portafolio'` en la config apunta al subpath de GitHub Pages. Si el sitio pasa a un
  dominio propio, hay que cambiarlo a `/`.
- Las imágenes nuevas conviene agregarlas con `<Image />` de `astro:assets` para que se optimicen
  solas en el build.
- Las reglas para trabajar en el repo (convenciones, i18n, verificación, commits) están en
  `AGENTS.md`.
