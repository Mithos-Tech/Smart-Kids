import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Loader2,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  createProfessor,
  updateProfessor,
  getProfessorById,
  CreateProfessorData
} from '../../src/firebase/professors';

interface FormData {
  name: string;
  role: string;
  specialty: string;
  quote: string;
  photo: string;
  email: string;
  order: number;
  active: boolean;
}

const ProfessorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    specialty: '',
    quote: '',
    photo: '',
    email: '',
    order: 999,
    active: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing && id) {
      loadProfessor(id);
    }
  }, [id, isEditing]);

  const loadProfessor = async (professorId: string) => {
    try {
      setIsLoading(true);
      const professor = await getProfessorById(professorId);
      
      if (professor) {
        setFormData({
          name: professor.name || '',
          role: professor.role || '',
          specialty: professor.specialty || '',
          quote: professor.quote || '',
          photo: professor.photo || '',
          email: professor.email || '',
          order: professor.order || 999,
          active: professor.active !== false
        });
      } else {
        showNotification('error', 'Profesor no encontrado');
        navigate('/admin/professors');
      }
    } catch (error) {
      console.error('Error cargando profesor:', error);
      showNotification('error', 'Error al cargar los datos del profesor');
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

    // Limpiar error del campo
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'La imagen no debe superar los 5MB');
      return;
    }

    try {
      setIsUploadingImage(true);
      const cloudinaryUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, photo: cloudinaryUrl }));
      showNotification('success', 'Imagen subida correctamente');
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      showNotification('error', 'Error al subir la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'TU_PRESET_AQUI'); // ← CAMBIAR
  formData.append('cloud_name', 'TU_CLOUD_NAME_AQUI'); // ← CAMBIAR

  const response = await fetch(
    'https://api.cloudinary.com/v1_1/TU_CLOUD_NAME_AQUI/image/upload', // ← CAMBIAR
    {
      method: 'POST',
      body: formData
    }
  );
  
    if (!response.ok) {
      throw new Error('Error al subir imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'El cargo es requerido';
    }

    if (!formData.quote.trim()) {
      newErrors.quote = 'La frase es requerida';
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('error', 'Por favor corrige los errores del formulario');
      return;
    }

    try {
      setIsSaving(true);

      const professorData: CreateProfessorData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        specialty: formData.specialty.trim() || undefined,
        quote: formData.quote.trim(),
        photo: formData.photo || '',
        email: formData.email.trim() || undefined,
        order: formData.order,
        active: formData.active
      };

      if (isEditing && id) {
        await updateProfessor(id, professorData);
        showNotification('success', 'Profesor actualizado correctamente');
      } else {
        await createProfessor(professorData);
        showNotification('success', 'Profesor creado correctamente');
      }

      setTimeout(() => {
        navigate('/admin/professors');
      }, 1500);
    } catch (error) {
      console.error('Error guardando profesor:', error);
      showNotification('error', 'Error al guardar el profesor');
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
      <AdminLayout title={isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}>
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
    <AdminLayout
      title={isEditing ? 'Editar Profesor' : 'Nuevo Profesor'}
      subtitle={isEditing ? `Editando: ${formData.name}` : 'Agrega un nuevo miembro del equipo'}
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

      {/* Botón Volver */}
      <button
        onClick={() => navigate('/admin/professors')}
        className="mb-6 flex items-center gap-2 text-light/60 hover:text-light transition-colors"
      >
        <ArrowLeft size={20} />
        Volver a la lista
      </button>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-dark rounded-xl p-8 border border-light/10 space-y-8">

          {/* Foto del Profesor */}
          <div>
            <label className="block text-light font-semibold mb-3">
              Foto del Profesor
            </label>
            
            <div className="flex items-start gap-6">
              {/* Preview */}
              <div className="flex-shrink-0">
                {formData.photo ? (
                  <div className="relative group">
                    <img
                      src={formData.photo}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-primary/50"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-darker border-2 border-dashed border-light/20 flex items-center justify-center">
                    <User className="w-12 h-12 text-light/30" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-light/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-light/60 text-sm">Subiendo imagen...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-light/40" />
                        <span className="text-light/60 text-sm">
                          Haz clic para subir una foto
                        </span>
                        <span className="text-light/40 text-xs">
                          PNG, JPG (max. 5MB)
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="md:col-span-2">
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
                placeholder="Ej: María García López"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-light font-semibold mb-2">
                Cargo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full bg-darker text-light px-4 py-3 rounded-lg border ${
                  errors.role ? 'border-red-500' : 'border-light/10'
                } focus:border-primary focus:outline-none transition-colors`}
                placeholder="Ej: Directora"
              />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Especialidad */}
            <div>
              <label className="block text-light font-semibold mb-2">
                Especialidad
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
                placeholder="Ej: Docente de 5° Grado"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-light font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-darker text-light px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-light/10'
                } focus:border-primary focus:outline-none transition-colors`}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
              <p className="text-light/50 text-xs mt-1">
                Número menor aparece primero
              </p>
            </div>
          </div>

          {/* Frase */}
          <div>
            <label className="block text-light font-semibold mb-2">
              Frase Inspiradora <span className="text-red-500">*</span>
            </label>
            <textarea
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              rows={3}
              className={`w-full bg-darker text-light px-4 py-3 rounded-lg border ${
                errors.quote ? 'border-red-500' : 'border-light/10'
              } focus:border-primary focus:outline-none transition-colors resize-none`}
              placeholder="Una frase que represente su filosofía educativa..."
            />
            {errors.quote && (
              <p className="text-red-500 text-sm mt-1">{errors.quote}</p>
            )}
          </div>

          {/* Estado Activo */}
          <div className="flex items-center gap-3 p-4 bg-darker rounded-lg">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-primary bg-dark border-light/20 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="active" className="text-light cursor-pointer">
              Mostrar en la página del equipo
            </label>
          </div>

          {/* Botones */}
          <div className="flex items-center gap-4 pt-6 border-t border-light/10">
            <button
              type="button"
              onClick={() => navigate('/admin/professors')}
              className="px-6 py-3 bg-darker text-light rounded-lg hover:bg-light/5 transition-colors"
              disabled={isSaving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving || isUploadingImage}
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
                  {isEditing ? 'Actualizar Profesor' : 'Crear Profesor'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default ProfessorForm;