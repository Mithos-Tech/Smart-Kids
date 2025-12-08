// ============================================
// ADMIN.TSX - PARTE 1/3
// Imports + Types + Hooks + Componentes Base
// ============================================

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Mic, Users, Image, LogOut, Plus, Edit, Trash2, 
  Mail, X, Upload, Save, Search, Bell, Menu, Star, Grid, Heart, 
  Loader2, Ghost, CheckCircle, AlertCircle, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { 
  createEpisode, updateEpisode, deleteEpisode,
  createTeamMember, updateTeamMember, deleteTeamMember,
  createGalleryItem, deleteGalleryItem 
} from '../firebase/adminFunctions';

// ==================== TYPES ====================
type ViewType = 'dashboard' | 'episodes' | 'teachers' | 'gallery' | 'home_editor' | 'subscribers';

interface Episode {
  id: string;
  title: string;
  description: string;
  author: string;
  grade: string;
  category: string;
  duration: string;
  plays: number;
  likes: number;
  date: string;
  imageUrl: string;
  spotifyUrl: string;
  featured?: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  area: string;
  imageUrl: string;
  quote: string;
}

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  cols: number;
  rows: number;
}

interface Subscriber {
  id: string;
  email: string;
  date: any;
}

// ==================== CUSTOM HOOKS ====================

// Hook para Episodes con realtime updates
const useEpisodes = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'episodes'), (snapshot) => {
      const episodesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Episode[];
      setEpisodes(episodesList);
      setLoading(false);
    }, (error) => {
      console.error('Error loading episodes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { episodes, loading };
};

// Hook para Team con realtime updates
const useTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'team'), (snapshot) => {
      const teamList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[];
      setTeam(teamList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { team, loading };
};

// Hook para Gallery con realtime updates
const useGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const galleryList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryItem[];
      setGallery(galleryList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { gallery, loading };
};

// Hook para Subscribers
const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'subscribers'), (snapshot) => {
      const subsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscriber[];
      setSubscribers(subsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { subscribers, loading };
};

// ==================== UTILITY FUNCTIONS ====================

// Función para subir imágenes a Firebase Storage
const uploadImage = async (file: File, folder: string): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};

// Función para comprimir imágenes antes de subir
const compressImage = async (file: File, maxWidth: number = 800): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionar manteniendo proporción
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          0.8 // Calidad 80%
        );
      };
    };
    reader.onerror = reject;
  });
};

// ==================== UI COMPONENTS ====================

// Toast Notification Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className="fixed top-4 right-4 z-[100] animate-slide-in">
    <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
      type === 'success' 
        ? 'bg-green-500/90 border-green-400 text-white' 
        : 'bg-red-500/90 border-red-400 text-white'
    } backdrop-blur-xl`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-70">
        <X size={18} />
      </button>
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ title, description, actionLabel, onAction }: { 
  title: string, 
  description: string, 
  actionLabel?: string, 
  onAction?: () => void 
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
      <Ghost size={32} className="text-gray-500" />
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
    <p className="text-gray-400 text-sm max-w-xs mb-6">{description}</p>
    {actionLabel && onAction && (
      <button 
        onClick={onAction} 
        className="px-6 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm">Cargando datos...</p>
    </div>
  </div>
);

// ==================== DASHBOARD VIEW ====================
const DashboardView = ({ 
  episodesCount, 
  teamCount, 
  subscribersCount,
  totalPlays 
}: { 
  episodesCount: number, 
  teamCount: number, 
  subscribersCount: number,
  totalPlays: number
}) => (
  <div className="space-y-8 animate-fade-in">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Total Episodios', value: episodesCount, color: 'bg-blue-500', icon: Mic, trend: 'Publicados' },
        { title: 'Reproducciones', value: totalPlays.toLocaleString(), color: 'bg-green-500', icon: Heart, trend: 'Total acumulado' },
        { title: 'Equipo Docente', value: teamCount, color: 'bg-purple-500', icon: Users, trend: 'Miembros activos' },
        { title: 'Suscriptores', value: subscribersCount, color: 'bg-amber-500', icon: Mail, trend: 'En la comunidad' }
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

    {/* Quick Actions Card */}
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-white/10 p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Panel de Administración</h3>
          <p className="text-gray-400 text-sm">Gestiona todo el contenido de Smart Kids desde aquí</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-500">Última actualización</p>
            <p className="text-sm text-white font-bold">{new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);



// ============================================
// ADMIN.TSX - PARTE 2/3
// Vistas de Contenido (Episodes, Teachers, Gallery, Subscribers)
// ============================================

// ==================== EPISODES VIEW ====================
const EpisodesView = ({ 
  episodes, 
  onNew, 
  onEdit, 
  onDelete 
}: { 
  episodes: Episode[], 
  onNew: () => void, 
  onEdit: (ep: Episode) => void, 
  onDelete: (id: string) => void 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredEpisodes = episodes.filter(ep => 
    ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ep.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ep.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#1a1f35]/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="font-bold text-lg text-white">Catálogo de Episodios</h3>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-primary outline-none" 
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={onNew} 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
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
                <th className="px-6 py-4 font-semibold">Destacado</th>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      ep.category === 'Ciencia' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      ep.category === 'Historia' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {ep.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {ep.featured && (
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(ep)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary transition-colors" 
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(ep.id)}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors" 
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState 
            title="No hay episodios" 
            description="Comienza subiendo el primer podcast de tu escuela." 
            actionLabel="Crear Episodio" 
            onAction={onNew} 
          />
        )}
      </div>
    </div>
  );
};

// ==================== TEACHERS VIEW ====================
const TeachersView = ({ 
  team, 
  onNew, 
  onEdit, 
  onDelete 
}: { 
  team: TeamMember[], 
  onNew: () => void, 
  onEdit: (member: TeamMember) => void, 
  onDelete: (id: string) => void 
}) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-white">Equipo Fundador</h3>
        <p className="text-sm text-gray-400">Gestiona los perfiles de la página "Nosotros"</p>
      </div>
      <button 
        onClick={onNew} 
        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
      >
        <Plus size={16} /> Agregar Miembro
      </button>
    </div>

    {team.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div 
            key={member.id} 
            className="bg-[#1a1f35]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 group hover:border-primary/30 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button 
                onClick={() => onEdit(member)} 
                className="p-2 bg-black/50 hover:bg-primary text-white rounded-lg backdrop-blur-md transition-colors"
              >
                <Edit size={14}/>
              </button>
              <button 
                onClick={() => onDelete(member.id)}
                className="p-2 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors"
              >
                <Trash2 size={14}/>
              </button>
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
      <EmptyState 
        title="Equipo vacío" 
        description="Agrega a los docentes fundadores del proyecto." 
        actionLabel="Agregar Miembro" 
        onAction={onNew} 
      />
    )}
  </div>
);

// ==================== GALLERY VIEW ====================
const GalleryView = ({ 
  gallery, 
  onNew, 
  onDelete 
}: { 
  gallery: GalleryItem[], 
  onNew: () => void, 
  onDelete: (id: string) => void 
}) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-white">Galería "Nosotros"</h3>
        <p className="text-sm text-gray-400">Gestiona el mosaico de fotos (Bento Grid)</p>
      </div>
      <button 
        onClick={onNew}
        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
      >
        <Upload size={16} /> Subir Foto
      </button>
    </div>

    {gallery.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div 
            key={item.id} 
            className={`relative group rounded-xl overflow-hidden border border-white/10 ${
              item.cols === 2 ? 'col-span-2' : 'col-span-1'
            } ${
              item.rows === 2 ? 'row-span-2 aspect-[1/2]' : 'aspect-square'
            }`}
          >
            <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <p className="text-white font-bold text-sm text-center px-2">{item.title}</p>
              <button 
                onClick={() => onDelete(item.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16}/>
              </button>
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
      <EmptyState 
        title="Galería vacía" 
        description="Sube fotos para el mosaico de la sección Nosotros." 
      />
    )}
  </div>
);

// ==================== HOME EDITOR VIEW ====================
const HomeEditorView = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [studentData, setStudentData] = useState({
    name: 'Mateo Velásquez',
    grade: '5° Grado - Sección B',
    quote: 'Al principio me daba miedo hablar, pero aprendí que mi propia voz tiene poder.',
    imageUrl: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763677415/Blob_esdauu.png'
  });

  // Preview imagen seleccionada
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      let imageUrl = studentData.imageUrl;
      
      // Solo subir si hay nueva imagen
      if (imageFile) {
        console.log('📤 Subiendo imagen...', imageFile.size, 'bytes');
        
        // Verificar tamaño
        if (imageFile.size > 5 * 1024 * 1024) {
          alert('⚠️ Imagen demasiado grande. Usa una menor a 5MB');
          return;
        }

        imageUrl = await uploadImage(imageFile, 'featured_student');
        console.log('✅ Imagen subida:', imageUrl);
      }

      // Actualizar estado local inmediatamente
      const updatedData = { ...studentData, imageUrl };
      setStudentData(updatedData);
      setImageFile(null);
      setPreviewUrl(null);
      
      // Opcional: Guardar en Firestore para persistencia
      // const docRef = doc(db, 'homepage', 'featured_student');
      // await setDoc(docRef, updatedData);
      
      alert('✅ Cambios guardados exitosamente');
    } catch (error) {
      console.error('❌ Error completo:', error);
      alert(`❌ Error: ${error.message || 'No se pudo guardar'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Función para renderizar texto con colores (como en tu diseño original)
  const renderColoredQuote = (text: string) => {
    // Palabras que van en verde
    const greenWords = ['miedo', 'propia voz', 'poder'];
    // Palabras que van en morado
    const purpleWords = ['aventura increíble'];
    
    let parts = [text];
    
    // Reemplazar palabras verdes
    greenWords.forEach(word => {
      parts = parts.flatMap(part => 
        typeof part === 'string' 
          ? part.split(new RegExp(`(${word})`, 'gi')).map((p, i) => 
              p.toLowerCase() === word.toLowerCase() 
                ? <span key={`green-${i}`} className="text-green-400 font-bold">{p}</span> 
                : p
            )
          : [part]
      );
    });
    
    // Reemplazar frases moradas
    purpleWords.forEach(phrase => {
      parts = parts.flatMap(part => 
        typeof part === 'string' 
          ? part.split(new RegExp(`(${phrase})`, 'gi')).map((p, i) => 
              p.toLowerCase() === phrase.toLowerCase() 
                ? <span key={`purple-${i}`} className="text-purple-400 font-bold">{p}</span> 
                : p
            )
          : [part]
      );
    });
    
    return parts;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Preview Card */}
      <div className="lg:col-span-1">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          Vista Previa (Estudiante del Mes)
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">LIVE</span>
        </h3>
        <div className="bg-[#0a0f1e] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px]"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-40 h-40 relative mb-4">
              <img src={studentData.imageUrl} className="w-full h-full object-contain drop-shadow-xl" alt="" />
              <div className="absolute bottom-0 right-0 bg-black/80 text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/30">
                MEJOR PODCAST
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white">{studentData.name}</h4>
            <p className="text-gray-400 text-sm mb-4">{studentData.grade}</p>
            <p className="text-gray-300 text-sm italic leading-relaxed">
              "{renderColoredQuote(studentData.quote)}"
            </p>
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
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Publicar Cambios
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {isSaving && uploadProgress > 0 && (
          <div className="mb-6">
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Subiendo... {uploadProgress}%</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Nombre del Alumno</label>
            <input 
              type="text" 
              value={studentData.name}
              onChange={(e) => setStudentData({...studentData, name: e.target.value})}
              className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Grado / Sección</label>
            <input 
              type="text" 
              value={studentData.grade}
              onChange={(e) => setStudentData({...studentData, grade: e.target.value})}
              className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
              disabled={isSaving}
            />
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Frase / Cita
              <span className="text-xs text-gray-500 normal-case ml-2">(Las palabras clave se resaltarán automáticamente)</span>
            </label>
            <textarea 
              rows={3} 
              value={studentData.quote}
              onChange={(e) => setStudentData({...studentData, quote: e.target.value})}
              className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" 
              disabled={isSaving}
            />
            <p className="text-xs text-gray-500">
              💡 Palabras como "miedo", "propia voz", "aventura" se resaltarán automáticamente
            </p>
          </div>
          <div className="col-span-full space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Imagen (Sin Fondo / PNG)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer"
              disabled={isSaving}
            />
            {imageFile && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
                <CheckCircle size={16} />
                <span>✓ Nueva imagen: {imageFile.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== SUBSCRIBERS VIEW ====================
const SubscribersView = ({ 
  subscribers, 
  loading 
}: { 
  subscribers: Subscriber[], 
  loading: boolean 
}) => {
  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Fecha', 'Estado'],
      ...subscribers.map(sub => [
        sub.email,
        sub.date?.toDate ? new Date(sub.date.toDate()).toLocaleDateString('es-ES') : 'Reciente',
        'Activo'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `suscriptores_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-[#1a1f35]/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-white">Lista de Suscriptores</h3>
          <p className="text-xs text-gray-400">Usuarios registrados a través del Community Hub</p>
        </div>
        <button 
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} /> Exportar CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : subscribers.length > 0 ? (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail size={18} className="text-primary" />
                      </div>
                      {sub.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sub.date?.toDate ? new Date(sub.date.toDate()).toLocaleDateString('es-ES') : 'Reciente'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                      Activo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState 
            title="No hay suscriptores" 
            description="Los emails aparecerán aquí cuando alguien se suscriba" 
          />
        )}
      </div>
    </div>
  );
};

// ============================================
// ADMIN.TSX - PARTE 3A/3
// Componente Principal + Lógica de Estado
// ============================================

// ==================== MAIN ADMIN COMPONENT ====================
const Admin = () => {
  const navigate = useNavigate();
  
  // Custom Hooks
  const { episodes, loading: loadingEpisodes } = useEpisodes();
  const { team, loading: loadingTeam } = useTeam();
  const { gallery, loading: loadingGallery } = useGallery();
  const { subscribers, loading: loadingSubscribers } = useSubscribers();

  // UI State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewType>('dashboard');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Modal States
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit States
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<TeamMember | null>(null);

  // Form States
  const [episodeForm, setEpisodeForm] = useState({
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

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    role: '',
    area: '',
    quote: '',
    imageUrl: ''
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    imageUrl: '',
    cols: 1,
    rows: 1
  });

  // File States
  const [episodeImageFile, setEpisodeImageFile] = useState<File | null>(null);
  const [teacherImageFile, setTeacherImageFile] = useState<File | null>(null);
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);

  // ==================== UTILITY FUNCTIONS ====================
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('smart_auth_token');
    navigate('/login');
  };

  const resetEpisodeForm = () => {
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
    setEpisodeImageFile(null);
    setEditingEpisode(null);
  };

  const resetTeacherForm = () => {
    setTeacherForm({
      name: '',
      role: '',
      area: '',
      quote: '',
      imageUrl: ''
    });
    setTeacherImageFile(null);
    setEditingTeacher(null);
  };

  const resetGalleryForm = () => {
    setGalleryForm({
      title: '',
      imageUrl: '',
      cols: 1,
      rows: 1
    });
    setGalleryImageFile(null);
  };

  // ==================== EPISODE HANDLERS ====================
  const handleOpenEpisodeModal = (episode?: Episode) => {
    if (episode) {
      setEditingEpisode(episode);
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
    } else {
      resetEpisodeForm();
    }
    setIsEpisodeModalOpen(true);
  };

  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = episodeForm.imageUrl;

      // Upload image if file is selected
      if (episodeImageFile) {
        imageUrl = await uploadImage(episodeImageFile, 'episodes');
      }

      const episodeData = {
        ...episodeForm,
        imageUrl,
        plays: editingEpisode?.plays || 0,
        likes: editingEpisode?.likes || 0,
        date: editingEpisode?.date || new Date().toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        })
      };

      if (editingEpisode) {
        await updateEpisode(editingEpisode.id, episodeData);
        showToast('Episodio actualizado exitosamente', 'success');
      } else {
        await createEpisode(episodeData);
        showToast('Episodio creado exitosamente', 'success');
      }

      setIsEpisodeModalOpen(false);
      resetEpisodeForm();
    } catch (error) {
      console.error('Error saving episode:', error);
      showToast('Error al guardar el episodio', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEpisode = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este episodio?')) {
      try {
        await deleteEpisode(id);
        showToast('Episodio eliminado', 'success');
      } catch (error) {
        console.error('Error deleting episode:', error);
        showToast('Error al eliminar', 'error');
      }
    }
  };

  // ==================== TEACHER HANDLERS ====================
  const handleOpenTeacherModal = (member?: TeamMember) => {
    if (member) {
      setEditingTeacher(member);
      setTeacherForm({
        name: member.name,
        role: member.role,
        area: member.area,
        quote: member.quote,
        imageUrl: member.imageUrl
      });
    } else {
      resetTeacherForm();
    }
    setIsTeacherModalOpen(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = teacherForm.imageUrl;

      if (teacherImageFile) {
        imageUrl = await uploadImage(teacherImageFile, 'team');
      }

      const teacherData = { ...teacherForm, imageUrl };

      if (editingTeacher) {
        await updateTeamMember(editingTeacher.id, teacherData);
        showToast('Miembro actualizado exitosamente', 'success');
      } else {
        await createTeamMember(teacherData);
        showToast('Miembro agregado exitosamente', 'success');
      }

      setIsTeacherModalOpen(false);
      resetTeacherForm();
    } catch (error) {
      console.error('Error saving teacher:', error);
      showToast('Error al guardar', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este miembro?')) {
      try {
        await deleteTeamMember(id);
        showToast('Miembro eliminado', 'success');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        showToast('Error al eliminar', 'error');
      }
    }
  };

  // ==================== GALLERY HANDLERS ====================
  const handleOpenGalleryModal = () => {
    resetGalleryForm();
    setIsGalleryModalOpen(true);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!galleryImageFile) {
      showToast('Por favor selecciona una imagen', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const imageUrl = await uploadImage(galleryImageFile, 'gallery');
      const galleryData = { ...galleryForm, imageUrl };

      await createGalleryItem(galleryData, galleryImageFile);
      showToast('Foto agregada exitosamente', 'success');

      setIsGalleryModalOpen(false);
      resetGalleryForm();
    } catch (error) {
      console.error('Error saving gallery:', error);
      showToast('Error al guardar', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta foto?')) {
      try {
        await deleteGalleryItem(id);
        showToast('Foto eliminada', 'success');
      } catch (error) {
        console.error('Error deleting gallery:', error);
        showToast('Error al eliminar', 'error');
      }
    }
  };

  // ==================== RENDER LOGIC ====================
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Panel de Control';
      case 'episodes': return 'Gestión de Episodios';
      case 'teachers': return 'Equipo Docente';
      case 'gallery': return 'Galería "Nosotros"';
      case 'subscribers': return 'Comunidad';
      default: return 'Admin';
    }
  };

  const renderContent = () => {
  switch(activeTab) {
    case 'dashboard':
      return (
        <DashboardView 
          episodesCount={episodes.length}
          teamCount={team.length}
          subscribersCount={subscribers.length}
          totalPlays={episodes.reduce((sum, ep) => sum + (ep.plays || 0), 0)}
        />
      );
    case 'episodes':
      return (
        <EpisodesView 
          episodes={episodes}
          onNew={() => handleOpenEpisodeModal()}
          onEdit={handleOpenEpisodeModal}
          onDelete={handleDeleteEpisode}
        />
      );
    case 'home_editor':
      return <HomeEditorView />;
    case 'teachers':
      return (
        <TeachersView 
          team={team}
          onNew={() => handleOpenTeacherModal()}
          onEdit={handleOpenTeacherModal}
          onDelete={handleDeleteTeacher}
        />
      );
    case 'gallery':
      return (
        <GalleryView 
          gallery={gallery}
          onNew={handleOpenGalleryModal}
          onDelete={handleDeleteGallery}
        />
      );
    case 'subscribers':
      return (
        <SubscribersView 
          subscribers={subscribers}
          loading={loadingSubscribers}
        />
      );
    default:
      return <DashboardView episodesCount={0} teamCount={0} subscribersCount={0} totalPlays={0} />;
  }
};

  const NavItem = ({ id, icon: Icon, label }: { id: ViewType, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        activeTab === id 
          ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  // Loading State
  if (loadingEpisodes || loadingTeam || loadingGallery) {
    return <LoadingSpinner />;
  }

return (
    <div className="flex min-h-screen bg-[#0a0f1e] text-white font-sans">
      
      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-full w-64 bg-[#0a0f1e] border-r border-white/10 z-20 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0 pt-20' : '-translate-x-full md:translate-x-0 md:pt-0'
      }`}>
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

      {/* Main Content */}
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

        {/* ==================== EPISODE MODAL ==================== */}
        {isEpisodeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSaving && setIsEpisodeModalOpen(false)}></div>
            <div className="relative bg-[#1a1f35] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0f1e]">
                <h3 className="text-xl font-display font-bold text-white">
                  {editingEpisode ? 'Editar' : 'Nuevo'} Episodio
                </h3>
                <button onClick={() => !isSaving && setIsEpisodeModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                  <X size={24}/>
                </button>
              </div>
              
              <form onSubmit={handleSaveEpisode} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Título *</label>
                    <input 
                      type="text" 
                      value={episodeForm.title}
                      onChange={(e) => setEpisodeForm({...episodeForm, title: e.target.value})}
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Autor / Grado *</label>
                    <input 
                      type="text" 
                      value={episodeForm.author}
                      onChange={(e) => setEpisodeForm({...episodeForm, author: e.target.value})}
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Grado *</label>
                    <input 
                      type="text" 
                      value={episodeForm.grade}
                      onChange={(e) => setEpisodeForm({...episodeForm, grade: e.target.value})}
                      placeholder="ej: 5° Grado"
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Categoría *</label>
                    <select 
                      value={episodeForm.category}
                      onChange={(e) => setEpisodeForm({...episodeForm, category: e.target.value})}
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    >
                      <option>Cuentos</option>
                      <option>Ciencia</option>
                      <option>Historia</option>
                      <option>Entrevistas</option>
                      <option>Debate</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Descripción *</label>
                  <textarea 
                    value={episodeForm.description}
                    onChange={(e) => setEpisodeForm({...episodeForm, description: e.target.value})}
                    rows={3}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Duración *</label>
                    <input 
                      type="text" 
                      value={episodeForm.duration}
                      onChange={(e) => setEpisodeForm({...episodeForm, duration: e.target.value})}
                      placeholder="ej: 10 min"
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-green-400 uppercase">Enlace Spotify *</label>
                    <input 
                      type="url" 
                      value={episodeForm.spotifyUrl}
                      onChange={(e) => setEpisodeForm({...episodeForm, spotifyUrl: e.target.value})}
                      placeholder="https://open.spotify.com/episode/..."
                      className="w-full bg-[#0a0f1e] border border-green-500/30 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Imagen de Portada</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEpisodeImageFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer"
                  />
                  {episodeForm.imageUrl && !episodeImageFile && (
                    <img src={episodeForm.imageUrl} alt="Preview" className="w-32 h-32 rounded-lg object-cover mt-2" />
                  )}
                </div>

                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                  <div>
                    <h4 className="font-bold text-white text-sm">Destacar en Carrusel</h4>
                    <p className="text-xs text-gray-400">Aparecerá en "Podcasts Destacados"</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setEpisodeForm({...episodeForm, featured: !episodeForm.featured})}
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${episodeForm.featured ? 'bg-primary' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${episodeForm.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEpisodeModalOpen(false)}
                    disabled={isSaving}
                    className="flex-1 px-6 py-2.5 rounded-xl text-gray-400 hover:text-white font-medium transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                    {isSaving ? 'Guardando...' : 'Publicar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TEACHER MODAL ==================== */}
        {isTeacherModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSaving && setIsTeacherModalOpen(false)}></div>
            <div className="relative bg-[#1a1f35] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0f1e]">
                <h3 className="text-xl font-display font-bold text-white">
                  {editingTeacher ? 'Editar' : 'Nuevo'} Miembro
                </h3>
                <button onClick={() => !isSaving && setIsTeacherModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                  <X size={24}/>
                </button>
              </div>
              
              <form onSubmit={handleSaveTeacher} className="p-8 space-y-6">
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Nombre Completo *"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Rol (ej: Docente) *"
                    value={teacherForm.role}
                    onChange={(e) => setTeacherForm({...teacherForm, role: e.target.value})}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Área *"
                    value={teacherForm.area}
                    onChange={(e) => setTeacherForm({...teacherForm, area: e.target.value})}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    required
                  />
                  <textarea 
                    placeholder="Cita inspiradora *"
                    value={teacherForm.quote}
                    onChange={(e) => setTeacherForm({...teacherForm, quote: e.target.value})}
                    rows={3}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    required
                  />
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTeacherImageFile(e.target.files?.[0] || null)}
                    className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer"
                  />
                  {teacherForm.imageUrl && !teacherImageFile && (
                    <img src={teacherForm.imageUrl} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsTeacherModalOpen(false)}
                    disabled={isSaving}
                    className="flex-1 px-6 py-2.5 rounded-xl text-gray-400 hover:text-white font-medium disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== GALLERY MODAL ==================== */}
        {isGalleryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSaving && setIsGalleryModalOpen(false)}></div>
            <div className="relative bg-[#1a1f35] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0f1e]">
                <h3 className="text-xl font-display font-bold text-white">Nueva Foto</h3>
                <button onClick={() => !isSaving && setIsGalleryModalOpen(false)} disabled={isSaving} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                  <X size={24}/>
                </button>
              </div>
              
              <form onSubmit={handleSaveGallery} className="p-8 space-y-6">
                <input 
                  type="text" 
                  placeholder="Título *"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                  required
                />
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryImageFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Columnas</label>
                    <input
                      type="number"
                      min="1"
                      max="2"
                      value={galleryForm.cols}
                      onChange={(e) => setGalleryForm({...galleryForm, cols: parseInt(e.target.value)})}
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Filas</label>
                    <input
                      type="number"
                      min="1"
                      max="2"
                      value={galleryForm.rows}
                      onChange={(e) => setGalleryForm({...galleryForm, rows: parseInt(e.target.value)})}
                      className="w-full bg-[#0a0f1e] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsGalleryModalOpen(false)}
                    disabled={isSaving}
                    className="flex-1 px-6 py-2.5 rounded-xl text-gray-400 hover:text-white font-medium disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
