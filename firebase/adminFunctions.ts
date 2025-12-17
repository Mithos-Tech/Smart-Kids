import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from './config';

export const createEpisode = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'episodes'), {
      ...data,
      createdAt: Timestamp.now(),
      likes: data.likes || 0,
      plays: data.plays || 0
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error };
  }
};

export const updateEpisode = async (id: string, data: any) => {
  try {
    await updateDoc(doc(db, 'episodes', id), { ...data, updatedAt: Timestamp.now() });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteEpisode = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'episodes', id));
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const createTeamMember = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'team'), { ...data, createdAt: Timestamp.now() });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateTeamMember = async (id: string, data: any) => {
  try {
    await updateDoc(doc(db, 'team', id), data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteTeamMember = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'team', id));
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const createGalleryItem = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'gallery'), data);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error };
  }
};

export const deleteGalleryItem = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'gallery', id));
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};