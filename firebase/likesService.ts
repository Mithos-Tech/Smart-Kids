import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from './config';

/**
 * Servicio centralizado para manejar likes en Firebase
 */

export interface LikeResult {
  success: boolean;
  newLikesCount?: number;
  error?: any;
}

/**
 * Incrementa o decrementa likes de un episodio
 * @param episodeId - ID del episodio
 * @param increment - Cantidad a incrementar (1) o decrementar (-1)
 */
export const updateEpisodeLikes = async (
  episodeId: string,
  incrementValue: number
): Promise<LikeResult> => {
  try {
    const docRef = doc(db, 'episodes', episodeId);
    
    // Verificar que el documento existe
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return { 
        success: false, 
        error: 'Episodio no encontrado' 
      };
    }

    // Actualizar likes
    await updateDoc(docRef, {
      likes: increment(incrementValue)
    });

    // Obtener nuevo valor
    const updatedSnap = await getDoc(docRef);
    const newLikesCount = updatedSnap.data()?.likes || 0;

    return { 
      success: true, 
      newLikesCount 
    };
  } catch (error) {
    console.error('❌ Error en updateEpisodeLikes:', error);
    return { 
      success: false, 
      error 
    };
  }
};

/**
 * Obtiene el conteo actual de likes de un episodio
 */
export const getEpisodeLikes = async (episodeId: string): Promise<number> => {
  try {
    const docRef = doc(db, 'episodes', episodeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data()?.likes || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error obteniendo likes:', error);
    return 0;
  }
};
