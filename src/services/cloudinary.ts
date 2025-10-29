export const CLOUDINARY_CONFIG = {
  cloudName: 'dkoshgzxo',
  uploadPreset: 'smart-kids-uploads',
  folder: 'smart-kids/episodes'
};

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen (jpg, png, webp)');
  }

  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('La imagen no debe superar los 5MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', CLOUDINARY_CONFIG.folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      throw new Error('Error al subir la imagen a Cloudinary');
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error en uploadImageToCloudinary:', error);
    throw error;
  }
}

export function getPublicIdFromUrl(url: string): string {
  const parts = url.split('/upload/');
  if (parts.length < 2) return '';
  const path = parts[1].split('/').slice(1).join('/');
  return path.replace(/\.[^/.]+$/, '');
}
