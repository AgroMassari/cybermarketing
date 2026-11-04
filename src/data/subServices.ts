import { MockupIconType } from "@/components/NeonPhoneMockup";

export interface SubServiceDef {
  id: string;
  name: string;
  platform: "instagram" | "tiktok" | "facebook" | "youtube" | "spotify";
  tagline: string;
  badge?: string;
  iconType: MockupIconType;
  serviceGroupIds: string[];
  bonusPercent?: number;
  bonusLabel?: string;
  stabilityTitle?: string;
  stabilityDesc?: string;
  accountLabel?: string;
  accountPlaceholder?: string;
  accountHelper?: string;
  showReviewCheckbox?: boolean;
  persuasion: {
    title: string;
    description: string;
    businessBenefits: string[];
    personalBenefits: string[];
    whyAds: string;
  };
}

export const SUB_SERVICES: SubServiceDef[] = [
  // ──────────────────────────── INSTAGRAM ────────────────────────────────────
  {
    id: "ig-seguidores",
    name: "Seguidores Instagram",
    platform: "instagram",
    tagline: "Perfiles estables con entrega orgánica y garantía",
    badge: "MÁS POPULAR",
    iconType: "followers",
    serviceGroupIds: ["ig-seg-latinos", "ig-seg-globales", "ig-seg-vip"],
    stabilityTitle: "MENOS CAÍDAS, MÁS ESTABILIDAD",
    stabilityDesc: "Seguidores premium y estables · Tasa de caída aproximada: 10% · Inicio: 0 a 72 hs · 30 días de reposición garantizada.",
    accountLabel: "¿Tu Instagram está listo para crecer?",
    accountPlaceholder: "@tu.cuenta.de.instagram",
    accountHelper: "Escribí tu usuario. No necesitás contraseña.",
    showReviewCheckbox: true,
    persuasion: {
      title: "¿Por qué aumentar tus seguidores es la clave para vender más?",
      description: "La respuesta es simple: tus posibles clientes miran la cantidad de seguidores que tenés para confiar o no en tu producto, marca o servicio.",
      businessBenefits: [
        "Mayor credibilidad y confianza al instante",
        "Menos dudas y objeciones al momento de comprar",
        "Te eligen a vos y no a tu competencia directa",
        "Aumento directo en la conversión de tus ventas",
        "Mejora radical de la imagen y autoridad de tu marca",
      ],
      personalBenefits: [
        "Más chances de patrocinios y canjes con marcas",
        "Más contratos, invitaciones y oportunidades comerciales",
        "Mayor reconocimiento en tu sector o nicho",
      ],
      whyAds: "Publicitar con pocos seguidores hace que la gente ni mire tu producto por desconfianza. Una cuenta sólida y con comunidad multiplica el retorno de tu inversión publicitaria.",
    },
  },
  {
    id: "ig-likes",
    name: "Likes Instagram",
    platform: "instagram",
    tagline: "Mejorá la interacción en fotos, reels y carruseles",
    badge: "ALTA INTERACCIÓN",
    iconType: "likes",
    serviceGroupIds: ["ig-likes-latinos", "ig-likes-globales"],
    stabilityTitle: "ENTREGA RÁPIDA Y RETENCIÓN REAL",
    stabilityDesc: "Likes de perfiles activos · Distribución natural · Inicio rápido en 15 a 60 min · Impulsa el alcance orgánico en la pestaña Explorar.",
    accountLabel: "Enlace de la publicación o reel",
    accountPlaceholder: "https://www.instagram.com/p/... o @usuario",
    accountHelper: "Tu cuenta debe ser pública para recibir los likes.",
    showReviewCheckbox: false,
    persuasion: {
      title: "¿Por qué los likes siguen siendo vitales para tu perfil?",
      description: "El algoritmo de Instagram prioriza los posts que reciben interacción temprana, mostrándoselos a más personas de manera orgánica.",
      businessBenefits: [
        "Dispara el alcance de tus lanzamientos y promociones",
        "Genera efecto 'bola de nieve' atrayendo likes orgánicos",
        "Transmite que tu contenido es valorado y relevante",
        "Mayor retención de potenciales clientes en tus publicaciones",
      ],
      personalBenefits: [
        "Posicionate como referente o creador influyente",
        "Mejores estadísticas para presentar en tu Media Kit",
      ],
      whyAds: "Un post patrocinado con miles de me gusta genera un 70% más de clics que uno sin interacción.",
    },
  },
  {
    id: "ig-vistas-reels",
    name: "Vistas para Reels Instagram",
    platform: "instagram",
    tagline: "Impulso algorítmico y alcance masivo para tus vídeos",
    badge: "TENDENCIA",
    iconType: "views",
    serviceGroupIds: ["ig-visualizaciones-videos"],
    stabilityTitle: "IMPULSO ALGORÍTMICO PARA REELS",
    stabilityDesc: "Alta tasa de retención · Inicio rápido · Ayuda a activar la distribución masiva del algoritmo.",
    accountLabel: "Enlace del Reel o Vídeo",
    accountPlaceholder: "https://www.instagram.com/reel/...",
    accountHelper: "Pegá el link del Reel que querés viralizar.",
    showReviewCheckbox: false,
    persuasion: {
      title: "¿Por qué viralizar tus Reels con visualizaciones?",
      description: "Los Reels son el canal #1 de descubrimiento en Instagram. Cuantas más vistas acumulan en sus primeras horas, más los recomienda el algoritmo.",
      businessBenefits: [
        "Exponé tus productos ante miles de clientes nuevos",
        "Mejora las métricas de reproducciones y tiempo visto",
        "Atrae seguidores calificados de forma orgánica",
      ],
      personalBenefits: [
        "Tus videos compiten en igualdad con los grandes creadores",
        "Aumenta la probabilidad de que tu audio sea tendencia",
      ],
      whyAds: "Los reels con alta cantidad de reproducciones generan una sensación inmediata de éxito y novedad.",
    },
  },
  {
    id: "ig-vistas-historias",
    name: "Vistas para Historias Instagram",
    platform: "instagram",
    tagline: "Llegan a todas las historias activas de tu perfil",
    iconType: "stories",
    serviceGroupIds: ["ig-vistas-historias"],
    stabilityTitle: "COBERTURA TOTAL DE HISTORIAS",
    stabilityDesc: "Se aplican a todas las historias vigentes de las últimas 24 horas · Inicio en menos de 1 hora.",
    accountLabel: "¿En qué cuenta están las historias?",
    accountPlaceholder: "@tu.cuenta.de.instagram",
    accountHelper: "Tu cuenta debe ser pública mientras dure el servicio.",
    showReviewCheckbox: false,
    persuasion: {
      title: "¿Por qué potenciar las vistas de tus Stories?",
      description: "Las historias son el canal de venta más íntimo y directo. Números altos consolidan tu autoridad de marca.",
      businessBenefits: [
        "Aumenta la percepción de comunidad activa y despierta",
        "Ideal para lanzamientos, flash sales y anuncios de 24hs",
      ],
      personalBenefits: [
        "Demuestra engagement diario para marcas e invitaciones",
      ],
      whyAds: "Tus leads confiarán mucho más si ven que tu comunidad consume activamente tu día a día.",
    },
  },
  {
    id: "ig-mix-acciones",
    name: "Mix de Acciones Instagram",
    platform: "instagram",
    tagline: "Reposts + Compartidos + Guardados para el algoritmo",
    badge: "FÓRMULA VIRAL",
    iconType: "repost",
    serviceGroupIds: ["ig-mix-acciones"],
    stabilityTitle: "EL TRÍO PERFECTO QUE PREMIA EL ALGORITMO",
    stabilityDesc: "Combina guardados, compartidos por DM y reposts para simular un interés orgánico masivo.",
    accountLabel: "Enlace del post o reel",
    accountPlaceholder: "https://www.instagram.com/p/...",
    accountHelper: "El post debe ser público.",
    showReviewCheckbox: false,
    persuasion: {
      title: "¿Por qué el algoritmo ama los guardados y compartidos?",
      description: "Instagram premia el contenido que la gente 'guarda para ver después' y 'comparte con amigos'. Es la señal #1 de valor.",
      businessBenefits: [
        "Multiplica la probabilidad de entrar en la pestaña Explorar",
        "Construye métricas de guardado ultra profesionales",
      ],
      personalBenefits: [
        "Excelente para destacar infografías, recetas o carruseles educativos",
      ],
      whyAds: "Los posts guardados y compartidos tienen un ciclo de vida mucho más largo en el feed.",
    },
  },
  {
    id: "ig-comentarios",
    name: "Comentarios Instagram",
    platform: "instagram",
    tagline: "Comentarios positivos para validar publicaciones",
    iconType: "comments",
    serviceGroupIds: ["ig-comentarios"],
    stabilityTitle: "PRUEBA SOCIAL Y CONVERSACIÓN",
    stabilityDesc: "Comentarios positivos y relevantes · Entrega progresiva y permanente.",
    accountLabel: "Enlace del post o reel",
    accountPlaceholder: "https://www.instagram.com/p/...",
    accountHelper: "Podés coordinar textos específicos si lo preferís.",
    showReviewCheckbox: false,
    persuasion: {
      title: "La prueba social que cierra ventas en los comentarios",
      description: "Cuando un cliente entra a un post y ve comentarios elogiando el producto o preguntando cómo comprar, su confianza se dispara.",
      businessBenefits: [
        "Elimina las dudas de potenciales compradores",
        "Genera un clima de alta demanda y entusiasmo",
      ],
      personalBenefits: [
        "Aumenta la interacción visible de tu perfil",
      ],
      whyAds: "La sección de comentarios activa es el mayor catalizador de compras impulsivas.",
    },
  },
  {
    id: "ig-compartidas",
    name: "Compartidos por DM Instagram",
    platform: "instagram",
    tagline: "Envíos directos entre usuarios para elevar el engagement",
    iconType: "shares",
    serviceGroupIds: ["ig-compartidas"],
    stabilityTitle: "SEÑAL DE VIRALIDAD DIRECTA",
    stabilityDesc: "Compartidas por mensaje directo que activan la métrica de 'shares' en tus estadísticas.",
    accountLabel: "Enlace del post o reel",
    accountPlaceholder: "https://www.instagram.com/reel/...",
    accountHelper: "Perfil público durante la entrega.",
    showReviewCheckbox: false,
    persuasion: {
      title: "¿Por qué las compartidas son la métrica reina?",
      description: "El nuevo algoritmo de Instagram posiciona los videos principalmente por la cantidad de veces que son compartidos.",
      businessBenefits: [
        "Máxima ponderación algorítmica para Reels",
        "Dispara el alcance más allá de tus seguidores actuales",
      ],
      personalBenefits: [
        "Tu contenido llega a un público más amplio y variado",
      ],
      whyAds: "Los contenidos compartidos gozan de credibilidad transferida de usuario a usuario.",
    },
  },

  // ──────────────────────────── TIKTOK ───────────────────────────────────────
  {
    id: "tt-seguidores",
    name: "Seguidores TikTok",
    platform: "tiktok",
    tagline: "Desbloqueá funciones de LIVE y monetización",
    badge: "MÁS VENDIDO TIKTOK",
    iconType: "followers",
    serviceGroupIds: ["tt-seguidores"],
    stabilityTitle: "CRECIMIENTO REAL EN TIKTOK",
    stabilityDesc: "Crecimiento progresivo y seguro · Sin contraseña · Apto para desbloquear transmisiones LIVE y enlaces en biografía.",
    accountLabel: "¿Cuál es tu usuario de TikTok?",
    accountPlaceholder: "@tu_usuario_de_tiktok",
    accountHelper: "Ingresá tu usuario sin contraseña. Perfil público.",
    showReviewCheckbox: false,
    persuasion: {
      title: "¿Por qué necesitás seguidores en TikTok para crecer?",
      description: "TikTok exige 1.000 seguidores para hacer transmisiones LIVE y poner enlaces en tu bio. Es la puerta de entrada a tu negocio.",
      businessBenefits: [
        "Desbloquea el link en tu biografía para llevar tráfico a tu tienda o WhatsApp",
        "Habilita TikTok LIVE para vender productos en directo",
        "Genera confianza inmediata en los usuarios que descubren tus videos",
      ],
      personalBenefits: [
        "Elegibilidad para el fondo de creadores y regalos en directos",
        "Presencia consolidada frente a marcas patrocinadoras",
      ],
      whyAds: "Los perfiles de TikTok con más de 10k seguidores convierten el tráfico hasta 3 veces mejor.",
    },
  },
  {
    id: "tt-likes",
    name: "Likes TikTok",
    platform: "tiktok",
    tagline: "Interacción instantánea para tus videos",
    iconType: "likes",
    serviceGroupIds: ["tt-likes"],
    stabilityTitle: "IMPULSO A LA PESTAÑA 'PARA TI'",
    stabilityDesc: "Likes de perfiles activos · Se pueden dividir en varios videos si lo coordinás.",
    accountLabel: "Enlace del vídeo de TikTok",
    accountPlaceholder: "https://www.tiktok.com/@usuario/video/...",
    accountHelper: "Tu cuenta debe ser pública.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Activá el algoritmo 'Para Ti' con Likes",
      description: "TikTok mide la velocidad a la que un video recibe likes en sus primeros minutos para decidir si viralizarlo masivamente.",
      businessBenefits: [
        "Aumenta la retención y validación social de tus videos promocionales",
        "Mayor exposición de tus productos y servicios",
      ],
      personalBenefits: [
        "Multiplica las chances de que tu video sea recomendado en For You",
      ],
      whyAds: "Un video con miles de me gusta retiene a los usuarios hasta 4 veces más tiempo.",
    },
  },
  {
    id: "tt-visualizaciones",
    name: "Visualizaciones TikTok",
    platform: "tiktok",
    tagline: "Reproducciones a gran escala para catapultar tus videos",
    iconType: "views",
    serviceGroupIds: ["tt-visualizaciones"],
    stabilityTitle: "ALTO VOLUMEN DE REPRODUCCIONES",
    stabilityDesc: "Entrega progresiva y natural · Ideal para paquetes de alta escala.",
    accountLabel: "Enlace del vídeo de TikTok",
    accountPlaceholder: "https://www.tiktok.com/@usuario/video/...",
    accountHelper: "Perfil público.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Visualizaciones para lograr impacto masivo",
      description: "Los videos con cientos de miles de reproducciones se perciben instantáneamente como virales.",
      businessBenefits: [
        "Brinda imagen de éxito masivo a tus campañas",
        "Empuja tus publicaciones a audiencias globales",
      ],
      personalBenefits: [
        "Estadísticas impresionantes para tu perfil de creador",
      ],
      whyAds: "Los usuarios prestan más atención a videos que ya tienen alto volumen de reproducciones.",
    },
  },

  // ──────────────────────────── FACEBOOK ─────────────────────────────────────
  {
    id: "fb-seguidores",
    name: "Seguidores Facebook",
    platform: "facebook",
    tagline: "Hacé crecer tu Fanpage o perfil profesional",
    badge: "MÁS VENDIDO",
    iconType: "followers",
    serviceGroupIds: ["fb-seguidores"],
    stabilityTitle: "PERFILES ESTABLES PARA FANPAGE",
    stabilityDesc: "Crecimiento seguro para páginas de empresa y perfiles profesionales · Sin contraseña.",
    accountLabel: "Enlace de tu Página o Perfil de Facebook",
    accountPlaceholder: "https://www.facebook.com/tupagina",
    accountHelper: "Página pública accesible para todos.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Autoridad comercial para tu página de Facebook",
      description: "Facebook sigue siendo el canal de mayor poder adquisitivo en adultos y familias. Una página con miles de seguidores inspira solidez institucional.",
      businessBenefits: [
        "Genera confianza inmediata en clientes que buscan comprar por Marketplace o anuncios",
        "Aumenta la tasa de cierre de mensajes por Messenger y WhatsApp",
      ],
      personalBenefits: [
        "Perfil público consolidado con presencia institucional",
      ],
      whyAds: "Los anuncios de Facebook Ads tienen menor costo por clic cuando la página emisora cuenta con miles de seguidores.",
    },
  },
  {
    id: "fb-likes",
    name: "Likes / Reacciones Facebook",
    platform: "facebook",
    tagline: "Reacciones variadas para publicaciones y fotos",
    iconType: "likes",
    serviceGroupIds: ["fb-likes-post"],
    stabilityTitle: "INTERACCIÓN DINÁMICA",
    stabilityDesc: "Se pueden dividir entre varias publicaciones (mínimo 100 por post) · Entrega rápida.",
    accountLabel: "Enlace de la publicación de Facebook",
    accountPlaceholder: "https://www.facebook.com/.../posts/...",
    accountHelper: "La publicación debe tener privacidad pública.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Impulsá tus publicaciones en Facebook",
      description: "Los posts con reacciones activas fomentan que más personas comenten y consulten por tus productos.",
      businessBenefits: [
        "Multiplica la interacción en ofertas y publicaciones comerciales",
      ],
      personalBenefits: [
        "Mayor alcance y dinamismo en tus fotos y noticias",
      ],
      whyAds: "La prueba social en anuncios de Facebook es el factor clave para bajar tu costo por venta.",
    },
  },

  // ──────────────────────────── YOUTUBE ──────────────────────────────────────
  {
    id: "yt-suscriptores",
    name: "Suscriptores YouTube",
    platform: "youtube",
    tagline: "Llegá a los 1.000 suscriptores y monetizá tu canal",
    badge: "MONETIZACIÓN",
    iconType: "followers",
    serviceGroupIds: ["yt-subscriptores", "yt-suscriptores-canales"],
    stabilityTitle: "CRECIMIENTO REAL PARA TU CANAL",
    stabilityDesc: "Entrega gradual y progresiva · Seguro para el canal · Sin contraseña.",
    accountLabel: "Enlace de tu Canal de YouTube",
    accountPlaceholder: "https://www.youtube.com/@tucanal",
    accountHelper: "Pegá el link del canal.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Alcanzá la meta de monetización de YouTube",
      description: "YouTube exige 1.000 suscriptores para activar el Programa de Socios (monetización con anuncios). Acelerá tu camino.",
      businessBenefits: [
        "Canal corporativo con presencia sólida y profesional",
        "Mayor credibilidad para tutoriales, webinars y presentaciones",
      ],
      personalBenefits: [
        "Desbloquea pestaña de Comunidad, membresías y monetización",
      ],
      whyAds: "Los espectadores se suscriben con mucha más facilidad a canales que ya superan el millar de miembros.",
    },
  },
  {
    id: "yt-likes",
    name: "Likes YouTube",
    platform: "youtube",
    tagline: "Me Gusta para videos convencionales y YouTube Shorts",
    iconType: "likes",
    serviceGroupIds: ["yt-likes-megusta", "yt-likes-videos-shorts"],
    stabilityTitle: "IMPULSO ALGORÍTMICO EN YOUTUBE",
    stabilityDesc: "Aumenta la tasa de Me Gusta vs visualizaciones · Se pueden dividir en varios videos.",
    accountLabel: "Enlace del Vídeo o Short",
    accountPlaceholder: "https://www.youtube.com/watch?v=...",
    accountHelper: "El video debe ser público o no listado.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Posicioná tus videos en el buscador de YouTube",
      description: "El ratio de Me Gusta es una de las métricas que YouTube evalúa para sugerir tus videos en la columna derecha.",
      businessBenefits: [
        "Mayor visibilidad para videos de ventas y casos de éxito",
      ],
      personalBenefits: [
        "Validación inmediata de tu contenido por parte de la comunidad",
      ],
      whyAds: "Un video con buena cantidad de me gusta retiene la atención durante los primeros segundos clave.",
    },
  },
  {
    id: "yt-visitas",
    name: "Visitas YouTube",
    platform: "youtube",
    tagline: "Alta retención de visualización mundial o argentina",
    iconType: "views",
    serviceGroupIds: ["yt-visitas-mundiales", "yt-visitas-argentinas"],
    stabilityTitle: "ALTO TIEMPO DE RETENCIÓN",
    stabilityDesc: "Visitas con retención prolongada · Entrega progresiva y natural · Opciones Mundiales y Argentinas.",
    accountLabel: "Enlace del Vídeo de YouTube",
    accountPlaceholder: "https://www.youtube.com/watch?v=...",
    accountHelper: "Enlace directo del video a potenciar.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Multiplica las horas de reproducción de tu canal",
      description: "Las visualizaciones con buen tiempo de retención ayudan a cumplir las 4.000 horas requeridas por YouTube.",
      businessBenefits: [
        "Presentación de alta jerarquía para videos corporativos y musicales",
      ],
      personalBenefits: [
        "Impulso en las recomendaciones del algoritmo de YouTube",
      ],
      whyAds: "Los nuevos usuarios se quedan a ver videos que ya cuentan con miles de visitas.",
    },
  },
  {
    id: "yt-comentarios",
    name: "Comentarios YouTube",
    platform: "youtube",
    tagline: "Comentarios personalizables y positivos para tus videos",
    iconType: "comments",
    serviceGroupIds: ["yt-comentarios"],
    stabilityTitle: "DEBATE Y ENGAGEMENT ACTIVO",
    stabilityDesc: "Comentarios positivos que aumentan el engagement rate de tus videos.",
    accountLabel: "Enlace del Vídeo de YouTube",
    accountPlaceholder: "https://www.youtube.com/watch?v=...",
    accountHelper: "Video público.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Generá conversación genuina en tu canal",
      description: "Un video con comentarios genera debate, preguntas y retiene a la audiencia en la plataforma.",
      businessBenefits: ["Respaldo y opiniones favorables sobre tu producto o servicio"],
      personalBenefits: ["Mayor calidez y cercanía en tu comunidad de YouTube"],
      whyAds: "La interacción en comentarios es un fuerte indicador de calidad para el algoritmo.",
    },
  },
  {
    id: "yt-espectadores",
    name: "Espectadores en Vivo YouTube",
    platform: "youtube",
    tagline: "Audiencia en tiempo real para transmisiones en vivo",
    iconType: "stream",
    serviceGroupIds: ["yt-espectadores"],
    stabilityTitle: "AUDIENCIA EN VIVO GARANTIZADA",
    stabilityDesc: "Entrega inmediata al iniciar la transmisión · Mantiene la concurrencia durante toda la hora.",
    accountLabel: "Enlace de la transmisión en directo",
    accountPlaceholder: "https://www.youtube.com/watch?v=... (Stream)",
    accountHelper: "Inicia la transmisión o programala antes de solicitar.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Tus transmisiones en vivo con audiencia sólida",
      description: "Nadie se queda en un stream con 3 personas. Una concurrencia de cientos de personas atrae automáticamente a más espectadores orgánicos.",
      businessBenefits: ["Lanzamientos de productos y webinars con sensación de auditorio lleno"],
      personalBenefits: ["Posicionamiento en la categoría de transmisiones en directo"],
      whyAds: "El efecto manada hace que la gente permanezca en los directos más concurridos.",
    },
  },

  // ──────────────────────────── SPOTIFY ──────────────────────────────────────
  {
    id: "sp-reproducciones",
    name: "Reproducciones Spotify",
    platform: "spotify",
    tagline: "Streams para canciones individuales o álbumes completos",
    badge: "MÚSICOS & ARTISTAS",
    iconType: "music",
    serviceGroupIds: ["sp-reproducciones-mundiales", "sp-reproducciones-argentinas"],
    stabilityTitle: "ENTREGA NATURAL Y SEGURA",
    stabilityDesc: "Streams progresivos (100 a 1.000 por día según paquete) · Avances visibles en 48hs en Spotify for Artists.",
    accountLabel: "Enlace de la canción o álbum en Spotify",
    accountPlaceholder: "https://open.spotify.com/track/...",
    accountHelper: "Enlace de la canción, álbum o playlist.",
    showReviewCheckbox: false,
    persuasion: {
      title: "Posicioná tu música en el radar de Spotify",
      description: "Las reproducciones constantes activan el algoritmo de Radio y playlists editoriales como Descubrimiento Semanal.",
      businessBenefits: ["Lanzamientos musicales con impacto profesional y presencia sólida"],
      personalBenefits: ["Crecimiento de oyentes mensuales para tu perfil de artista"],
      whyAds: "Las disqueras y organizadores de shows se fijan primero en los oyentes y reproducciones.",
    },
  },
];

