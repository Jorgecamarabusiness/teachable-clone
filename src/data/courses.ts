export type Course = {
  id: string;
  title: string;
  description: string;
  longDescription: string[];
  price: string;
  learnPoints: string[];
};

export const courses: Course[] = [
  {
    id: "diseno-ux-ui",
    title: "Domina el Diseño UX/UI desde Cero",
    description: "Aprende a diseñar interfaces claras y funcionales.",
    longDescription: [
      "Este curso te lleva paso a paso desde los principios básicos del diseño hasta la creación de interfaces completas y listas para producción. Aprenderás a investigar usuarios, construir wireframes y traducir esas ideas en pantallas reales usando herramientas profesionales.",
      "A lo largo de los módulos trabajarás con casos prácticos: una app móvil, un panel de administración y una tienda online, aplicando principios de jerarquía visual, contraste y accesibilidad en cada proyecto.",
      "Al finalizar tendrás un portafolio con proyectos reales que podrás mostrar a clientes o incluir en tu perfil profesional.",
    ],
    price: "$49",
    learnPoints: [
      "Fundamentos de investigación de usuarios",
      "Wireframing y prototipado rápido",
      "Sistemas de diseño y componentes reutilizables",
      "Principios de accesibilidad y contraste",
      "Cómo presentar tu trabajo a clientes",
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
    price: "$79",
    learnPoints: [
      "Definir tu público objetivo y buyer persona",
      "Crear campañas en redes sociales que convierten",
      "Fundamentos de email marketing",
      "Publicidad paga con presupuestos pequeños",
      "Medir resultados con métricas reales",
    ],
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
    price: "$59",
    learnPoints: [
      "Estructura de páginas web con HTML",
      "Estilos y diseño responsivo con CSS",
      "Fundamentos de JavaScript e interactividad",
      "Buenas prácticas de código limpio",
      "Publicar tu primer sitio web",
    ],
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
    price: "$39",
    learnPoints: [
      "Composición y regla de tercios",
      "Aprovechar la luz natural",
      "Edición rápida con apps móviles",
      "Planificación de sesiones de fotos",
      "Consistencia visual en tu feed",
    ],
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
    price: "$69",
    learnPoints: [
      "Fórmulas de copywriting probadas",
      "Escribir titulares que capturan atención",
      "Textos para páginas de venta",
      "Email marketing persuasivo",
      "Psicología básica de la persuasión",
    ],
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
    price: "$89",
    learnPoints: [
      "Flujo de trabajo de edición profesional",
      "Corte, ritmo y estructura narrativa",
      "Corrección de color básica",
      "Mezcla y limpieza de audio",
      "Exportar para cada plataforma",
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}
