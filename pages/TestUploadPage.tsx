import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';

export const TestUploadPage = () => {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">🧪 Prueba de Upload a Cloudinary</h1>
      
      <ImageUploader 
        onImageUploaded={(url) => {
          setImageUrl(url);
          console.log('✅ Imagen subida:', url);
        }}
      />

      {imageUrl && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-semibold text-green-800 mb-2">✅ Imagen subida exitosamente</h2>
            <p className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded">
              {imageUrl}
            </p>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={imageUrl} alt="Subida" className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
};
