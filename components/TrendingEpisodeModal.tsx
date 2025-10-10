import React, { useEffect } from 'react';
import { Episode } from '../types';
import { X, Play, Pause, Headphones, Calendar } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface TrendingEpisodeModalProps {
    episode: Episode;
    onClose: () => void;
}

const TrendingEpisodeModal: React.FC<TrendingEpisodeModalProps> = ({ episode, onClose }) => {
    const { playEpisode, pause, currentEpisode, isPlaying } = usePlayer();
    const isActive = currentEpisode?.id === episode.id;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handlePlayPause = () => {
        if (isActive && isPlaying) {
            pause();
        } else {
            playEpisode(episode);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-darker/80 backdrop-blur-lg z-[100] flex justify-center items-center p-4"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
            <div 
                className="relative bg-dark rounded-2xl w-full max-w-4xl max-h-[90vh] grid grid-cols-1 lg:grid-cols-2 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.3s ease-out' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-light/70 hover:text-primary transition-colors z-20 bg-darker/50 rounded-full p-2"
                    aria-label="Cerrar modal"
                >
                    <X size={24} />
                </button>

                {/* Left Column: Image */}
                <div className="relative min-h-[300px] lg:min-h-0">
                    <img src={episode.thumbnail} alt={episode.title} className="absolute inset-0 w-full h-full object-cover"/>
                </div>

                {/* Right Column: Content */}
                <div className="p-8 lg:p-12 flex flex-col overflow-y-auto">
                    <div>
                        <span className="bg-secondary text-light text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">{episode.category}</span>
                        <h2 className="font-heading text-4xl font-bold text-light mb-4">{episode.title}</h2>
                        <div className="flex items-center gap-3 text-lg text-light/80 mb-6">
                            <span>{episode.podcaster.name} - {episode.podcaster.grade}</span>
                        </div>
                    </div>

                    <div className="text-light/70 my-6 flex-grow">
                        <p>{episode.description}</p>
                    </div>

                    <div className="border-t border-b border-darker py-4 my-6 flex justify-around text-center">
                        <div>
                            <p className="font-bold text-2xl text-primary">{episode.duration}</p>
                            <p className="text-xs text-light/50">Minutos</p>
                        </div>
                        <div className="border-l border-darker"></div>
                        <div>
                            <p className="font-bold text-2xl text-primary">{episode.plays}</p>
                            <p className="text-xs text-light/50">Escuchas</p>
                        </div>
                        <div className="border-l border-darker"></div>
                         <div>
                            <p className="font-bold text-xl text-primary">{episode.date}</p>
                            <p className="text-xs text-light/50">Publicado</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handlePlayPause}
                        className="w-full bg-primary text-darker font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 text-lg hover:bg-primary/90 transition-colors duration-300 transform hover:scale-105"
                    >
                        {isActive && isPlaying ? <><Pause size={24} /> Pausar</> : <><Play size={24} /> Reproducir Episodio</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrendingEpisodeModal;