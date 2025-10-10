import React, { useState, useEffect } from 'react';
import { Search, X, Play, LoaderCircle } from 'lucide-react';
import { Episode } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { api } from '../src/services/api';

const SearchResultItem: React.FC<{ episode: Episode; onSelect: () => void }> = ({ episode, onSelect }) => {
    const { playEpisode } = usePlayer();

    const handlePlay = () => {
        playEpisode(episode);
        onSelect();
    };

    return (
        <button
            onClick={handlePlay}
            className="w-full text-left p-4 flex items-center gap-4 rounded-xl hover:bg-dark transition-colors duration-200"
        >
            <img src={episode.thumbnail} alt={episode.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="min-w-0">
                <p className="font-bold text-light truncate">{episode.title}</p>
                <p className="text-sm text-light/70 truncate">{episode.podcaster.name} - {episode.podcaster.grade}</p>
            </div>
            <div className="ml-auto pl-4">
                <Play className="w-6 h-6 text-primary" />
            </div>
        </button>
    );
};

const SearchModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Episode[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm.trim().length > 2) {
                const fetchResults = async () => {
                    setIsLoading(true);
                    try {
                        const data = await api.searchEpisodes(searchTerm);
                        setResults(data);
                    } catch (error) {
                        console.error("Failed to search episodes:", error);
                        setResults([]);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchResults();
            } else {
                setResults([]);
            }
        }, 300); // Debounce API calls

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    return (
        <div
            className="fixed inset-0 bg-darker/80 backdrop-blur-lg z-[100] flex justify-center items-start pt-20 sm:pt-32"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
            <div
                className="relative container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.3s ease-out' }}
            >
                <div className="relative">
                    <input
                        type="search"
                        placeholder="Busca episodios, temas o podcasters..."
                        className="w-full py-5 pl-14 pr-14 bg-dark text-light text-xl rounded-2xl placeholder-light/50 focus:outline-none focus:ring-4 focus:ring-primary"
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-light/40" size={24} />
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-light/70 hover:text-primary transition-colors"
                        aria-label="Cerrar búsqueda"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="mt-6 bg-dark/50 rounded-2xl max-h-[60vh] overflow-y-auto scrollbar-hide">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-8">
                            <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    ) : searchTerm.trim().length <= 2 ? (
                        <div className="p-8 text-center text-light/60">
                            <p>Escribe al menos 3 caracteres para empezar a buscar.</p>
                        </div>
                    ) : results.length > 0 ? (
                         <div className="p-2">
                             {results.map(episode => (
                                 <SearchResultItem key={episode.id} episode={episode} onSelect={onClose} />
                             ))}
                         </div>
                    ) : (
                        <div className="p-8 text-center text-light/60">
                            <p>No se encontraron resultados para "<strong>{searchTerm}</strong>".</p>
                            <p className="text-sm mt-2">Intenta con otras palabras clave.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;