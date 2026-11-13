/**
 * Idioma recordado.
 *
 * Guarda en `localStorage` el idioma que el visitante elige en el selector y lo
 * vuelve a aplicar cuando entra por la raiz del sitio. Sin backend y sin cookie:
 * el dato no viaja al servidor y no hay nada que consentir.
 *
 * Tres decisiones que importan:
 *
 * 1. Solo se redirige desde el home del idioma por defecto. Un enlace explicito
 *    a `/en/` o a `/pt/` se respeta siempre: si alguien comparte una pagina en
 *    ingles, quien la abre la ve en ingles aunque tenga otro idioma guardado.
 * 2. Solo se guarda lo que el visitante elige a mano. Llegar a `/en/` por un
 *    enlace no cambia la preferencia.
 * 3. La clave lleva el prefijo del sitio porque franco2900.github.io es el mismo
 *    origen para todos los repos de GitHub Pages del autor: una clave pelada se
 *    pisaria con otro proyecto.
 *
 * Se ejecuta en el `<head>` a proposito: si espera al `DOMContentLoaded`, la
 * pagina se pinta en un idioma y salta al otro a la vista.
 */
(function () {
  'use strict';

  var KEY = 'mi-portafolio:lang';

  // Los datos llegan como atributos de este mismo `<script>`: en el head el DOM
  // todavia no existe, asi que no hay nada que leer de la pagina.
  var script = document.currentScript;
  if (!script) {
    return;
  }

  var current = script.getAttribute('data-locale');
  var fallback = script.getAttribute('data-default-locale');
  var homes = null;
  try {
    homes = JSON.parse(script.getAttribute('data-homes'));
  } catch (error) {
    return;
  }
  if (!current || !fallback || !homes) {
    return;
  }

  // `localStorage` tira excepcion en modo privado y cuando el sitio esta
  // bloqueado por cookies: en ese caso el sitio tiene que andar igual.
  function readSaved() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (error) {
      return null;
    }
  }

  function save(value) {
    try {
      window.localStorage.setItem(KEY, value);
    } catch (error) {
      /* sin persistencia, pero la navegacion sigue */
    }
  }

  // Se guarda la eleccion, no la visita: solo cuenta el clic en el selector.
  document.addEventListener('click', function (event) {
    var link =
      event.target && event.target.closest
        ? event.target.closest('[data-lang-switcher] a[data-lang]')
        : null;

    if (link) {
      save(link.getAttribute('data-lang'));
    }
  });

  var saved = readSaved();
  if (!saved || saved === current || current !== fallback) {
    return;
  }

  var target = homes[saved];
  if (!target) {
    return;
  }

  // `/mi-portafolio`, `/mi-portafolio/` y `/mi-portafolio/index.html` son el
  // mismo home; cualquier otra ruta se deja quieta.
  var here = window.location.pathname.replace(/index\.html$/, '');
  if (here.charAt(here.length - 1) !== '/') {
    here += '/';
  }
  if (here !== homes[fallback]) {
    return;
  }

  window.location.replace(target + window.location.search + window.location.hash);
})();
