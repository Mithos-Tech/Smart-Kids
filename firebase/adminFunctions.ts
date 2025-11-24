// firebase/adminFunctions.ts
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// ==================== EPISODES ====================

export const createEpisode = async (episodeData: any, imageFile?: File) => {
  try {
    let imageUrl = episodeData.imageUrl;
    
    // Si hay imagen nueva, subirla
    if (imageFile) {
      const imageRef = ref(storage, `episodes/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(collection(db, 'episodes'), {
      ...episodeData,
      imageUrl,
      createdAt: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating episode:', error);
    return { success: false, error };
  }
};

export const updateEpisode = async (id: string, episodeData: any, imageFile?: File) => {
  try {
    let imageUrl = episodeData.imageUrl;

    if (imageFile) {
      const imageRef = ref(storage, `episodes/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = doc(db, 'episodes', id);
    await updateDoc(docRef, {
      ...episodeData,
      imageUrl
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating episode:', error);
    return { success: false, error };
  }
};

export const deleteEpisode = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'episodes', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting episode:', error);
    return { success: false, error };
  }
};

// ==================== TEAM ====================

export const createTeamMember = async (memberData: any, imageFile?: File) => {
  try {
    let imageUrl = memberData.imageUrl;

    if (imageFile) {
      const imageRef = ref(storage, `team/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = await addDoc(collection(db, 'team'), {
      ...memberData,
      imageUrl
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating team member:', error);
    return { success: false, error };
  }
};

export const updateTeamMember = async (id: string, memberData: any, imageFile?: File) => {
  try {
    let imageUrl = memberData.imageUrl;

    if (imageFile) {
      const imageRef = ref(storage, `team/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = doc(db, 'team', id);
    await updateDoc(docRef, {
      ...memberData,
      imageUrl
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating team member:', error);
    return { success: false, error };
  }
};

export const deleteTeamMember = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'team', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting team member:', error);
    return { success: false, error };
  }
};

// ==================== GALLERY ====================

export const createGalleryItem = async (itemData: any, imageFile: File) => {
  try {
    const imageRef = ref(storage, `gallery/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    const docRef = await addDoc(collection(db, 'gallery'), {
      ...itemData,
      imageUrl
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return { success: false, error };
  }
};

export const deleteGalleryItem = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'gallery', id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return { success: false, error };
  }
};
