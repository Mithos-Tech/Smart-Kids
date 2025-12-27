import React, { memo, useCallback } from 'react';
import { Clock, Headphones, Heart } from 'lucide-react';
import { Episode } from '../types';

interface Props {
  episode: Episode;
  currentLikes: number;
  onLike: (episodeId: string, currentLikes: number) => void;
  isLiking?: boolean;
}

// 🎯 OPTIMIZACIÓN: Memoización con comparación profunda
const EpisodeCardComponent: React.FC<Props> = ({
  episode,
  currentLikes,
  onLike,
  isLiking = false
}) => {
  // useCallback para evitar re-renders
  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(episode.id, currentLikes);
  }, [episode.id, currentLikes, onLike]);

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card-bg border border-white/10 backdrop-blur-sm flex flex-col h-full transition-transform hover:scale-[1.02] will-change-transform">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={episode.imageUrl}
          alt={episode.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
          loading="lazy"
          decoding="async"
        />

        {/* Botón de Like */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          aria-label={`Like ${episode.title}`}
          className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 hover:scale-110 ${
            isLiking
              ? 'bg-gray-500/20 border-gray-500 cursor-not-allowed'
              : 'bg-white/10 border-white/20 hover:bg-red-500/30 hover:border-red-500'
          }`}
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              isLiking
                ? 'text-gray-500'
                : 'text-white hover:text-red-500 hover:fill-red-500'
            }`}
          />
        </button>
      </div>

      <a
        href={episode.spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-5 flex flex-col flex-grow hover:bg-white/5 transition-colors"
      >
        <h3 className="font-display font-bold text-lg mb-2 line-clamp-2">
          {episode.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          {episode.author} • {episode.grade}
        </p>

        <div className="pt-4 mt-auto border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock size={14} /> {episode.duration}
          </div>
          <div className="flex items-center gap-1 text-red-500">
            <Heart size={12} className="fill-current" /> {currentLikes}
          </div>
          <div className="flex items-center gap-1">
            <Headphones size={14} /> {episode.plays}
          </div>
        </div>
      </a>
    </div>
  );
};

// Comparación personalizada para evitar re-renders innecesarios
export const EpisodeCard = memo(EpisodeCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.episode.id === nextProps.episode.id &&
    prevProps.currentLikes === nextProps.currentLikes &&
    prevProps.isLiking === nextProps.isLiking
  );
});