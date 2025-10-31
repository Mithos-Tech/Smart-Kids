import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
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
  featured?: boolean; // Para destacar en homepage
  status?: 'draft' | 'published'; // Estado del episodio
  createdAt?: any;
  updatedAt?: any;
}

// Tipo para crear episodio (sin id)
export type CreateEpisodeData = Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para actualizar episodio (campos opcionales)
export type UpdateEpisodeData = Partial<CreateEpisodeData>;

// ============================================================================
// OBTENER EPISODIOS
// ============================================================================

// Obtener todos los episodios
export async function getEpisodes(): Promise<Episode[]> {
  try {
    const episodesRef = collection(db, 'episodes');
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

// Obtener un episodio por ID
export async function getEpisodeById(id: string): Promise<Episode | null> {
  try {
    const episodeRef = doc(db, 'episodes', id);
    const episodeSnap = await getDoc(episodeRef);
    
    if (episodeSnap.exists()) {
      return {
        id: episodeSnap.id,
        ...episodeSnap.data()
      } as Episode;
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo episodio:', error);
    return null;
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

// Obtener episodios destacados (para homepage)
export async function getFeaturedEpisodes(): Promise<Episode[]> {
  const allEpisodes = await getEpisodes();
  return allEpisodes.filter(ep => ep.featured === true && ep.status === 'published');
}

// ============================================================================
// CREAR EPISODIO
// ============================================================================

export async function createEpisode(episodeData: CreateEpisodeData): Promise<string> {
  try {
    const episodesRef = collection(db, 'episodes');
    
    // Datos con timestamps
    const newEpisode = {
      ...episodeData,
      plays: episodeData.plays || 0,
      status: episodeData.status || 'draft',
      featured: episodeData.featured || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(episodesRef, newEpisode);
    console.log('Episodio creado con ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creando episodio:', error);
    throw new Error('No se pudo crear el episodio');
  }
}

// ============================================================================
// ACTUALIZAR EPISODIO
// ============================================================================

export async function updateEpisode(
  id: string, 
  updateData: UpdateEpisodeData
): Promise<void> {
  try {
    const episodeRef = doc(db, 'episodes', id);
    
    // Verificar que el episodio existe
    const episodeSnap = await getDoc(episodeRef);
    if (!episodeSnap.exists()) {
      throw new Error('El episodio no existe');
    }
    
    // Actualizar con timestamp
    await updateDoc(episodeRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    console.log('Episodio actualizado:', id);
  } catch (error) {
    console.error('Error actualizando episodio:', error);
    throw new Error('No se pudo actualizar el episodio');
  }
}

// ============================================================================
// ELIMINAR EPISODIO
// ============================================================================

export async function deleteEpisode(id: string): Promise<void> {
  try {
    const episodeRef = doc(db, 'episodes', id);
    
    // Verificar que el episodio existe
    const episodeSnap = await getDoc(episodeRef);
    if (!episodeSnap.exists()) {
      throw new Error('El episodio no existe');
    }
    
    await deleteDoc(episodeRef);
    console.log('Episodio eliminado:', id);
  } catch (error) {
    console.error('Error eliminando episodio:', error);
    throw new Error('No se pudo eliminar el episodio');
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

// Validar URL de Spotify
export function validateSpotifyUrl(url: string): boolean {
  const spotifyRegex = /^https:\/\/(open\.)?spotify\.com\/(embed\/)?episode\/[a-zA-Z0-9]+/;
  return spotifyRegex.test(url);
}

// Extraer ID de embed de Spotify
export function extractSpotifyEmbedId(url: string): string | null {
  const regex = /spotify\.com\/(embed\/)?episode\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[2] : null;
}

// Convertir URL normal a URL de embed
export function convertToSpotifyEmbedUrl(url: string): string {
  const embedId = extractSpotifyEmbedId(url);
  if (!embedId) {
    throw new Error('URL de Spotify inválida');
  }
  return `https://open.spotify.com/embed/episode/${embedId}`;
}

// Incrementar reproducciones
export async function incrementPlays(id: string): Promise<void> {
  try {
    const episodeRef = doc(db, 'episodes', id);
    const episodeSnap = await getDoc(episodeRef);
    
    if (episodeSnap.exists()) {
      const currentPlays = episodeSnap.data().plays || 0;
      await updateDoc(episodeRef, {
        plays: currentPlays + 1,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error incrementando reproducciones:', error);
  }
}