
import React from 'react';
import { TIMELINE_EVENTS } from '../constants';
import { useTeam, useGallery } from '../firebase/hooks';
import { Mail, Linkedin, Target, Users, Sparkles, Award, Globe, Lightbulb, Calendar, ArrowRight, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SectionHero = () => (
  <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
     {/* Local Background Effects */}
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
     
     <div className="max-w-4xl mx-auto relative z-10">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.8 }}
         className="flex flex-col items-center"
       >
           {/* Sophisticated Audio Waveform Graphic - Harmonized with Episodes Page */}
           <div className="mb-8 opacity-60">
              <svg width="300" height="40" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 md:w-80 h-auto">
                  <defs>
                      <linearGradient id="waveGradientTeam" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                          <stop stopColor="rgba(255,255,255,0)" />
                          <stop offset="0.5" stopColor="#10b981" />
                          <stop offset="1" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                  </defs>
                  <path d="M2 20C2 20 15.5 20 25 20C34.5 20 35.5 12 45 12C54.5 12 55.5 28 65 28C74.5 28 75.5 8 85 8C94.5 8 95.5 32 105 32C114.5 32 115.5 15 125 15C134.5 15 135.5 25 145 25C154.5 25 155.5 5 165 5C174.5 5 175.5 35 185 35C194.5 35 195.5 18 205 18C214.5 18 215.5 22 225 22C234.5 22 235.5 10 245 10C254.5 10 255.5 30 265 30C274.5 30 280 20 298 20" 
                        stroke="url(#waveGradientTeam)" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse"
                  />
                  <path d="M2 20 H 300" stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 4"/>
              </svg>
           </div>

           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              Innovación Educativa
           </div>
           
           <h1 className="font-display font-bold text-5xl md:text-7xl mb-8 leading-tight text-white">
             La Evolución de <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary animate-shine bg-[length:200%_auto]">
                Smart Kids
             </span>
           </h1>
           
           <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
             La historia de cómo un taller escolar se transformó en esta plataforma digital, amplificando la voz de cada estudiante.
           </p>
       </motion.div>
     </div>
  </section>
);

const SectionTimeline = () => {
  const getIcon = (iconName: string) => {
    switch(iconName) {
        case 'spark': return <Lightbulb size={18} />;
        case 'award': return <Award size={18} />;
        case 'users': return <Users size={18} />;
        case 'globe': return <Globe size={18} />;
        default: return <Target size={18} />;
    }
  };

  return (
    <section className="py-24 px-6 relative max-w-5xl mx-auto">
        <div className="text-center mb-20">
            <h2 className="font-display font-bold text-4xl mb-4 text-white">El Viaje Evolutivo</h2>
            <p className="text-gray-500 text-sm uppercase tracking-widest">Hitos que marcaron nuestro camino</p>
        </div>

        <div className="relative pl-4 md:pl-0">
            {/* Vertical Track Line - Single Side Layout */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent opacity-30"></div>

            <div className="space-y-12">
                {TIMELINE_EVENTS.map((event, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: idx * 0.15 }}
                        className="relative flex gap-8 md:gap-12 items-start group"
                    >
                        {/* Node on Track */}
                        <div className="absolute left-4 md:left-8 -translate-x-1/2 w-4 h-4 bg-[#0a0f1e] border-2 border-primary rounded-full z-10 mt-6 shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover:scale-125 transition-transform duration-300"></div>

                        {/* Spacer for track */}
                        <div className="w-8 md:w-12 flex-shrink-0"></div>

                        {/* Content Card */}
                        <div className="flex-grow">
                            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden group-hover:bg-white/[0.02]">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            {getIcon(event.icon)}
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-primary uppercase tracking-wider mb-0.5">{event.phase}</span>
                                            <h3 className="text-xl font-bold text-white">{event.title}</h3>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-full self-start md:self-center">{event.year}</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-sm border-l-2 border-white/10 pl-4">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

const SectionFounders = ({ team }: { team: any[] }) => {
  const TEAM = team;
  return (
  <section className="py-32 px-6 relative">
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
     
     <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
           <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 text-white">Arquitectos del Proyecto</h2>
           <p className="text-gray-400 max-w-xl mx-auto">Los 5 docentes y colaboradores que transformaron una idea en realidad.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
           {TEAM.map((member, idx) => (
             <motion.div 
               key={member.id}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: idx * 0.1 }}
               className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-[#0a0f1e] border border-white/5"
             >
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                   <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{member.role}</p>
                   <h3 className="text-white font-bold text-lg leading-tight mb-2">{member.name}</h3>
                   <div className="h-px w-12 bg-white/30 mb-3 group-hover:w-full transition-all duration-500"></div>
                   <p className="text-gray-400 text-xs line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                      "{member.quote}"
                   </p>
                </div>
             </motion.div>
           ))}
        </div>
     </div>
  </section>
);
}; // <--- ¡Agrega este para cerrar la función SectionFounders!

const SectionGallery = ({ gallery }: { gallery: any[] }) => {
  const GALLERY = gallery;
  return (
  <section className="pb-20 px-6 max-w-7xl mx-auto">
     <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
           <h2 className="font-display font-bold text-4xl mb-2 text-white">Galería de Recuerdos</h2>
           <p className="text-gray-500">Instantes que construyeron nuestra identidad</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
           <Sparkles size={14} className="text-primary" />
           Colección 2024-2025
        </div>
     </div>

     {/* Uniform Sophisticated Grid - Solves the broken mosaic issue */}
     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {GALLERY.map((item, idx) => (
           <motion.div 
             key={item.id}
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ delay: idx * 0.05 }}
             className="aspect-square relative group rounded-2xl overflow-hidden bg-[#1a1f35] border border-white/5"
           >
              {/* Image fills the square perfectly */}
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
              />
              
              {/* Clean overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                 <p className="text-white font-bold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</p>
                 <div className="w-8 h-0.5 bg-primary mt-2 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
           </motion.div>
        ))}
     </div>
  </section>
);
};

const SectionCTA = () => (
    <section className="py-24 px-6">
        <Reveal delay={0.2}>
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1a1f35] to-[#0a0f1e] rounded-[3rem] border border-white/10 p-12 md:p-20 text-center relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="relative z-10">
                    <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-6">¿Inspirado por nuestra historia?</h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Descubre el resultado de todo este esfuerzo. Escucha las voces, cuentos y debates que hacen vibrar a nuestra escuela.
                    </p>
                    
                    <Link 
                        to="/episodes"
                        className="inline-flex items-center gap-3 bg-white text-black hover:bg-gray-200 font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        <Headphones size={20} />
                        Explorar Biblioteca
                    </Link>
                </div>
            </div>
        </Reveal>
    </section>
);

// Helper for Reveal (reused from Home, but defined here for standalone use in Team)
const Reveal: React.FC<{children: React.ReactNode, delay?: number}> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

const Team = () => {
  const { team, loading: loadingTeam } = useTeam();
  const { gallery, loading: loadingGallery } = useGallery();

  if (loadingTeam || loadingGallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const TEAM = team;
  const GALLERY = gallery;

  return (
    <div className="min-h-screen">
      <SectionHero />
      <SectionTimeline />
      <SectionFounders team={TEAM} />
      <SectionGallery gallery={GALLERY} />
      <SectionCTA />
    </div>
  );
};

export default Team;
