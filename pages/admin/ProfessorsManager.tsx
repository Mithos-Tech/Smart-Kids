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
  User
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  getProfessors, 
  deleteProfessor, 
  updateProfessor,
  Professor 
} from '../../src/firebase/professors';

const ProfessorsManager: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    loadProfessors();
  }, []);

  useEffect(() => {
    filterProfessors();
  }, [professors, searchTerm]);

  const loadProfessors = async () => {
    try {
      setIsLoading(true);
      const data = await getProfessors();
      setProfessors(data);
    } catch (error) {
      showNotification('error', 'Error al cargar los profesores');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProfessors = () => {
    let filtered = [...professors];

    if (searchTerm) {
      filtered = filtered.filter(prof => 
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prof.specialty && prof.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProfessors(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProfessor(id);
      showNotification('success', 'Profesor eliminado correctamente');
      loadProfessors();
      setDeleteConfirm(null);
    } catch (error) {
      showNotification('error', 'Error al eliminar el profesor');
      console.error(error);
    }
  };

  const toggleActive = async (professor: Professor) => {
    try {
      await updateProfessor(professor.id, { active: !professor.active });
      showNotification('success', 'Profesor actualizado');
      loadProfessors();
    } catch (error) {
      showNotification('error', 'Error al actualizar el profesor');
      console.error(error);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestión de Profesores">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-light/70">Cargando profesores...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Gestión de Profesores"
      subtitle={`${professors.length} profesor${professors.length !== 1 ? 'es' : ''} en total`}
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

      {/* Header con búsqueda */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-light/40" size={20} />
            <input
              type="text"
              placeholder="Buscar profesores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark text-light pl-10 pr-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <Link
          to="/admin/professors/new"
          className="bg-primary text-darker font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
        >
          <Plus size={20} />
          Nuevo Profesor
        </Link>
      </div>

      {/* Contador de resultados */}
      {searchTerm && (
        <div className="mb-4 text-sm text-light/60">
          Mostrando {filteredProfessors.length} de {professors.length} profesores
        </div>
      )}

      {/* Lista de Profesores */}
      {filteredProfessors.length === 0 ? (
        <div className="bg-dark rounded-xl p-12 text-center border border-light/10">
          <AlertCircle className="w-16 h-16 text-light/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-light mb-2">
            {searchTerm ? 'No se encontraron profesores' : 'No hay profesores registrados'}
          </h3>
          <p className="text-light/60">
            {searchTerm ? 'Intenta ajustar tu búsqueda' : 'Comienza agregando un nuevo profesor'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessors.map((professor) => (
            <div
              key={professor.id}
              className="bg-dark rounded-xl p-6 border border-light/10 hover:border-primary/30 transition-all duration-300"
            >
              {/* Foto y Estado */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  {professor.photo ? (
                    <img
                      src={professor.photo}
                      alt={professor.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary/50"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-darker flex items-center justify-center border-2 border-light/10">
                      <User className="w-10 h-10 text-light/30" />
                    </div>
                  )}
                  
                  {/* Indicador de estado */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark ${
                    professor.active !== false ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-light truncate mb-1">
                    {professor.name}
                  </h3>
                  <p className="text-primary text-sm font-semibold mb-2">
                    {professor.role}
                  </p>
                  {professor.specialty && (
                    <p className="text-light/50 text-xs">
                      {professor.specialty}
                    </p>
                  )}
                </div>
              </div>

              {/* Frase */}
              <div className="mb-4">
                <p className="text-light/70 text-sm italic line-clamp-2">
                  "{professor.quote}"
                </p>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 pt-4 border-t border-light/10">
                <button
                  onClick={() => toggleActive(professor)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                    professor.active !== false
                      ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                      : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                  }`}
                  title={professor.active !== false ? 'Desactivar' : 'Activar'}
                >
                  {professor.active !== false ? (
                    <>
                      <Eye size={16} />
                      Activo
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} />
                      Inactivo
                    </>
                  )}
                </button>

                <Link
                  to={`/admin/professors/edit/${professor.id}`}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit2 size={16} />
                  Editar
                </Link>

                {deleteConfirm === professor.id ? (
                  <>
                    <button
                      onClick={() => handleDelete(professor.id)}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                      title="Confirmar eliminación"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-darker text-light/60 hover:bg-light/5 transition-colors"
                      title="Cancelar"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(professor.id)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
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

export default ProfessorsManager;