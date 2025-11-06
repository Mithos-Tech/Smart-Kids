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
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

export interface Professor {
  id: string;
  name: string;
  role: string;
  specialty?: string; // Ej: "Docente de 5° Grado"
  quote: string;
  photo: string;
  email?: string;
  order?: number; // Para ordenar en la página
  active?: boolean; // Si está activo o no
  createdAt?: any;
  updatedAt?: any;
}

// Tipo para crear profesor (sin id)
export type CreateProfessorData = Omit<Professor, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para actualizar profesor (campos opcionales)
export type UpdateProfessorData = Partial<CreateProfessorData>;

// ============================================================================
// OBTENER PROFESORES
// ============================================================================

// Obtener todos los profesores
export async function getProfessors(): Promise<Professor[]> {
  try {
    const professorsRef = collection(db, 'professors');
    let querySnapshot;
    
    try {
      // Intentar ordenar por 'order' si existe
      const q = query(professorsRef, orderBy('order', 'asc'));
      querySnapshot = await getDocs(q);
    } catch (error) {
      console.warn('No se pudo ordenar por order, obteniendo sin orden:', error);
      querySnapshot = await getDocs(professorsRef);
    }
    
    const professors: Professor[] = [];
    querySnapshot.forEach((doc) => {
      professors.push({
        id: doc.id,
        ...doc.data()
      } as Professor);
    });
    
    // Ordenar manualmente por order si existe
    professors.sort((a, b) => (a.order || 999) - (b.order || 999));
    
    return professors;
  } catch (error) {
    console.error('Error obteniendo profesores:', error);
    return [];
  }
}

// Obtener un profesor por ID
export async function getProfessorById(id: string): Promise<Professor | null> {
  try {
    const professorRef = doc(db, 'professors', id);
    const professorSnap = await getDoc(professorRef);
    
    if (professorSnap.exists()) {
      return {
        id: professorSnap.id,
        ...professorSnap.data()
      } as Professor;
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo profesor:', error);
    return null;
  }
}

// Obtener profesores activos
export async function getActiveProfessors(): Promise<Professor[]> {
  const allProfessors = await getProfessors();
  return allProfessors.filter(prof => prof.active !== false);
}

// ============================================================================
// CREAR PROFESOR
// ============================================================================

export async function createProfessor(professorData: CreateProfessorData): Promise<string> {
  try {
    const professorsRef = collection(db, 'professors');
    
    // Datos con timestamps
    const newProfessor = {
      ...professorData,
      active: professorData.active !== false, // Por defecto activo
      order: professorData.order || 999,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(professorsRef, newProfessor);
    console.log('Profesor creado con ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creando profesor:', error);
    throw new Error('No se pudo crear el profesor');
  }
}

// ============================================================================
// ACTUALIZAR PROFESOR
// ============================================================================

export async function updateProfessor(
  id: string, 
  updateData: UpdateProfessorData
): Promise<void> {
  try {
    const professorRef = doc(db, 'professors', id);
    
    // Verificar que el profesor existe
    const professorSnap = await getDoc(professorRef);
    if (!professorSnap.exists()) {
      throw new Error('El profesor no existe');
    }
    
    // Actualizar con timestamp
    await updateDoc(professorRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    
    console.log('Profesor actualizado:', id);
  } catch (error) {
    console.error('Error actualizando profesor:', error);
    throw new Error('No se pudo actualizar el profesor');
  }
}

// ============================================================================
// ELIMINAR PROFESOR
// ============================================================================

export async function deleteProfessor(id: string): Promise<void> {
  try {
    const professorRef = doc(db, 'professors', id);
    
    // Verificar que el profesor existe
    const professorSnap = await getDoc(professorRef);
    if (!professorSnap.exists()) {
      throw new Error('El profesor no existe');
    }
    
    await deleteDoc(professorRef);
    console.log('Profesor eliminado:', id);
  } catch (error) {
    console.error('Error eliminando profesor:', error);
    throw new Error('No se pudo eliminar el profesor');
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

// Reordenar profesores
export async function reorderProfessors(professorIds: string[]): Promise<void> {
  try {
    const updatePromises = professorIds.map((id, index) => 
      updateProfessor(id, { order: index + 1 })
    );
    
    await Promise.all(updatePromises);
    console.log('Profesores reordenados correctamente');
  } catch (error) {
    console.error('Error reordenando profesores:', error);
    throw new Error('No se pudo reordenar los profesores');
  }
}