/**
 * Diccionario de la interfaz: todo lo que no es prosa de una pagina.
 * Solo cadenas cortas (labels, titulos de seccion, textos de navegacion).
 * El texto largo de cada pagina vive en `src/content/<lang>/<slug>.astro`.
 */
/**
 * Cada idioma con lo que necesitan el selector y el `<head>`: el nombre que se
 * ve en el boton, la bandera de `flag-icons` y la etiqueta BCP 47 que va en
 * `hreflang` y en `<html lang>`. El orden de las claves es el orden de los
 * botones: el idioma por defecto primero.
 */
export const languages = {
  es: { name: 'Español', flag: 'es', tag: 'es', ogLocale: 'es_AR' },
  en: { name: 'English', flag: 'gb', tag: 'en', ogLocale: 'en_US' },
  pt: { name: 'Português', flag: 'br', tag: 'pt-BR', ogLocale: 'pt_BR' },
} as const;

export const defaultLang = 'es' as const;

/** Todos los idiomas publicados, en el orden en el que se muestran. */
export const locales = Object.keys(languages) as Lang[];

export type Lang = keyof typeof languages;

export const ui: Record<Lang, Record<string, string>> = {
  es: {
    'nav.home': 'Home',
    'nav.homeAria': 'Ir al inicio',
    'nav.language': 'Idioma',
    'nav.intro': 'Introducción',
    'nav.skills': 'Habilidades',
    'nav.contact': 'Contacto',
    'nav.projects': 'Proyectos',
    'nav.assistant': 'Asistente',
    'nav.summary': 'Resumen',
    'nav.technologies': 'Tecnologías',
    'nav.description': 'Descripción',
    'nav.images': 'Imágenes',
    'nav.video': 'Video',
    'nav.learned': 'Lo que aprendí',
    'footer.location': 'Ubicación: Buenos Aires, Argentina',
    'footer.email': 'Email:',
    'footer.github': 'GitHub: Franco2900',
    'home.contact': 'Mis datos de contacto',
    'home.skills': 'Mis habilidades',
    'home.certificate': 'Certificado de ingles',
    'home.projects': 'Mis proyectos',
    'home.academic': 'Proyectos acádemicos',
    'notFound.message': 'La dirección que buscás no existe o cambió de lugar.',
    'notFound.back': 'Volver al inicio',
    'notFound.contact': 'También podés escribirme a',
  },
  en: {
    'nav.home': 'Home',
    'nav.homeAria': 'Go to home',
    'nav.language': 'Language',
    'nav.intro': 'Introduction',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    'nav.projects': 'Projects',
    'nav.assistant': 'Assistant',
    'nav.summary': 'Summary',
    'nav.technologies': 'Technologies',
    'nav.description': 'Description',
    'nav.images': 'Images',
    'nav.video': 'Video',
    'nav.learned': 'What I learned',
    'footer.location': 'Location: Buenos Aires, Argentina',
    'footer.email': 'Email:',
    'footer.github': 'GitHub: Franco2900',
    'home.contact': 'My contact details',
    'home.skills': 'My skills',
    'home.certificate': 'English certificate',
    'home.projects': 'My projects',
    'home.academic': 'Academic projects',
  },
  pt: {
    'nav.home': 'Home',
    'nav.homeAria': 'Ir para o início',
    'nav.language': 'Idioma',
    'nav.intro': 'Introdução',
    'nav.skills': 'Habilidades',
    'nav.contact': 'Contato',
    'nav.projects': 'Projetos',
    'nav.assistant': 'Assistente',
    'nav.summary': 'Resumo',
    'nav.technologies': 'Tecnologias',
    'nav.description': 'Descrição',
    'nav.images': 'Imagens',
    'nav.video': 'Vídeo',
    'nav.learned': 'O que aprendi',
    'footer.location': 'Localização: Buenos Aires, Argentina',
    'footer.email': 'Email:',
    'footer.github': 'GitHub: Franco2900',
    'home.contact': 'Meus dados de contato',
    'home.skills': 'Minhas habilidades',
    'home.certificate': 'Certificado de inglês',
    'home.projects': 'Meus projetos',
    'home.academic': 'Projetos acadêmicos',
  },
};
