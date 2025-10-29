import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

// Interfaz para contenido visual
export interface SiteContent {
  id: string;
  section: 'hero' | 'gallery' | 'professors' | 'episodes';
  title?: string;
  subtitle?: string;
  imageUrl: string;
  order?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Obtener todo el contenido visual
export const getSiteContent = async (): Promise<SiteContent[]> => {
  try {
    const contentRef = collection(db, 'siteContent');
    const snapshot = await getDocs(contentRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SiteContent));
  } catch (error) {
    console.error('Error al obtener contenido:', error);
    return [];
  }
};

// Obtener contenido por sección
export const getContentBySection = async (section: string): Promise<SiteContent[]> => {
  const allContent = await getSiteContent();
  return allContent
    .filter(item => item.section === section && item.active)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

// Actualizar contenido
export const updateSiteContent = async (
  id: string, 
  data: Partial<SiteContent>
): Promise<void> => {
  try {
    const contentRef = doc(db, 'siteContent', id);
    await updateDoc(contentRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    throw error;
  }
};

// Crear nuevo contenido
export const createSiteContent = async (
  data: Omit<SiteContent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const contentRef = doc(collection(db, 'siteContent'));
    const newContent: SiteContent = {
      ...data,
      id: contentRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(contentRef, newContent);
    return contentRef.id;
  } catch (error) {
    console.error('Error al crear contenido:', error);
    throw error;
  }
};
