import React, { useState, useEffect } from 'react';
import { Lightbulb, Trophy, Users, Globe, ArrowRight } from 'lucide-react';
import { Professor } from '../types';
import ParticipateModal from '../components/ParticipateModal';
import { api } from '../src/services/api';

const HeroSection: React.FC = () => (
    <div className="bg-gradient-to-r from-secondary to-primary py-24 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-darker leading-tight">
                DETRÁS DE CADA GRAN PODCAST<br />
                <span className="text-light">HAY UN GRAN EQUIPO</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg text-darker/80">
                Conoce a los profesores y al equipo de producción que hacen posible este increíble proyecto educativo.
            </p>
        </div>
    </div>
);

const MissionSection: React.FC = () => (
    <div className="py-24 bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center border-2 border-secondary p-12 rounded-2xl">
                <h3 className="font-heading text-3xl font-bold text-light mb-4">Nuestra Misión</h3>
                <p className="text-2xl text-light/80 italic leading-relaxed">
                    "Empoderar a los estudiantes para que descubran su voz, compartan sus pasiones y desarrollen habilidades de comunicación críticas a través del poder del podcasting."
                </p>
            </div>
        </div>
    </div>
);

const ProfessorCard: React.FC<{ professor: Professor }> = ({ professor }) => (
    <div className="bg-dark p-8 rounded-2xl text-center flex flex-col items-center">
        <img loading="lazy" src={professor.photo} alt={professor.name} className="w-24 h-24 rounded-full mb-4 border-4 border-primary/50" />
        <h3 className="font-heading text-xl font-bold text-light">{professor.name}</h3>
        <p className="text-primary font-semibold mb-4">{professor.role}</p>
        <p className="text-light/70 text-sm italic">"{professor.quote}"</p>
    </div>
);

const ProfessorSkeleton: React.FC = () => (
    <div className="bg-dark p-8 rounded-2xl text-center flex flex-col items-center animate-pulse">
        <div className="w-24 h-24 rounded-full bg-darker mb-4 border-4 border-primary/10"></div>
        <div className="h-6 w-3/4 bg-darker rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-primary/20 rounded mb-4"></div>
        <div className="h-3 w-full bg-darker rounded mt-2"></div>
        <div className="h-3 w-5/6 bg-darker rounded mt-1 mx-auto"></div>
    </div>
);

const ProfessorsSection: React.FC = () => {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                setIsLoading(true);
                const data = await api.getProfessors();
                setProfessors(data);
            } catch (error) {
                console.error("Failed to fetch professors:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfessors();
    }, []);

    return (
        <div className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-heading text-4xl font-bold text-center mb-12">Nuestros Profesores Guía</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => <ProfessorSkeleton key={i} />)
                        : professors.map(prof => <ProfessorCard key={prof.name} professor={prof} />)
                    }
                </div>
            </div>
        </div>
    );
};

const GallerySection: React.FC = () => (
    <div className="py-24 bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-4xl font-bold text-center mb-12">Galería del Proyecto</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="group aspect-square rounded-2xl overflow-hidden relative">
                        <img loading="lazy" src={`https://picsum.photos/seed/gallery${i + 1}/400/400`} alt={`Gallery image ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-darker/40 group-hover:bg-darker/20 transition-colors"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const JourneySection: React.FC = () => {
    const timelineEvents = [
        {
            icon: Lightbulb,
            phase: "Fase 1: La Chispa",
            title: "Nace 'Cerebros Brillantes'",
            year: "2023",
            description: "Un pequeño grupo de 4 docentes visionarios lanza la iniciativa, creyendo en el poder de la voz estudiantil. Con recursos limitados pero una pasión infinita, plantan la semilla del proyecto."
        },
        {
            icon: Trophy,
            phase: "Fase 2: El Reconocimiento",
            title: "Premio Estatal a la Innovación",
            year: "2024",
            description: "El esfuerzo da frutos. El proyecto gana un prestigioso premio del estado, obteniendo fondos vitales que permiten adquirir equipos de grabación profesionales y expandir el alcance del taller."
        },
        {
            icon: Users,
            phase: "Fase 3: La Expansión",
            title: "Una Comunidad Crece",
            year: "2024",
            description: "Inspirados por el éxito, más docentes y grados se suman al proyecto. 'Cerebros Brillantes' evoluciona de un taller aislado a un movimiento que integra a toda la comunidad escolar."
        },
        {
            icon: Globe,
            phase: "Fase 4: El Salto Digital",
            title: "Nace la Plataforma Web",
            year: "Hoy",
            description: "Cumpliendo el sueño original, se lanza esta plataforma web, un hogar digital para todas las historias, asegurando que las voces de nuestros 'Cerebros Brillantes' resuenen más allá del aula."
        }
    ];

    return (
        <div className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="font-heading text-4xl font-bold">Nuestro Viaje: De una Idea a una Comunidad</h2>
                    <p className="text-light/70 mt-4 text-lg">Una cronología del esfuerzo y la pasión que dieron vida al proyecto "Cerebros Brillantes".</p>
                </div>
                
                <div className="relative max-w-3xl mx-auto">
                    {/* The vertical timeline bar */}
                    <div className="absolute left-4 top-2 h-full w-1 bg-dark rounded-full sm:left-1/2 sm:-translate-x-1/2"></div>
                
                    <div className="space-y-16">
                        {timelineEvents.map((event, index) => (
                            <div key={index} className={`relative flex items-center ${
                                // On desktop, odd items will have their content on the right (via flex-row-reverse)
                                index % 2 !== 0 ? 'sm:flex-row-reverse' : ''
                            }`}>
                                {/* Content card */}
                                <div className={`w-full sm:w-[calc(50%-2.5rem)]`}>
                                    <div className="bg-dark p-6 rounded-2xl ml-10 sm:ml-0">
                                        <p className="text-sm font-semibold text-primary">{event.phase} - {event.year}</p>
                                        <h3 className="font-heading text-2xl font-bold mt-1 mb-2">{event.title}</h3>
                                        <p className="text-light/80">{event.description}</p>
                                    </div>
                                </div>
                
                                {/* Spacer for desktop layout */}
                                <div className="hidden sm:block sm:w-[calc(50%-2.5rem)]"></div>

                                {/* Icon on the timeline */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 z-10">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center ring-8 ring-darker">
                                        <event.icon className="w-5 h-5 text-darker" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const CtaSection: React.FC<{ onParticipateClick: () => void }> = ({ onParticipateClick }) => (
    <div className="py-24 bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary to-accent p-12 rounded-2xl text-center flex flex-col lg:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="font-heading text-4xl font-bold text-darker">Únete a Nuestra Aventura Sonora</h2>
                    <p className="text-darker/80 mt-2 max-w-2xl mx-auto">¿Eres un docente, padre o alumno y quieres ser parte de algo increíble? ¡Nos encantaría saber de ti!</p>
                </div>
                <button 
                    onClick={onParticipateClick}
                    className="bg-darker text-light font-bold py-4 px-8 rounded-2xl flex items-center gap-2 text-lg hover:bg-darker/90 transition-colors duration-300 transform hover:scale-105 shrink-0"
                >
                    Quiero Participar <ArrowRight />
                </button>
            </div>
        </div>
    </div>
);


const TeamPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-darker text-light">
            <HeroSection />
            <MissionSection />
            <ProfessorsSection />
            <GallerySection />
            <JourneySection />
            <CtaSection onParticipateClick={() => setIsModalOpen(true)} />
            {isModalOpen && <ParticipateModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default TeamPage;