import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ 
  currentImage, 
  onImageUploaded, 
  label = 'Imagen'
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || '');

  const handleChange = (url: string) => {
    setImageUrl(url);
    onImageUploaded(url);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-light/80">
        {label}
      </label>

      {/* Input de URL */}
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="https://ejemplo.com/imagen.jpg"
        className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Preview */}
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen';
            }}
            className="w-full max-w-2xl h-64 object-cover rounded-xl border border-light/10"
          />
          <button
            type="button"
            onClick={() => handleChange('')}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Instrucciones */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm mb-2 font-semibold">
          💡 Para subir imágenes:
        </p>
        <ol className="text-blue-300 text-xs space-y-1 ml-4 list-decimal">
          <li>Ve a <a href="https://imgur.com/upload" target="_blank" className="underline">Imgur.com</a> o <a href="https://imgbb.com" target="_blank" className="underline">ImgBB.com</a></li>
          <li>Sube tu imagen</li>
          <li>Copia el enlace directo de la imagen</li>
          <li>Pégalo en el campo de arriba</li>
        </ol>
      </div>
    </div>
  );
}