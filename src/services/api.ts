import { getEpisodes } from '../firebase/episodes';
import { PROFESSORS, TESTIMONIALS, CATEGORIES, GRADES } from '../../constants';
import { Episode } from '../../types';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Helper function para asignar colores por categoría
function getColorByCategory(category: string): string {
  const colors: { [key: string]: string } = {
    'Ciencia': '#4a439b',
    'Historia': '#b8860b',
    'Arte': '#c71585',
    'Cuentos': '#8b4513',
    'Música': '#ff4500',
    'Naturaleza': '#228b22',
  };
  return colors[category] || '#4a439b';
}

export const api = {
  // Obtener episodios desde Firestore
  getEpisodes: async (): Promise<Episode[]> => {
    await delay(500);
    const firestoreEpisodes = await getEpisodes();
    
    // Mapear TODOS los episodios al mismo formato normalizado
    return firestoreEpisodes.map((ep: any, index: number) => ({
      id: ep.id || `ep-${index + 1}`, // Usar ID de Firestore o generar uno
      title: ep.title,
      description: ep.description,
      podcaster: {
        name: ep.author,
        grade: ep.grade
      },
      category: ep.category,
      duration: ep.duration,
      plays: ep.plays || 0,
      date: ep.createdAt 
        ? (typeof ep.createdAt === 'object' && ep.createdAt.seconds
            ? new Date(ep.createdAt.seconds * 1000).toLocaleDateString('es-PE')
            : new Date().toLocaleDateString('es-PE'))
        : new Date().toLocaleDateString('es-PE'),
      thumbnail: `https://picsum.photos/seed/ep${ep.id || index}/400/400`,
      color: getColorByCategory(ep.category),
      embedUrl: ep.embedUrl,
    }));
   },

  searchEpisodes: async (query: string): Promise<Episode[]> => {
    await delay(300);
    const episodes = await api.getEpisodes();
    if (!query || query.trim().length <= 2) {
      return Promise.resolve([]);
    }
    const lowercasedQuery = query.toLowerCase();
    const results = episodes.filter(episode =>
      episode.title.toLowerCase().includes(lowercasedQuery) ||
      episode.description.toLowerCase().includes(lowercasedQuery) ||
      episode.podcaster.name.toLowerCase().includes(lowercasedQuery) ||
      episode.category.toLowerCase().includes(lowercasedQuery)
    );
    return Promise.resolve(results);
  },

  getProfessors: async () => {
    await delay(500);
    return Promise.resolve(PROFESSORS);
  },

  getTestimonials: async () => {
    await delay(500);
    return Promise.resolve(TESTIMONIALS);
  },

  getCategories: async () => {
    await delay(500);
    return Promise.resolve(CATEGORIES);
  },

  getGrades: async () => {
    await delay(500);
    return Promise.resolve(GRADES);
  }
};

// ============================================
// FUNCIONES CRUD PARA EL ADMIN
// ============================================

// Función para el admin dashboard - usa el mismo mapeo
export const getAllEpisodes = async (): Promise<Episode[]> => {
  return await api.getEpisodes();
};

// Crear nuevo episodio en Firestore
export const createEpisode = async (episodeData: {
  title: string;
  description: string;
  author: string;
  category: string;
  grade: string;
  section?: string;
  duration: string;
  embedUrl: string;
  plays?: number;
}) => {
  try {
    // Convertir URL de Spotify a formato embed automáticamente
    let embedUrl = episodeData.embedUrl.trim();
    
    if (embedUrl.includes('open.spotify.com/episode/') && !embedUrl.includes('/embed/')) {
      const episodeId = embedUrl.split('/episode/')[1]?.split('?')[0];
      if (episodeId) {
        embedUrl = `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator`;
      }
    }
    
    const episodesRef = collection(db, 'episodes');
    const docRef = await addDoc(episodesRef, {
      title: episodeData.title,
      description: episodeData.description,
      author: episodeData.author,
      category: episodeData.category,
      grade: episodeData.grade,
      section: episodeData.section || 'A',
      duration: episodeData.duration,
      embedUrl: embedUrl,
      plays: episodeData.plays || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error al crear episodio:', error);
    return { success: false, error: 'Error al crear episodio' };
  }
};

// Actualizar episodio existente
export const updateEpisode = async (id: string, episodeData: any) => {
  try {
    // Convertir URL de Spotify a formato embed automáticamente
    let embedUrl = episodeData.embedUrl?.trim();
    
    if (embedUrl && embedUrl.includes('open.spotify.com/episode/') && !embedUrl.includes('/embed/')) {
      const episodeId = embedUrl.split('/episode/')[1]?.split('?')[0];
      if (episodeId) {
        embedUrl = `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator`;
      }
    }
    
    const episodeRef = doc(db, 'episodes', id);
    await updateDoc(episodeRef, {
      ...episodeData,
      embedUrl: embedUrl || episodeData.embedUrl,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar episodio:', error);
    return { success: false, error: 'Error al actualizar episodio' };
  }
};

// Eliminar episodio
export const deleteEpisode = async (id: string) => {
  try {
    const episodeRef = doc(db, 'episodes', id);
    await deleteDoc(episodeRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar episodio:', error);
    return { success: false, error: 'Error al eliminar episodio' };
  }
};

// Obtener episodio por ID
export const getEpisodeById = async (id: string) => {
  try {
    const episodeRef = doc(db, 'episodes', id);
    const episodeSnap = await getDoc(episodeRef);
    
    if (episodeSnap.exists()) {
      return {
        success: true,
        episode: { id: episodeSnap.id, ...episodeSnap.data() }
      };
    } else {
      return { success: false, error: 'Episodio no encontrado' };
    }
  } catch (error) {
    console.error('Error al obtener episodio:', error);
    return { success: false, error: 'Error al obtener episodio' };
  }
};