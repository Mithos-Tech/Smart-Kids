import React, { useEffect } from 'react';
import { Episode } from '../types';
import { X, Clock, Headphones, Calendar, Sparkles, BookOpen, Users } from 'lucide-react';

interface TrendingEpisodeModalProps {
    episode: Episode;
    onClose: () => void;
}

const TrendingEpisodeModal: React.FC<TrendingEpisodeModalProps> = ({ episode, onClose }) => {

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Datos enriquecidos (luego vienen de Firebase)
    const enrichedData = {
        fullSynopsis: episode.description || 'Cuento tradicional que nos enseña valiosas lecciones sobre la vida y nuestras decisiones.',
        educationalValues: [
            { icon: '🦊', title: 'Ingenio y Astucia', description: 'Pensamiento crítico' },
            { icon: '🦅', title: 'Respeto', description: 'Conciencia sobre consecuencias' },
            { icon: '⚖️', title: 'Responsabilidad', description: 'Toma de decisiones' },
            { icon: '🏔️', title: 'Identidad Cultural', description: 'Tradiciones ancestrales' }
        ],
        ageRecommended: '8-12 años',
        curriculum: 'Comunicación, Valores',
        narratorMessage: 'Me encantó narrar esta historia porque conecta con nuestras raíces'
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1419] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-primary/20"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con botón cerrar */}
                <div className="relative h-12 bg-gradient-to-r from-primary/10 to-transparent">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-gray-400 hover:text-primary transition-colors bg-black/30 rounded-full p-2 hover:bg-black/50"
                        aria-label="Cerrar modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-y-auto max-h-[calc(90vh-3rem)]">
                    
                    {/* LEFT: Image */}
                    <div className="lg:col-span-2 relative min-h-[300px] lg:min-h-0">
                        <img 
                            src={episode.thumbnail} 
                            alt={episode.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-primary/30">
                            <p className="text-xs text-gray-400 mb-1">Narrado por</p>
                            <p className="text-white font-bold">{episode.author || episode.podcaster?.name}</p>
                            <p className="text-primary text-sm">{episode.grade || episode.podcaster?.grade}</p>
                        </div>
                    </div>

                    {/* RIGHT: Content */}
                    <div className="lg:col-span-3 p-6 lg:p-8 space-y-6 overflow-y-auto">
                        
                        {/* Header */}
                        <div>
                            <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">
                                {episode.category}
                            </span>
                            <h2 className="font-bold text-3xl lg:text-4xl text-white mt-3 mb-2">
                                {episode.title}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {episode.author || episode.podcaster?.name} • {episode.grade || episode.podcaster?.grade}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-700">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Clock size={16} className="text-primary" />
                                    <p className="font-bold text-xl text-white">{episode.duration || '10'} min</p>
                                </div>
                                <p className="text-xs text-gray-500">Duración</p>
                            </div>
                            <div className="text-center border-x border-gray-700">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Headphones size={16} className="text-primary" />
                                    <p className="font-bold text-xl text-white">{episode.plays || 0}</p>
                                </div>
                                <p className="text-xs text-gray-500">Escuchas</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Calendar size={16} className="text-primary" />
                                    <p className="font-bold text-sm text-white">{episode.date || 'Reciente'}</p>
                                </div>
                                <p className="text-xs text-gray-500">Publicado</p>
                            </div>
                        </div>

                        {/* Sinopsis */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={18} className="text-primary" />
                                <h3 className="font-bold text-lg text-white">Sinopsis</h3>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {enrichedData.fullSynopsis}
                            </p>
                        </div>

                        {/* Educational Values */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={18} className="text-primary" />
                                <h3 className="font-bold text-lg text-white">Valores Educativos</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {enrichedData.educationalValues.map((value, index) => (
                                    <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-primary/10 hover:border-primary/30 transition-colors">
                                        <div className="flex items-start gap-2">
                                            <span className="text-2xl">{value.icon}</span>
                                            <div>
                                                <p className="font-semibold text-white text-sm">{value.title}</p>
                                                <p className="text-gray-400 text-xs mt-0.5">{value.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-white/5 p-4 rounded-xl border border-gray-700">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Edad Recomendada</p>
                                    <p className="text-white font-semibold">{enrichedData.ageRecommended}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Área Curricular</p>
                                    <p className="text-white font-semibold">{enrichedData.curriculum}</p>
                                </div>
                            </div>
                        </div>

                        {/* Narrator Quote */}
                        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-xl">
                            <div className="flex items-start gap-3">
                                <Users size={20} className="text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Mensaje del narrador:</p>
                                    <p className="text-white italic text-sm">"{enrichedData.narratorMessage}"</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={onClose}
                            className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            Cerrar y Escuchar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendingEpisodeModal;