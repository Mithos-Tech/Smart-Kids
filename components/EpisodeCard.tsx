
import React, { useState } from 'react';
import { Play, Clock, Headphones, ExternalLink, Heart } from 'lucide-react';
import { Episode } from '../types';
import { motion } from 'framer-motion';

interface Props {
  episode: Episode;
}

export const EpisodeCard: React.FC<Props> = ({ episode }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(episode.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
    
    // Here you would trigger the backend update
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Ciencia': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Historia': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Cuentos': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <motion.a 
      href={episode.spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl overflow-hidden bg-card-bg border border-white/10 backdrop-blur-sm flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={episode.imageUrl} 
          alt={episode.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 transform scale-50 group-hover:scale-100 transition-transform">
            <Play className="fill-white text-white ml-1" size={24} />
          </div>
        </div>

        {/* Category Badge - Top Left */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${getCategoryColor(episode.category)}`}>
          {episode.category}
        </div>

        {/* Like Button - Top Right */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleLike}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors z-20
            ${isLiked 
              ? 'bg-red-500/20 border-red-500/50 text-red-500' 
              : 'bg-black/30 border-white/10 text-white hover:bg-black/50'
            }`}
        >
          <Heart size={16} className={isLiked ? 'fill-current' : ''} />
        </motion.button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-auto">
          <h3 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {episode.title}
          </h3>
          <p className="text-sm text-gray-400 font-medium mb-3">{episode.author} • {episode.grade}</p>
        </div>
        
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>{episode.duration}</span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Likes Count Display */}
             <div className="flex items-center gap-1.5 text-gray-400">
                <Heart size={12} className={isLiked ? 'text-red-500 fill-red-500' : ''} /> 
                <span>{likes}</span>
             </div>
             
             <div className="flex items-center gap-2 group-hover:text-green-400 transition-colors">
                <span className="hidden group-hover:inline">Spotify</span>
                <ExternalLink size={14} className="hidden group-hover:block" />
                <span className="group-hover:hidden flex items-center gap-2"><Headphones size={14} /> {episode.plays}</span>
             </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
};
