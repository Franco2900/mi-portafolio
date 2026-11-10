/**
 * Metadatos de cada pagina. Un unico lugar para el <title>, la meta description
 * y el <h1>. Las descripciones apuntan a ~155 caracteres, que es lo que Google
 * muestra antes de cortar.
 */
import type { Lang } from '../i18n/ui';

export interface PageMeta {
  title: string;
  description: string;
  h1: string;
}

export const pages: Record<Lang, Record<string, PageMeta>> = {
  es: {
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
        'Sitio web con varios juegos de casino y sistema de apuestas, desarrollado con Node.js, Express y MongoDB como práctica de lógica y estado en el backend.',
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
    campusVirtual: {
      title: 'Campus Virtual: gestión académica con chatbot | Franco Figueroa',
      description:
        'Sistema de gestión académica con tres roles y un asistente conversacional que consulta datos reales del sistema sin poder modificarlos. Flask, React y RAG local.',
      h1: 'Campus Virtual: gestión académica con asistente conversacional',
    },
    notFound: {
      title: 'Página no encontrada | Franco Figueroa',
      description: 'La página que buscás no existe en el portafolio de Franco Figueroa.',
      h1: 'Página no encontrada',
    },
  },
  en: {
    home: {
      title: 'Franco Figueroa | Backend Developer (Node.js)',
      description:
        'Portfolio of Franco Figueroa, Computer Systems graduate and backend developer working with Node.js, Express and MySQL. Projects, CV and contact.',
      h1: 'Franco Figueroa',
    },
    tesis: {
      title: 'Thesis: scientific journal harvesting | Franco Figueroa',
      description:
        'Web system that harvests, normalizes and updates information on Argentine scientific journals from bibliographic repositories and builds a single unified listing.',
      h1: 'Thesis: harvesting Argentine scientific journals',
    },
    supermercado: {
      title: 'Online supermarket with admin panel | Franco Figueroa',
      description:
        'Web-based online supermarket with cart, favorites, purchase history, PDF receipts and an admin panel with sales reports and user role management.',
      h1: 'Online supermarket system',
    },
    casino: {
      title: 'Online casino games | Franco Figueroa',
      description:
        'Website with several casino games and a betting system, built with Node.js, Express and MongoDB as practice for backend logic and state management.',
      h1: 'Online casino games',
    },
    empresaTransporte: {
      title: 'Website for a transport company | Franco Figueroa',
      description:
        'Corporate website for a transport company: service presentation, contact information, a responsive Bootstrap design and multilingual support.',
      h1: 'Website for a transport company',
    },
    autoescuela: {
      title: 'Driving school management: students and classes | Franco Figueroa',
      description:
        'Web application to manage the students and classes of a driving school, with create, update and delete actions, tracking and email reminders.',
      h1: 'Driving school student and class management',
    },
    docker: {
      title: 'Node.js application deployed with Docker | Franco Figueroa',
      description:
        'Web application connected to a MySQL database and deployed in Docker containers, with the detail of the Dockerfile and the runtime environment.',
      h1: 'Web application with MySQL deployed in Docker',
    },
    tiendaJuegosDeMesa: {
      title: 'Board game store with reviews | Franco Figueroa',
      description:
        'Online board game store where users post products, write comments, rate them with stars and reply to each other. Built with Node.js and MySQL.',
      h1: 'Board game store',
    },
    campusVirtual: {
      title: 'Campus Virtual: academic management with a chatbot | Franco Figueroa',
      description:
        'Academic management system with three roles and a conversational assistant that queries real system data without changing it. Flask, React and local RAG.',
      h1: 'Campus Virtual: academic management with a conversational assistant',
    },
  },
  pt: {
    home: {
      title: 'Franco Figueroa | Desenvolvedor Backend Node.js',
      description:
        'Portfólio de Franco Figueroa, Licenciado em Sistemas e desenvolvedor backend com Node.js, Express e MySQL. Projetos, CV e contato.',
      h1: 'Franco Figueroa',
    },
    tesis: {
      title: 'Tese: coleta de revistas científicas | Franco Figueroa',
      description:
        'Sistema web que coleta, normaliza e atualiza informações de revistas científicas argentinas em repositórios bibliográficos e gera uma listagem unificada.',
      h1: 'Tese: coleta de revistas científicas argentinas',
    },
    supermercado: {
      title: 'Supermercado on-line com painel de administração | Franco Figueroa',
      description:
        'Sistema web de supermercado on-line com carrinho, favoritos, histórico de compras, comprovantes em PDF e painel de administração com relatórios de vendas.',
      h1: 'Sistema de supermercado on-line',
    },
    casino: {
      title: 'Jogos de cassino on-line | Franco Figueroa',
      description:
        'Site com vários jogos de cassino e sistema de apostas, desenvolvido com Node.js, Express e MongoDB como prática de lógica e estado no backend.',
      h1: 'Jogos de cassino on-line',
    },
    empresaTransporte: {
      title: 'Site para empresa de transporte | Franco Figueroa',
      description:
        'Site institucional para uma empresa de transporte: apresentação de serviços, informações de contato e design responsivo com Bootstrap.',
      h1: 'Site para uma empresa de transporte',
    },
    autoescuela: {
      title: 'Gestão de autoescola: alunos e aulas | Franco Figueroa',
      description:
        'Aplicação web para administrar os alunos e as aulas de uma autoescola, com cadastro, exclusão, alteração e acompanhamento de cada turma.',
      h1: 'Gestão de alunos e aulas de uma autoescola',
    },
    docker: {
      title: 'Aplicação Node.js implantada com Docker | Franco Figueroa',
      description:
        'Aplicação web conectada a um banco de dados MySQL e implantada em contêineres Docker, com o detalhe do Dockerfile e do ambiente de execução.',
      h1: 'Aplicação web com MySQL implantada em Docker',
    },
    tiendaJuegosDeMesa: {
      title: 'Loja de jogos de tabuleiro com avaliações | Franco Figueroa',
      description:
        'Loja on-line de jogos de tabuleiro onde os usuários publicam produtos, escrevem comentários e os avaliam com estrelas. Feita com Node.js e MySQL.',
      h1: 'Loja de jogos de tabuleiro',
    },
    campusVirtual: {
      title: 'Campus Virtual: gestão acadêmica com chatbot | Franco Figueroa',
      description:
        'Sistema de gestão acadêmica com três papéis e um assistente conversacional que consulta dados reais do sistema sem poder modificá-los. Flask, React e RAG local.',
      h1: 'Campus Virtual: gestão acadêmica com assistente conversacional',
    },
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
