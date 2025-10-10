import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Episode } from '../types';

interface PlayerContextType {
    currentEpisode: Episode | null;
    isPlaying: boolean;
    playEpisode: (episode: Episode) => void;
    play: () => void;
    pause: () => void;
    closePlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const playEpisode = useCallback((episode: Episode) => {
        setCurrentEpisode(episode);
        setIsPlaying(true);
    }, []);

    const play = useCallback(() => {
        if (currentEpisode) {
            setIsPlaying(true);
        }
    }, [currentEpisode]);
    
    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const closePlayer = useCallback(() => {
        setIsPlaying(false);
        setCurrentEpisode(null);
    }, []);

    const value = {
        currentEpisode,
        isPlaying,
        playEpisode,
        play,
        pause,
        closePlayer,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = (): PlayerContextType => {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};