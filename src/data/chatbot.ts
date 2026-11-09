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
          'Ocho proyectos, entre académicos y personales: Campus Virtual, mi trabajo integrador de la carrera y el más grande de todos; la tesis; la tienda de juegos de mesa; el casino; la empresa de transporte; la autoescuela; el supermercado; y Docker. Además desarrollo VicioMesa para un cliente. Cada página de proyecto tiene imágenes, video explicativo y enlace al repositorio.',
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
        id: 'cnc',
        question: '¿Qué estás estudiando además de programación?',
        aliases: ['¿Qué es CNC?', '¿Estudiás CNC?', '¿Qué más estudiás?', 'CNC'],
        answer:
          'Estoy aprendiendo CNC, el control numérico computarizado que se usa en máquinas industriales. Me interesa porque combina software con procesos físicos de manufactura, y me da una visión más amplia de cómo la informática se aplica más allá del desarrollo web.',
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
          'Sí, y ya está aplicada en el portafolio: Campus Virtual tiene un asistente conversacional integrado que corre con LangChain y Ollama, recupera contexto desde ChromaDB y le da al modelo herramientas de sólo lectura limitadas por rol. Además sigo estudiando modelos de lenguaje y análisis de datos para integrarlos en aplicaciones reales.',
        links: [{ label: 'Ver Campus Virtual', slug: 'campusVirtual' }],
      },
      {
        id: 'cobol-plans',
        question: '¿Qué planes tenés con COBOL?',
        aliases: [
          '¿Para qué querés aprender COBOL?',
          '¿Seguís con COBOL?',
          '¿Qué querés hacer con COBOL?',
        ],
        answer:
          'Mi plan es seguir avanzando en COBOL y en el ecosistema mainframe, aprendiendo JCL, DB2 y CICS. Quiero construir proyectos que muestren cómo se desarrollan aplicaciones empresariales completas en ese entorno, y abrir oportunidades en sectores como banca y seguros, donde COBOL sigue siendo clave.',
      },
      {
        id: 'studies-portfolio',
        question: '¿Cómo relacionás tus estudios con tu portafolio?',
        aliases: [
          '¿Qué tiene que ver la facultad con tus proyectos?',
          '¿Cómo aplicás lo que estudiaste?',
        ],
        answer:
          'El portafolio muestra las dos puntas: los proyectos de la facultad, como la tesis y Campus Virtual, y los personales, hechos por mi cuenta. Campus Virtual es el ejemplo más claro: doce casos de uso, backend por capas, frontend en React y un asistente con IA, todo especificado, testeado y documentado antes de darlo por cerrado.',
        links: [{ label: 'Ver Campus Virtual', slug: 'campusVirtual' }],
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
          'Es mi trabajo práctico integrador de la carrera y el proyecto más grande del portafolio. Una plataforma de gestión académica con tres roles —estudiante, profesor y administrador— y un asistente conversacional que responde según el rol de quien pregunta, sin poder crear, modificar ni calificar nada. Backend en Flask organizado por capas, frontend en React con Vite, y doce casos de uso cerrados con especificación, tests y evidencia visual.',
        links: [{ label: 'Ver el proyecto', slug: 'campusVirtual' }],
      },
      {
        id: 'source-code',
        question: '¿Puedo ver el código de los proyectos?',
        aliases: ['¿Dónde está el código?', '¿Tenés GitHub?', 'Repositorios', 'Código fuente'],
        answer:
          'Sí. Cada página de proyecto enlaza a su repositorio en GitHub, y mi perfil es github.com/Franco2900. El código de Campus Virtual es público y tiene su pipeline de integración continua.',
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
          'Eight projects, academic and personal: Campus Virtual, my capstone project and the largest one; the thesis; the board-game store; the casino; the transport company; the driving school; the supermarket; and Docker. I also build VicioMesa for a client. Every project page has screenshots, a demo video and a link to the repository.',
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
        id: 'cnc',
        question: 'What are you studying besides programming?',
        aliases: ['What is CNC?', 'Are you studying CNC?', 'What else are you learning?'],
        answer:
          "I'm learning CNC, the computer numerical control used in industrial machines. It interests me because it combines software with physical manufacturing processes, and it gives me a broader view of how computing applies beyond web development.",
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
          "Yes, and it is already applied in this portfolio: Campus Virtual ships an integrated conversational assistant that runs on LangChain and Ollama, retrieves context from ChromaDB and gives the model role-scoped read-only tools. I'm also studying language models and data analysis to integrate them into real applications.",
        links: [{ label: 'See Campus Virtual', slug: 'campusVirtual' }],
      },
      {
        id: 'cobol-plans',
        question: 'What are your plans with COBOL?',
        aliases: ['Why do you want to learn COBOL?', 'Are you still working on COBOL?'],
        answer:
          'My plan is to keep advancing in COBOL and the mainframe ecosystem, learning JCL, DB2 and CICS. I want to build projects that show how complete enterprise applications are developed in that environment, and to open opportunities in sectors such as banking and insurance, where COBOL is still key.',
      },
      {
        id: 'studies-portfolio',
        question: 'How do your studies connect to your portfolio?',
        aliases: [
          'What does university have to do with your projects?',
          'How do you apply what you studied?',
        ],
        answer:
          'The portfolio shows both ends: the university projects, like the thesis and Campus Virtual, and the personal ones, built on my own. Campus Virtual is the clearest example: twelve use cases, a layered backend, a React frontend and an AI assistant, all specified, tested and documented before it was closed.',
        links: [{ label: 'See Campus Virtual', slug: 'campusVirtual' }],
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
          'It is my university capstone project and the largest one in the portfolio. An academic management platform with three roles — student, teacher and administrator — and a conversational assistant that answers according to the role of whoever asks, without being able to create, modify or grade anything. A layered Flask backend, a React frontend with Vite, and twelve use cases closed with specification, tests and visual evidence.',
        links: [{ label: 'See the project', slug: 'campusVirtual' }],
      },
      {
        id: 'source-code',
        question: 'Can I see the project code?',
        aliases: ['Where is the code?', 'Are you on GitHub?', 'Repositories', 'Source code'],
        answer:
          "Yes. Every project page links to its GitHub repository, and my profile is github.com/Franco2900. Campus Virtual's code is public and runs a continuous integration pipeline.",
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
          'Oito projetos, entre acadêmicos e pessoais: Campus Virtual, meu trabalho de conclusão e o maior de todos; a tese; a loja de jogos de tabuleiro; o cassino; a empresa de transporte; a autoescola; o supermercado; e Docker. Também desenvolvo o VicioMesa para um cliente. Cada página de projeto tem imagens, vídeo explicativo e link para o repositório.',
        links: [{ label: 'Ver todos os projetos', hash: '#projetos' }],
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
        id: 'cnc',
        question: 'O que você está estudando além de programação?',
        aliases: ['O que é CNC?', 'Você estuda CNC?', 'O que mais você estuda?'],
        answer:
          'Estou aprendendo CNC, o controle numérico computadorizado usado em máquinas industriais. Me interessa porque combina software com processos físicos de manufatura, e me dá uma visão mais ampla de como a informática se aplica além do desenvolvimento web.',
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
          'Sim, e ela já está aplicada no portfólio: o Campus Virtual tem um assistente conversacional integrado que roda com LangChain e Ollama, recupera contexto do ChromaDB e dá ao modelo ferramentas de apenas leitura limitadas por papel. Além disso, sigo estudando modelos de linguagem e análise de dados para integrá-los em aplicações reais.',
        links: [{ label: 'Ver Campus Virtual', slug: 'campusVirtual' }],
      },
      {
        id: 'cobol-plans',
        question: 'Quais são seus planos com COBOL?',
        aliases: ['Por que você quer aprender COBOL?', 'Você continua com COBOL?'],
        answer:
          'Meu plano é continuar avançando em COBOL e no ecossistema mainframe, aprendendo JCL, DB2 e CICS. Quero construir projetos que mostrem como se desenvolvem aplicações empresariais completas nesse ambiente, e abrir oportunidades em setores como bancos e seguros, onde COBOL continua sendo chave.',
      },
      {
        id: 'studies-portfolio',
        question: 'Como você relaciona seus estudos com o portfólio?',
        aliases: [
          'O que a faculdade tem a ver com seus projetos?',
          'Como você aplica o que estudou?',
        ],
        answer:
          'O portfólio mostra as duas pontas: os projetos da faculdade, como a tese e o Campus Virtual, e os pessoais, feitos por conta própria. O Campus Virtual é o exemplo mais claro: doze casos de uso, backend em camadas, frontend em React e um assistente com IA, tudo especificado, testado e documentado antes de ser encerrado.',
        links: [{ label: 'Ver Campus Virtual', slug: 'campusVirtual' }],
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
          'É meu trabalho de conclusão de curso e o maior projeto do portfólio. Uma plataforma de gestão acadêmica com três papéis — estudante, professor e administrador — e um assistente conversacional que responde conforme o papel de quem pergunta, sem poder criar, modificar ou dar notas. Backend em Flask organizado em camadas, frontend em React com Vite, e doze casos de uso encerrados com especificação, testes e evidência visual.',
        links: [{ label: 'Ver o projeto', slug: 'campusVirtual' }],
      },
      {
        id: 'source-code',
        question: 'Posso ver o código dos projetos?',
        aliases: ['Onde está o código?', 'Você tem GitHub?', 'Repositórios', 'Código-fonte'],
        answer:
          'Sim. Cada página de projeto tem link para o seu repositório no GitHub, e meu perfil é github.com/Franco2900. O código do Campus Virtual é público e tem seu pipeline de integração contínua.',
        links: [{ label: 'Ver projetos', hash: '#projetos' }],
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
