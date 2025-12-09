import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useEpisodes } from '../firebase/hooks';
import { useLikes } from '../firebase/useLikes';
import { EpisodeCard } from '../components/EpisodeCard';
import { Episode } from '../types';

const Episodes = () => {
  const { episodes, loading, error } = useEpisodes();
  const { likes, toggleLike, isLiking } = useLikes(episodes);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedGrade, setSelectedGrade] = useState<string>('Todos');

  const categories = ['Todos', 'Cuentos', 'Ciencia', 'Historia', 'Entrevistas', 'Debate'];
  const grades = ['Todos', '1° Grado', '2° Grado', '3° Grado', '4° Grado', '5° Grado', '6° Grado'];

  // Filtrar episodios
  const filteredEpisodes = episodes.filter((ep: Episode) => {
    const matchesSearch = ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ep.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ep.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || ep.category === selectedCategory;
    const matchesGrade = selectedGrade === 'Todos' || ep.grade === selectedGrade;
    
    return matchesSearch && matchesCategory && matchesGrade;
  });

  const handleLike = (episodeId: string, currentLikes: number) => {
    toggleLike(episodeId, currentLikes);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error al cargar episodios</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold tracking-wider text-white uppercase">Biblioteca Completa</span>
          </div>
          
          <h1 className="font-display font-bold text-5xl md:text-7xl mb-6">
            Biblioteca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Voces</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explora las producciones de nuestros estudiantes. Desde cuentos mágicos hasta debates científicos.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar episodios, temas o autores..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary transition-all backdrop-blur-md"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-6 mb-12"
        >
          {/* Category Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
              <Filter size={16} />
              <span className="font-bold uppercase tracking-wider">Categoría</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grade Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
              <Filter size={16} />
              <span className="font-bold uppercase tracking-wider">Grado Escolar</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedGrade === grade
                      ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-gray-400 text-sm">
          Mostrando <span className="text-white font-bold">{filteredEpisodes.length}</span> de{' '}
          <span className="text-white font-bold">{episodes.length}</span> episodios
        </div>

        {/* Episodes Grid */}
        {filteredEpisodes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEpisodes.map((episode: Episode, index: number) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EpisodeCard
                  episode={episode}
                  currentLikes={likes[episode.id] || episode.likes}
                  onLike={handleLike}
                  isLiking={isLiking}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No se encontraron episodios</h3>
            <p className="text-gray-400 mb-6">Intenta ajustar tus filtros o búsqueda</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
                setSelectedGrade('Todos');
              }}
              className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform"
            >
              Limpiar Filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Episodes;
