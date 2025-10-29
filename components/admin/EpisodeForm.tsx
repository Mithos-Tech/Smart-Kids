import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface EpisodeFormProps {
  episodeId?: string;
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function EpisodeForm({ episodeId, initialData, onSave, onCancel }: EpisodeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: 'Ciencia',
    grade: '4°',
    section: 'A',
    duration: '',
    embedUrl: '',
    plays: 0
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        author: initialData.author || '',
        category: initialData.category || 'Ciencia',
        grade: initialData.grade || '4°',
        section: initialData.section || 'A',
        duration: initialData.duration || '',
        embedUrl: initialData.embedUrl || '',
        plays: initialData.plays || 0
      });
    }
  }, [initialData]);

  const categories = ['Ciencia', 'Historia', 'Arte', 'Cuentos', 'Música', 'Naturaleza'];
  const grades = ['4°', '5°', '6°'];
  const sections = ['A', 'B', 'C'];

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.author.trim()) newErrors.author = 'El autor es requerido';
    if (!formData.duration.trim()) newErrors.duration = 'La duración es requerida';
    if (!formData.embedUrl.trim()) {
      newErrors.embedUrl = 'La URL de Spotify es requerida';
    } else if (!formData.embedUrl.includes('spotify.com')) {
      newErrors.embedUrl = 'Debe ser una URL válida de Spotify';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark border border-light/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark border-b border-light/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-light">
            {episodeId ? 'Editar Episodio' : 'Agregar Nuevo Episodio'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-light/60 hover:text-light hover:bg-light/10 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-light/80 mb-2">
              Título del Episodio *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: El Sistema Solar y sus misterios"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-light/80 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Breve descripción del episodio..."
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Autor */}
          <div>
            <label className="block text-sm font-medium text-light/80 mb-2">
              Autor / Narrador *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: Sofía Rodríguez"
            />
            {errors.author && <p className="text-red-400 text-sm mt-1">{errors.author}</p>}
          </div>

          {/* Categoría, Grado, Sección */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">Categoría *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">Grado *</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">Sección</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-medium text-light/80 mb-2">
              Duración *
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: 15:30"
            />
            {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
            <p className="text-light/50 text-xs mt-1">Formato: MM:SS (ej: 15:30)</p>
          </div>

          {/* URL de Spotify */}
          <div>
            <label className="block text-sm font-medium text-light/80 mb-2">
              URL del Reproductor de Spotify *
            </label>
            <input
              type="url"
              name="embedUrl"
              value={formData.embedUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://open.spotify.com/embed/..."
            />
            {errors.embedUrl && <p className="text-red-400 text-sm mt-1">{errors.embedUrl}</p>}
            <p className="text-light/50 text-xs mt-1">
              Copia la URL de "Compartir" → "Insertar episodio" desde Spotify
            </p>
          </div>

          {/* Reproducciones (solo para editar) */}
          {episodeId && (
            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">
                Reproducciones
              </label>
              <input
                type="number"
                name="plays"
                value={formData.plays}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-darker font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : episodeId ? 'Actualizar' : 'Crear Episodio'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-light/10 text-light rounded-xl hover:bg-light/20 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}