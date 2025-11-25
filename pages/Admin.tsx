import React, { useState } from 'react';
import { LayoutDashboard, Mic, Users, Image, LogOut, Plus, Edit, Trash2, Mail, X, Save, Search, Ghost } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEpisodes, useTeam, useGallery } from '../firebase/hooks';
import { createEpisode, updateEpisode, deleteEpisode, createTeamMember, updateTeamMember, deleteTeamMember, createGalleryItem, deleteGalleryItem } from '../firebase/adminFunctions';

type ViewType = 'dashboard' | 'episodes' | 'teachers' | 'gallery' | 'subscribers';

const EmptyState = ({ title, description }: { title: string, description: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Ghost size={48} className="text-gray-500 mb-4" />
    <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const DashboardView = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { title: 'Total Episodios', value: '7', color: 'bg-blue-500' },
        { title: 'Reproducciones', value: '12.5k', color: 'bg-green-500' },
        { title: 'Equipo Docente', value: '5', color: 'bg-purple-500' },
        { title: 'Suscriptores', value: '1,204', color: 'bg-amber-500' }
      ].map((stat, i) => (
        <div key={i} className="bg-[#1a1f35]/60 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-xs uppercase mb-2">{stat.title}</p>
          <span className="text-3xl font-bold text-white">{stat.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const EpisodesView = ({ onNew, episodes, onEdit, onDelete }: any) => (
  <div className="bg-[#1a1f35]/60 rounded-2xl border border-white/10 overflow-hidden">
    <div className="p-6 border-b border-white/10 flex justify-between items-center">
      <h3 className="font-bold text-lg text-white">Catálogo de Episodios</h3>
      <button onClick={onNew} className="bg-primary px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2">
        <Plus size={16} /> Nuevo
      </button>
    </div>
    <div className="overflow-x-auto">
      {episodes.length > 0 ? (
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Podcast</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Likes</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {episodes.map((ep: any) => (
              <tr key={ep.id} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={ep.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    <div>
                      <div className="font-bold text-white">{ep.title}</div>
                      <div className="text-xs text-gray-500">{ep.author}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{ep.category}</td>
                <td className="px-6 py-4">{ep.likes}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(ep)} className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-400">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(ep.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState title="No hay episodios" description="Crea tu primer episodio" />
      )}
    </div>
  </div>
);

const TeachersView = ({ team, onNew, onEdit, onDelete }: any) => (
  <div className="bg-[#1a1f35]/60 rounded-2xl border border-white/10 overflow-hidden">
    <div className="p-6 border-b border-white/10 flex justify-between items-center">
      <h3 className="font-bold text-lg text-white">Equipo Docente</h3>
      <button onClick={onNew} className="bg-primary px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2">
        <Plus size={16} /> Nuevo
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {team.map((member: any) => (
        <div key={member.id} className="bg-[#0a0f1e] rounded-xl overflow-hidden border border-white/10">
          <img src={member.imageUrl} className="w-full h-48 object-cover" alt="" />
          <div className="p-4">
            <h4 className="font-bold text-white">{member.name}</h4>
            <p className="text-sm text-gray-400 mb-2">{member.role}</p>
            <p className="text-xs text-gray-500 italic line-clamp-2">"{member.quote}"</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => onEdit(member)} className="flex-1 p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">
                <Edit size={16} className="mx-auto" />
              </button>
              <button onClick={() => onDelete(member.id)} className="flex-1 p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                <Trash2 size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GalleryView = ({ gallery, onNew, onDelete }: any) => (
  <div className="bg-[#1a1f35]/60 rounded-2xl border border-white/10 overflow-hidden">
    <div className="p-6 border-b border-white/10 flex justify-between items-center">
      <h3 className="font-bold text-lg text-white">Galería de Fotos</h3>
      <button onClick={onNew} className="bg-primary px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2">
        <Plus size={16} /> Nueva Foto
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
      {gallery.map((item: any) => (
        <div key={item.id} className="relative group">
          <img src={item.imageUrl} className="w-full aspect-square object-cover rounded-xl" alt="" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
            <button onClick={() => onDelete(item.id)} className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600">
              <Trash2 size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">{item.title}</p>
        </div>
      ))}
    </div>
  </div>
);

const Admin = () => {
  const { episodes, loading: loadingEpisodes } = useEpisodes();
  const { team } = useTeam();
  const { gallery } = useGallery();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    grade: '',
    category: 'Cuentos',
    description: '',
    duration: '',
    spotifyUrl: '',
    imageUrl: '',
    featured: false
  });

  
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    role: '',
    area: '',
    quote: '',
    imageUrl: ''
  });
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    imageUrl: '',
    cols: 1,
    rows: 1
  });


  const handleLogout = () => {
    localStorage.removeItem('smart_auth_token');
    navigate('/login');
  };

  const handleOpenModal = (episode?: any) => {
    if (episode) {
      setEditingItem(episode);
      setFormData(episode);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        author: '',
        grade: '',
        category: 'Cuentos',
        description: '',
        duration: '',
        spotifyUrl: '',
        imageUrl: '',
        featured: false
      });
    }
    setIsEpisodeModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const episodeData = {
        ...formData,
        plays: editingItem?.plays || 0,
        likes: editingItem?.likes || 0,
        date: editingItem?.date || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      if (editingItem) {
        await updateEpisode(editingItem.id, episodeData);
        alert('Episodio actualizado');
      } else {
        await createEpisode(episodeData);
        alert('Episodio creado');
      }

      setIsEpisodeModalOpen(false);
      window.location.reload();
    } catch (error) {
      alert('Error al guardar');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este episodio?')) {
      await deleteEpisode(id);
      window.location.reload();
    }
  };

  
  // TEACHERS HANDLERS
  const handleOpenTeacherModal = (member?: any) => {
    if (member) {
      setEditingItem(member);
      setTeacherFormData(member);
    } else {
      setEditingItem(null);
      setTeacherFormData({ name: '', role: '', area: '', quote: '', imageUrl: '' });
    }
    setIsTeacherModalOpen(true);
  };
  
  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem) {
        await updateTeamMember(editingItem.id, teacherFormData);
        alert('Miembro actualizado');
      } else {
        await createTeamMember(teacherFormData);
        alert('Miembro agregado');
      }
      setIsTeacherModalOpen(false);
      window.location.reload();
    } catch (error) {
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteTeacher = async (id: string) => {
    if (confirm('¿Eliminar este miembro?')) {
      await deleteTeamMember(id);
      window.location.reload();
    }
  };
  
  // GALLERY HANDLERS
  const handleOpenGalleryModal = () => {
    setGalleryFormData({ title: '', imageUrl: '', cols: 1, rows: 1 });
    setIsGalleryModalOpen(true);
  };
  
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createGalleryItem(galleryFormData);
      alert('Foto agregada');
      setIsGalleryModalOpen(false);
      window.location.reload();
    } catch (error) {
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteGallery = async (id: string) => {
    if (confirm('¿Eliminar esta foto?')) {
      await deleteGalleryItem(id);
      window.location.reload();
    }
  };


  if (loadingEpisodes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1a1f35] border-r border-white/10 p-6">
        <h2 className="text-2xl font-bold mb-8">Smart Kids Admin</h2>
        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'episodes', label: 'Episodios', icon: Mic },
            { id: 'teachers', label: 'Equipo', icon: Users },
            { id: 'gallery', label: 'Galería', icon: Image },
            { id: 'subscribers', label: 'Suscriptores', icon: Mail }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'episodes' && (
          <EpisodesView
            episodes={episodes}
            onNew={() => handleOpenModal()}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        )}
        {currentView === 'teachers' && (
          <TeachersView
            team={team}
            onNew={() => handleOpenTeacherModal()}
            onEdit={handleOpenTeacherModal}
            onDelete={handleDeleteTeacher}
          />
        )}
        {currentView === 'gallery' && (
          <GalleryView
            gallery={gallery}
            onNew={() => handleOpenGalleryModal()}
            onDelete={handleDeleteGallery}
          />
        )}

        {currentView === 'subscribers' && <EmptyState title="Suscriptores" description="Próximamente" />}
      </main>

      {/* Modal */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => !isSaving && setIsEpisodeModalOpen(false)}></div>
          <div className="relative bg-[#1a1f35] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingItem ? 'Editar' : 'Nuevo'} Episodio</h3>
              <button onClick={() => setIsEpisodeModalOpen(false)} disabled={isSaving}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <input
                type="text"
                placeholder="Autor"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <input
                type="text"
                placeholder="Grado (ej: 5° Grado)"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
              >
                <option>Cuentos</option>
                <option>Ciencia</option>
                <option>Historia</option>
                <option>Entrevistas</option>
                <option>Debate</option>
              </select>
              <textarea
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                rows={3}
                required
              />
              <input
                type="text"
                placeholder="Duración (ej: 10 min)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <input
                type="url"
                placeholder="URL Spotify"
                value={formData.spotifyUrl}
                onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <input
                type="url"
                placeholder="URL Imagen"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5"
                />
                <label className="text-sm">Destacar en carrusel</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEpisodeModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark font-bold flex items-center justify-center gap-2"
                >
                  {isSaving ? 'Guardando...' : <><Save size={18} /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Modal */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => !isSaving && setIsTeacherModalOpen(false)}></div>
          <div className="relative bg-[#1a1f35] rounded-2xl w-full max-w-xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingItem ? 'Editar' : 'Nuevo'} Miembro</h3>
              <button onClick={() => setIsTeacherModalOpen(false)} disabled={isSaving}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={teacherFormData.name}
                onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <input
                type="text"
                placeholder="Rol (ej: Docente)"
                value={teacherFormData.role}
                onChange={(e) => setTeacherFormData({ ...teacherFormData, role: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <input
                type="text"
                placeholder="Área"
                value={teacherFormData.area}
                onChange={(e) => setTeacherFormData({ ...teacherFormData, area: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <textarea
                placeholder="Cita inspiradora"
                value={teacherFormData.quote}
                onChange={(e) => setTeacherFormData({ ...teacherFormData, quote: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                rows={3}
                required
              />
              <input
                type="url"
                placeholder="URL de imagen"
                value={teacherFormData.imageUrl}
                onChange={(e) => setTeacherFormData({ ...teacherFormData, imageUrl: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark font-bold"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => !isSaving && setIsGalleryModalOpen(false)}></div>
          <div className="relative bg-[#1a1f35] rounded-2xl w-full max-w-xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold">Nueva Foto</h3>
              <button onClick={() => setIsGalleryModalOpen(false)} disabled={isSaving}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={galleryFormData.title}
                onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <input
                type="url"
                placeholder="URL de imagen"
                value={galleryFormData.imageUrl}
                onChange={(e) => setGalleryFormData({ ...galleryFormData, imageUrl: e.target.value })}
                className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Columnas</label>
                  <input
                    type="number"
                    min="1"
                    max="2"
                    value={galleryFormData.cols}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, cols: parseInt(e.target.value) })}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Filas</label>
                  <input
                    type="number"
                    min="1"
                    max="2"
                    value={galleryFormData.rows}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, rows: parseInt(e.target.value) })}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark font-bold"
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;