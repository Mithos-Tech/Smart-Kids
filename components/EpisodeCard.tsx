
import React from 'react';
import { Episode } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { Play, Headphones, Clock } from 'lucide-react';

interface EpisodeCardProps {
    episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
    const { playEpisode } = usePlayer();

    const handlePlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        playEpisode(episode);
    };

    return (
        <div className="bg-dark rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
            <div className="relative">
                <img loading="lazy" src={episode.thumbnail} alt={episode.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <button 
                    onClick={handlePlayClick}
                    className="absolute bottom-4 right-4 bg-primary text-darker w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 ease-in-out scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                    aria-label="Reproducir episodio"
                >
                    <Play size={24} className="ml-1" />
                </button>
                <span 
                    className="absolute top-4 left-4 text-light text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm"
                    style={{ backgroundColor: `${episode.color}99` }}
                >
                    {episode.category}
                </span>
            </div>
            <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-light truncate mb-2 group-hover:text-primary transition-colors">{episode.title}</h3>
                <p className="text-light/70 text-sm mb-4">
                    por {episode.podcaster.name} ({episode.podcaster.grade})
                </p>
                <div className="flex justify-between items-center text-xs text-light/50 border-t border-darker pt-3 mt-3">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {episode.duration} min</span>
                    <span className="flex items-center gap-1.5"><Headphones size={14} /> {episode.plays.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default EpisodeCard;