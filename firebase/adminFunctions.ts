import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, increment, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// ==================== EPISODES ====================

export const createEpisode = async (episodeData: any, imageFile?: File) => {
  try {
    let imageUrl = episodeData.imageUrl;
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
    await updateDoc(docRef, { ...episodeData, imageUrl });
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
    const docRef = await addDoc(collection(db, 'team'), { ...memberData, imageUrl });
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
    await updateDoc(docRef, { ...memberData, imageUrl });
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
    const docRef = await addDoc(collection(db, 'gallery'), { ...itemData, imageUrl });
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

// ==================== LIKES ====================

export const toggleLike = async (episodeId: string, isCurrentlyLiked: boolean) => {
  try {
    console.log('🔄 toggleLike called');
    console.log('Episode ID:', episodeId);
    console.log('Currently liked:', isCurrentlyLiked);
    
    const docRef = doc(db, 'episodes', episodeId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error('Episode not found');
      return { success: false, error: 'Episode not found' };
    }
    
    await updateDoc(docRef, {
      likes: increment(isCurrentlyLiked ? -1 : 1)
    });
    
    console.log('✅ Like updated in Firebase');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in toggleLike:', error);
    return { success: false, error };
  }
};