export interface Podcaster {
    name: string;
    grade: string;
}

export interface Episode {
    id: number;
    title: string;
    description: string;
    podcaster: Podcaster;
    category: string;
    duration: number;
    plays: number;
    date: string;
    thumbnail?: string;
    color: string;
    embedUrl?: string; // ← Agrega esta línea
}

export interface Professor {
    name: string;
    role: string;
    quote: string;
    photo: string;
}

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
}
