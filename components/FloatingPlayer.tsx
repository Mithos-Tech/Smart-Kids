import React, { useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X } from 'lucide-react'; 

const FloatingPlayer: React.FC = () => {
    // Solo necesitamos currentEpisode y closePlayer.
    const { currentEpisode, closePlayer } = usePlayer();

    if (!currentEpisode) return null;

    // *** CONSTRUCCIÓN DE LA URL DE EMBED COMPACTA DE SOUNDCLOUD ***
    const soundcloudEmbedUrl = useMemo(() => {
        if (!currentEpisode.audioUrl || !currentEpisode.audioUrl.includes('soundcloud.com')) {
            return null;
        }

        const urlEncoded = encodeURIComponent(currentEpisode.audioUrl);
        // Usamos visual=false (modo barra compacta) y una altura de 80 o menos
        // Color: %231f2937 es el color oscuro (dark) para el reproductor.
        return `https://w.soundcloud.com/player/?url=${urlEncoded}&color=%231f2937&auto_play=true&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=true&visual=false`;
    }, [currentEpisode]);

    if (!soundcloudEmbedUrl) return null;
    
    // --- Renderizado del Contenedor de la Barra Flotante ---
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 animate-slide-up">
            {/* Animación CSS (Mantener si es necesaria) */}
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
            
            <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] backdrop-blur-md text-light p-3 sm:p-4 rounded-2xl shadow-2xl shadow-black/50 max-w-6xl mx-auto relative border border-primary/20">
                
                {/* Botón de Cerrar (Mantenido) */}
                <button onClick={closePlayer} className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors z-10 p-1 rounded-full bg-black/20 hover:bg-black/50" aria-label="Cerrar reproductor">
                    <X size={20} />
                </button>
                
                {/* --- ESTRUCTURA SIMPLIFICADA (Línea 68-74 de la instrucción) --- */}
                {/* grid-cols-[auto_1fr_auto]:
                    1. Thumbnail (auto)
                    2. SoundCloud Embed (1fr - ocupa el espacio restante)
                    3. Badge de Streaming (auto)
                */}
                <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center pr-10"> {/* pr-10 para dejar espacio al botón de cerrar */}
                    
                    {/* Thumbnail */}
                    <img 
                        src={currentEpisode.thumbnail} 
                        alt={currentEpisode.title} 
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-lg" 
                    />
                    
                    {/* SoundCloud Embed (Centro - 1fr) */}
                    {/* Altura de 80px es estándar para el reproductor compacto */}
                    <div className="flex items-center justify-center min-w-0">
                        <iframe
                            // width="100%" y height="80" son las dimensiones ideales para el reproductor compacto.
                            width="100%"
                            height="80" 
                            scrolling="no"
                            frameBorder="no"
                            allow="autoplay"
                            src={soundcloudEmbedUrl}
                            title={`Reproductor de ${currentEpisode.title}`}
                            className="w-full rounded-xl"
                        ></iframe>
                    </div>
                    
                    {/* Badge de Streaming (Derecha - Oculto en móviles) */}
                    <div className="hidden sm:block">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
                            SOUNDCLOUD
                        </span>
                    </div>
                </div> 
                
            </div>
            {/* ELIMINAMOS COMPLETAMENTE LA ETIQUETA <audio> NATIVA */}
        </div>
    );
};

export default FloatingPlayer;