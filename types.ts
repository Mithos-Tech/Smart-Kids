
export interface Episode {
  id: string;
  title: string;
  description: string;
  author: string;
  grade: string;
  category: 'Cuentos' | 'Ciencia' | 'Historia' | 'Entrevistas' | 'Debate';
  duration: string;
  plays: number;
  likes: number; // New field for tracking votes/popularity
  date: string;
  imageUrl: string;
  spotifyUrl: string; // New field for external link
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  area: string;
  imageUrl: string;
  quote: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  cols: number;
  rows: number;
}
