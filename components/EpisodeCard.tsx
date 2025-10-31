import React from 'react';
import { Episode } from '../types';
import { Sparkles, TrendingUp, Play, Eye } from 'lucide-react';

interface EpisodeCardProps {
    episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
    const isTrending = episode.plays > 1500;

    // Función para formatear números
    const formatPlays = (plays: number): string => {
        if (plays >= 1000) {
            return `${(plays / 1000).toFixed(1)}k`;
        }
        return plays.toString();
    };

    return (
        <div className="group bg-dark rounded-2xl border border-light/10 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
            
            {/* HEADER: Badges y Metadata */}
            <div className="p-4 pb-3 flex items-start justify-between">
                {/* Badge de Categoría */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                    <Sparkles size={12} className="text-primary flex-shrink-0" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {episode.category}
                    </span>
                </div>

                {/* Badge de Tendencia */}
                {isTrending && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-red-500 uppercase">
                            Tendencia
                        </span>
                    </div>
                )}
            </div>

            {/* SPOTIFY EMBED: Protagonista del card */}
            <div className="px-4">
                {episode.embedUrl ? (
                    <div className="relative overflow-hidden rounded-xl">
                        <iframe
                            style={{ borderRadius: '12px' }}
                            src={episode.embedUrl}
                            width="100%"
                            height="352"
                            frameBorder="0"
                            allowFullScreen={true}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title={`Episodio: ${episode.title}`}
                        />
                    </div>
                ) : (
                    <div className="bg-darker rounded-xl h-[352px] flex flex-col items-center justify-center text-light/50 border border-light/5">
                        <Play size={48} className="mb-3 opacity-30" />
                        <p className="text-sm">No hay reproductor disponible</p>
                    </div>
                )}
            </div>

            {/* FOOTER: Metadata Complementaria (NO redundante) */}
            <div className="p-4 pt-3 flex items-center justify-between text-xs">
                {/* Información Educativa */}
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-darker rounded-md text-light/70 font-medium">
                        {episode.podcaster.grade}
                    </span>
                    <span className="text-light/40">•</span>
                    <span className="text-light/60">{episode.date}</span>
                </div>

                {/* Estadísticas de Engagement */}
                <div className="flex items-center gap-1.5 text-light/50">
                    <Eye size={14} />
                    <span className="font-semibold">{formatPlays(episode.plays)}</span>
                </div>
            </div>

            {/* Hover Effect: Borde animado */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-300 pointer-events-none" />
        </div>
    );
};

export default EpisodeCard;