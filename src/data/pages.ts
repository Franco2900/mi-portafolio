/**
 * Metadatos de cada pagina. Un unico lugar para el <title>, la meta description
 * y el <h1>. Las descripciones apuntan a ~155 caracteres, que es lo que Google
 * muestra antes de cortar.
 */
export interface PageMeta {
  title: string;
  description: string;
  h1: string;
}

export const pages: Record<string, PageMeta> = {
  home: {
    title: 'Franco Figueroa | Desarrollador Backend Node.js',
    description:
      'Portafolio de Franco Figueroa, Licenciado en Sistemas y desarrollador backend con Node.js, Express y MySQL. Proyectos, CV y contacto.',
    h1: 'Franco Figueroa',
  },
  tesis: {
    title: 'Tesis: recolección de revistas científicas | Franco Figueroa',
    description:
      'Sistema web que recolecta, normaliza y actualiza información de revistas científicas argentinas en repositorios bibliográficos y genera un listado unificado.',
    h1: 'Tesis: recolección de revistas científicas argentinas',
  },
  supermercado: {
    title: 'Supermercado online con panel de administración | Franco Figueroa',
    description:
      'Sistema web de supermercado online con carrito, favoritos, historial de compras, comprobantes en PDF y panel de administración con reportes de ventas.',
    h1: 'Sistema de supermercado online',
  },
  casino: {
    title: 'Juegos de casino online | Franco Figueroa',
    description:
      'Sitio web con varios juegos de casino y sistema de apuestas, desarrollado con Node.js, Express y MySQL como práctica de lógica y estado en el backend.',
    h1: 'Juegos de casino online',
  },
  empresaTransporte: {
    title: 'Sitio web para empresa de transporte | Franco Figueroa',
    description:
      'Sitio web institucional para una empresa de transporte: presentación de servicios, información de contacto y diseño responsive con Bootstrap.',
    h1: 'Sitio web para una empresa de transporte',
  },
  autoescuela: {
    title: 'Gestión de autoescuela: alumnos y clases | Franco Figueroa',
    description:
      'Aplicación web para administrar los alumnos y las clases de una escuela de conducción, con altas, bajas, modificaciones y seguimiento de cada cursada.',
    h1: 'Gestión de alumnos y clases de una autoescuela',
  },
  docker: {
    title: 'Aplicación Node.js desplegada con Docker | Franco Figueroa',
    description:
      'Aplicación web conectada a una base de datos MySQL y desplegada en contenedores Docker, con el detalle del Dockerfile y del entorno de ejecución.',
    h1: 'Aplicación web con MySQL desplegada en Docker',
  },
  tiendaJuegosDeMesa: {
    title: 'Tienda de juegos de mesa con reseñas | Franco Figueroa',
    description:
      'Tienda online de juegos de mesa donde los usuarios publican productos, escriben comentarios y los valoran con estrellas. Hecha con Node.js y MySQL.',
    h1: 'Tienda de juegos de mesa',
  },
  notFound: {
    title: 'Página no encontrada | Franco Figueroa',
    description: 'La página que buscás no existe en el portafolio de Franco Figueroa.',
    h1: 'Página no encontrada',
  },
};

/** Mapea el archivo de vista original con la ruta publicada. */
export const projectPages: { slug: string; view: string }[] = [
  { slug: 'tesis', view: 'tesisView.html' },
  { slug: 'supermercado', view: 'supermercadoView.html' },
  { slug: 'casino', view: 'casinoView.html' },
  { slug: 'empresaTransporte', view: 'empresaTransporteView.html' },
  { slug: 'autoescuela', view: 'autoescuelaView.html' },
  { slug: 'docker', view: 'dockerView.html' },
  { slug: 'tiendaJuegosDeMesa', view: 'tiendaJuegosDeMesaView.html' },
];
