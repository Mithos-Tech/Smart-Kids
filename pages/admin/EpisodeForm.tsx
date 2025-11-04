import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Star
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUploader from '../../components/admin/ImageUploader';
import {
  createEpisode,
  updateEpisode,
  getEpisodeById,
  validateSpotifyUrl,
  convertToSpotifyEmbedUrl,
  CreateEpisodeData
} from '../../src/firebase/episodes';

const EpisodeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Estados del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Campos del formulario
  const [formData, setFormData] = useState<CreateEpisodeData>({
    title: '',
    description: '',
    category: 'CUENTOS',
    grade: '4° Grado',
    section: 'A',
    author: '',
    duration: '',
    plays: 0,
    imageUrl: '',
    embedUrl: '',
    featured: false,
    status: 'draft'
  });

  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [spotifyError, setSpotifyError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar episodio si estamos en modo edición
  useEffect(() => {
    if (isEditMode && id) {
      loadEpisode(id);
    }
  }, [isEditMode, id]);

  const loadEpisode = async (episodeId: string) => {
    try {
      setIsLoading(true);
      const episode = await getEpisodeById(episodeId);
      if (episode) {
        setFormData({
          title: episode.title,
          description: episode.description,
          category: episode.category,
          grade: episode.grade,
          section: episode.section,
          author: episode.author,
          duration: episode.duration,
          plays: episode.plays,
          imageUrl: episode.imageUrl,
          embedUrl: episode.embedUrl,
          featured: episode.featured,
          status: episode.status
        });
        setSpotifyUrl(episode.embedUrl || '');
      }
    } catch (error) {
      showNotification('error', 'Error al cargar el episodio');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: 'featured') => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSpotifyUrlChange = (url: string) => {
    setSpotifyUrl(url);
    setSpotifyError('');

    if (url.trim()) {
      if (validateSpotifyUrl(url)) {
        try {
          const embedUrl = convertToSpotifyEmbedUrl(url);
          setFormData(prev => ({ ...prev, embedUrl }));
        } catch (error) {
          setSpotifyError('URL de Spotify inválida');
        }
      } else {
        setSpotifyError('URL de Spotify inválida. Debe ser un enlace de episodio de Spotify');
      }
    } else {
      setFormData(prev => ({ ...prev, embedUrl: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'El nombre del podcaster es requerido';
    }
    if (!formData.imageUrl) {
      newErrors.imageUrl = 'La imagen es requerida';
    }
    if (!formData.embedUrl) {
      newErrors.embedUrl = 'La URL de Spotify es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm()) {
      showNotification('error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setIsSaving(true);
      const dataToSave = { ...formData, status };

      if (isEditMode && id) {
        await updateEpisode(id, dataToSave);
        showNotification('success', 'Episodio actualizado correctamente');
      } else {
        await createEpisode(dataToSave);
        showNotification('success', 'Episodio creado correctamente');
      }

      setTimeout(() => {
        navigate('/admin/episodes');
      }, 1500);
    } catch (error) {
      showNotification('error', 'Error al guardar el episodio');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const categories = ['CUENTOS', 'HISTORIA', 'CIENCIA', 'ARTE', 'MÚSICA', 'NATURALEZA', 'CUENTOS'];
  const grades = ['4° Grado', '5° Grado', '6° Grado'];
  const sections = ['A', 'B', 'C', 'D'];

  if (isLoading) {
    return (
      <AdminLayout title="Cargando...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isEditMode ? 'Editar Episodio' : 'Crear Nuevo Episodio'}
      subtitle={isEditMode ? formData.title : 'Completa la información del episodio'}
    >
      {/* Notificación */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          notification.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
            : 'bg-red-500/10 border border-red-500/20 text-red-500'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-4xl">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/admin/episodes')}
          className="mb-6 flex items-center gap-2 text-light/60 hover:text-light transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a la lista
        </button>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          
          {/* Información Básica */}
          <section className="bg-dark rounded-xl p-6 border border-light/10">
            <h2 className="text-xl font-bold text-light mb-6 flex items-center gap-2">
              📌 Información Básica
            </h2>

            {/* Título */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-light/80 mb-2">
                Título del Episodio *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: El Zorro y el Cóndor"
                className={`w-full px-4 py-3 bg-darker text-light rounded-xl border ${
                  errors.title ? 'border-red-500' : 'border-light/10'
                } focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-light/80 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe de qué trata el episodio..."
                rows={4}
                className={`w-full px-4 py-3 bg-darker text-light rounded-xl border ${
                  errors.description ? 'border-red-500' : 'border-light/10'
                } focus:outline-none focus:ring-2 focus:ring-primary resize-none`}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Imagen */}
            <div>
              <ImageUploader
                currentImage={formData.imageUrl}
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                label="Imagen de Portada *"
              />
              {errors.imageUrl && (
                <p className="mt-2 text-sm text-red-500">{errors.imageUrl}</p>
              )}
            </div>
          </section>

          {/* Audio y Reproducción */}
          <section className="bg-dark rounded-xl p-6 border border-light/10">
            <h2 className="text-xl font-bold text-light mb-6 flex items-center gap-2">
              🎙️ Audio y Reproducción
            </h2>

            {/* URL de Spotify */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-light/80 mb-2">
                URL de Spotify Embed *
              </label>
              <input
                type="url"
                value={spotifyUrl}
                onChange={(e) => handleSpotifyUrlChange(e.target.value)}
                placeholder="https://open.spotify.com/episode/..."
                className={`w-full px-4 py-3 bg-darker text-light rounded-xl border ${
                  spotifyError || errors.embedUrl ? 'border-red-500' : 'border-light/10'
                } focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {(spotifyError || errors.embedUrl) && (
                <p className="mt-2 text-sm text-red-500">{spotifyError || errors.embedUrl}</p>
              )}
              <p className="mt-2 text-sm text-light/50">
                Copia el enlace del episodio desde Spotify (Ejemplo: https://open.spotify.com/episode/7makk4o...)
              </p>
            </div>

            {/* Vista previa del embed */}
            {formData.embedUrl && !spotifyError && (
              <div>
                <label className="block text-sm font-medium text-light/80 mb-2">
                  Vista Previa
                </label>
                <div className="bg-darker rounded-xl p-4 border border-light/10">
                  <iframe
                    src={formData.embedUrl}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: '12px' }}
                  />
                </div>
              </div>
            )}
          </section>

          {/* Información del Podcaster */}
          <section className="bg-dark rounded-xl p-6 border border-light/10">
            <h2 className="text-xl font-bold text-light mb-6 flex items-center gap-2">
              👨‍🎓 Información del Podcaster
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-light/80 mb-2">
                  Nombre del Estudiante/Grupo *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Ej: Luna Quiroz"
                  className={`w-full px-4 py-3 bg-darker text-light rounded-xl border ${
                    errors.author ? 'border-red-500' : 'border-light/10'
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.author && (
                  <p className="mt-2 text-sm text-red-500">{errors.author}</p>
                )}
              </div>

              {/* Grado */}
              <div>
                <label className="block text-sm font-medium text-light/80 mb-2">
                  Grado *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              {/* Sección */}
              <div>
                <label className="block text-sm font-medium text-light/80 mb-2">
                  Sección *
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-medium text-light/80 mb-2">
                  Duración (opcional)
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Ej: 15:30"
                  className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </section>

          {/* Categorización */}
          <section className="bg-dark rounded-xl p-6 border border-light/10">
            <h2 className="text-xl font-bold text-light mb-6 flex items-center gap-2">
              📂 Categorización
            </h2>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Configuración */}
          <section className="bg-dark rounded-xl p-6 border border-light/10">
            <h2 className="text-xl font-bold text-light mb-6 flex items-center gap-2">
              ⚙️ Configuración
            </h2>

            {/* Destacar */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={() => handleCheckboxChange('featured')}
                className="w-5 h-5 rounded border-light/10 text-primary focus:ring-primary focus:ring-offset-darker"
              />
              <div className="flex items-center gap-2">
                <Star className={`w-5 h-5 ${formData.featured ? 'text-yellow-500 fill-yellow-500' : 'text-light/40'}`} />
                <span className="text-light group-hover:text-primary transition-colors">
                  Destacar en página principal
                </span>
              </div>
            </label>
            <p className="mt-2 ml-8 text-sm text-light/50">
              Los episodios destacados aparecen en la sección principal del sitio
            </p>
          </section>

          {/* Botones de Acción */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/episodes')}
              disabled={isSaving}
              className="px-6 py-3 bg-darker text-light rounded-xl hover:bg-light/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={isSaving}
              className="px-6 py-3 bg-light/10 text-light rounded-xl hover:bg-light/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save size={20} />
              )}
              Guardar Borrador
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={isSaving}
              className="px-6 py-3 bg-primary text-darker font-bold rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload size={20} />
              )}
              Publicar Episodio
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EpisodeForm;