import { Episode, Professor, Testimonial } from './types';

export const EPISODES: Episode[] = [
  {
    id: 1,
    title: "El Sistema Solar y sus misterios",
    description: "Acompaña a Sofía en un viaje intergaláctico para descubrir los secretos de los planetas, estrellas y galaxias. ¿Sabías que en Júpiter hay una tormenta que dura siglos?",
    podcaster: { name: "Sofía Rodríguez", grade: "4° Grado" },
    category: "Ciencia",
    duration: 12,
    plays: 1250,
    date: "24/05/2024",
    thumbnail: "https://picsum.photos/seed/ep1/400/400",
    color: "#4a439b",
  },
  {
    id: 2,
    title: "La Leyenda del Dorado",
    description: "Mateo nos cuenta la fascinante leyenda de la ciudad de oro perdida en la selva amazónica. ¿Fue real? ¿Qué tesoros escondía? ¡Descúbrelo en este episodio!",
    podcaster: { name: "Mateo Vargas", grade: "5° Grado" },
    category: "Historia",
    duration: 15,
    plays: 2300,
    date: "22/05/2024",
    thumbnail: "https://picsum.photos/seed/ep2/400/400",
    color: "#b8860b",
  },
  {
    id: 3,
    title: "Los colores de Frida Kahlo",
    description: "Valentina explora la vida y obra de la icónica pintora mexicana Frida Kahlo. Un episodio lleno de arte, pasión y resiliencia que te inspirará a crear.",
    podcaster: { name: "Valentina Gómez", grade: "6° Grado" },
    category: "Arte",
    duration: 18,
    plays: 980,
    date: "20/05/2024",
    thumbnail: "https://picsum.photos/seed/ep3/400/400",
    color: "#c71585",
  },
  {
    id: 4,
    title: "El Zorro y el Cóndor",
    description: "Escucha este cuento tradicional andino narrado por Lucas, sobre la astucia del zorro y la majestuosidad del cóndor. Una lección sobre la humildad y la amistad.",
    podcaster: { name: "Lucas Quispe", grade: "4° Grado" },
    category: "Cuentos",
    duration: 10,
    plays: 3105,
    date: "18/05/2024",
    thumbnail: "https://picsum.photos/seed/ep4/400/400",
    color: "#8b4513",
  },
  {
    id: 5,
    title: "Instrumentos del Perú",
    description: "Un recorrido sonoro por el Perú junto a Camila, quien nos presenta el cajón, la quena y el charango. ¡Prepárate para mover los pies al ritmo de nuestra música!",
    podcaster: { name: "Camila Flores", grade: "5° Grado" },
    category: "Música",
    duration: 14,
    plays: 850,
    date: "15/05/2024",
    thumbnail: "https://picsum.photos/seed/ep5/400/400",
    color: "#ff4500",
  },
  {
    id: 6,
    title: "El Oso de Anteojos",
    description: "Isabella nos lleva a los bosques de neblina para conocer al único oso de Sudamérica: el oso de anteojos. Aprende sobre su hábitat, su alimentación y por qué está en peligro.",
    podcaster: { name: "Isabella Cruz", grade: "6° Grado" },
    category: "Naturaleza",
    duration: 16,
    plays: 1500,
    date: "12/05/2024",
    thumbnail: "https://picsum.photos/seed/ep6/400/400",
    color: "#228b22",
  },
];

export const CATEGORIES = [
    { name: 'Ciencia', icon: '🔬', count: 12 },
    { name: 'Historia', icon: '📜', count: 8 },
    { name: 'Arte', icon: '🎨', count: 15 },
    { name: 'Cuentos', icon: '📚', count: 20 },
    { name: 'Música', icon: '🎵', count: 5 },
    { name: 'Naturaleza', icon: '🌳', count: 10 },
];

export const GRADES = [
    {
        name: '4° Grado',
        sections: [
            { name: 'A', count: 15 },
            { name: 'B', count: 12 },
            { name: 'C', count: 10 },
        ]
    },
    {
        name: '5° Grado',
        sections: [
            { name: 'A', count: 18 },
            { name: 'B', count: 14 },
        ]
    },
    {
        name: '6° Grado',
        sections: [
            { name: 'A', count: 16 },
            { name: 'B', count: 13 },
            { name: 'C', count: 11 },
        ]
    }
];

export const PROFESSORS: Professor[] = [
    {
        name: "Ana García",
        role: "Coordinadora General",
        quote: "La curiosidad es el motor del aprendizaje. Este proyecto enciende esa chispa en cada niño.",
        photo: "https://picsum.photos/seed/anagarcia/200/200"
    },
    {
        name: "Carlos Mendoza",
        role: "Profesor de 4° Grado",
        quote: "Ver a mis alumnos expresarse con tanta confianza es la mayor recompensa.",
        photo: "https://picsum.photos/seed/carlosmendoza/200/200"
    },
    {
        name: "Luisa Fernández",
        role: "Profesora de 5° Grado",
        quote: "El podcasting les enseña a investigar, escribir y, sobre todo, a escuchar a los demás.",
        photo: "https://picsum.photos/seed/luisafernandez/200/200"
    },
    {
        name: "Javier Torres",
        role: "Profesor de 6° Grado",
        quote: "Preparamos a los líderes del mañana, dándoles una voz hoy.",
        photo: "https://picsum.photos/seed/javiertorres/200/200"
    },
    {
        name: "Marta Díaz",
        role: "Especialista en Audio",
        quote: "La calidad del sonido es clave para que sus historias lleguen lejos y claro.",
        photo: "https://picsum.photos/seed/martadiaz/200/200"
    }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Este proyecto ha sido increíble. Aprendí a hablar en público sin miedo y descubrí que mi voz es importante. ¡Ahora quiero ser periodista!",
    name: "Sofía Rodríguez",
    role: "Podcaster de 4° Grado",
  },
  {
    quote: "Smart Kids ha transformado la manera en que nuestros hijos se comunican. Han ganado confianza, mejorado su dicción y, lo más importante, se divierten aprendiendo.",
    name: "Juan Vargas",
    role: "Padre de Familia",
  },
  {
    quote: "La plataforma es una herramienta pedagógica excepcional. Fomenta la investigación, el trabajo en equipo y la creatividad de una forma innovadora y atractiva para los niños.",
    name: "Ana García",
    role: "Coordinadora General",
  },
  {
    quote: "El micrófono se convirtió en su mejor amigo. Smart Kids le ha dado a mi hijo una plataforma para brillar y compartir su creatividad con el mundo. ¡Estamos muy orgullosos!",
    name: "Luisa Mendoza",
    role: "Madre de Familia",
  }
];
