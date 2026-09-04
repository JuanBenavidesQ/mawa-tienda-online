// Contenido estático de la tienda (textos de marketing, FAQ, datos del lugar).
// Fuente: mawa.com.co, visitantes.mawa.com.co/planes y portal de agentes.

export const LUGAR = {
  nombre: 'Mawá',
  eslogan: 'En el corazón de la montaña',
  direccionCorta: 'Km 37,5 vía Ipiales – Pasto',
  direccionLarga: 'Km 37,5 vía Panamericana, entre Ipiales y Pasto (Iles, Nariño). A unos 40 minutos de ambas ciudades; desde la vía principal son 800 metros.',
  horario: 'Sábados, domingos y festivos de 9:00 a. m. a 5:00 p. m.',
  instagram: 'https://www.instagram.com/mawacampestre/',
  instagramUsuario: '@mawacampestre',
  facebook: 'https://www.facebook.com/mawacampestre',
  sitio: 'https://www.mawa.com.co',
  empresa: 'MAXIMIZA S.A.S.',
  nit: '900.490.382-4',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Maw%C3%A1+Centro+Campestre+Iles+Nari%C3%B1o',
}

// Qué incluye cada plan si el catálogo (Supabase) no trae `incluye_tienda`.
// Se controla desde el admin (tab Planes); esto es solo el respaldo.
export const INCLUYE_FALLBACK: Record<string, string[]> = {
  PACIFICO_PISCINA: ['Bebida de bienvenida', 'Piscinas y toboganes', 'Almuerzo a elección del menú', 'Bebida y postre'],
  MONTANA: ['Bebida de bienvenida', 'Puentes tibetanos', 'Almuerzo a elección del menú', 'Bebida y postre'],
  TRAVESIA: ['Bebida de bienvenida', 'Piscinas y toboganes', 'Puentes tibetanos', 'Almuerzo a elección del menú', 'Bebida y postre'],
  INFANTIL: ['Piscinas y toboganes', 'Menú infantil con bebida', 'Helado'],
  ALOJAMIENTO_ADULTO: ['Bebida de bienvenida', 'Habitación en acomodación doble', 'Desayuno', 'Piscinas y toboganes', 'Puentes tibetanos'],
  ALOJAMIENTO_NINO: ['Bebida de bienvenida', 'Habitación en acomodación doble', 'Desayuno', 'Piscinas y toboganes', 'Puentes tibetanos'],
}

// Frase corta por plan para la tarjeta (respaldo si no hay descripción).
export const RESUMEN_FALLBACK: Record<string, string> = {
  PACIFICO_PISCINA: 'Un día de piscina, toboganes y buena comida.',
  MONTANA: 'Cruza la montaña por los puentes colgantes.',
  TRAVESIA: 'La experiencia completa: piscina + puentes.',
  INFANTIL: 'Para niños hasta 12 años.',
}

export type Experiencia = {
  titulo: string
  texto: string
  foto: string // ruta en /public/fotos (sin sufijo de ancho)
  alt: string
}

export const EXPERIENCIAS: Experiencia[] = [
  {
    titulo: 'Piscinas y toboganes',
    texto: 'Piscina de adultos, piscina infantil y toboganes con vista a la montaña. Sillas, sombra y zonas verdes para pasar todo el día.',
    foto: 'piscina-persona',
    alt: 'Persona disfrutando la piscina de Mawá con las cabañas de fondo',
  },
  {
    titulo: 'Puentes tibetanos',
    texto: 'Puentes colgantes que cruzan la montaña de lado a lado, con arnés y acompañamiento de nuestro personal. Adrenalina con la mejor vista.',
    foto: 'puentes-persona',
    alt: 'Persona cruzando un puente tibetano en Mawá',
  },
  {
    titulo: 'Restaurante',
    texto: 'Almuerzo a elección del menú incluido en los planes: parrilla, comida típica nariñense y platos de la casa, con bebida y postre.',
    foto: 'restaurante-bandeja',
    alt: 'Bandeja de comida típica del restaurante de Mawá',
  },
  {
    titulo: 'Naturaleza y animales',
    texto: 'Llamas, senderos, hamacas y rincones para desconectarse. Un centro campestre en medio de la montaña nariñense.',
    foto: 'animales-llamas',
    alt: 'Visitante con las llamas de Mawá',
  },
]

export const PASOS = [
  {
    titulo: 'Elige tu plan y la fecha',
    texto: 'Escoge cuántas entradas quieres y el día que planeas venir. Con la compra online tienes descuento sobre el precio en taquilla.',
  },
  {
    titulo: 'Paga en línea con Bold',
    texto: 'Tarjeta de crédito o débito, PSE, Nequi o Daviplata. Pago seguro procesado por Bold, sin registrarte en ningún lado.',
  },
  {
    titulo: 'Recibe tu código y ven a Mawá',
    texto: 'Te enviamos el código por WhatsApp al instante. Preséntalo en la entrada, recibes tu manilla y a disfrutar.',
  },
]

export type Faq = { pregunta: string; respuesta: string }

export const FAQS: Faq[] = [
  {
    pregunta: '¿Qué días abren y en qué horario?',
    respuesta: 'Abrimos sábados, domingos y festivos de 9:00 a. m. a 5:00 p. m. Entre semana atendemos solo eventos y grupos con reserva previa.',
  },
  {
    pregunta: '¿Cómo llego a Mawá?',
    respuesta: 'Estamos en el Km 37,5 de la vía Panamericana entre Ipiales y Pasto, en el municipio de Iles (Nariño), a unos 40 minutos de ambas ciudades. Desde la vía principal son 800 metros hasta la entrada. Hay parqueadero.',
  },
  {
    pregunta: '¿Hasta cuándo puedo usar mi código?',
    respuesta: 'Tu código es válido durante 30 días a partir de la fecha de visita que elijas, cualquier sábado, domingo o festivo. Si no puedes venir el día planeado, lo usas otro día dentro de ese plazo sin trámites.',
  },
  {
    pregunta: '¿Cómo recibo la entrada después de pagar?',
    respuesta: 'Al confirmarse el pago te mostramos el código en pantalla y te lo enviamos por WhatsApp al celular que registraste. En la entrada lo presentas y recibes tu manilla de acceso.',
  },
  {
    pregunta: '¿Qué incluye el almuerzo?',
    respuesta: 'En los planes Pacífico, Montaña y Travesía eliges cualquier plato del menú sin costo adicional, con bebida y postre. Los sábados está disponible la sección de parrilla; los domingos y festivos, la carta completa.',
  },
  {
    pregunta: '¿Los niños pueden subir a los puentes tibetanos?',
    respuesta: 'Los puentes son para mayores de 12 años (puede variar según el ajuste del arnés) y los menores necesitan autorización de un adulto responsable. Los niños hasta 12 años tienen el Plan Infantil con piscina, menú infantil y helado.',
  },
  {
    pregunta: '¿Puedo llevar comida o mascotas?',
    respuesta: 'No se permite el ingreso de alimentos ni bebidas externas; el almuerzo ya viene incluido en tu plan. Las mascotas son bienvenidas, siempre con correa.',
  },
  {
    pregunta: 'Somos un grupo grande, ¿hay descuento?',
    respuesta: 'Sí, desde 30 personas tenemos tarifas especiales y atención personalizada. Escríbenos por WhatsApp y te armamos la cotización.',
  },
  {
    pregunta: '¿Qué métodos de pago aceptan en línea?',
    respuesta: 'Tarjetas de crédito y débito, PSE, Nequi y Daviplata a través de Bold, la pasarela de pagos. En taquilla también recibimos efectivo y transferencia, pero sin el descuento online.',
  },
]

export const GALERIA = [
  { foto: 'aerea-hotel', alt: 'Vista aérea de Mawá entre la montaña' },
  { foto: 'puentes-aereo', alt: 'Puente tibetano visto desde arriba' },
  { foto: 'restaurante-camarones', alt: 'Camarones apanados con patacón' },
  { foto: 'actividades-bici', alt: 'Ciclismo de montaña cerca de Mawá' },
  { foto: 'panoramica-montana', alt: 'Panorámica de Mawá y las montañas' },
  { foto: 'restaurante-arepa', alt: 'Plato típico del restaurante' },
]
