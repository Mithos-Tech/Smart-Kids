import React, { useState, useEffect } from 'react';
import { CATEGORIES, GRADES } from '../constants';
import EpisodeCard from '../components/EpisodeCard';
import { Search, ChevronDown, SlidersHorizontal, LoaderCircle } from 'lucide-react';
import { Episode } from '../types';
import { api } from '../src/services/api';

const FiltersSidebar: React.FC<{
    selectedCategories: string[];
    onCategoryChange: (category: string) => void;
    selectedGrades: string[];
    onGradeChange: (grade: string) => void;
    onClearFilters: () => void;
}> = ({ selectedCategories, onCategoryChange, selectedGrades, onGradeChange, onClearFilters }) => {
    const [openGrade, setOpenGrade] = useState<string | null>('4° Grado');
    
    const handleCategoryToggle = (category: string) => {
        onCategoryChange(category);
    };
    
    const handleGradeToggle = (grade: string) => {
        onGradeChange(grade);
    };
    
    return (
        <aside className="w-full lg:w-1/4 lg:pr-8">
            <div className="sticky top-24">
                <div className="bg-dark p-6 rounded-2xl">
                    <h3 className="font-heading text-2xl font-bold mb-6">Filtros</h3>
                    
                    {/* Filter by Grade */}
                    <div className="border-b border-darker pb-6 mb-6">
                        <h4 className="font-semibold text-lg mb-4">Por Grado</h4>
                        {GRADES.map(grade => (
                            <div key={grade.name}>
                                <label className="flex items-center py-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedGrades.includes(grade.name)}
                                        onChange={() => handleGradeToggle(grade.name)}
                                        className="w-5 h-5 rounded bg-darker border-light/30 text-primary focus:ring-primary mr-3"
                                    />
                                    <span className="flex-grow text-light">{grade.name}</span>
                                    <ChevronDown 
                                        className={`transition-transform cursor-pointer ${openGrade === grade.name ? 'rotate-180' : ''}`} 
                                        size={20}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setOpenGrade(openGrade === grade.name ? null : grade.name);
                                        }}
                                    />
                                </label>
                                {openGrade === grade.name && (
                                    <div className="pl-9 pt-2 space-y-2">
                                        {grade.sections.map(section => (
                                            <div key={section.name} className="flex justify-between items-center text-sm text-light/70">
                                                <span>Sección {section.name}</span>
                                                <span className="bg-darker text-xs px-2 py-0.5 rounded-full">{section.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {/* Filter by Category */}
                    <div className="pb-6 mb-6">
                        <h4 className="font-semibold text-lg mb-4">Por Categoría</h4>
                        <div className="space-y-3">
                            {CATEGORIES.map(cat => (
                                <label key={cat.name} className="flex items-center gap-3 text-light/80 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes(cat.name)}
                                        onChange={() => handleCategoryToggle(cat.name)}
                                        className="w-5 h-5 rounded bg-darker border-light/30 text-primary focus:ring-primary"
                                    />
                                    <span className="flex-grow">{cat.icon} {cat.name}</span>
                                    <span className="text-sm text-light/50">{cat.count}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClearFilters}
                        className="w-full bg-secondary text-white font-semibold py-3 rounded-xl hover:bg-secondary/90 transition-colors"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>
        </aside>
    );
};

const EpisodesPage: React.FC = () => {
    const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
    const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setIsLoading(true);
                const episodes = await api.getEpisodes();
                setAllEpisodes(episodes);
                setFilteredEpisodes(episodes);
            } catch (error) {
                console.error("Error fetching episodes:", error);
                // Aquí podrías establecer un estado de error
            } finally {
                setIsLoading(false);
            }
        };

        fetchEpisodes();
    }, []);

    useEffect(() => {
    let results = allEpisodes;
    
    // Filtrar por búsqueda
    if (searchTerm) {
        const lowercasedQuery = searchTerm.toLowerCase();
        results = results.filter(episode =>
            episode.title.toLowerCase().includes(lowercasedQuery) ||
            episode.description.toLowerCase().includes(lowercasedQuery) ||
            episode.podcaster.name.toLowerCase().includes(lowercasedQuery) ||
            episode.category.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    // Filtrar por categorías
    if (selectedCategories.length > 0) {
        results = results.filter(episode => 
            selectedCategories.includes(episode.category)
        );
    }
    
    // Filtrar por grados
    if (selectedGrades.length > 0) {
        results = results.filter(episode => {
             // Comparar solo el número del grado (ej: "4°" matchea con "4° Grado")
             return selectedGrades.some(selectedGrade => 
                selectedGrade.startsWith(episode.podcaster.grade)
    );
});
        
    }
    
    setFilteredEpisodes(results);
}, [searchTerm, selectedCategories, selectedGrades, allEpisodes]);
    
           
        
    
        return (
        <div className="bg-darker">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-secondary py-20 text-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-heading text-5xl font-bold text-darker mb-4">Nuestra Biblioteca de Podcasts</h1>
                    <div className="max-w-2xl mx-auto mt-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Busca tu episodio favorito..."
                                className="w-full py-4 pl-12 pr-4 bg-light/90 text-darker rounded-2xl placeholder-dark/50 focus:outline-none focus:ring-4 focus:ring-accent/50"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col lg:flex-row">
                    <FiltersSidebar 
                       selectedCategories={selectedCategories}
                       onCategoryChange={(category) => {
                        setSelectedCategories(prev => 
                         prev.includes(category) 
                          ? prev.filter(c => c !== category)
                          : [...prev, category]
                       );
                       }}
                       selectedGrades={selectedGrades}
                       onGradeChange={(grade) => {
                         setSelectedGrades(prev => 
                          prev.includes(grade) 
                            ? prev.filter(g => g !== grade)
                            : [...prev, grade]
                       );
                   }}
                   onClearFilters={() => {
                     setSelectedCategories([]);
                     setSelectedGrades([]);
                     setSearchTerm('');
                   }}
              /> 
           
                    <main className="w-full lg:w-3/4 lg:pl-8 mt-12 lg:mt-0">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                            <h2 className="font-semibold text-xl">Mostrando <span className="text-primary">{filteredEpisodes.length}</span> episodios</h2>
                            <div className="relative">
                                <select className="appearance-none bg-dark py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option>Ordenar por: Más recientes</option>
                                    <option>Más escuchados</option>
                                    <option>Duración</option>
                                </select>
                                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-20 bg-dark rounded-2xl">
                                <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
                            </div>
                        ) : filteredEpisodes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {filteredEpisodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-dark rounded-2xl">
                                <h3 className="text-2xl font-bold text-light">No se encontraron episodios</h3>
                                <p className="text-light/70 mt-2">Intenta ajustar tu búsqueda o filtros.</p>
                            </div>
                        )}
                        
                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-16">
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark hover:bg-primary hover:text-darker transition-colors">1</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-darker font-bold">2</button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark hover:bg-primary hover:text-darker transition-colors">3</button>
                            <span className="text-light/50">...</span>
                            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark hover:bg-primary hover:text-darker transition-colors">8</button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default EpisodesPage;
