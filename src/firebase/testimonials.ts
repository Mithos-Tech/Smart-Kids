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

export interface Testimonial {
  id: string;
  name: string;
  role: string; // "Padre de familia", "Estudiante 5°", "Director"
  content: string;
  photo?: string;
  rating?: number; // 1-5 estrellas (opcional)
  featured?: boolean; // Destacar en homepage
  active?: boolean; // Si está visible o no
  order?: number; // Orden de aparición
  createdAt?: any;
  updatedAt?: any;
}

// Tipo para crear testimonio (sin id)
export type CreateTestimonialData = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;

// Tipo para actualizar testimonio (campos opcionales)
export type UpdateTestimonialData = Partial<CreateTestimonialData>;

// ============================================================================
// OBTENER TESTIMONIOS
// ============================================================================

// Obtener todos los testimonios
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonialsRef = collection(db, 'testimonials');
    const querySnapshot = await getDocs(testimonialsRef);

    const testimonials: Testimonial[] = [];
    querySnapshot.forEach((doc) => {
      testimonials.push({
        id: doc.id,
        ...doc.data()
      } as Testimonial);
    });

    // Ordenar manualmente por order si existe
    testimonials.sort((a, b) => (a.order || 999) - (b.order || 999));

    return testimonials;
  } catch (error) {
    console.error('Error obteniendo testimonios:', error);
    return [];
  }
}

// Obtener un testimonio por ID
export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  try {
    const testimonialRef = doc(db, 'testimonials', id);
    const testimonialSnap = await getDoc(testimonialRef);

    if (testimonialSnap.exists()) {
      return {
        id: testimonialSnap.id,
        ...testimonialSnap.data()
      } as Testimonial;
    }

    return null;
  } catch (error) {
    console.error('Error obteniendo testimonio:', error);
    return null;
  }
}

// Obtener testimonios activos
export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const allTestimonials = await getTestimonials();
  return allTestimonials.filter(test => test.active !== false);
}

// Obtener testimonios destacados (para homepage)
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const allTestimonials = await getTestimonials();
  return allTestimonials.filter(test => test.featured === true && test.active !== false);
}

// ============================================================================
// CREAR TESTIMONIO
// ============================================================================

export async function createTestimonial(testimonialData: CreateTestimonialData): Promise<string> {
  try {
    const testimonialsRef = collection(db, 'testimonials');

    // Datos con timestamps
    const newTestimonial = {
      ...testimonialData,
      active: testimonialData.active !== false, // Por defecto activo
      featured: testimonialData.featured || false,
      order: testimonialData.order || 999,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(testimonialsRef, newTestimonial);
    console.log('Testimonio creado con ID:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('Error creando testimonio:', error);
    throw new Error('No se pudo crear el testimonio');
  }
}

// ============================================================================
// ACTUALIZAR TESTIMONIO
// ============================================================================

export async function updateTestimonial(
  id: string,
  updateData: UpdateTestimonialData
): Promise<void> {
  try {
    const testimonialRef = doc(db, 'testimonials', id);

    // Verificar que el testimonio existe
    const testimonialSnap = await getDoc(testimonialRef);
    if (!testimonialSnap.exists()) {
      throw new Error('El testimonio no existe');
    }

    // Actualizar con timestamp
    await updateDoc(testimonialRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });

    console.log('Testimonio actualizado:', id);
  } catch (error) {
    console.error('Error actualizando testimonio:', error);
    throw new Error('No se pudo actualizar el testimonio');
  }
}

// ============================================================================
// ELIMINAR TESTIMONIO
// ============================================================================

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    const testimonialRef = doc(db, 'testimonials', id);

    // Verificar que el testimonio existe
    const testimonialSnap = await getDoc(testimonialRef);
    if (!testimonialSnap.exists()) {
      throw new Error('El testimonio no existe');
    }

    await deleteDoc(testimonialRef);
    console.log('Testimonio eliminado:', id);
  } catch (error) {
    console.error('Error eliminando testimonio:', error);
    throw new Error('No se pudo eliminar el testimonio');
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

// Reordenar testimonios
export async function reorderTestimonials(testimonialIds: string[]): Promise<void> {
  try {
    const updatePromises = testimonialIds.map((id, index) =>
      updateTestimonial(id, { order: index + 1 })
    );

    await Promise.all(updatePromises);
    console.log('Testimonios reordenados correctamente');
  } catch (error) {
    console.error('Error reordenando testimonios:', error);
    throw new Error('No se pudo reordenar los testimonios');
  }
}