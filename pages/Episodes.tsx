
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, SlidersHorizontal, Sparkles, Ghost, ChevronDown, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { useEpisodes } from '../firebase/hooks';
import { EpisodeCard } from '../components/EpisodeCard';
import { motion, AnimatePresence } from 'framer-motion';

const Episodes = () => {
  const { episodes, loading } = useEpisodes();
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination State
  const ITEMS_PER_PAGE = 9;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Grades Options
  const grades = ['3° Grado', '4° Grado', '5° Grado', '6° Grado', 'Secundaria'];

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory, selectedGrades]);

  // Filter Logic
  const filteredEpisodes = episodes.filter(ep => {
    const matchesSearch = ep.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ep.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Todos' || ep.category === selectedCategory;
    
    const matchesGrade = selectedGrades.length === 0 || selectedGrades.some(g => ep.grade.includes(g));

    return matchesSearch && matchesCategory && matchesGrade;
  });

  // Slice for pagination
  const visibleEpisodes = filteredEpisodes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEpisodes.length;

  // Load More Handler
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  // Toggle Grade Selection
  const toggleGrade = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      setSelectedGrades(prev => prev.filter(g => g !== grade));
    } else {
      setSelectedGrades(prev => [...prev, grade]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setSelectedGrades([]);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      
      {/* --- Cinematic Header --- */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Local Background Effects (Aurora Lights) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none animate-pulse"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
             {/* Sophisticated Audio Waveform Graphic */}
             <div className="mb-6 opacity-60">
                <svg width="300" height="40" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 md:w-80 h-auto">
                    <defs>
                        <linearGradient id="waveGradient" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="rgba(255,255,255,0)" />
                            <stop offset="0.5" stopColor="#10b981" />
                            <stop offset="1" stopColor="rgba(255,255,255,0)" />
                        </linearGradient>
                    </defs>
                    <path d="M2 20C2 20 15.5 20 25 20C34.5 20 35.5 12 45 12C54.5 12 55.5 28 65 28C74.5 28 75.5 8 85 8C94.5 8 95.5 32 105 32C114.5 32 115.5 15 125 15C134.5 15 135.5 25 145 25C154.5 25 155.5 5 165 5C174.5 5 175.5 35 185 35C194.5 35 195.5 18 205 18C214.5 18 215.5 22 225 22C234.5 22 235.5 10 245 10C254.5 10 255.5 30 265 30C274.5 30 280 20 298 20" 
                          stroke="url(#waveGradient)" 
                          strokeWidth="1.5" 
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-pulse"
                    />
                    <path d="M2 20 H 300" stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 4"/>
                </svg>
             </div>

             <h1 className="font-display font-bold text-5xl md:text-7xl mb-6 leading-tight">
               Biblioteca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary animate-shine bg-[length:200%_auto]">Voces</span>
             </h1>
             <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
               Explora las producciones de nuestros estudiantes. Desde cuentos mágicos hasta debates científicos.
             </p>
          </motion.div>

          {/* Floating Search Bar - Fixed Focus State */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative max-w-2xl mx-auto group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* Container handles the visual border/background */}
            <div className="relative flex items-center bg-[#1a1f35]/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl transition-all duration-300 hover:border-white/20 focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)] focus-within:bg-[#1a1f35]/80">
               <div className="pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                 <Search size={22} />
               </div>
               
               {/* Input is completely transparent with no outline/ring */}
               <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Buscar episodios, temas o autores..." 
                 className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none text-white placeholder-gray-500 px-4 py-3 text-lg"
                 autoComplete="off"
               />
               
               {searchQuery && (
                 <button onClick={() => setSearchQuery('')} className="p-2 text-gray-500 hover:text-white transition-colors mr-2">
                   <X size={18} />
                 </button>
               )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 space-y-8">
          <div className="glass-panel p-6 rounded-2xl sticky top-28 border border-white/5">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2 text-white"><SlidersHorizontal size={18} className="text-primary"/> Filtros</h3>
              {(selectedCategory !== 'Todos' || selectedGrades.length > 0 || searchQuery) && (
                <button onClick={clearFilters} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">
                  Limpiar todo
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Categoría</h4>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all flex justify-between items-center group ${selectedCategory === cat ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {cat}
                    {selectedCategory === cat && <motion.div layoutId="active-dot" className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Grades */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Grado Escolar</h4>
              <div className="space-y-2">
                {grades.map(grade => (
                  <label key={grade} className="flex items-center gap-3 cursor-pointer group p-1">
                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedGrades.includes(grade) ? 'bg-primary border-primary' : 'border-gray-700 bg-[#0a0f1e] group-hover:border-gray-500'}`}>
                        {selectedGrades.includes(grade) && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-2.5 h-2.5 bg-white rounded-sm" />}
                     </div>
                     <input type="checkbox" className="hidden" checked={selectedGrades.includes(grade)} onChange={() => toggleGrade(grade)} />
                     <span className={`text-sm transition-colors ${selectedGrades.includes(grade) ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>{grade}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="lg:hidden col-span-1 flex justify-between items-center">
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 bg-[#1a1f35] border border-white/10 px-5 py-3 rounded-full text-white font-bold shadow-lg active:scale-95 transition-transform"
            >
              <Filter size={18} className="text-primary" /> Filtros
              {(selectedCategory !== 'Todos' || selectedGrades.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-primary"></span>
              )}
            </button>
            <span className="text-sm text-gray-400">
              {filteredEpisodes.length} resultados
            </span>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {/* Desktop Results Info */}
          <div className="hidden lg:flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm font-medium">
                Mostrando <span className="text-white font-bold text-base">{Math.min(visibleCount, filteredEpisodes.length)}</span> de <span className="text-white font-bold text-base">{filteredEpisodes.length}</span> episodios
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Todo el contenido está disponible en Spotify
            </div>
          </div>

          {visibleEpisodes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {visibleEpisodes.map((episode) => (
                  <motion.div 
                    key={episode.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EpisodeCard episode={episode} />
                  </motion.div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                 <div className="flex justify-center pb-10">
                    <button 
                      onClick={handleLoadMore}
                      className="group flex items-center gap-2 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-primary hover:border-primary hover:scale-105 transition-all shadow-lg"
                    >
                      Cargar más episodios
                      <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                    </button>
                 </div>
              )}
            </>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
               <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-float-slow">
                 <Ghost size={48} className="text-gray-600" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">No encontramos resultados</h3>
               <p className="text-gray-400 max-w-md mb-8">
                 Parece que no hay episodios que coincidan con tu búsqueda. Intenta cambiar los filtros o busca otro tema.
               </p>
               <button 
                 onClick={clearFilters}
                 className="px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold hover:bg-primary hover:text-white transition-all"
               >
                 Limpiar filtros
               </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer (Off-canvas) */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-[#1a1f35] rounded-t-[2rem] z-50 lg:hidden border-t border-white/10 max-h-[85vh] overflow-y-auto"
            >
               <div className="p-6">
                  <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
                  
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-xl text-white">Filtros</h3>
                    <button onClick={clearFilters} className="text-sm text-red-400 font-medium">Limpiar todo</button>
                  </div>

                  <div className="space-y-8 mb-8">
                     <div>
                        <h4 className="font-bold text-gray-400 mb-4 uppercase text-xs tracking-wider">Categoría</h4>
                        <div className="flex flex-wrap gap-2">
                           {CATEGORIES.map(cat => (
                             <button 
                               key={cat}
                               onClick={() => setSelectedCategory(cat)}
                               className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${selectedCategory === cat ? 'bg-primary text-white border-primary' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                             >
                               {cat}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <h4 className="font-bold text-gray-400 mb-4 uppercase text-xs tracking-wider">Grado</h4>
                        <div className="flex flex-wrap gap-2">
                           {grades.map(grade => (
                             <button 
                               key={grade}
                               onClick={() => toggleGrade(grade)}
                               className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${selectedGrades.includes(grade) ? 'bg-white text-black border-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                             >
                               {grade}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 text-lg"
                  >
                    Ver {filteredEpisodes.length} resultados
                  </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Episodes;
