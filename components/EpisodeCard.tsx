import React, { useState } from 'react';
import { Episode } from '../types';
import { Sparkles, Play, Eye, ExternalLink } from 'lucide-react';

interface EpisodeCardProps {
    episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
    const isTrending = episode.plays > 1500;
    const [embedError, setEmbedError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const formatPlays = (plays: number): string => {
        if (plays >= 1000) {
            return `${(plays / 1000).toFixed(1)}k`;
        }
        return plays.toString();
    };

    const getSpotifyShareUrl = (embedUrl: string): string => {
        const match = embedUrl.match(/episode\/([a-zA-Z0-9]+)/);
        if (match) {
            return `https://open.spotify.com/episode/${match[1]}`;
        }
        return embedUrl;
    };

    return (
        <div className="group bg-dark rounded-2xl border border-light/10 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
            <div className="p-4 pb-3 flex items-start justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                    <Sparkles size={12} className="text-primary flex-shrink-0" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {episode.category}
                    </span>
                </div>

                {isTrending && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-red-500 uppercase">
                            Tendencia
                        </span>
                    </div>
                )}
            </div>

            <div className="px-4">
                {episode.embedUrl ? (
                    embedError ? (
                        <div className="bg-gradient-to-br from-[#1DB954] to-[#1ed760] rounded-xl h-[352px] flex flex-col items-center justify-center p-6 text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-4">
                                <Play size={48} className="text-white" />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">{episode.title}</h3>
                            <p className="text-white/80 text-sm mb-6 line-clamp-2">{episode.description}</p>
                            <a
                                href={getSpotifyShareUrl(episode.embedUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-[#1DB954] font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <ExternalLink size={18} />
                                Abrir en Spotify
                            </a>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-xl">
                            {isLoading && (
                                <div className="absolute inset-0 bg-darker rounded-xl flex items-center justify-center z-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            )}
                            <iframe
                                style={{ borderRadius: '12px' }}
                                src={episode.embedUrl}
                                width="100%"
                                height="352"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                title={`Episodio: ${episode.title}`}
                                onLoad={() => setIsLoading(false)}
                                onError={() => {
                                    console.log('Error cargando Spotify embed para:', episode.title);
                                    setEmbedError(true);
                                    setIsLoading(false);
                                }}
                            />
                        </div>
                    )
                ) : (
                    <div className="bg-darker rounded-xl h-[352px] flex flex-col items-center justify-center text-light/50 border border-light/5">
                        <Play size={48} className="mb-3 opacity-30" />
                        <p className="text-sm">No hay reproductor disponible</p>
                    </div>
                )}
            </div>

            <div className="p-4 pt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-darker rounded-md text-light/70 font-medium">
                        {episode.podcaster.grade}
                    </span>
                    <span className="text-light/40">•</span>
                    <span className="text-light/60">{episode.date}</span>
                </div>

                <div className="flex items-center gap-1.5 text-light/50">
                    <Eye size={14} />
                    <span className="font-semibold">{formatPlays(episode.plays)}</span>
                </div>
            </div>
        </div>
    );
};

export default EpisodeCard;