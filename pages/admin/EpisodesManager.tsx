import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Filter,
    Loader2,
    AlertCircle,
    CheckCircle,
    Star
} from 'lucide-react';
import {
    getEpisodes,
    deleteEpisode,
    updateEpisode,
    Episode
} from '../../src/firebase/episodes';

const EpisodesManager: React.FC = () => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // Cargar episodios al montar
    useEffect(() => {
        loadEpisodes();
    }, []);

    // Filtrar episodios cuando cambien los filtros
    useEffect(() => {
        filterEpisodes();
    }, [episodes, searchTerm, filterCategory, filterStatus]);

    const loadEpisodes = async () => {
        try {
            setIsLoading(true);
            const data = await getEpisodes();
            setEpisodes(data);
        } catch (error) {
            showNotification('error', 'Error al cargar los episodios');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterEpisodes = () => {
        let filtered = [...episodes];

        // Filtro de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(ep =>
                ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ep.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ep.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro de categoría
        if (filterCategory !== 'all') {
            filtered = filtered.filter(ep => ep.category === filterCategory);
        }

        // Filtro de estado
        if (filterStatus !== 'all') {
            filtered = filtered.filter(ep => ep.status === filterStatus);
        }

        setFilteredEpisodes(filtered);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEpisode(id);
            showNotification('success', 'Episodio eliminado correctamente');
            loadEpisodes();
            setDeleteConfirm(null);
        } catch (error) {
            showNotification('error', 'Error al eliminar el episodio');
            console.error(error);
        }
    };

    const toggleFeatured = async (episode: Episode) => {
        try {
            await updateEpisode(episode.id, { featured: !episode.featured });
            showNotification('success', 'Episodio actualizado');
            loadEpisodes();
        } catch (error) {
            showNotification('error', 'Error al actualizar el episodio');
            console.error(error);
        }
    };

    const toggleStatus = async (episode: Episode) => {
        const newStatus = episode.status === 'published' ? 'draft' : 'published';
        try {
            await updateEpisode(episode.id, { status: newStatus });
            showNotification('success', `Episodio ${newStatus === 'published' ? 'publicado' : 'guardado como borrador'}`);
            loadEpisodes();
        } catch (error) {
            showNotification('error', 'Error al cambiar el estado');
            console.error(error);
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const categories = ['CUENTOS', 'HISTORIA', 'CIENCIA', 'ARTE', 'MÚSICA', 'NATURALEZA'];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-darker">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-light/70">Cargando episodios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-darker p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-light mb-2">Gestión de Episodios</h1>
                        <p className="text-light/60">
                            {episodes.length} episodio{episodes.length !== 1 ? 's' : ''} en total
                        </p>
                    </div>
                    <Link
                        to="/admin/episodes/new"
                        className="bg-primary text-darker font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                    >
                        <Plus size={20} />
                        Nuevo Episodio
                    </Link>
                </div>

                {/* Notificación */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${notification.type === 'success'
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

                {/* Filtros y Búsqueda */}
                <div className="bg-dark rounded-xl p-6 mb-6 border border-light/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Búsqueda */}
                        <div className="md:col-span-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-light/40" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar episodios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-darker text-light pl-10 pr-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Filtro de Categoría */}
                        <div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
                            >
                                <option value="all">Todas las categorías</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtro de Estado */}
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="published">Publicados</option>
                                <option value="draft">Borradores</option>
                            </select>
                        </div>
                    </div>

                    {/* Contador de resultados */}
                    <div className="mt-4 text-sm text-light/60">
                        Mostrando {filteredEpisodes.length} de {episodes.length} episodios
                    </div>
                </div>

                {/* Lista de Episodios */}
                {filteredEpisodes.length === 0 ? (
                    <div className="bg-dark rounded-xl p-12 text-center border border-light/10">
                        <AlertCircle className="w-16 h-16 text-light/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-light mb-2">No se encontraron episodios</h3>
                        <p className="text-light/60">Intenta ajustar los filtros o crea un nuevo episodio</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEpisodes.map((episode) => (
                            <div
                                key={episode.id}
                                className="bg-dark rounded-xl p-6 border border-light/10 hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex items-start gap-6">

                                    {/* Thumbnail */}
                                    <div className="flex-shrink-0">
                                        {episode.imageUrl ? (
                                            <img
                                                src={episode.imageUrl}
                                                alt={episode.title}
                                                className="w-24 h-24 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-lg bg-darker flex items-center justify-center">
                                                <span className="text-light/30 text-xs">Sin imagen</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Información */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-light truncate">
                                                        {episode.title}
                                                    </h3>
                                                    {episode.featured && (
                                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-light/60 text-sm mb-2">
                                                    por {episode.author} • {episode.grade} {episode.section}
                                                </p>
                                            </div>

                                            {/* Estado */}
                                            <div className="flex items-center gap-2 ml-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${episode.status === 'published'
                                                        ? 'bg-green-500/10 text-green-500'
                                                        : 'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {episode.status === 'published' ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Metadata */}
                                        <div className="flex items-center gap-4 text-sm text-light/50 mb-3">
                                            <span className="flex items-center gap-1">
                                                <span className="font-semibold text-primary">{episode.category}</span>
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} />
                                                {episode.plays.toLocaleString()} reproducciones
                                            </span>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleFeatured(episode)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${episode.featured
                                                        ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                                                        : 'bg-darker text-light/60 hover:bg-light/5'
                                                    }`}
                                                title={episode.featured ? 'Quitar de destacados' : 'Destacar en homepage'}
                                            >
                                                <Star size={16} className={episode.featured ? 'fill-yellow-500' : ''} />
                                            </button>

                                            <button
                                                onClick={() => toggleStatus(episode)}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-darker text-light/60 hover:bg-light/5 transition-colors flex items-center gap-1"
                                            >
                                                {episode.status === 'published' ? <EyeOff size={16} /> : <Eye size={16} />}
                                                {episode.status === 'published' ? 'Ocultar' : 'Publicar'}
                                            </button>

                                            <Link
                                                to={`/admin/episodes/edit/${episode.id}`}
                                                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                                            >
                                                <Edit2 size={16} />
                                                Editar
                                            </Link>

                                            {deleteConfirm === episode.id ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleDelete(episode.id)}
                                                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                    >
                                                        Confirmar
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-darker text-light/60 hover:bg-light/5 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(episode.id)}
                                                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} />
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EpisodesManager;