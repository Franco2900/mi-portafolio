import type { Lang } from '../i18n/ui';

/**
 * The portfolio assistant's curated question set.
 *
 * It is deliberately a fixed set of answers instead of a language model: the site is static, the
 * content is finite, and an answer that invents something about the author would be worse than an
 * honest "I don't have an answer for that". Every statement here is already made somewhere on the
 * site; nothing new is claimed.
 */
export interface ChatLink {
  label: string;
  /** Project slug, resolved to its localized page by the component. */
  slug?: string;
  /** Anchor on the home page. */
  hash?: string;
}

export interface ChatEntry {
  id: string;
  question: string;
  /** Other phrasings that must reach this answer. */
  aliases: string[];
  answer: string;
  links?: ChatLink[];
}

export interface ChatCopy {
  title: string;
  subtitle: string;
  suggestionsTitle: string;
  /** Etiqueta del desplegable que muestra el set completo. */
  allQuestions: string;
  groupProfile: string;
  groupTech: string;
  groupProjects: string;
  groupContact: string;
  placeholder: string;
  send: string;
  fallback: string;
  disclaimer: string;
}

export interface ChatLocale {
  copy: ChatCopy;
  entries: ChatEntry[];
}

export const chatbot: Record<Lang, ChatLocale> = {
  es: {
    copy: {
      title: 'Asistente del portafolio',
      subtitle:
        'Preguntá lo que quieras sobre mi perfil, mis proyectos o cómo contactarme. Responde al instante, sin salir de la página.',
      suggestionsTitle: 'Podés empezar por acá:',
      allQuestions: 'Ver todas las preguntas',
      groupProfile: 'Perfil',
      groupTech: 'Tecnologías',
      groupProjects: 'Proyectos',
      groupContact: 'Contacto',
      placeholder: 'Escribí tu pregunta...',
      send: 'Enviar',
      fallback:
        'No tengo una respuesta para eso. Probá con alguna de las preguntas sugeridas, o escribime a franco2900@gmail.com.',
      disclaimer:
        'Respuestas armadas a partir del contenido del sitio. No es un modelo de lenguaje.',
    },
    entries: [
      {
        id: 'who',
        question: '¿Quién eres?',
        aliases: [
          '¿Quién sos?',
          '¿Cómo te llamás?',
          'Presentate',
          '¿Quién es Franco Figueroa?',
          'Contame de vos',
        ],
        answer:
          'Soy Franco Figueroa, Licenciado en Sistemas graduado de la Universidad Nacional de Lanús (UNLa). Estoy dando mis primeros pasos en el mundo laboral de la informática, y uso este portafolio para mostrar mis capacidades como programador, mis proyectos y mi experiencia en desarrollo de software.',
        links: [{ label: 'Ver mi introducción', hash: '#introduccion' }],
      },
      {
        id: 'services',
        question: '¿Qué servicios ofreces?',
        aliases: [
          '¿Qué hacés?',
          '¿Hacés desarrollo a medida?',
          '¿Trabajás por encargo?',
          '¿Qué ofrecés?',
        ],
        answer:
          'Además de los proyectos que muestro en el portafolio, desarrollo software y programas a medida según las necesidades específicas de cada cliente. Me gusta escuchar ideas y transformarlas en soluciones tecnológicas prácticas, adaptadas a cada situación, con foco en la calidad y la utilidad real.',
        links: [{ label: 'Ir a contacto', hash: '#contacto' }],
      },
      {
        id: 'skills',
        question: '¿Cuáles son tus habilidades principales?',
        aliases: [
          '¿Qué tecnologías usás?',
          '¿Qué stack manejás?',
          '¿Qué lenguajes sabés?',
          'Habilidades',
          '¿Qué sabés hacer?',
        ],
        answer:
          'Mi punto más fuerte es el backend: NodeJS con Express y Python con Flask. En bases de datos trabajo con MySQL, SQLite y MongoDB. En frontend uso HTML5, CSS3, Bootstrap, EJS y React, y también trabajo con Docker. En lo blando: comunicación efectiva, creatividad aplicada al análisis de datos e inglés C1.',
        links: [{ label: 'Ver habilidades', hash: '#habilidades' }],
      },
      {
        id: 'studies',
        question: '¿Dónde estudiaste?',
        aliases: [
          '¿Dónde te recibiste?',
          '¿Qué estudiaste?',
          '¿En qué universidad?',
          'Universidad',
        ],
        answer:
          'Me gradué como Licenciado en Sistemas en la Universidad Nacional de Lanús (UNLa). Durante la carrera adquirí una base sólida en programación, análisis de sistemas y gestión de proyectos, lo que me permite abordar tanto el aspecto técnico como el organizacional del desarrollo de software.',
      },
      {
        id: 'projects',
        question: '¿Qué proyectos has realizado?',
        aliases: [
          '¿Qué proyectos tenés?',
          'Mostrame tus proyectos',
          'Proyectos',
          '¿Qué construiste?',
        ],
        answer:
          'Ocho proyectos, entre académicos y personales: la tesis; el Campus Virtual; la tienda de juegos de mesa; el casino; la empresa de transporte; la autoescuela; el supermercado; y Docker. Cada página de proyecto tiene imágenes, video explicativo y enlace al repositorio.',
        links: [{ label: 'Ver todos los proyectos', hash: '#proyectos' }],
      },
      {
        id: 'contact',
        question: '¿Cómo puedo contactarte?',
        aliases: [
          '¿Cuál es tu email?',
          '¿Cómo te contacto?',
          '¿Tenés LinkedIn?',
          'Contacto',
          '¿Dónde te escribo?',
        ],
        answer:
          'Podés escribirme a franco2900@gmail.com. También estoy en LinkedIn, donde comparto mi perfil profesional. En el portafolio tenés enlaces directos a mi CV y a mi certificado de inglés C1.',
        links: [{ label: 'Ver datos de contacto', hash: '#contacto' }],
      },
      {
        id: 'languages',
        question: '¿Qué idiomas hablás?',
        aliases: ['¿Hablás inglés?', '¿Qué nivel de inglés tenés?', 'Idiomas'],
        answer:
          'Mi idioma nativo es el español y tengo inglés C1 certificado con el EF SET. Eso me permite comunicarme con fluidez en entornos internacionales, leer documentación técnica y colaborar con equipos globales.',
      },
      {
        id: 'cobol',
        question: '¿Sabés programar en COBOL?',
        aliases: ['¿Programás en COBOL?', 'COBOL', '¿Manejás mainframe?'],
        answer:
          'Sí, tengo conocimientos básicos de COBOL y estoy profundizando en su sintaxis y estructura. Mi objetivo es aplicarlo en entornos empresariales y bancarios, donde sigue siendo muy usado. Estoy haciendo ejercicios prácticos que muestran cómo integrar COBOL con tecnologías modernas, para conectar el mundo legacy con el desarrollo actual.',
      },
      {
        id: 'ai',
        question: '¿Te interesa la inteligencia artificial?',
        aliases: [
          '¿Usás IA?',
          '¿Sabés de inteligencia artificial?',
          'IA',
          '¿Trabajaste con modelos de lenguaje?',
        ],
        answer:
          'Sí, y ya está aplicada en el portafolio: uno de los proyectos, el Campus Virtual, tiene un asistente conversacional integrado que corre con LangChain y Ollama, recupera contexto desde ChromaDB y le da al modelo herramientas de sólo lectura limitadas por rol. Además sigo estudiando modelos de lenguaje y análisis de datos para integrarlos en aplicaciones reales.',
        links: [{ label: 'Ver Campus Virtual', slug: 'campusVirtual' }],
      },
      {
        id: 'studies-portfolio',
        question: '¿Cómo relacionás tus estudios con tu portafolio?',
        aliases: [
          '¿Qué tiene que ver la facultad con tus proyectos?',
          '¿Cómo aplicás lo que estudiaste?',
        ],
        answer:
          'El portafolio muestra las dos puntas: los proyectos de la facultad, como la tesis; los de cursos, como el Campus Virtual; y los personales, hechos por mi cuenta. En todos la idea es la misma: contar el problema, las decisiones y el resultado, no solo el código.',
        links: [{ label: 'Ver proyectos', hash: '#proyectos' }],
      },
      {
        id: 'campus-virtual',
        question: '¿Qué es Campus Virtual?',
        aliases: [
          'Contame de Campus Virtual',
          '¿Qué hiciste en Campus Virtual?',
          'Campus Virtual',
          '¿Cuál es tu mejor proyecto?',
        ],
        answer:
          'Es un trabajo práctico de un curso de "Desarrollo de software y arquitectura de agentes con IA" de la UNLa. El trabajo consistió en construir un programa con agentes de IA que se encargan de la creación del código: el rol del programador ya no es escribir el código, sino gestionar, orquestar, estructurar y revisar el trabajo que hacen los agentes. El resultado es una plataforma de gestión académica con tres roles —estudiante, profesor y administrador— y un asistente conversacional que responde según el rol de quien pregunta, sin poder crear, modificar ni calificar nada.',
        links: [{ label: 'Ver el proyecto', slug: 'campusVirtual' }],
      },
      {
        id: 'source-code',
        question: '¿Puedo ver el código de los proyectos?',
        aliases: ['¿Dónde está el código?', '¿Tenés GitHub?', 'Repositorios', 'Código fuente'],
        answer:
          'Sí. Cada página de proyecto enlaza a su repositorio en GitHub, y mi perfil es github.com/Franco2900.',
        links: [{ label: 'Ver proyectos', hash: '#proyectos' }],
      },
      {
        id: 'available',
        question: '¿Estás disponible para nuevos proyectos?',
        aliases: [
          '¿Estás buscando trabajo?',
          '¿Trabajás freelance?',
          '¿Puedo contratarte?',
          'Disponibilidad',
        ],
        answer:
          'Sí. Además de los proyectos que muestro en el portafolio, desarrollo software y programas a medida según las necesidades de cada cliente. Si tenés una idea, contame de qué se trata y vemos cómo resolverlo.',
        links: [{ label: 'Ir a contacto', hash: '#contacto' }],
      },
    ],
  },

  en: {
    copy: {
      title: 'Portfolio assistant',
      subtitle:
        'Ask anything about my profile, my projects or how to reach me. It answers instantly, without leaving the page.',
      suggestionsTitle: 'You can start here:',
      allQuestions: 'See all questions',
      groupProfile: 'Profile',
      groupTech: 'Technologies',
      groupProjects: 'Projects',
      groupContact: 'Contact',
      placeholder: 'Type your question...',
      send: 'Send',
      fallback:
        "I don't have an answer for that. Try one of the suggested questions, or write to me at franco2900@gmail.com.",
      disclaimer: "Answers assembled from this site's content. Not a language model.",
    },
    entries: [
      {
        id: 'who',
        question: 'Who are you?',
        aliases: [
          'Who is Franco Figueroa?',
          'Tell me about yourself',
          "What's your name?",
        ],
        answer:
          "I'm Franco Figueroa, a Computer Systems graduate from the National University of Lanús (UNLa). I'm taking my first steps in the IT job market, and I use this portfolio to show my skills as a developer, my projects and my experience in software development.",
        links: [{ label: 'See my introduction', hash: '#introduccion' }],
      },
      {
        id: 'services',
        question: 'What services do you offer?',
        aliases: [
          'What do you do?',
          'Do you build custom software?',
          'Do you take on client work?',
        ],
        answer:
          "Beyond the projects shown in my portfolio, I also build custom software and programs for each client's specific needs. I like listening to ideas and turning them into practical technical solutions, adapted to each situation, focused on quality and real usefulness.",
        links: [{ label: 'Go to contact', hash: '#contacto' }],
      },
      {
        id: 'skills',
        question: 'What are your main skills?',
        aliases: [
          'What stack do you use?',
          'Which technologies do you know?',
          'What languages do you code in?',
          'Skills',
        ],
        answer:
          'Backend is my strongest side: NodeJS with Express and Python with Flask. For databases I work with MySQL, SQLite and MongoDB. On the frontend I use HTML5, CSS3, Bootstrap, EJS and React, and I also work with Docker. Soft skills: effective communication, creativity applied to data analysis, and C1 English.',
        links: [{ label: 'See skills', hash: '#habilidades' }],
      },
      {
        id: 'studies',
        question: 'Where did you study?',
        aliases: ['Which university did you attend?', 'What did you study?'],
        answer:
          'I graduated in Computer Systems from the National University of Lanús (UNLa). During my degree I built a solid base in programming, systems analysis and project management, which lets me handle both the technical and the organisational side of software development.',
      },
      {
        id: 'projects',
        question: 'What projects have you built?',
        aliases: ['Show me your projects', 'Projects', 'What have you built?'],
        answer:
          'Eight projects, academic and personal: the thesis; Campus Virtual; the board-game store; the casino; the transport company; the driving school; the supermarket; and Docker. Every project page has screenshots, a demo video and a link to the repository.',
        links: [{ label: 'See all projects', hash: '#proyectos' }],
      },
      {
        id: 'contact',
        question: 'How can I contact you?',
        aliases: ["What's your email?", 'Are you on LinkedIn?', 'Contact'],
        answer:
          "You can write to me at franco2900@gmail.com. I'm also on LinkedIn, where I share my professional profile. The portfolio has direct links to my CV and to my C1 English certificate.",
        links: [{ label: 'See contact details', hash: '#contacto' }],
      },
      {
        id: 'languages',
        question: 'What languages do you speak?',
        aliases: ['Do you speak English?', "What's your English level?", 'Languages'],
        answer:
          'Spanish is my native language and I have C1 English certified by the EF SET. That lets me communicate fluently in international settings, read technical documentation and work with global teams.',
      },
      {
        id: 'cobol',
        question: 'Do you know COBOL?',
        aliases: ['Can you code in COBOL?', 'COBOL', 'Do you work with mainframes?'],
        answer:
          "Yes, I have basic COBOL knowledge and I'm going deeper into its syntax and structure. My goal is to apply it in enterprise and banking environments, where it is still widely used. I'm working through practical exercises that show how to integrate COBOL with modern technologies, bridging the legacy world and current development.",
      },
      {
        id: 'ai',
        question: 'Are you interested in artificial intelligence?',
        aliases: [
          'Do you use AI?',
          'Do you know about AI?',
          'AI',
          'Have you worked with language models?',
        ],
        answer:
          "Yes, and it is already applied in this portfolio: one of the projects, Campus Virtual, ships an integrated conversational assistant that runs on LangChain and Ollama, retrieves context from ChromaDB and gives the model role-scoped read-only tools. I'm also studying language models and data analysis to integrate them into real applications.",
        links: [{ label: 'See Campus Virtual', slug: 'campusVirtual' }],
      },
      {
        id: 'studies-portfolio',
        question: 'How do your studies connect to your portfolio?',
        aliases: [
          'What does university have to do with your projects?',
          'How do you apply what you studied?',
        ],
        answer:
          'The portfolio shows both ends: the university projects, like the thesis; the course projects, like Campus Virtual; and the personal ones, built on my own. In all of them the idea is the same: show the problem, the decisions and the result, not just the code.',
        links: [{ label: 'See projects', hash: '#proyectos' }],
      },
      {
        id: 'campus-virtual',
        question: 'What is Campus Virtual?',
        aliases: [
          'Tell me about Campus Virtual',
          'What did you build in Campus Virtual?',
          'Campus Virtual',
          "What's your best project?",
        ],
        answer:
          'It is a practical assignment from a course on "Software development and agent architecture with AI" at UNLa. The work consisted of building a program with AI agents that handle the creation of the code: the programmer\'s role is no longer writing code, but managing, orchestrating, structuring and reviewing the work the agents do. The result is an academic management platform with three roles — student, teacher and administrator — and a conversational assistant that answers according to the role of whoever asks, without being able to create, modify or grade anything.',
        links: [{ label: 'See the project', slug: 'campusVirtual' }],
      },
      {
        id: 'source-code',
        question: 'Can I see the project code?',
        aliases: ['Where is the code?', 'Are you on GitHub?', 'Repositories', 'Source code'],
        answer:
          'Yes. Every project page links to its GitHub repository, and my profile is github.com/Franco2900.',
        links: [{ label: 'See projects', hash: '#proyectos' }],
      },
      {
        id: 'available',
        question: 'Are you available for new projects?',
        aliases: [
          'Are you looking for work?',
          'Do you freelance?',
          'Can I hire you?',
          'Availability',
        ],
        answer:
          "Yes. Beyond the projects shown in the portfolio, I build custom software and programs for each client's needs. If you have an idea, tell me what it is about and we'll figure out how to solve it.",
        links: [{ label: 'Go to contact', hash: '#contacto' }],
      },
    ],
  },

  pt: {
    copy: {
      title: 'Assistente do portfólio',
      subtitle:
        'Pergunte o que quiser sobre meu perfil, meus projetos ou como falar comigo. Responde na hora, sem sair da página.',
      suggestionsTitle: 'Você pode começar por aqui:',
      allQuestions: 'Ver todas as perguntas',
      groupProfile: 'Perfil',
      groupTech: 'Tecnologias',
      groupProjects: 'Projetos',
      groupContact: 'Contato',
      placeholder: 'Escreva sua pergunta...',
      send: 'Enviar',
      fallback:
        'Não tenho uma resposta para isso. Tente uma das perguntas sugeridas ou escreva para mim em franco2900@gmail.com.',
      disclaimer:
        'Respostas montadas a partir do conteúdo do site. Não é um modelo de linguagem.',
    },
    entries: [
      {
        id: 'who',
        question: 'Quem é você?',
        aliases: ['Quem é Franco Figueroa?', 'Fale sobre você', 'Qual é o seu nome?'],
        answer:
          'Sou Franco Figueroa, formado em Sistemas pela Universidade Nacional de Lanús (UNLa). Estou dando meus primeiros passos no mercado de trabalho de TI, e uso este portfólio para mostrar minhas capacidades como programador, meus projetos e minha experiência em desenvolvimento de software.',
        links: [{ label: 'Ver minha introdução', hash: '#introduccion' }],
      },
      {
        id: 'services',
        question: 'Que serviços você oferece?',
        aliases: [
          'O que você faz?',
          'Você desenvolve software sob medida?',
          'Você trabalha por encomenda?',
        ],
        answer:
          'Além dos projetos que mostro no portfólio, também desenvolvo software e programas sob medida conforme as necessidades específicas de cada cliente. Gosto de ouvir ideias e transformá-las em soluções tecnológicas práticas, adaptadas a cada situação, com foco na qualidade e na utilidade real.',
        links: [{ label: 'Ir para contato', hash: '#contacto' }],
      },
      {
        id: 'skills',
        question: 'Quais são suas principais habilidades?',
        aliases: [
          'Que tecnologias você usa?',
          'Qual é o seu stack?',
          'Que linguagens você sabe?',
          'Habilidades',
        ],
        answer:
          'Meu ponto mais forte é o backend: NodeJS com Express e Python com Flask. Em bancos de dados trabalho com MySQL, SQLite e MongoDB. No frontend uso HTML5, CSS3, Bootstrap, EJS e React, e também trabalho com Docker. Nas habilidades comportamentais: comunicação efetiva, criatividade aplicada à análise de dados e inglês C1.',
        links: [{ label: 'Ver habilidades', hash: '#habilidades' }],
      },
      {
        id: 'studies',
        question: 'Onde você estudou?',
        aliases: ['Em que universidade?', 'O que você estudou?'],
        answer:
          'Me formei em Sistemas pela Universidade Nacional de Lanús (UNLa). Durante a graduação construí uma base sólida em programação, análise de sistemas e gestão de projetos, o que me permite lidar tanto com o lado técnico quanto com o organizacional do desenvolvimento de software.',
      },
      {
        id: 'projects',
        question: 'Que projetos você já fez?',
        aliases: ['Mostre seus projetos', 'Projetos', 'O que você construiu?'],
        answer:
          'Oito projetos, entre acadêmicos e pessoais: a tese; o Campus Virtual; a loja de jogos de tabuleiro; o cassino; a empresa de transporte; a autoescola; o supermercado; e Docker. Cada página de projeto tem imagens, vídeo explicativo e link para o repositório.',
        links: [{ label: 'Ver todos os projetos', hash: '#proyectos' }],
      },
      {
        id: 'contact',
        question: 'Como posso falar com você?',
        aliases: ['Qual é o seu email?', 'Você tem LinkedIn?', 'Contato'],
        answer:
          'Você pode me escrever em franco2900@gmail.com. Também estou no LinkedIn, onde compartilho meu perfil profissional. No portfólio há links diretos para meu CV e para meu certificado de inglês C1.',
        links: [{ label: 'Ver dados de contato', hash: '#contacto' }],
      },
      {
        id: 'languages',
        question: 'Que idiomas você fala?',
        aliases: ['Você fala inglês?', 'Qual é o seu nível de inglês?', 'Idiomas'],
        answer:
          'Meu idioma nativo é o espanhol e tenho inglês C1 certificado pelo EF SET. Isso me permite me comunicar com fluência em ambientes internacionais, ler documentação técnica e colaborar com equipes globais.',
      },
      {
        id: 'cobol',
        question: 'Você sabe programar em COBOL?',
        aliases: ['Você programa em COBOL?', 'COBOL', 'Você trabalha com mainframe?'],
        answer:
          'Sim, tenho conhecimentos básicos de COBOL e estou me aprofundando na sua sintaxe e estrutura. Meu objetivo é aplicá-lo em ambientes empresariais e bancários, onde ainda é muito usado. Estou fazendo exercícios práticos que mostram como integrar COBOL com tecnologias modernas, para conectar o mundo legado ao desenvolvimento atual.',
      },
      {
        id: 'ai',
        question: 'Você se interessa por inteligência artificial?',
        aliases: [
          'Você usa IA?',
          'Você sabe de IA?',
          'IA',
          'Você já trabalhou com modelos de linguagem?',
        ],
        answer:
          'Sim, e ela já está aplicada no portfólio: um dos projetos, o Campus Virtual, tem um assistente conversacional integrado que roda com LangChain e Ollama, recupera contexto do ChromaDB e dá ao modelo ferramentas de apenas leitura limitadas por papel. Além disso, sigo estudando modelos de linguagem e análise de dados para integrá-los em aplicações reais.',
        links: [{ label: 'Ver Campus Virtual', slug: 'campusVirtual' }],
      },
      {
        id: 'studies-portfolio',
        question: 'Como você relaciona seus estudos com o portfólio?',
        aliases: [
          'O que a faculdade tem a ver com seus projetos?',
          'Como você aplica o que estudou?',
        ],
        answer:
          'O portfólio mostra as duas pontas: os projetos da faculdade, como a tese; os de cursos, como o Campus Virtual; e os pessoais, feitos por conta própria. Em todos a ideia é a mesma: mostrar o problema, as decisões e o resultado, não só o código.',
        links: [{ label: 'Ver projetos', hash: '#proyectos' }],
      },
      {
        id: 'campus-virtual',
        question: 'O que é o Campus Virtual?',
        aliases: [
          'Fale sobre o Campus Virtual',
          'O que você fez no Campus Virtual?',
          'Campus Virtual',
          'Qual é o seu melhor projeto?',
        ],
        answer:
          'É um trabalho prático de um curso de "Desenvolvimento de software e arquitetura de agentes com IA" da UNLa. O trabalho consistiu em construir um programa com agentes de IA que se encarregam da criação do código: o papel do programador já não é escrever o código, mas gerenciar, orquestrar, estruturar e revisar o trabalho que os agentes fazem. O resultado é uma plataforma de gestão acadêmica com três papéis — estudante, professor e administrador — e um assistente conversacional que responde conforme o papel de quem pergunta, sem poder criar, modificar ou dar notas.',
        links: [{ label: 'Ver o projeto', slug: 'campusVirtual' }],
      },
      {
        id: 'source-code',
        question: 'Posso ver o código dos projetos?',
        aliases: ['Onde está o código?', 'Você tem GitHub?', 'Repositórios', 'Código-fonte'],
        answer:
          'Sim. Cada página de projeto tem link para o seu repositório no GitHub, e meu perfil é github.com/Franco2900.',
        links: [{ label: 'Ver projetos', hash: '#proyectos' }],
      },
      {
        id: 'available',
        question: 'Você está disponível para novos projetos?',
        aliases: [
          'Você está procurando trabalho?',
          'Você trabalha como freelancer?',
          'Posso te contratar?',
          'Disponibilidade',
        ],
        answer:
          'Sim. Além dos projetos que mostro no portfólio, desenvolvo software e programas sob medida conforme as necessidades de cada cliente. Se você tem uma ideia, me conte do que se trata e vemos como resolver.',
        links: [{ label: 'Ir para contato', hash: '#contacto' }],
      },
    ],
  },
};
