export interface Podcaster {
    name: string;
    grade: string;
}

export interface Episode {
    id: number | string; // ← Permitir string también
    title: string;
    description: string;
    podcaster?: Podcaster; // ← Hacer opcional
    author?: string;       // ← Agregar este campo
    grade?: string;        // ← Agregar este campo
    section?: string;      // ← Agregar este campo
    category: string;
    duration: number;
    plays: number;
    date?: string;
    thumbnail?: string;
    color?: string;
    embedUrl?: string;
    audioUrl?: string;
}

export interface Professor {
    name: string;
    role: string;
    quote: string;
    photo: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    quote?: string; // Mantener por compatibilidad
    rating?: number;
    photo?: string;
    featured?: boolean;
    active?: boolean;
    order?: number;
    createdAt?: any;
    updatedAt?: any;
}
