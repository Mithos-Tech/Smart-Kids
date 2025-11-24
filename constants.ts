
import { Episode, TeamMember, Testimonial, GalleryItem } from './types';

export const CATEGORIES = ['Todos', 'Cuentos', 'Ciencia', 'Historia', 'Entrevistas'];

export const EPISODES: Episode[] = [
  {
    id: '1',
    title: 'El Zorro y el Cóndor',
    description: 'Un cuento tradicional andino narrado con efectos de sonido inmersivos que nos enseña sobre la astucia y la paciencia.',
    author: 'Lucas Quispe',
    grade: '4° Grado',
    category: 'Cuentos',
    duration: '10 min',
    plays: 3100,
    likes: 842,
    date: '15 Nov 2024',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763674472/El_Zorro_y_el_C%C3%B3ndor_at7ba2.jpg',
    spotifyUrl: 'https://open.spotify.com/episode/7DB3EiW0I3bc22RJzUjDId?si=bbf3a40a72b74168',
    featured: true
  },
  {
    id: '2',
    title: '¿Por qué el cielo es azul?',
    description: 'Explicación científica sencilla sobre la dispersión de la luz solar en la atmósfera terrestre.',
    author: 'Grupo de Ciencias 5A',
    grade: '5° Grado',
    category: 'Ciencia',
    duration: '8 min',
    plays: 1200,
    likes: 450,
    date: '12 Nov 2024',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763685723/cielo_azul_eb2vsc.jpg',
    spotifyUrl: 'https://open.spotify.com/episode/55Amdc6P7gWWy7TowsqRJB?si=94a63a6dfafe4b73'
  },
  {
    id: '3',
    title: 'Héroes de la Independencia',
    description: 'Un recorrido histórico por las vidas de San Martín y Bolívar.',
    author: 'Maria y Juan',
    grade: '6° Grado',
    category: 'Historia',
    duration: '15 min',
    plays: 850,
    likes: 320,
    date: '10 Nov 2024',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763685722/heroes_glfprk.jpg',
    spotifyUrl: 'https://open.spotify.com/episode/2NvZOS0NpqkQ6BvsAArB9A?si=7e1b51246bc342fa'
  },
  {
    id: '4',
    title: 'Entrevista al Director',
    description: 'Conversamos sobre los nuevos proyectos de la escuela para el 2025.',
    author: 'Periodismo Escolar',
    grade: 'Secundaria',
    category: 'Entrevistas',
    duration: '22 min',
    plays: 2100,
    likes: 1105,
    date: '05 Nov 2024',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763685723/Entrevista_al_director_dmopbi.jpg',
    spotifyUrl: 'https://open.spotify.com/episode/5MS6IvhxkjN4aJuhKaBA9r?si=1f5c7532bfdc49dc'
  },
  {
    id: '5',
    title: 'La Liebre y la Tortuga',
    description: 'Una fábula clásica reimaginada en un contexto moderno y divertido.',
    author: 'Sofia Mendez',
    grade: '3° Grado',
    category: 'Cuentos',
    duration: '5 min',
    plays: 300,
    likes: 150,
    date: '01 Nov 2024',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763685722/La_liebre_y_la_tortuga_j8q9te.jpg',
    spotifyUrl: 'https://open.spotify.com/episode/7xzIOzyYun5KR0t10MU90W?si=932bc1670c604f3f'
  },
  {
    id: '6',
    title: 'El Ciclo del Agua',
    description: 'Viajamos con una gota de agua desde el mar hasta las nubes en este viaje sonoro.',
    author: 'Ciencia Divertida',
    grade: '4° Grado',
    category: 'Ciencia',
    duration: '7 min',
    plays: 980,
    likes: 290,
    date: '28 Oct 2024',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763685722/ciclo_del_agua_kgrr1z.jpg',
    spotifyUrl: 'https://open.spotify.com/episode/3iNSrNuF4hFBNz3jBqpHwe?si=96a29da831924f09'
  },
  {
    id: '7',
    title: 'Caperucita Roja',
    description: 'Una versión teatralizada del clásico cuento con voces de todo el salón.',
    author: 'Teatro 3B',
    grade: '3° Grado',
    category: 'Cuentos',
    duration: '12 min',
    plays: 1540,
    likes: 670,
    date: '25 Oct 2024',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763685725/Caperucita_Roja_xlmdub.jpg',
    spotifyUrl: 'https://open.spotify.com/episode/21CdJLvXvGIXpuyNIbkoNi?si=9195b4bc22184e9d'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 't1',
    name: 'Miriam Foster',
    role: 'Docente - Fundadora',
    area: 'Dirección General',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692249/Miriam_b0bzfs.jpg',
    quote: 'Todo empezó con una grabadora simple y un sueño grande: que los niños se escucharan a sí mismos.'
  },
  {
    id: 't2',
    name: 'Isabel Galvez',
    role: 'Subdirectora',
    area: 'Gestión Educativa',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692251/Isabel_eklofq.jpg',
    quote: 'Apoyar la innovación es nuestra responsabilidad. Smart Kids es el reflejo de una escuela viva.'
  },
  {
    id: 't3',
    name: 'Luis Vargas',
    role: 'Docente de AIP',
    area: 'Tecnología',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692249/Luis_gw9nnf.jpg',
    quote: 'Enseñar a editar audio es enseñar a estructurar el pensamiento. La técnica al servicio del arte.'
  },
  {
    id: 't4',
    name: 'Luisa Hernandez',
    role: 'Docente',
    area: 'Guion y Narrativa',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692250/Luisa_h68821.jpg',
    quote: 'Descubrimos talentos ocultos en niños que antes eran tímidos. El micrófono les dio superpoderes.'
  },
  {
    id: 't5',
    name: 'Mario Liberato',
    role: 'Colaborador Técnico',
    area: 'Post-Producción',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692249/Mario_ztvdcy.jpg',
    quote: 'Lograr calidad profesional con recursos escolares fue el reto más divertido de mi carrera.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'tm1',
    name: 'Miriam Foster',
    role: 'Docente - Ideadora del Proyecto',
    text: 'Ver a los estudiantes descubrir su propia voz y ganar confianza frente al micrófono ha sido la recompensa más grande de esta iniciativa.',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692249/Miriam_b0bzfs.jpg'
  },
  {
    id: 'tm2',
    name: 'Isabel Galvez',
    role: 'Subdirectora',
    text: 'Smart Kids ha transformado la manera en que nuestra escuela se comunica. Es un puente directo entre la creatividad del aula y las familias.',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692251/Isabel_eklofq.jpg'
  },
  {
    id: 'tm3',
    name: 'Luis Vargas',
    role: 'Docente de AIP',
    text: 'La tecnología cobra sentido cuando sirve para amplificar el talento. Estos podcasts son la prueba de que la innovación educativa es posible.',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692249/Luis_gw9nnf.jpg'
  },
  {
    id: 'tm4',
    name: 'Luisa Hernandez',
    role: 'Docente',
    text: 'Cada episodio es una ventana al aprendizaje. Mis alumnos ahora investigan con más pasión sabiendo que su trabajo será escuchado por todos.',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692250/Luisa_h68821.jpg'
  },
  {
    id: 'tm5',
    name: 'Mario Liberato',
    role: 'Colaborador',
    text: 'Ha sido un honor apoyar en la parte técnica. La calidad de producción que han logrado estos chicos supera todas las expectativas.',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692249/Mario_ztvdcy.jpg'
  }
];

// Timeline Events Data
export const TIMELINE_EVENTS = [
  {
    year: '2023',
    title: "Nace la Iniciativa",
    description: "Un pequeño grupo de 4 docentes visionarios lanza la idea, creyendo en el poder de la voz estudiantil. Con recursos limitados pero una pasión infinita, plantan la semilla.",
    icon: 'spark',
    phase: 'Fase 1: La Chispa'
  },
  {
    year: '2024',
    title: "Premio Estatal a la Innovación",
    description: "El esfuerzo da frutos. El proyecto gana un prestigioso premio del estado, obteniendo fondos vitales que permiten adquirir equipos de grabación profesionales y expandir el alcance del taller.",
    icon: 'award',
    phase: 'Fase 2: El Reconocimiento'
  },
  {
    year: '2024',
    title: "Smart Kids Crece",
    description: "Inspirados por el éxito, más docentes y grados se suman al proyecto. La iniciativa evoluciona de un taller aislado a un movimiento que integra a toda la comunidad escolar.",
    icon: 'users',
    phase: 'Fase 3: La Expansión'
  },
  {
    year: 'Hoy',
    title: "Nace la Plataforma Web",
    description: "Cumpliendo el sueño original, se lanza esta plataforma web Smart Kids, un hogar digital para todas las historias, asegurando que las voces de nuestros estudiantes resuenen más allá del aula.",
    icon: 'globe',
    phase: 'Fase 4: El Salto Digital'
  }
];

// Using Cloudinary specific images for high-quality B&W/Color interaction in Gallery
export const GALLERY: GalleryItem[] = [
  { id: 'g1', imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763755336/1_Primera_grabacion_ck3qoo.jpg', title: 'Primera Grabación', cols: 2, rows: 2 },
  { id: 'g2', imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763755336/2_Taller_de_Guion_qnzseg.jpg', title: 'Taller de Guion', cols: 1, rows: 1 },
  { id: 'g3', imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763755337/3_Edici%C3%B3n_en_equipo_gzuroh.jpg', title: 'Edición en Equipo', cols: 1, rows: 1 },
  { id: 'g4', imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763755336/4_Premios_2024_dpwep7.jpg', title: 'Premios 2024', cols: 1, rows: 2 },
  { id: 'g5', imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763755337/5_gallery_studio_wide_kwsv1r.jpg', title: 'El Nuevo Estudio', cols: 2, rows: 1 },
  { id: 'g6', imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763755336/6_Brainstorming_bez4jg.jpg', title: 'Brainstorming', cols: 1, rows: 1 },
  { id: 'g7', imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763755336/7_Entrevista_en_directo_vkj8dv.jpg', title: 'Entrevista en Directo', cols: 1, rows: 1 },
  { id: 'g8', imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763755336/8_Celebraci%C3%B3n_bhffkn.jpg', title: 'Celebración', cols: 1, rows: 1 },
];
