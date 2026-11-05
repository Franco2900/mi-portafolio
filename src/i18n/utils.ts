import { url } from '../lib/url';
import { defaultLang, ui, type Lang } from './ui';

/** Devuelve `t(key)` para un idioma, con caida al idioma por defecto. */
export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

/**
 * Antepone `/en` a la ruta cuando el idioma no es el por defecto.
 * Se apoya en `url()` para no perder el base `/mi-portafolio`.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.replace(/^\/+/, '');

  return lang === defaultLang ? url(clean) : url(`${lang}/${clean}`);
}

/** `home` es la raiz; el resto de los slugs publican `<slug>.html`. */
export function slugPath(slug: string): string {
  return slug === 'home' ? '' : `${slug}.html`;
}
