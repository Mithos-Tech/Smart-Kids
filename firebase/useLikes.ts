import { useState, useCallback } from 'react';
import { updateEpisodeLikes } from './likesService';

/**
 * Custom hook para manejar likes de episodios
 * Uso: const { likes, toggleLike, isLiking } = useLikes(episodes);
 */

interface LikesState {
  [episodeId: string]: number;
}

interface UseLikesReturn {
  likes: LikesState;
  toggleLike: (episodeId: string, currentLikes: number) => Promise<void>;
  isLiking: boolean;
}

export const useLikes = (initialEpisodes: any[]): UseLikesReturn => {
  // Estado local de likes (sincronizado con Firebase)
  const [likes, setLikes] = useState<LikesState>(() => {
    const initialLikes: LikesState = {};
    initialEpisodes.forEach(ep => {
      initialLikes[ep.id] = ep.likes || 0;
    });
    return initialLikes;
  });

  const [isLiking, setIsLiking] = useState(false);

  /**
   * Toggle like - Optimistic UI Update
   */
  const toggleLike = useCallback(async (episodeId: string, currentLikes: number) => {
    setIsLiking(true);

    // 1. Actualización optimista (UI instantánea)
    const newLikesCount = currentLikes + 1;
    setLikes(prev => ({
      ...prev,
      [episodeId]: newLikesCount
    }));

    try {
      // 2. Actualizar en Firebase
      const result = await updateEpisodeLikes(episodeId, 1);

      if (result.success && result.newLikesCount !== undefined) {
        // 3. Sincronizar con el valor real de Firebase
        setLikes(prev => ({
          ...prev,
          [episodeId]: result.newLikesCount!
        }));
      } else {
        // 4. Revertir si falla
        console.error('Error al dar like, revirtiendo...');
        setLikes(prev => ({
          ...prev,
          [episodeId]: currentLikes
        }));
      }
    } catch (error) {
      console.error('Error en toggleLike:', error);
      // Revertir cambio
      setLikes(prev => ({
        ...prev,
        [episodeId]: currentLikes
      }));
    } finally {
      setIsLiking(false);
    }
  }, []);

  return { likes, toggleLike, isLiking };
};
