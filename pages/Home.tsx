import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Play, ArrowRight, Clock, Headphones, Music2, Star, Send, Instagram, Twitter, Facebook, Linkedin, Sparkles, BarChart3, Trophy, Quote, ChevronRight, ChevronLeft, ExternalLink, Heart, TrendingUp, Bell } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useEpisodes, useTeam } from '../firebase/hooks';
import { Link } from 'react-router-dom';

// --- Visual Effect Components ---

interface AudioWaveProps {
  color?: string;
  count?: number;
  height?: string;
}

const AudioWave: React.FC<AudioWaveProps> = ({ color = "bg-primary", count = 8, height = "h-8" }) => (
  <div className={`flex items-end gap-1 ${height}`}>
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className={`w-1 rounded-full ${color}`}
        animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: i * 0.1,
          repeatType: "mirror"
        }}
      />
    ))}
  </div>
);

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

// --- Sections ---

const SectionHero = () => {
  const platformLogos = [
    { name: 'Spotify', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763670317/Spotify_oabsyx.png', link: 'https://spotify.com' },
    { name: 'Apple Podcasts', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763670317/Apple_Podcasts_fwt12k.png', link: 'https://apple.com/podcasts' },
    { name: 'Google Podcasts', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763670316/Google_Podcasts_blyorr.png', link: 'https://podcasts.google.com' },
    { name: 'SoundCloud', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763670317/soundcloud_flfrpq.png', link: 'https://soundcloud.com' },
    { name: 'Pocket Casts', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/v1763670316/pocketcasts_xqo0zl.png', link: 'https://pocketcasts.com' },
  ];

  const handleScrollToTrending = () => {
    document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-32 pb-20 overflow-hidden">
      {/* Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text */}
        <div className="text-center lg:text-left">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:border-primary/50 transition-colors cursor-default mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold tracking-wider text-white uppercase">Nueva Temporada 2025</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display font-bold text-5xl md:text-7xl tracking-tight mb-6 leading-[1.1]">
              Hablamos, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-shine bg-[length:200%_auto]">
                Tú Escuchas
              </span>
            </h1>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
              Descubre el talento y creatividad de nuestros estudiantes a través de podcasts educativos, historias inmersivas y entrevistas.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Link to="/episodes" className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-full overflow-hidden shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300">
                <span className="relative z-10 flex items-center gap-2">Descubre Ahora <ArrowRight size={18} /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:animate-shine" />
              </Link>
              
              <button 
                onClick={handleScrollToTrending}
                className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 text-white font-medium transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
              >
                <TrendingUp size={18} className="text-white" /> Ver Tendencias
              </button>
            </div>
          </Reveal>

          {/* Platform Icons Section - Sophisticated & Linked (Full Color) */}
          <Reveal delay={0.4}>
            <div className="flex flex-col items-center lg:items-start gap-4">
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Disponible en todas las plataformas</span>
               <div className="flex flex-wrap justify-center lg:justify-start gap-6 items-center p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  {platformLogos.map((platform, i) => (
                    <a 
                      key={i} 
                      href={platform.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative transition-all duration-300 hover:-translate-y-1"
                    >
                       {/* Subtle glow on hover */}
                       <div className="absolute inset-0 bg-white/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                       <img 
                         src={platform.url} 
                         alt={platform.name} 
                         className="h-6 md:h-8 w-auto object-contain relative z-10 filter drop-shadow-md hover:scale-110 transition-transform duration-300"
                       />
                    </a>
                  ))}
               </div>
            </div>
          </Reveal>
        </div>

        {/* Right Column: Sophisticated 3D Mosaic - Rebalanced */}
        <div className="hidden lg:block relative h-[600px] w-full perspective-1000">
           <motion.div 
             className="relative w-full h-full"
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 1 }}
           >
              {/* Central Main Image */}
              <motion.div 
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] rounded-[2rem] overflow-hidden shadow-2xl z-20 border border-white/10"
                 animate={{ y: [-10, 10, -10] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                 <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Student Podcaster" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
                       <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                       EN VIVO
                    </div>
                    <h3 className="text-white font-bold text-xl leading-tight">Historias que inspiran</h3>
                 </div>
              </motion.div>

              {/* Floating Card Top Right (Album Art) */}
              <motion.div 
                className="absolute top-12 right-0 w-48 h-48 rounded-2xl overflow-hidden shadow-xl z-10 border border-white/10"
                animate={{ y: [10, -10, 10], rotate: [6, 4, 6] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                 <img src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=500&auto=format&fit=crop" className="w-full h-full object-cover" alt="Cover Art" />
              </motion.div>

              {/* Floating Card Bottom Left (Player UI) */}
              <motion.div 
                 className="absolute bottom-24 left-0 w-64 bg-[#1a1f35]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl z-30"
                 animate={{ y: [15, -15, 15], x: [-5, 5, -5] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                 <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                       <Music2 size={20} />
                    </div>
                    <div>
                       <div className="h-2 w-24 bg-white/20 rounded-full mb-1.5"></div>
                       <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                    </div>
                 </div>
                 <AudioWave count={12} height="h-8" color="bg-primary" />
              </motion.div>

              {/* Decorative Elements */}
              <motion.div 
                 className="absolute top-10 left-20 text-secondary opacity-60"
                 animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                 <Sparkles size={48} />
              </motion.div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

const SectionRecentEpisode = ({ episodes }: { episodes: any[] }) => {
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const EPISODES = episodes;

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="trending" className="py-24 px-6 max-w-7xl mx-auto">
      <Reveal>
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Nuevos Lanzamientos</span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl">Episodios Recientes</h2>
          </div>
          <Link 
            to="/episodes" 
            className="group px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 hover:border-primary/50 transition-all flex items-center gap-2 text-sm font-bold text-white"
          >
            Ver más <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-primary"/>
          </Link>
        </div>
      </Reveal>

      {/* Grid System - 7/5 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Hero Card */}
        <div className="lg:col-span-7 relative group rounded-[2.5rem] overflow-hidden border border-white/10 h-[600px] shadow-2xl transform-gpu z-0">
          {/* Full Background Image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[2.5rem]">
              <img 
                  src={EPISODES[0].imageUrl} 
                  alt="Background" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform" 
              />
          </div>

          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/50 to-transparent opacity-95 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/80 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Hover Overlay Highlight */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Like Button (Hero) */}
          <button 
            onClick={(e) => toggleLike(e, EPISODES[0].id)}
            className={`absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 z-30 hover:scale-110
                ${likes[EPISODES[0].id] ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}
            `}
          >
             <Heart size={20} className={likes[EPISODES[0].id] ? 'fill-current' : ''} />
          </button>

          {/* Content Container */}
          <div className="relative h-full z-20 p-8 md:p-12 flex flex-col justify-end items-start">
               
               <div className="mb-2 flex items-center gap-3">
                   <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold backdrop-blur-md">
                      🔥 TENDENCIA #1
                   </span>
                   <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">
                      {EPISODES[0].grade}
                   </span>
               </div>
               
               <h3 className="font-display font-bold text-4xl md:text-6xl mb-4 leading-[1.1] text-white drop-shadow-lg max-w-2xl">
                 {EPISODES[0].title}
               </h3>
               
               <p className="text-gray-200 mb-8 text-lg md:text-xl leading-relaxed max-w-xl drop-shadow-md font-medium">
                 {EPISODES[0].description}
               </p>
               
               <div className="flex flex-wrap items-center gap-6 md:gap-10 w-full border-t border-white/10 pt-6">
                 <div className="flex flex-col gap-1">
                   <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tiempo</span>
                   <div className="flex items-center gap-2 text-white font-medium">
                      <Clock size={16} className="text-primary"/> {EPISODES[0].duration}
                   </div>
                 </div>
                 
                 <div className="flex flex-col gap-1">
                   <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Reproducciones</span>
                   <div className="flex items-center gap-2 text-white font-medium">
                      <Headphones size={16} className="text-secondary"/> {EPISODES[0].plays.toLocaleString()}
                   </div>
                 </div>

                 <div className="flex flex-col gap-1 flex-grow md:flex-grow-0">
                   <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Audio</span>
                   <div className="h-6 flex items-center">
                      <AudioWave color="bg-white" count={8} height="h-4" />
                   </div>
                 </div>

                  {/* Updated Button to link to Spotify with Official Branding */}
                  <a 
                      href={EPISODES[0].spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto bg-[#1DB954] hover:bg-[#1ed760] text-white px-8 py-4 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-[0_10px_30px_rgba(29,185,84,0.3)] flex items-center gap-2 cursor-pointer"
                  >
                      Escuchar en Spotify <ExternalLink size={16} />
                  </a>
               </div>
          </div>
        </div>

        {/* Side List */}
        <div className="lg:col-span-5 flex flex-col h-[600px] justify-between">
          {EPISODES.slice(1, 4).map((ep, i) => (
            <motion.a 
              href={ep.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={ep.id} 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2 }} 
              className="group relative flex-1 bg-[#1a1f35]/40 hover:bg-[#1a1f35] border border-white/5 hover:border-white/10 rounded-[2rem] flex gap-4 items-center p-4 transition-all cursor-pointer overflow-hidden backdrop-blur-sm mb-4 last:mb-0 shadow-lg hover:shadow-xl"
              whileHover={{ x: -5 }}
            >
               {/* Adjusted to vertical poster aspect ratio */}
               <div className="w-28 h-36 md:w-32 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-md bg-[#0a0f1e]">
                 <img src={ep.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                 <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                    <Play size={12} className="text-white fill-white ml-0.5" />
                 </div>
               </div>
               
               <div className="min-w-0 z-10 flex flex-col justify-center pr-2 h-full py-2 w-full">
                 <div className="flex justify-between items-start mb-1.5">
                     <div className="flex items-center gap-2">
                         <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold uppercase text-gray-400 border border-white/5">{ep.category}</span>
                     </div>
                     {/* Small Like Button for List Items */}
                     <button 
                        onClick={(e) => toggleLike(e, ep.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${likes[ep.id] ? 'text-red-500 bg-red-500/10' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                     >
                        <Heart size={14} className={likes[ep.id] ? 'fill-current' : ''} />
                     </button>
                 </div>
                 <h4 className="font-display font-bold text-white text-lg leading-tight line-clamp-2 mb-2 group-hover:text-[#1DB954] transition-colors">{ep.title}</h4>
                 <div className="text-xs text-gray-500 font-medium flex items-center gap-3 mt-auto">
                     <span className="flex items-center gap-1"><Clock size={12}/> {ep.duration}</span>
                     <span className="flex items-center gap-1"><BarChart3 size={12}/> {ep.grade}</span>
                 </div>
               </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionHostHighlight = () => (
  <section className="py-32 relative overflow-hidden">
    {/* Floating Blobs Background - Local to section for emphasis but transparent base */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      <motion.div 
        className="relative order-2 lg:order-1 flex justify-center h-[500px] lg:h-[600px] items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-full h-full max-w-[600px]">
           {/* Rotating Rings - Behind Image */}
           <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-[500px] h-[500px] rounded-full border border-dashed border-white/20 animate-spin-slow"></div>
              <div className="absolute w-[400px] h-[400px] rounded-full border border-white/10 animate-[spin_30s_linear_infinite_reverse]"></div>
           </div>
           
           {/* Main Image - No Container - Floating Free */}
           <div className="absolute inset-0 flex items-center justify-center z-20">
             <img 
               src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1763677415/Blob_esdauu.png" 
               className="w-[110%] h-[110%] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
               alt="Estudiante Destacado"
             />
           </div>

           {/* Rotating Text Badge - Floating */}
           <motion.div 
             className="absolute bottom-10 left-0 lg:bottom-20 lg:left-0 w-32 h-32 md:w-40 md:h-40 z-30 bg-[#0a0f1e] rounded-full flex items-center justify-center border border-white/10 shadow-2xl shadow-primary/20 cursor-pointer"
             whileHover={{ scale: 1.1 }}
           >
             <div className="relative w-full h-full animate-[spin_10s_linear_infinite]">
                <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                    <defs>
                        <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                    </defs>
                    <text fontSize="10.5" fill="#10b981" fontWeight="bold" letterSpacing="1.2">
                        <textPath href="#circle">
                           ★ ESTUDIANTE DEL MES ★ MEJOR PODCAST
                        </textPath>
                    </text>
                </svg>
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                 <Trophy className="text-white w-8 h-8 md:w-10 md:h-10 fill-white/20" />
             </div>
           </motion.div>
        </div>
      </motion.div>

      <div className="order-1 lg:order-2">
        <Reveal>
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 border border-primary/20 tracking-wider">
                ORGULLO ESCOLAR
            </div>
            
            <h2 className="font-display font-bold text-5xl md:text-7xl mb-4 leading-[0.95] text-white">
              Mateo <br/>
              <span className="text-gray-500">Velásquez</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 mb-10 font-medium">
                5° Grado - Sección B
            </p>

            <div className="relative mb-10">
                {/* Decorative Quote Mark */}
                <div className="absolute -top-8 -left-4 text-8xl text-white/5 font-serif leading-none pointer-events-none z-0 select-none">"</div>
                <p className="relative z-10 text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                  Al principio me daba <span className="text-accent font-bold">miedo</span> hablar, pero aprendí que mi <span className="text-primary font-bold">propia voz</span> tiene poder. Grabar sobre 'Mitos Locales' fue una <span className="text-secondary font-bold">aventura increíble</span> que me enseñó a creer en mí mismo.
                </p>
            </div>
            
            <div className="flex gap-4">
                <Link to="/team" className="group bg-white text-dark-bg font-bold py-4 px-8 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  Conoce al Equipo 
                  <span className="bg-black text-white rounded-full p-1 group-hover:rotate-45 transition-transform">
                    <ArrowRight size={14} />
                  </span>
                </Link>
            </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const SectionBigText = () => {
    const { scrollYProgress } = useScroll();
    const x = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <section className="py-32 relative overflow-hidden flex flex-col justify-center items-center">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            {/* Updated text size for mobile responsiveness: text-5xl on mobile, text-9xl on desktop */}
            <motion.div style={{ x }} className="w-full whitespace-nowrap">
                <h2 className="font-display font-bold text-5xl md:text-9xl opacity-10 text-white select-none text-center">
                    DESCUBRE LAS
                </h2>
            </motion.div>
            
            <motion.div style={{ x: x2 }} className="w-full whitespace-nowrap -mt-2 md:-mt-12">
                <div className="font-display font-bold text-5xl md:text-9xl text-center">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-white to-gray-600 animate-shine bg-[length:200%_auto]">
                        VOCES DEL FUTURO
                    </span>
                </div>
            </motion.div>
        </section>
    );
};

const SectionFeaturedPodcasts = ({ episodes }: { episodes: any[] }) => {
  const EPISODES = episodes;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420; // Approx card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <Reveal>
          <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">Selección de los Oyentes</span>
          </div>
          <h2 className="font-display font-bold text-4xl">Podcasts Destacados</h2>
        </Reveal>
        
        {/* Navigation buttons visible on all screens but resized/styled for mobile */}
        <div className="flex gap-3">
           <button 
             onClick={() => scroll('left')}
             className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-white transition-colors z-20"
           >
             <ArrowRight className="rotate-180" size={20}/>
           </button>
           <button 
             onClick={() => scroll('right')}
             className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform z-20"
           >
             <ArrowRight size={20}/>
           </button>
        </div>
      </div>
      
      {/* Large Poster Carousel */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto px-6 py-12 scrollbar-hide snap-x snap-mandatory"
      >
         {[...EPISODES].reverse().map((ep) => (
           <motion.a 
              href={ep.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={ep.id} 
              className="min-w-[85vw] md:min-w-[400px] snap-center group relative h-[550px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 cursor-pointer block"
              whileHover={{ y: -15, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
           >
             <img 
               src={ep.imageUrl} 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               alt={ep.title}
             />
             
             {/* Dark Gradient Overlay for readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/40 to-transparent opacity-90" />
             
             {/* Like Button (Carousel) */}
             <button 
                onClick={(e) => toggleLike(e, ep.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 z-30 hover:scale-110
                    ${likes[ep.id] ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-black/30 border-white/10 text-white hover:bg-black/50'}
                `}
             >
                 <Heart size={18} className={likes[ep.id] ? 'fill-current' : ''} />
             </button>

             {/* Play Button Centered on Hover */}
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-20 h-20 bg-[#1DB954] backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                   <Play className="text-white ml-1" size={32} fill="white"/>
                </div>
             </div>

             <div className="absolute bottom-0 left-0 w-full p-8">
                 <div className="text-xs text-primary font-bold uppercase mb-2 tracking-wider flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    {ep.category}
                 </div>
                 <h3 className="font-display font-bold text-white text-3xl leading-tight mb-2 group-hover:text-[#1DB954] transition-colors">{ep.title}</h3>
                 <p className="text-gray-400 font-medium mb-4 line-clamp-2">{ep.description}</p>
                 
                 <div className="flex items-center gap-6 text-sm text-gray-500 font-medium border-t border-white/10 pt-4">
                     <span className="flex items-center gap-2"><Clock size={14} className="text-gray-400"/> {ep.duration}</span>
                     <span className="flex items-center gap-2"><Headphones size={14} className="text-gray-400"/> {ep.plays}</span>
                 </div>
             </div>
           </motion.a>
         ))}
      </div>
    </section>
  );
};

const SectionTestimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 6000); // Change every 6 seconds
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

    return (
        <section className="py-32 bg-[#02040a] relative overflow-hidden border-y border-white/5">
            {/* Spotlight Background Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] opacity-50 pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Voces del Proyecto</h2>
                    <p className="text-gray-500 uppercase tracking-widest text-sm">Lo que dicen nuestros educadores</p>
                </div>

                <div className="relative min-h-[400px] flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
                    {/* Navigation Buttons - Absolute on mobile, relative on desktop */}
                    <button onClick={prevSlide} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 items-center justify-center text-gray-400 hover:text-white hover:border-primary transition-all hover:scale-110 z-20">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/10 items-center justify-center text-gray-400 hover:text-white hover:border-primary transition-all hover:scale-110 z-20">
                        <ChevronRight size={24} />
                    </button>

                    <AnimatePresence mode='wait'>
                        <motion.div 
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto"
                        >
                            {/* Avatar with Progress Ring */}
                            <div className="relative flex-shrink-0">
                                <div className="w-48 h-48 md:w-64 md:h-64 relative">
                                    {/* Progress Ring SVG */}
                                    <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="48" fill="none" stroke="#1f2937" strokeWidth="2" />
                                        <motion.circle 
                                            cx="50" cy="50" r="48" fill="none" stroke="#10b981" strokeWidth="2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 6, ease: "linear" }}
                                        />
                                    </svg>
                                    {/* Image */}
                                    <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-[#02040a]">
                                        <img 
                                            src={TESTIMONIALS[currentIndex].imageUrl} 
                                            alt={TESTIMONIALS[currentIndex].name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="text-center md:text-left flex-1">
                                <div className="mb-6 relative">
                                    <Quote className="text-primary/20 w-16 h-16 absolute -top-8 -left-6 transform -scale-x-100" />
                                    <h3 className="text-2xl md:text-4xl font-display font-medium italic leading-snug text-gray-200 relative z-10">
                                        "{TESTIMONIALS[currentIndex].text}"
                                    </h3>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-xl">{TESTIMONIALS[currentIndex].name}</h4>
                                    <p className="text-primary font-medium">{TESTIMONIALS[currentIndex].role}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                {/* Mobile Controls */}
                <div className="flex md:hidden justify-center gap-6 mt-8">
                     <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"><ChevronLeft /></button>
                     <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center"><ChevronRight /></button>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-3 mt-12">
                    {TESTIMONIALS.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-700 hover:bg-gray-500'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const SectionCommunityHub = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        date: serverTimestamp()
      });
      setMessage('¡Gracias por suscribirte! 🎉');
      setEmail('');
    } catch (error) {
      setMessage('Error al suscribirse. Intenta de nuevo.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section id="community" className="py-32 px-6 max-w-7xl mx-auto relative">
      <Reveal>
        <div 
          className="group relative bg-[#1a1f35]/60 backdrop-blur-xl rounded-[3rem] p-10 md:p-20 overflow-hidden border border-white/10 transition-all"
          onMouseMove={handleMouseMove}
        >
          {/* Holographic Glow Effect following Mouse */}
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  650px circle at ${mouseX}px ${mouseY}px,
                  rgba(16, 185, 129, 0.15),
                  transparent 80%
                )
              `,
            }}
          />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Side: Text */}
            <div className="lg:w-1/2 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                  <Sparkles size={14} /> Community Hub
               </div>
               <h2 className="font-display font-bold text-5xl md:text-6xl mb-6 text-white leading-tight">
                 Únete a nuestra <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">comunidad escolar</span>
               </h2>
               <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                 Sé parte del movimiento. Recibe episodios exclusivos, invitaciones a talleres de podcasting y novedades antes que nadie.
               </p>
               
               <div className="flex gap-4 justify-center lg:justify-start">
                   {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                     <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:scale-110 hover:text-primary transition-all border border-white/5">
                       <Icon size={22} />
                     </a>
                   ))}
               </div>
            </div>

            {/* Right Side: Interactive Form Card */}
            <div className="w-full lg:w-5/12">
               <div className="bg-[#0a0f1e]/80 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Mantente al día</h3>
                  <p className="text-sm text-gray-500 mb-6">Únete a más de 1,200 suscriptores felices.</p>
                  
                  <form onSubmit={handleSubscribe} className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-2 block">Tu Correo Electrónico</label>
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ejemplo@escuela.edu" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary transition-colors"
                          required
                          disabled={loading}
                        />
                     </div>
                     {message && (
                       <div className={`text-sm p-3 rounded-xl ${message.includes('Gracias') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                         {message}
                       </div>
                     )}
                     <button 
                       type="submit"
                       disabled={loading}
                       className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {loading ? 'Enviando...' : 'Suscribirme Ahora'} <Send size={18} />
                     </button>
                  </form>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-500">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                     <span>No enviamos spam, prometido.</span>
                  </div>
               </div>
            </div>
          </div>
      </Reveal>
    </section>
  );
};

const Home = () => {
  const { episodes, loading: loadingEpisodes } = useEpisodes();
  const { team, loading: loadingTeam } = useTeam();

  if (loadingEpisodes || loadingTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const EPISODES = episodes;
  const TEAM = team;

  return (
    <>
      <SectionHero />
      <SectionRecentEpisode episodes={EPISODES} />
      <SectionHostHighlight />
      <SectionBigText />
      <SectionFeaturedPodcasts episodes={EPISODES} />
      <SectionTestimonials />
      <SectionCommunityHub />
    </>
  );
};

export default Home;