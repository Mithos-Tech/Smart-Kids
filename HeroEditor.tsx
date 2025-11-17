import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Image, Save, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Breadcrumbs from '../../../components/admin/Breadcrumbs';
import { getContentBySection, updateSiteContent, createSiteContent, SiteContent } from '../../../src/firebase/content';
import { CLOUDINARY_CONFIG } from '../../../src/services/cloudinary';

const HeroEditor: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Datos del formulario
  const [heroId, setHeroId] = useState<string | null>(null);
  const [title, setTitle] = useState('Hablamos,');
  const [subtitle, setSubtitle] = useState('Tú Escuchas');
  const [description, setDescription] = useState('Descubre el talento y la creatividad de nuestros estudiantes a través de podcasts educativos hechos por y para niños.');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Cargar datos existentes
  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        setLoading(true);
        const content = await getContentBySection('hero');
        
        if (content.length > 0) {
          const hero = content[0];
          setHeroId(hero.id);
          setTitle(hero.title || 'Hablamos,');
          setSubtitle(hero.subtitle || 'Tú Escuchas');
          setImageUrl(hero.imageUrl);
          setImagePreview(hero.imageUrl);
          // La descripción no está en Firebase, solo se renderiza en el código
        } else {
          // No hay contenido, se creará al guardar
          console.log('No hay contenido hero en Firebase');
        }
      } catch (err) {
        console.error('Error cargando hero:', err);
        setError('Error al cargar el contenido');
      } finally {
        setLoading(false);
      }
    };
    
    loadHeroContent();
  }, []);

  // Subir imagen a Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es muy grande. Máximo 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'smart-kids/hero'); // Organizar en carpeta
      formData.append('public_id', 'hero-main'); // Nombre fijo para sobrescribir
      formData.append('overwrite', 'true'); // IMPORTANTE: Sobrescribir en vez de duplicar

      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir imagen');
      }

      const data = await response.json();
      setImageUrl(data.secure_url);
      setImagePreview(data.secure_url);
      
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      setError('Error al subir la imagen a Cloudinary');
    } finally {
      setUploading(false);
    }
  };

  // Guardar cambios en Firebase
  const handleSave = async () => {
    if (!imageUrl) {
      setError('Por favor sube una imagen para el hero');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const heroData = {
        section: 'hero' as const,
        title,
        subtitle,
        imageUrl,
        order: 0,
        active: true,
      };

      if (heroId) {
        // Actualizar existente
        await updateSiteContent(heroId, heroData);
      } else {
        // Crear nuevo
        const newId = await createSiteContent(heroData);
        setHeroId(newId);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('Error guardando:', err);
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Breadcrumbs
        items={[
          { label: 'Página: Inicio', path: '/admin/dashboard' },
          { label: 'Hero Principal' }
        ]}
      />

      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-light">Editor del Hero Principal</h1>
              <p className="text-light/60 text-sm">Configura la primera sección de tu página de inicio</p>
            </div>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-500">¡Cambios guardados exitosamente!</p>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-dark rounded-xl p-6 border border-light/10 space-y-6">
          {/* Título Principal */}
          <div>
            <label className="block text-light font-semibold mb-2">
              Título Principal
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
              placeholder="Ej: Hablamos,"
            />
          </div>

          {/* Subtítulo Destacado */}
          <div>
            <label className="block text-light font-semibold mb-2">
              Subtítulo Destacado <span className="text-primary">(Color primario)</span>
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
              placeholder="Ej: Tú Escuchas"
            />
          </div>

          {/* Descripción (informativa, no editable por ahora) */}
          <div>
            <label className="block text-light font-semibold mb-2">
              Descripción <span className="text-light/40 text-xs">(Hardcodeada en el código)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              disabled
              className="w-full bg-darker/50 text-light/50 px-4 py-3 rounded-lg border border-light/10 cursor-not-allowed resize-none"
            />
            <p className="text-light/40 text-xs mt-1">
              Esta descripción está en el código de HomePage.tsx. Para editarla, modifica el archivo directamente.
            </p>
          </div>

          {/* Imagen de fondo */}
          <div>
            <label className="block text-light font-semibold mb-3">
              Imagen de Fondo
            </label>
            
            {/* Preview de la imagen actual */}
            {imagePreview && (
              <div className="mb-4 rounded-lg overflow-hidden border border-light/10">
                <img 
                  src={imagePreview} 
                  alt="Vista previa del hero"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Input para subir imagen */}
            <label className="border-2 border-dashed border-light/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              
              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-3" />
                  <p className="text-light/60 mb-1">Subiendo imagen...</p>
                </>
              ) : (
                <>
                  <Image className="w-12 h-12 text-light/40 mx-auto mb-3" />
                  <p className="text-light/60 mb-1">Haz clic para cambiar imagen</p>
                  <p className="text-light/40 text-xs">Máximo 5MB • JPG, PNG, WebP</p>
                  <p className="text-primary/60 text-xs mt-2">
                    💡 La imagen se guardará como "hero-main" y reemplazará la anterior
                  </p>
                </>
              )}
            </label>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4 pt-6 border-t border-light/10">
            <button
              onClick={() => navigate('/admin/dashboard')}
              disabled={saving}
              className="px-6 py-3 bg-darker text-light rounded-lg hover:bg-light/5 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={saving || uploading || !imageUrl}
              className="flex-1 bg-primary text-darker font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-blue-400 text-sm">
            <strong>💡 Consejo:</strong> Usa imágenes de alta calidad (1920x1080px recomendado).
            Cloudinary las optimizará automáticamente para web. Al guardar con el mismo nombre,
            se reemplazará la imagen anterior sin crear duplicados.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HeroEditor;