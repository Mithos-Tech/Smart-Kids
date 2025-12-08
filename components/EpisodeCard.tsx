import React, { useState } from 'react';
import { Play, Clock, Headphones, ExternalLink, Heart } from 'lucide-react';
import { Episode } from '../types';
import { motion } from 'framer-motion';

interface Props {
  episode: Episode;
}

export const EpisodeCard: React.FC<Props> = ({ episode }) => {
  const [likes, setLikes] = useState(episode.likes);

  const handleLike = () => {
    alert('CLICK FUNCIONA!');
    setLikes(prev => prev + 1);
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card-bg border border-white/10 backdrop-blur-sm flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={episode.imageUrl} alt={episode.title} className="w-full h-full object-cover" />
        <button onClick={handleLike} type="button" style={{position: 'absolute', top: '12px', right: '12px', zIndex: 999, width: '40px', height: '40px', background: 'red', borderRadius: '50%', border: 'none', cursor: 'pointer'}}>
          <Heart size={18} color="white" />
        </button>
      </div>
      <a href={episode.spotifyUrl} target="_blank" rel="noopener noreferrer" className="p-5 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-lg mb-2">{episode.title}</h3>
        <p className="text-sm text-gray-400 mb-3">{episode.author} • {episode.grade}</p>
        <div className="pt-4 mt-auto border-t border-white/10 flex items-center justify-between text-xs">
          <div><Clock size={14} /> {episode.duration}</div>
          <div><Heart size={12} /> {likes}</div>
          <div><Headphones size={14} /> {episode.plays}</div>
        </div>
      </a>
    </div>
  );
};
