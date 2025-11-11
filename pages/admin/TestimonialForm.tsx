import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Star,
  ArrowLeft
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import {
  createTestimonial,
  updateTestimonial,
  getTestimonialById,
  CreateTestimonialData
} from '../../src/firebase/testimonials';

interface FormData {
  name: string;
  role: string;
  content: string;
  rating: number;
  featured: boolean;
  active: boolean;
  order: number;
}

const TestimonialForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    content: '',
    rating: 5,
    featured: false,
    active: true,
    order: 999
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const roleOptions = [
    'Padre de familia',
    'Madre de familia',
    'Estudiante de 4° grado',
    'Estudiante de 5° grado',
    'Estudiante de 6° grado',
    'Director(a)',
    'Docente',
    'Coordinador(a)'
  ];

  useEffect(() => {
    if (isEditing && id) {
      loadTestimonial(id);
    }
  }, [id, isEditing]);

  const loadTestimonial = async (testimonialId: string) => {
    try {
      setIsLoading(true);
      const testimonial = await getTestimonialById(testimonialId);
      
      if (testimonial) {
        setFormData({
          name: testimonial.name || '',
          role: testimonial.role || '',
          content: testimonial.content || '',
          rating: testimonial.rating || 5,
          featured: testimonial.featured || false,
          active: testimonial.active !== false,
          order: testimonial.order || 999
        });
      } else {
        showNotification('error', 'Testimonio no encontrado');
        navigate('/admin/testimonials');
      }
    } catch (error) {
      console.error('Error cargando testimonio:', error);
      showNotification('error', 'Error al cargar el testimonio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));

    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'El rol es requerido';
    }

    if (!formData.content.trim()) {
  newErrors.content = 'El contenido es requerido';
} else if (formData.content.length < 20) {
  newErrors.content = 'El testimonio debe tener al menos 20 caracteres';
} else if (formData.content.length > 300) {
  newErrors.content = 'El testimonio no debe superar los 300 caracteres';
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('error', 'Por favor corrige los errores del formulario');
      return;
    }

    try {
      setIsSaving(true);

      const testimonialData: CreateTestimonialData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        content: formData.content.trim(),
        rating: formData.rating || undefined,
        featured: formData.featured,
        active: formData.active,
        order: formData.order
      };

      if (isEditing && id) {
        await updateTestimonial(id, testimonialData);
        showNotification('success', 'Testimonio actualizado correctamente');
      } else {
        await createTestimonial(testimonialData);
        showNotification('success', 'Testimonio creado correctamente');
      }

      setTimeout(() => {
        navigate('/admin/testimonials');
      }, 1500);
    } catch (error) {
      console.error('Error guardando testimonio:', error);
      showNotification('error', 'Error al guardar el testimonio');
    } finally {
      setIsSaving(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-light/70">Cargando datos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Breadcrumbs 
        items={[
          { label: 'Página: Inicio', path: '/admin/dashboard' },
          { label: 'Testimonios', path: '/admin/testimonials' },
          { label: isEditing ? 'Editar' : 'Nuevo' }
        ]}
      />

      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-light mb-1">
            {isEditing ? 'Editar Testimonio' : 'Nuevo Testimonio'}
          </h1>
          <p className="text-light/60 text-sm">
            {isEditing ? `Editando: ${formData.name}` : 'Agrega una nueva opinión al sitio'}
          </p>
        </div>

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

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="bg-dark rounded-xl p-8 border border-light/10 space-y-6">

            {/* Información Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-light font-semibold mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full bg-darker text-light px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-light/10'
                  } focus:border-primary focus:outline-none transition-colors`}
                  placeholder="Ej: María García"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-light font-semibold mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`w-full bg-darker text-light px-4 py-3 rounded-lg border ${
                    errors.role ? 'border-red-500' : 'border-light/10'
                  } focus:border-primary focus:outline-none transition-colors`}
                >
                  <option value="">Seleccionar...</option>
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Contenido del Testimonio */}
            <div>
              <label className="block text-light font-semibold mb-2">
                Testimonio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={5}
                className={`w-full bg-darker text-light px-4 py-3 rounded-lg border ${
                  errors.content ? 'border-red-500' : 'border-light/10'
                } focus:border-primary focus:outline-none transition-colors resize-none`}
                placeholder="Escribe el testimonio completo aquí..."
              />
              <div className="flex items-center justify-between mt-1">
  {errors.content ? (
    <p className="text-red-500 text-sm">{errors.content}</p>
  ) : (
    <p className="text-light/50 text-xs">Entre 20 y 300 caracteres</p>
  )}
  <p className={`text-xs ${formData.content.length > 300 ? 'text-red-500' : 'text-light/50'}`}>
    {formData.content.length}/300 caracteres
  </p>
</div>
            </div>

            {/* Rating (opcional) */}
            <div>
              <label className="block text-light font-semibold mb-3">
                Calificación (Opcional)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= formData.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-light/20'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-light/60 text-sm">
                  {formData.rating} estrella{formData.rating !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-light/10">
              <div className="flex items-center gap-3 p-3 bg-darker rounded-lg">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-primary bg-dark border-light/20 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="featured" className="text-light cursor-pointer flex-1">
                  Destacar en homepage
                </label>
              </div>

              <div className="flex items-center gap-3 p-3 bg-darker rounded-lg">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-primary bg-dark border-light/20 rounded focus:ring-primary focus:ring-2"
                />
                <label htmlFor="active" className="text-light cursor-pointer flex-1">
                  Visible en el sitio
                </label>
              </div>
            </div>

            {/* Orden */}
            <div>
              <label className="block text-light font-semibold mb-2">
                Orden de aparición
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
                min="1"
              />
              <p className="text-light/50 text-xs mt-1">Número menor aparece primero</p>
            </div>

            {/* Botones */}
            <div className="flex items-center gap-4 pt-6 border-t border-light/10">
              <button
                type="button"
                onClick={() => navigate('/admin/testimonials')}
                className="px-6 py-3 bg-darker text-light rounded-lg hover:bg-light/5 transition-colors"
                disabled={isSaving}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-primary text-darker font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {isEditing ? 'Actualizar Testimonio' : 'Crear Testimonio'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TestimonialForm;