import type { Course, Profile, Purchase, VideoView } from "@/types";

export const mockProfiles: Profile[] = [
  {
    id: "profile-maria",
    email: "maria.gonzalez@example.com",
    name: "María González",
    isAdmin: false,
    createdAt: "2026-01-12",
  },
  {
    id: "profile-carlos",
    email: "carlos.ruiz@example.com",
    name: "Carlos Ruiz",
    isAdmin: false,
    createdAt: "2026-02-03",
  },
  {
    id: "profile-laura",
    email: "laura.fernandez@example.com",
    name: "Laura Fernández",
    isAdmin: false,
    createdAt: "2026-02-27",
  },
  {
    id: "profile-javier",
    email: "javier.torres@example.com",
    name: "Javier Torres",
    isAdmin: false,
    createdAt: "2026-03-15",
  },
  {
    id: "profile-ana",
    email: "ana.martin@example.com",
    name: "Ana Martín",
    isAdmin: false,
    createdAt: "2026-04-05",
  },
];

export const mockCourses: Course[] = [
  {
    id: "diseno-ux-ui",
    title: "Domina el Diseño UX/UI desde Cero",
    description: "Aprende a diseñar interfaces claras y funcionales.",
    longDescription: [
      "Este curso te lleva paso a paso desde los principios básicos del diseño hasta la creación de interfaces completas y listas para producción. Aprenderás a investigar usuarios, construir wireframes y traducir esas ideas en pantallas reales usando herramientas profesionales.",
      "A lo largo de los módulos trabajarás con casos prácticos: una app móvil, un panel de administración y una tienda online, aplicando principios de jerarquía visual, contraste y accesibilidad en cada proyecto.",
      "Al finalizar tendrás un portafolio con proyectos reales que podrás mostrar a clientes o incluir en tu perfil profesional.",
    ],
    price: 49,
    learnPoints: [
      "Fundamentos de investigación de usuarios",
      "Wireframing y prototipado rápido",
      "Sistemas de diseño y componentes reutilizables",
      "Principios de accesibilidad y contraste",
      "Cómo presentar tu trabajo a clientes",
    ],
    status: "published",
    createdAt: "2026-01-05",
    sections: [
      {
        id: "diseno-ux-ui-s1",
        courseId: "diseno-ux-ui",
        title: "Fundamentos",
        order: 1,
        lessons: [
          {
            id: "diseno-ux-ui-s1-l1",
            sectionId: "diseno-ux-ui-s1",
            courseId: "diseno-ux-ui",
            title: "Bienvenida al curso",
            duration: 134,
            order: 1,
            isPreview: true,
            blocks: [
              { id: "diseno-ux-ui-s1-l1-b1", type: "video", video_url: "" },
            ],
          },
          {
            id: "diseno-ux-ui-s1-l2",
            sectionId: "diseno-ux-ui-s1",
            courseId: "diseno-ux-ui",
            title: "Qué vamos a aprender",
            duration: 131,
            order: 2,
            isPreview: true,
            blocks: [
              { id: "diseno-ux-ui-s1-l2-b1", type: "video", video_url: "" },
              {
                id: "diseno-ux-ui-s1-l2-b2",
                type: "text",
                title: "Resumen de la lección",
                content:
                  "En este módulo veremos el mapa completo del curso: investigación, wireframing, sistemas de diseño y cómo presentar tu trabajo a clientes.",
              },
            ],
          },
          {
            id: "diseno-ux-ui-s1-l3",
            sectionId: "diseno-ux-ui-s1",
            courseId: "diseno-ux-ui",
            title: "Investigación de usuarios",
            duration: 720,
            order: 3,
            isPreview: false,
            blocks: [
              { id: "diseno-ux-ui-s1-l3-b1", type: "video", video_url: "" },
              {
                id: "diseno-ux-ui-s1-l3-b2",
                type: "text",
                title: "Puntos clave",
                content:
                  "Antes de diseñar cualquier pantalla, valida tus suposiciones hablando con usuarios reales. Entrevistas y encuestas cortas te darán más señal que cien horas de opiniones internas.",
              },
            ],
          },
          {
            id: "diseno-ux-ui-s1-l4",
            sectionId: "diseno-ux-ui-s1",
            courseId: "diseno-ux-ui",
            title: "Wireframing rápido",
            duration: 505,
            order: 4,
            isPreview: false,
            blocks: [
              { id: "diseno-ux-ui-s1-l4-b1", type: "video", video_url: "" },
            ],
          },
        ],
      },
      {
        id: "diseno-ux-ui-s2",
        courseId: "diseno-ux-ui",
        title: "Sistemas de diseño",
        order: 2,
        lessons: [
          {
            id: "diseno-ux-ui-s2-l1",
            sectionId: "diseno-ux-ui-s2",
            courseId: "diseno-ux-ui",
            title: "Componentes reutilizables",
            duration: 483,
            order: 1,
            isPreview: false,
            blocks: [
              { id: "diseno-ux-ui-s2-l1-b1", type: "video", video_url: "" },
              {
                id: "diseno-ux-ui-s2-l1-b2",
                type: "text",
                title: "Por qué importa",
                content:
                  "Un sistema de componentes bien documentado reduce la deuda de diseño y acelera a todo el equipo de producto.",
              },
            ],
          },
          {
            id: "diseno-ux-ui-s2-l2",
            sectionId: "diseno-ux-ui-s2",
            courseId: "diseno-ux-ui",
            title: "Accesibilidad y contraste",
            duration: 362,
            order: 2,
            isPreview: false,
            blocks: [
              { id: "diseno-ux-ui-s2-l2-b1", type: "video", video_url: "" },
            ],
          },
          {
            id: "diseno-ux-ui-s2-l3",
            sectionId: "diseno-ux-ui-s2",
            courseId: "diseno-ux-ui",
            title: "Presentar tu trabajo a clientes",
            duration: 290,
            order: 3,
            isPreview: false,
            blocks: [
              { id: "diseno-ux-ui-s2-l3-b1", type: "video", video_url: "" },
              {
                id: "diseno-ux-ui-s2-l3-b2",
                type: "text",
                title: "Guion de presentación",
                content:
                  "Empieza siempre por el problema del usuario, no por la pantalla. El contexto convence antes que el pixel.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "marketing-digital",
    title: "Marketing Digital para Emprendedores",
    description: "Estrategias prácticas para hacer crecer tu negocio online.",
    longDescription: [
      "Aprenderás a construir una estrategia de marketing digital desde cero, sin depender de grandes presupuestos. El curso cubre redes sociales, email marketing y publicidad paga con ejemplos reales de negocios pequeños.",
      "Verás cómo definir tu público objetivo, crear contenido que convierte y medir resultados con métricas claras en lugar de suposiciones.",
      "El curso incluye plantillas listas para usar en tus campañas y un plan de 90 días para aplicar todo lo aprendido.",
    ],
    price: 79,
    learnPoints: [
      "Definir tu público objetivo y buyer persona",
      "Crear campañas en redes sociales que convierten",
      "Fundamentos de email marketing",
      "Publicidad paga con presupuestos pequeños",
      "Medir resultados con métricas reales",
    ],
    status: "published",
    createdAt: "2026-01-10",
    sections: [],
  },
  {
    id: "programacion-web",
    title: "Introducción a la Programación Web",
    description: "Los fundamentos de HTML, CSS y JavaScript desde cero.",
    longDescription: [
      "Un curso pensado para quienes nunca han programado. Empezarás construyendo páginas simples con HTML y CSS, y avanzarás hacia interactividad real con JavaScript.",
      "Cada lección incluye ejercicios prácticos para que escribas código desde el primer día, con explicaciones claras de por qué funciona cada línea, no solo cómo copiarla.",
      "Terminarás el curso con tu propio sitio web personal, construido completamente por ti.",
    ],
    price: 59,
    learnPoints: [
      "Estructura de páginas web con HTML",
      "Estilos y diseño responsivo con CSS",
      "Fundamentos de JavaScript e interactividad",
      "Buenas prácticas de código limpio",
      "Publicar tu primer sitio web",
    ],
    status: "published",
    createdAt: "2026-01-15",
    sections: [],
  },
  {
    id: "fotografia-redes-sociales",
    title: "Fotografía para Redes Sociales",
    description: "Técnicas de composición e iluminación con tu móvil.",
    longDescription: [
      "No necesitas una cámara profesional para tomar fotos que destaquen. Este curso te enseña a aprovechar tu móvil al máximo, dominando composición, iluminación natural y edición rápida.",
      "Aprenderás a planear sesiones de fotos para redes sociales, desde productos hasta retratos, con un flujo de trabajo simple que puedes repetir cada semana.",
      "Incluye una guía de edición paso a paso con aplicaciones gratuitas y accesibles.",
    ],
    price: 39,
    learnPoints: [
      "Composición y regla de tercios",
      "Aprovechar la luz natural",
      "Edición rápida con apps móviles",
      "Planificación de sesiones de fotos",
      "Consistencia visual en tu feed",
    ],
    status: "published",
    createdAt: "2026-01-20",
    sections: [],
  },
  {
    id: "copywriting",
    title: "Copywriting que Convierte",
    description: "Escribe textos persuasivos para vender más.",
    longDescription: [
      "El copywriting es la habilidad de escribir textos que llevan a la acción. En este curso aprenderás las estructuras y técnicas que usan las marcas más exitosas para vender con palabras.",
      "Trabajarás con ejemplos reales de páginas de venta, emails y anuncios, desglosando qué funciona y por qué, para luego aplicarlo a tu propio negocio o al de tus clientes.",
      "Saldrás con una caja de herramientas de fórmulas de copywriting que podrás reutilizar en cualquier proyecto.",
    ],
    price: 69,
    learnPoints: [
      "Fórmulas de copywriting probadas",
      "Escribir titulares que capturan atención",
      "Textos para páginas de venta",
      "Email marketing persuasivo",
      "Psicología básica de la persuasión",
    ],
    status: "draft",
    createdAt: "2026-01-25",
    sections: [],
  },
  {
    id: "edicion-video",
    title: "Edición de Vídeo para Creadores",
    description: "Edita contenido profesional con herramientas accesibles.",
    longDescription: [
      "Aprende a editar vídeo con un flujo de trabajo profesional usando herramientas accesibles y gratuitas. El curso cubre desde el corte básico hasta la corrección de color y el sonido.",
      "Verás cómo estructurar un vídeo para mantener la atención del espectador, aplicar transiciones con criterio y exportar en el formato correcto para cada plataforma.",
      "Incluye proyectos prácticos basados en contenido real para redes sociales y YouTube.",
    ],
    price: 89,
    learnPoints: [
      "Flujo de trabajo de edición profesional",
      "Corte, ritmo y estructura narrativa",
      "Corrección de color básica",
      "Mezcla y limpieza de audio",
      "Exportar para cada plataforma",
    ],
    status: "draft",
    createdAt: "2026-01-30",
    sections: [],
  },
];

export function getCourseById(id: string): Course | undefined {
  return mockCourses.find((course) => course.id === id);
}

export function getFeaturedCourses(count = 3): Course[] {
  return mockCourses.slice(0, count);
}

export const mockPurchases: Purchase[] = [
  { id: "purchase-1", userId: "profile-maria", courseId: "diseno-ux-ui", pricePaid: 49, purchasedAt: "2026-02-01" },
  { id: "purchase-2", userId: "profile-maria", courseId: "marketing-digital", pricePaid: 79, purchasedAt: "2026-02-10" },
  { id: "purchase-3", userId: "profile-carlos", courseId: "programacion-web", pricePaid: 59, purchasedAt: "2026-02-15" },
  { id: "purchase-4", userId: "profile-laura", courseId: "diseno-ux-ui", pricePaid: 49, purchasedAt: "2026-03-01" },
  { id: "purchase-5", userId: "profile-laura", courseId: "programacion-web", pricePaid: 59, purchasedAt: "2026-03-05" },
  { id: "purchase-6", userId: "profile-laura", courseId: "fotografia-redes-sociales", pricePaid: 39, purchasedAt: "2026-03-08" },
  { id: "purchase-7", userId: "profile-ana", courseId: "marketing-digital", pricePaid: 79, purchasedAt: "2026-04-10" },
  { id: "purchase-8", userId: "profile-ana", courseId: "fotografia-redes-sociales", pricePaid: 39, purchasedAt: "2026-04-12" },
];

export const mockVideoViews: VideoView[] = [
  { id: "view-1", userId: "profile-maria", lessonId: "diseno-ux-ui-s1-l1", watchedSeconds: 720, completed: true, lastWatchedAt: "2026-02-02" },
  { id: "view-2", userId: "profile-laura", lessonId: "diseno-ux-ui-s1-l1", watchedSeconds: 400, completed: false, lastWatchedAt: "2026-03-02" },
];

export type CourseStats = {
  curso: string;
  visualizaciones: number;
  rewatches: number;
  ingresos: number;
  comprasPorMes: number[];
};

const meses = ["Feb", "Mar", "Abr", "May", "Jun", "Jul"];

export const mesesEstadisticas = meses;

export const courseStats: CourseStats[] = [
  {
    curso: "Domina el Diseño UX/UI desde Cero",
    visualizaciones: 4832,
    rewatches: 312,
    ingresos: 9506,
    comprasPorMes: [18, 24, 31, 27, 35, 42],
  },
  {
    curso: "Marketing Digital para Emprendedores",
    visualizaciones: 3120,
    rewatches: 154,
    ingresos: 6162,
    comprasPorMes: [12, 15, 14, 20, 18, 21],
  },
  {
    curso: "Introducción a la Programación Web",
    visualizaciones: 6710,
    rewatches: 487,
    ingresos: 11210,
    comprasPorMes: [22, 28, 33, 41, 38, 48],
  },
  {
    curso: "Fotografía para Redes Sociales",
    visualizaciones: 1954,
    rewatches: 76,
    ingresos: 2691,
    comprasPorMes: [6, 8, 7, 10, 9, 12],
  },
];

export type UserStats = {
  nombre: string;
  email: string;
  gastado: number;
  alta: string;
};

export const userStats: UserStats[] = [
  { nombre: "María González", email: "maria.gonzalez@example.com", gastado: 249, alta: "12/01/2026" },
  { nombre: "Carlos Ruiz", email: "carlos.ruiz@example.com", gastado: 89, alta: "03/02/2026" },
  { nombre: "Laura Fernández", email: "laura.fernandez@example.com", gastado: 512, alta: "27/02/2026" },
  { nombre: "Javier Torres", email: "javier.torres@example.com", gastado: 0, alta: "15/03/2026" },
  { nombre: "Ana Martín", email: "ana.martin@example.com", gastado: 178, alta: "05/04/2026" },
];
