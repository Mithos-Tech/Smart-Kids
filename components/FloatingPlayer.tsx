import React, { useRef, useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, X } from 'lucide-react';

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const FloatingPlayer: React.FC = () => {
    const { currentEpisode, isPlaying, play, pause, closePlayer } = usePlayer();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    // This effect handles pausing the audio.
    // Playing is handled by the `onCanPlay` event handler to avoid race conditions.
    useEffect(() => {
        const audio = audioRef.current;
        if (audio && !isPlaying) {
            audio.pause();
        }
    }, [isPlaying]);

     useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    if (!currentEpisode) return null;

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };
    
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };
    
    // When the browser can play the audio, this function is called.
    // We check if the player state is "playing" and then start the audio.
    const handleCanPlay = () => {
        const audio = audioRef.current;
        if (audio && isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Audio playback failed:", error);
                    pause(); // Revert state if playback fails
                });
            }
        }
    };

    const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = Number(e.target.value);
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
        }
    };
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0) setIsMuted(false);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const audioUrl = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(currentEpisode.id % 16) + 1}.mp3`;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 animate-slide-up">
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
                .volume-slider {
                    width: 0px;
                    opacity: 0;
                    transition: width 0.2s ease-in-out, opacity 0.2s ease-in-out;
                }
                .group:hover .volume-slider {
                    width: 80px;
                    opacity: 1;
                }
            `}</style>
             <div className="bg-light/95 backdrop-blur-md text-darker p-3 sm:p-4 rounded-2xl shadow-2xl shadow-black/50 max-w-5xl mx-auto grid grid-cols-[auto,1fr] sm:grid-cols-[200px,1fr,200px] items-center gap-4 relative">
                <button onClick={closePlayer} className="absolute top-2 right-2 text-dark/40 hover:text-dark transition-colors z-10" aria-label="Cerrar reproductor">
                    <X size={20} />
                </button>
                
                {/* Episode Info */}
                <div className="flex items-center gap-3">
                    <img src={currentEpisode.thumbnail} alt={currentEpisode.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" />
                    <div className="hidden sm:block">
                        <p className="font-bold text-dark text-base leading-tight truncate">{currentEpisode.title}</p>
                        <p className="text-dark/70 text-sm">{currentEpisode.podcaster.name}</p>
                    </div>
                </div>
                
                {/* Player Controls */}
                <div className="flex flex-col items-center justify-center gap-2 w-full">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button className="text-dark/50 hover:text-dark transition-colors"><Shuffle size={18} /></button>
                        <button className="text-dark/70 hover:text-dark transition-colors"><SkipBack size={24} /></button>
                        <button onClick={isPlaying ? pause : play} className="bg-darker text-light w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                        </button>
                        <button className="text-dark/70 hover:text-dark transition-colors"><SkipForward size={24} /></button>
                        <button className="text-dark/50 hover:text-dark transition-colors"><Repeat size={18} /></button>
                    </div>
                     <div className="w-full flex items-center gap-2">
                        <span className="text-xs text-dark/50 w-10 text-right">{formatTime(progress)}</span>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={progress}
                            onChange={handleScrub}
                            className="w-full h-1.5 bg-dark/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary"
                        />
                        <span className="text-xs text-dark/50 w-10">{formatTime(duration)}</span>
                    </div>
                </div>
                
                {/* Volume & Mobile Title */}
                <div className="hidden sm:flex items-center justify-end group">
                     <button onClick={toggleMute} className="text-dark/70 hover:text-dark transition-colors p-2">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                     </button>
                     <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="volume-slider h-1 bg-dark/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary"
                     />
                </div>
                 <div className="block sm:hidden col-start-2 col-end-3 min-w-0 -mt-2">
                    <p className="font-bold text-dark text-sm leading-tight truncate">{currentEpisode.title}</p>
                    <p className="text-dark/70 text-xs truncate">{currentEpisode.podcaster.name}</p>
                 </div>
            </div>
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onEnded={pause}
            />
        </div>
    );
};

export default FloatingPlayer;