export interface Episode {
  id: number;
  title: string;
  description: string;
  podcaster: {
    name: string;
    grade: string;
  };
  category: string;
  duration: number; // in minutes
  plays: number;
  date: string;
  thumbnail: string;
  color: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Professor {
  name: string;
  role: string;
  quote: string;
  photo: string;
}