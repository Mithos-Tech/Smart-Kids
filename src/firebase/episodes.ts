import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './config';

export interface Episode {
  id: string;
  title: string;
  description: string;
  category: string;
  grade: string;
  section: string;
  duration: string | number;
  plays: number;
  author: string;
  audioUrl?: string;
  imageUrl?: string;
  embedUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Obtener todos los episodios
export async function getEpisodes(): Promise<Episode[]> {
  try {
    const episodesRef = collection(db, 'episodes');
    
    // Intentar ordenar por plays, si falla, traer todos sin ordenar
    let querySnapshot;
    try {
      const q = query(episodesRef, orderBy('plays', 'desc'));
      querySnapshot = await getDocs(q);
    } catch (error) {
      console.warn('No se pudo ordenar por plays, obteniendo sin orden:', error);
      querySnapshot = await getDocs(episodesRef);
    }
    
    const episodes: Episode[] = [];
    querySnapshot.forEach((doc) => {
      episodes.push({
        id: doc.id,
        ...doc.data()
      } as Episode);
    });
    
    // Ordenar manualmente por plays (descendente)
    episodes.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    
    return episodes;
  } catch (error) {
    console.error('Error obteniendo episodios:', error);
    return [];
  }
}

// Obtener episodios por categoría
export async function getEpisodesByCategory(category: string): Promise<Episode[]> {
  const allEpisodes = await getEpisodes();
  return allEpisodes.filter(ep => ep.category === category);
}

// Obtener episodios por grado
export async function getEpisodesByGrade(grade: string): Promise<Episode[]> {
  const allEpisodes = await getEpisodes();
  return allEpisodes.filter(ep => ep.grade === grade);
}