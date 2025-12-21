import React, { useState } from 'react';
import { LayoutDashboard, Mic, Users, Image, Settings, LogOut, Plus, Edit, Trash2, Mail, X, Upload, Link as LinkIcon, Save, Download, Search, MoreVertical, Bell, Menu, Star, Grid, Heart, Loader2, Ghost, FileBox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEpisodes, useTeam, useGallery, useSubscribers } from '../firebase/hooks';
import { createEpisode, updateEpisode, deleteEpisode, createTeamMember, updateTeamMember, deleteTeamMember, createGalleryItem, deleteGalleryItem } from '../firebase/adminFunctions';

// --- TYPES ---
type ViewType = 'dashboard' | 'episodes' | 'teachers' | 'gallery' | 'home_editor' | 'subscribers';

// --- SHARED COMPONENTS ---

// 1. Empty State Component (For when tables are empty)
const EmptyState = ({ title, description, actionLabel, onAction }: { title: string, description: string, actionLabel?: string, onAction?: () => void }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
            <Ghost size={32} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-400 text-sm max-w-xs mb-6">{description}</p>
        {actionLabel && onAction && (
            <button onClick={onAction} className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all">
                {actionLabel}
            </button>
        )}
    </div>
);

// --- VIEWS ---

const DashboardView = ({ 
    episodesCount = 0, 
    teamCount = 0, 
    subscribersCount = 0,
    onNewEpisode,
    onUploadGallery
}: { 
    episodesCount?: number;
    teamCount?: number;
    subscribersCount?: number;
    onNewEpisode?: () => void;
    onUploadGallery?: () => void;
}) => (
  <div className="space-y-8 animate-fade-in">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { title: 'Total Episodios', value: episodesCount.toString(), color: 'bg-blue-500', icon: Mic, trend: 'En Firestore' },
            { title: 'Reproducciones', value: '12.5k', color: 'bg-green-500', icon: Users, trend: '+15% vs mes anterior' },
            { title: 'Equipo Docente', value: teamCount.toString(), color: 'bg-purple-500', icon: Users, trend: 'Activo' },
            { title: 'Suscriptores', value: subscribersCount.toString(), color: 'bg-amber-500', icon: Mail, trend: 'Registrados' }
        ].map((stat, i) => (
            <div key={i} className="bg-[#1a1f35]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all">
                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color} rounded-bl-2xl`}>
                    <stat.icon size={32} />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">{stat.title}</p>
                <div className="flex items-end justify-between">
                    <span className="text-3xl font-display font-bold text-white">{stat.value}</span>
                    <div className={`w-2 h-2 rounded-full ${stat.color} mb-2 animate-pulse`}></div>
                </div>
                <div className="mt-4 text-xs text-gray-500 font-medium">
                    {stat.trend}
                </div>
            </div>
        ))}
    </div>

    {/* Quick Actions */}
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
             <h3 className="text-xl font-bold text-white mb-2">¿Qué deseas publicar hoy?</h3>
             <p className="text-gray-400 text-sm">Gestiona el contenido de Smart Kids desde un solo lugar.</p>
         </div>
         <div className="flex gap-4">
             <button 
                 onClick={onNewEpisode}
                 className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                 <Mic size={18} /> Nuevo Episodio
             </button>
             <button 
                 onClick={onUploadGallery}
                 className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2">
                 <Image size={18} /> Subir a Galería
             </button>
         </div>
    </div>
  </div>
);

const EpisodesView = ({ 
    episodes = [], 
    onNew, 
    onEdit, 
    onDelete,
    searchTerm = '',
    onSearchChange
}: { 
    episodes?: any[], 
    onNew: () => void, 
    onEdit?: (ep: any) => void, 
    onDelete?: (id: string) => void,
    searchTerm?: string,
    onSearchChange?: (term: string) => void
}) => {
    // Filtrar episodios por búsqueda
    const filteredEpisodes = searchTerm 
        ? episodes.filter(ep => 
            ep.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ep.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ep.category?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : episodes;

    return (
        <div className="bg-[#1a1f35]/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-lg text-white">Catálogo de Episodios</h3>
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <input 
                            type="text" 
                            placeholder="Buscar por título, autor o categoría..." 
                            value={searchTerm}
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary outline-none" 
                        />
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button onClick={onNew} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Plus size={16} /> <span className="hidden sm:inline">Nuevo</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                {filteredEpisodes.length > 0 ? (
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Podcast</th>
                                <th className="px-6 py-4 font-semibold">Votos</th>
                                <th className="px-6 py-4 font-semibold">Categoría</th>
                                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredEpisodes.map((ep) => (
                                <tr key={ep.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden shadow-md border border-white/10 group-hover:border-primary/50 transition-colors relative shrink-0">
                                                <img src={ep.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="font-bold line-clamp-1">{ep.title}</div>
                                                <div className="text-xs text-gray-500">{ep.author} • {ep.grade}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Heart size={14} className="text-red-400 fill-red-400" />
                                            <span className="font-bold">{ep.likes}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${ep.category === 'Ciencia' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                            {ep.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onEdit && onEdit(ep)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary transition-colors" title="Editar"><Edit size={16} /></button>
                                            <button onClick={() => onDelete && onDelete(ep.id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyState title="No hay episodios" description="Comienza subiendo el primer podcast de tu escuela." actionLabel="Crear Episodio" onAction={onNew} />
                )}
            </div>
        </div>
    );
};

const TeachersView = ({ team = [], onEdit, onDelete }: { team?: any[], onEdit: () => void, onDelete?: (id: string) => void }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-white">Equipo Fundador</h3>
                <p className="text-sm text-gray-400">Gestiona los perfiles de la página "Nosotros"</p>
            </div>
            <button onClick={onEdit} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                <Plus size={16} /> Agregar Miembro
            </button>
        </div>

        {team.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                    <div key={member.id} className="bg-[#1a1f35]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 group hover:border-primary/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button onClick={onEdit} className="p-2 bg-black/50 hover:bg-primary text-white rounded-lg backdrop-blur-md transition-colors"><Edit size={14}/></button>
                            <button onClick={() => onDelete && onDelete(member.id)} className="p-2 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors"><Trash2 size={14}/></button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors shrink-0">
                                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg leading-tight">{member.name}</h4>
                                <p className="text-primary text-xs font-bold uppercase">{member.role}</p>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/5">
                            <p className="text-gray-400 text-sm italic line-clamp-3">"{member.quote}"</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <EmptyState title="Equipo vacío" description="Agrega a los docentes fundadores del proyecto." actionLabel="Agregar Miembro" onAction={onEdit} />
        )}
    </div>
);

const HomeEditorView = () => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 2000);
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Preview Card */}
            <div className="lg:col-span-1">
                <h3 className="text-white font-bold mb-4">Vista Previa (Estudiante del Mes)</h3>
                <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px]"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-40 h-40 relative mb-4">
                            <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763677415/Blob_esdauu.png" className="w-full h-full object-contain drop-shadow-xl" />
                            <div className="absolute bottom-0 right-0 bg-black/80 text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/30">
                                MEJOR PODCAST
                            </div>
                        </div>
                        <h4 className="text-2xl font-bold text-white">Mateo Velásquez</h4>
                        <p className="text-gray-400 text-sm mb-4">5° Grado - Sección B</p>
                        <p className="text-gray-300 text-sm italic">"Al principio me daba miedo hablar, pero aprendí que mi propia voz tiene poder."</p>
                    </div>
                </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2 bg-[#1a1f35]/60 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">Editar Portada</h3>
                        <p className="text-sm text-gray-400">Actualiza al estudiante destacado del mes</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all ${isSaving ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                        {isSaving ? 'Guardando...' : 'Publicar Cambios'}
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Nombre del Alumno</label>
                        <input type="text" defaultValue="Mateo Velásquez" className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Grado / Sección</label>
                        <input type="text" defaultValue="5° Grado - Sección B" className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Frase / Cita</label>
                        <textarea rows={3} defaultValue="Al principio me daba miedo hablar, pero aprendí que mi propia voz tiene poder." className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Imagen (Sin Fondo / PNG)</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center text-gray-500 hover:bg-white/5 hover:border-primary/30 transition-colors cursor-pointer">
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm">Arrastra una imagen nueva aquí</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GalleryView = ({ gallery = [], onDelete }: { gallery?: any[], onDelete?: (id: string) => void }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-white">Galería "Nosotros"</h3>
                <p className="text-sm text-gray-400">Gestiona el mosaico de fotos (Bento Grid)</p>
            </div>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                <Upload size={16} /> Subir Foto
            </button>
        </div>

        {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((item) => (
                    <div 
                        key={item.id} 
                        className={`relative group rounded-xl overflow-hidden border border-white/10 ${item.cols === 2 ? 'col-span-2' : 'col-span-1'} ${item.rows === 2 ? 'row-span-2 aspect-[1/2]' : 'aspect-square'}`}
                    >
                        <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <p className="text-white font-bold text-sm text-center px-2">{item.title}</p>
                            <div className="flex gap-2">
                                <button className="p-1.5 bg-white text-black rounded hover:bg-primary transition-colors"><Edit size={14}/></button>
                                <button onClick={() => onDelete && onDelete(item.id)} className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"><Trash2 size={14}/></button>
                            </div>
                            <div className="mt-2 flex gap-1">
                                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">
                                    {item.cols === 2 ? 'Panorámico' : item.rows === 2 ? 'Vertical' : 'Cuadrado'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <EmptyState title="Galería vacía" description="Sube fotos para el mosaico de la sección Nosotros." />
        )}
    </div>
);

const SubscribersView = ({ subscribers = [] }: { subscribers?: any[] }) => (
    <div className="bg-[#1a1f35]/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-lg text-white">Lista de Suscriptores</h3>
                <p className="text-xs text-gray-400">Usuarios registrados a través del Community Hub</p>
            </div>
            <button className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                <Download size={16} /> Exportar CSV
            </button>
        </div>
        <div className="overflow-x-auto">
            {subscribers.length > 0 ? (
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Email</th>
                            <th className="px-6 py-4 font-semibold">Fecha</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {subscribers.map((sub: any) => (
                            <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{sub.email}</td>
                                <td className="px-6 py-4">
                                  {sub.date ? (
                                    typeof sub.date === 'string' ? sub.date : 
                                    sub.date?.toDate ? new Date(sub.date.toDate()).toLocaleDateString('es-ES') :
                                    'Sin fecha'
                                  ) : 'Sin fecha'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                                        Activo
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <EmptyState title="Sin suscriptores" description="Aún no hay usuarios registrados." />
            )}
        </div>
    </div>
);

// --- MAIN ADMIN LAYOUT ---

const Admin = () => {
  // Firebase Hooks
  const { episodes: firebaseEpisodes, loading: loadingEpisodes } = useEpisodes();
  const { team: firebaseTeam } = useTeam();
  const { gallery: firebaseGallery } = useGallery();
  const { subscribers: firebaseSubscribers } = useSubscribers();
  const [searchEpisodes, setSearchEpisodes] = useState('');
  
  // Map Firebase data
  const EPISODES = firebaseEpisodes || [];
  const TEAM = firebaseTeam || [];
  const GALLERY = firebaseGallery || [];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Global loading state for modals
  const [activeTab, setActiveTab] = useState<ViewType>('dashboard');
  const [isFeaturedToggle, setIsFeaturedToggle] = useState(false); // State for featured toggle in modal
  const navigate = useNavigate();

  // Estados para el formulario de episodios
  const [episodeForm, setEpisodeForm] = useState({
    title: '',
    author: '',
    grade: '',
    category: 'Cuentos' as Episode['category'],
    description: '',
    duration: '',
    spotifyUrl: '',
    imageUrl: '',
    featured: false
  });

  const [editingEpisode, setEditingEpisode] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('smart_auth_token');
    navigate('/login');
  };

  // Función para guardar nuevo episodio
  const handleSaveEpisode = async () => {
    // Validar campos obligatorios
    if (!episodeForm.title || !episodeForm.author || !episodeForm.spotifyUrl) {
      alert('Por favor completa los campos obligatorios: Título, Autor y URL de Spotify');
      return;
    }

    setIsSaving(true);
    try {
      const episodeData = {
        title: episodeForm.title,
        author: episodeForm.author,
        grade: episodeForm.grade || 'N/A',
        category: episodeForm.category,
        description: episodeForm.description || '',
        duration: episodeForm.duration || '0 min',
        spotifyUrl: episodeForm.spotifyUrl,
        imageUrl: episodeForm.imageUrl || 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763685723/default_podcast.jpg',
        featured: episodeForm.featured,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      let result;
      if (editingEpisode) {
        // EDITAR episodio existente
        result = await updateEpisode(editingEpisode, episodeData);
      } else {
        // CREAR nuevo episodio
        result = await createEpisode({
          ...episodeData,
          likes: 0,
          plays: 0
        });
      }

      if (result.success) {
        // Limpiar formulario
        setEpisodeForm({
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
        setEditingEpisode(null);
        setIsEpisodeModalOpen(false);
        alert(editingEpisode ? '✅ Episodio actualizado' : '✅ Episodio creado exitosamente');
      } else {
        alert('❌ Error al guardar episodio');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  // Función para abrir modal en modo edición
  const handleEditEpisode = (episode: Episode) => {
    setEpisodeForm({
      title: episode.title,
      author: episode.author,
      grade: episode.grade,
      category: episode.category,
      description: episode.description,
      duration: episode.duration,
      spotifyUrl: episode.spotifyUrl,
      imageUrl: episode.imageUrl,
      featured: episode.featured || false
    });
    setEditingEpisode(episode.id);
    setIsEpisodeModalOpen(true);
  };

  // Función para eliminar episodio
  const handleDeleteEpisode = async (id: string, title: string) => {
    if (!confirm(`¿Seguro que deseas eliminar "${title}"?`)) return;
    
    const result = await deleteEpisode(id);
    if (result.success) {
      alert('✅ Episodio eliminado');
    } else {
      alert('❌ Error al eliminar');
    }
  };

  // Simulating backend save delay
  const handleModalSave = (closeModal: () => void) => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        closeModal();
    }, 1500);
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'dashboard': return (
    <DashboardView 
        episodesCount={firebaseEpisodes.length}
        teamCount={firebaseTeam.length}
        subscribersCount={firebaseSubscribers.length}
        onNewEpisode={() => {
            setActiveTab('episodes');
            setEditingEpisode(null);
            setEpisodeForm({
                title: '', author: '', grade: '', category: 'Cuentos',
                description: '', duration: '', spotifyUrl: '', imageUrl: '', featured: false
            });
            setIsEpisodeModalOpen(true);
        }}
        onUploadGallery={() => setActiveTab('gallery')}
    />
);
        case 'episodes': return (
  <EpisodesView 
    episodes={firebaseEpisodes}
    searchTerm={searchEpisodes}
    onSearchChange={setSearchEpisodes}
    onNew={() => {
      setActiveTab('episodes');
      setEditingEpisode(null);
      setEpisodeForm({
        title: '', author: '', grade: '', category: 'Cuentos',
        description: '', duration: '', spotifyUrl: '', imageUrl: '', featured: false
      });
      setIsEpisodeModalOpen(true);
    }} 
    onEdit={handleEditEpisode} 
    onDelete={(id) => {
      const episode = firebaseEpisodes.find(ep => ep.id === id);
      if (episode) handleDeleteEpisode(id, episode.title);
    }} 
  />
);
        case 'teachers': return (
          <TeachersView 
            team={firebaseTeam}
            onEdit={() => setIsTeacherModalOpen(true)}
            onDelete={async (id) => {
              if(confirm('¿Eliminar miembro?')) await deleteTeamMember(id);
            }}
          />
        );
        case 'home_editor': return <HomeEditorView />;
        case 'gallery': return (
          <GalleryView 
            gallery={firebaseGallery}
            onDelete={async (id) => {
              if(confirm('¿Eliminar foto?')) await deleteGalleryItem(id);
            }}
          />
        );
        case 'subscribers': return <SubscribersView subscribers={firebaseSubscribers} />;
        default: return <DashboardView />;
    }
};

  const getTitle = () => {
      switch(activeTab) {
          case 'dashboard': return 'Panel de Control';
          case 'episodes': return 'Gestión de Episodios';
          case 'teachers': return 'Equipo Docente';
          case 'home_editor': return 'Editor de Portada';
          case 'gallery': return 'Galería "Nosotros"';
          case 'subscribers': return 'Comunidad';
          default: return 'Admin';
      }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: ViewType, icon: any, label: string }) => (
      <button 
        onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === id ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
      >
        <Icon size={20} /> {label}
      </button>
  );

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-white font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-white/10 z-30 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763694145/Logo_SmartKids_og849e.svg" alt="Logo" className="h-8 w-auto" />
             <span className="font-display font-bold text-white">Smart Admin</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 hover:text-white">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>

      {/* Sidebar (Desktop & Mobile Overlay) */}
      <aside className={`
          fixed md:sticky top-0 left-0 h-full w-64 bg-[#0a0f1e] border-r border-white/10 z-20 transition-transform duration-300 
          ${isMobileMenuOpen ? 'translate-x-0 pt-20' : '-translate-x-full md:translate-x-0 md:pt-0'}
      `}>
        <div className="p-6 border-b border-white/10 hidden md:block">
           <div className="flex items-center gap-3">
             <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763694145/Logo_SmartKids_og849e.svg" alt="Logo" className="h-10 w-auto drop-shadow-lg" />
             <div>
                <h2 className="font-display font-extrabold text-lg leading-none text-white">Smart <span className="text-primary">Kids</span></h2>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin Panel</span>
             </div>
           </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)]">
          <div className="px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest">General</div>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="subscribers" icon={Mail} label="Suscriptores" />
          
          <div className="mt-6 px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest">Contenido</div>
          <NavItem id="episodes" icon={Mic} label="Episodios" />
          <NavItem id="home_editor" icon={Star} label="Portada (Home)" />
          
          <div className="mt-6 px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-widest">Nosotros</div>
          <NavItem id="teachers" icon={Users} label="Docentes" />
          <NavItem id="gallery" icon={Grid} label="Galería" />
          
          <div className="my-4 border-t border-white/10"></div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 relative mt-16 md:mt-0 overflow-x-hidden">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white">{getTitle()}</h1>
            <p className="text-gray-400 text-sm">Centro de control v1.0</p>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
             <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative">
                <Bell size={20} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0a0f1e]"></div>
             </button>
             <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 p-[1.5px]">
                    <img src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763692249/Miriam_b0bzfs.jpg" className="w-full h-full rounded-full object-cover border border-[#0a0f1e]" alt="Profile" />
                </div>
                <span className="text-sm font-bold text-white hidden md:block">Miriam F.</span>
             </div>
          </div>
        </header>

        {/* Render Active View */}
        <div className="min-h-[500px]">
             {renderContent()}
        </div>

        {/* --- MODALS --- */}

        {/* Episode Modal */}
        {isEpisodeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSaving && setIsEpisodeModalOpen(false)}></div>
                <div className="relative bg-[#1a1f35] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0f1e] sticky top-0 z-10">
                        <h3 className="text-xl font-display font-bold text-white">
                          {editingEpisode ? 'Editar Episodio' : 'Nuevo Episodio'}
                        </h3>
                        <button onClick={() => setIsEpisodeModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"><X size={24}/></button>
                    </div>
                    
                    <div className="p-8 space-y-6">
                         <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 items-start">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0"><LinkIcon size={18} /></div>
                            <div>
                                <h4 className="text-sm font-bold text-blue-200">Estrategia Spotify (Headless)</h4>
                                <p className="text-xs text-blue-300/80 mt-1">Sube el audio a Spotify y pega el enlace aquí.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Título *</label>
                                <input 
                                  type="text" 
                                  value={episodeForm.title}
                                  onChange={(e) => setEpisodeForm({...episodeForm, title: e.target.value})}
                                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                                  placeholder="El Zorro y el Cóndor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Autor / Grado *</label>
                                <input 
                                  type="text" 
                                  value={episodeForm.author}
                                  onChange={(e) => setEpisodeForm({...episodeForm, author: e.target.value})}
                                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                                  placeholder="Lucas Quispe"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Grado</label>
                                <input 
                                  type="text" 
                                  value={episodeForm.grade}
                                  onChange={(e) => setEpisodeForm({...episodeForm, grade: e.target.value})}
                                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                                  placeholder="4° Grado"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Categoría</label>
                                <select 
                                  value={episodeForm.category}
                                  onChange={(e) => setEpisodeForm({...episodeForm, category: e.target.value as Episode['category']})}
                                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                >
                                  <option value="Cuentos">Cuentos</option>
                                  <option value="Ciencia">Ciencia</option>
                                  <option value="Historia">Historia</option>
                                  <option value="Entrevistas">Entrevistas</option>
                                  <option value="Debate">Debate</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Descripción</label>
                            <textarea 
                              rows={3} 
                              value={episodeForm.description}
                              onChange={(e) => setEpisodeForm({...episodeForm, description: e.target.value})}
                              className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                              placeholder="Un cuento tradicional andino..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Duración</label>
                                <input 
                                  type="text" 
                                  value={episodeForm.duration}
                                  onChange={(e) => setEpisodeForm({...episodeForm, duration: e.target.value})}
                                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                                  placeholder="10 min"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">URL de Imagen</label>
                                <input 
                                  type="url" 
                                  value={episodeForm.imageUrl}
                                  onChange={(e) => setEpisodeForm({...episodeForm, imageUrl: e.target.value})}
                                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
                                  placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold text-green-400 uppercase flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Enlace Spotify *
                             </label>
                             <input 
                               type="url" 
                               value={episodeForm.spotifyUrl}
                               onChange={(e) => setEpisodeForm({...episodeForm, spotifyUrl: e.target.value})}
                               placeholder="https://open.spotify.com/episode/..." 
                               className="w-full bg-[#0a0f1e] border border-green-500/30 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none" 
                             />
                        </div>

                      {/* Teacher/Member Modal */}
        {isTeacherModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSaving && setIsTeacherModalOpen(false)}></div>
                <div className="relative bg-[#1a1f35] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0f1e]">
                        <h3 className="text-xl font-display font-bold text-white">Nuevo Miembro del Equipo</h3>
                        <button onClick={() => setIsTeacherModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"><X size={24}/></button>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                            <p className="text-yellow-200 text-sm">⚠️ Funcionalidad en desarrollo. Próximamente podrás agregar miembros del equipo.</p>
                        </div>
                    </div>
                    <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#0a0f1e]">
                        <button onClick={() => setIsTeacherModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white font-medium">Cerrar</button>
                    </div>
                </div>
            </div>
        )}

                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                            <div>
                                <h4 className="font-bold text-white text-sm">Destacar en Carrusel</h4>
                                <p className="text-xs text-gray-400">Aparecerá en la sección "Podcasts Destacados" del Home.</p>
                            </div>
                            <button 
                                onClick={() => setEpisodeForm({...episodeForm, featured: !episodeForm.featured})}
                                className={`w-12 h-7 rounded-full p-1 transition-colors ${episodeForm.featured ? 'bg-primary' : 'bg-gray-700'}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${episodeForm.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#0a0f1e] sticky bottom-0">
                        <button onClick={() => setIsEpisodeModalOpen(false)} disabled={isSaving} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white font-medium transition-colors disabled:opacity-50">Cancelar</button>
                        <button 
                            onClick={handleSaveEpisode} 
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                            {isSaving ? 'Guardando...' : 'Publicar'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Teacher/Member Modal */}
        {isTeacherModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSaving && setIsTeacherModalOpen(false)}></div>
                <div className="relative bg-[#1a1f35] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0f1e]">
                        <h3 className="text-xl font-display font-bold text-white">Editar Miembro</h3>
                        <button onClick={() => setIsTeacherModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"><X size={24}/></button>
                    </div>
                    <div className="p-8 space-y-6">
                         <div className="grid grid-cols-1 gap-4">
                             <input type="text" placeholder="Nombre Completo" className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                             <input type="text" placeholder="Rol (ej: Docente)" className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                             <textarea placeholder="Cita inspiradora..." rows={3} className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                         </div>
                    </div>
                    <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-[#0a0f1e]">
                        <button onClick={() => setIsTeacherModalOpen(false)} disabled={isSaving} className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white font-medium disabled:opacity-50">Cancelar</button>
                        <button 
                            onClick={() => handleModalSave(() => setIsTeacherModalOpen(false))}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default Admin;