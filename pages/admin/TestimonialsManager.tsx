import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Star,
  Quote
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import {
  getTestimonials,
  deleteTestimonial,
  updateTestimonial,
  Testimonial
} from '../../src/firebase/testimonials';

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm]);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      showNotification('error', 'Error al cargar los testimonios');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = [...testimonials];

    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTestimonials(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
      showNotification('success', 'Testimonio eliminado correctamente');
      loadTestimonials();
      setDeleteConfirm(null);
    } catch (error) {
      showNotification('error', 'Error al eliminar el testimonio');
      console.error(error);
    }
  };

  const toggleActive = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial(testimonial.id, { active: !testimonial.active });
      showNotification('success', 'Testimonio actualizado');
      loadTestimonials();
    } catch (error) {
      showNotification('error', 'Error al actualizar el testimonio');
      console.error(error);
    }
  };

  const toggleFeatured = async (testimonial: Testimonial) => {
    try {
      await updateTestimonial(testimonial.id, { featured: !testimonial.featured });
      showNotification('success', 'Testimonio actualizado');
      loadTestimonials();
    } catch (error) {
      showNotification('error', 'Error al actualizar el testimonio');
      console.error(error);
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
            <p className="text-light/70">Cargando testimonios...</p>
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
          { label: 'Testimonios' }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-light mb-1">Gestión de Testimonios</h1>
          <p className="text-light/60 text-sm">
            {testimonials.length} testimonio{testimonials.length !== 1 ? 's' : ''} registrado{testimonials.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/admin/testimonials/new"
          className="bg-primary text-darker font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
        >
          <Plus size={20} />
          Nuevo Testimonio
        </Link>
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

      {/* Búsqueda */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-light/40" size={20} />
          <input
            type="text"
            placeholder="Buscar testimonios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark text-light pl-10 pr-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        {searchTerm && (
          <p className="text-light/50 text-sm mt-2">
            Mostrando {filteredTestimonials.length} de {testimonials.length} testimonios
          </p>
        )}
      </div>

      {/* Lista de Testimonios */}
      {filteredTestimonials.length === 0 ? (
        <div className="bg-dark rounded-xl p-12 text-center border border-light/10">
          <MessageSquare className="w-16 h-16 text-light/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-light mb-2">
            {searchTerm ? 'No se encontraron testimonios' : 'No hay testimonios registrados'}
          </h3>
          <p className="text-light/60 mb-6">
            {searchTerm ? 'Intenta ajustar tu búsqueda' : 'Comienza agregando el primer testimonio'}
          </p>
          {!searchTerm && (
            <Link
              to="/admin/testimonials/new"
              className="inline-flex items-center gap-2 bg-primary text-darker font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all"
            >
              <Plus size={20} />
              Crear Primer Testimonio
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-dark rounded-xl p-6 border border-light/10 hover:border-primary/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold text-light">
                      {testimonial.name}
                    </h3>
                    {testimonial.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-primary text-sm font-semibold">
                    {testimonial.role}
                  </p>
                  {testimonial.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < testimonial.rating!
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-light/20'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="mb-4 p-4 bg-darker rounded-lg relative">
                <Quote className="absolute top-2 left-2 w-6 h-6 text-primary/20" />
                <p className="text-light/80 text-sm italic pl-6 line-clamp-3">
                  {testimonial.content}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => toggleFeatured(testimonial)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    testimonial.featured
                      ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                      : 'bg-darker text-light/60 hover:bg-light/5'
                  }`}
                  title={testimonial.featured ? 'Quitar de destacados' : 'Destacar'}
                >
                  <Star size={14} className={testimonial.featured ? 'fill-yellow-500' : ''} />
                </button>

                <button
                  onClick={() => toggleActive(testimonial)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                    testimonial.active !== false
                      ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                      : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                  }`}
                >
                  {testimonial.active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  {testimonial.active !== false ? 'Activo' : 'Oculto'}
                </button>

                <Link
                  to={`/admin/testimonials/edit/${testimonial.id}`}
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  <Edit2 size={14} />
                  Editar
                </Link>

                {deleteConfirm === testimonial.id ? (
                  <>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-darker text-light/60 hover:bg-light/5 transition-colors"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(testimonial.id)}
                    className="px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default TestimonialsManager;