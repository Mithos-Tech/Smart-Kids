import React from 'react';
import { Episode } from '../types';
import { Sparkles, TrendingUp } from 'lucide-react';

interface EpisodeCardProps {
    episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
    const isTrending = episode.plays > 1500;

    return (
        <div className="bg-dark rounded-2xl border border-light/10 overflow-hidden hover:border-light/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
            
            {/* Header con padding */}
            <div className="p-5 pb-4 h-28 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-primary flex-shrink-0" />
                        <span className="text-xs font-semibold text-light/50 uppercase tracking-wider">
                            {episode.category}
                        </span>
                    </div>
                    {isTrending && (
                        <span className="text-xs text-red-400 font-semibold flex items-center gap-1 flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            Tendencia
                        </span>
                    )}
                </div>
                
                {/* Título con altura fija (2 líneas máximo) */}
                <h3 className="text-lg font-bold text-light leading-tight line-clamp-2">
                    {episode.title}
                </h3>
                
                {/* Autor en una línea */}
                <div className="flex items-center gap-2 text-xs truncate">
                    <span className="text-light/60">por</span>
                    <span className="text-light font-medium truncate">{episode.podcaster.name}</span>
                    <span className="text-light/30 flex-shrink-0">•</span>
                    <span className="text-light/50 flex-shrink-0">{episode.podcaster.grade}</span>
                </div>
            </div>

            {/* Reproductor Spotify sin padding extra */}
            <div className="px-5 pb-5">
                {episode.embedUrl ? (
                    <iframe
                        style={{ borderRadius: '12px' }}
                        src={episode.embedUrl}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    />
                ) : (
                    <div className="bg-darker rounded-xl h-[352px] flex items-center justify-center text-light/50">
                        No hay reproductor disponible
                    </div>
                )}
            </div>

        </div>
    );
};

export default EpisodeCard;
