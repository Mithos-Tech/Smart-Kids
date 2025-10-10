import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, GraduationCap, Gamepad2, Users, ChevronLeft, ChevronRight, Check, ShieldOff } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import EpisodeCard from '../components/EpisodeCard';
import { Episode, Testimonial } from '../types';
import TrendingEpisodeModal from '../components/TrendingEpisodeModal';
import { usePlayer } from '../context/PlayerContext';
import { api } from '../src/services/api';

const HeroSection: React.FC = () => {
    return (
        <div className="relative bg-darker overflow-hidden min-h-screen">
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-darker via-darker/80 to-transparent lg:bg-gradient-to-r lg:from-darker lg:via-darker/90 lg:to-transparent z-10"></div>
                <img src="https://picsum.photos/seed/hero-bg/1920/1080" alt="Estudiante escuchando podcast" className="w-full h-full object-cover opacity-30" />
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center min-h-screen pt-20">
                    <div className="relative z-10 text-center lg:text-left py-16 lg:w-1/2">
                        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-light leading-tight">
                            Hablamos, <br /><span className="text-primary">Tú Escuchas</span>
                        </h1>
                        <p className="max-w-xl mx-auto lg:mx-0 mt-6 text-lg sm:text-xl text-light/70">
                            Descubre el talento y la creatividad de nuestros estudiantes a través de podcasts educativos hechos por y para niños.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a href="#episodes" className="w-full sm:w-auto bg-primary text-darker font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
                                Descubre ahora
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrendingSection: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trendingEpisode, setTrendingEpisode] = useState<Episode | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { playEpisode } = usePlayer();

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setIsLoading(true);
                const episodes = await api.getEpisodes();
                const trending = [...episodes].sort((a, b) => b.plays - a.plays)[0];
                setTrendingEpisode(trending);
            } catch (error) {
                console.error("Failed to fetch trending episode:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrending();
    }, []);

    const TrendingSkeleton: React.FC = () => (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16 animate-pulse">
            <div className="w-full max-w-md mx-auto aspect-square rounded-2xl bg-dark/10"></div>
            <div>
                <div className="h-4 bg-primary/20 rounded w-1/3 mb-4"></div>
                <div className="h-12 bg-darker/20 rounded w-full mb-4"></div>
                <div className="h-10 bg-darker/20 rounded w-4/5 mb-6 lg:mb-4"></div>
                <div className="h-6 bg-dark/10 rounded w-full mb-2"></div>
                <div className="h-6 bg-dark/10 rounded w-full mb-2"></div>
                <div className="h-6 bg-dark/10 rounded w-2/3 mb-8"></div>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <div className="h-12 bg-primary/20 rounded-xl w-full sm:w-40"></div>
                    <div className="h-12 bg-darker/20 rounded-xl w-full sm:w-40"></div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div id="trending" className="bg-light-gray py-24 sm:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeader title="Popular & Tendencia" subtitle="El episodio del momento" textColor="dark" hideLink />
                    {isLoading ? <TrendingSkeleton /> : trendingEpisode && (
                        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
                            <div className="w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden shadow-2xl shadow-dark/20">
                               <img src={trendingEpisode.thumbnail} alt={trendingEpisode.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center lg:text-left">
                                <p className="font-semibold text-primary mb-2">{trendingEpisode.podcaster.name} - {trendingEpisode.podcaster.grade}</p>
                                <h3 className="font-heading text-4xl lg:text-5xl font-bold text-darker mb-4">{trendingEpisode.title}</h3>
                                <p className="text-dark/70 text-lg mb-6">{trendingEpisode.description.substring(0, 150)}...</p>
                                <p className="text-dark/50 text-sm mb-8">Publicado: {trendingEpisode.date}</p>
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <button onClick={() => playEpisode(trendingEpisode)} className="w-full sm:w-auto bg-primary text-darker font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
                                        <Play size={20} /> Reproducir
                                    </button>
                                    <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-darker text-light font-bold py-3 px-6 rounded-xl hover:bg-dark transition-colors duration-300">
                                        Ver más
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && trendingEpisode && <TrendingEpisodeModal episode={trendingEpisode} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

const FeaturedEpisodesSection: React.FC = () => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                setIsLoading(true);
                const data = await api.getEpisodes();
                setEpisodes(data.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch episodes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEpisodes();
    }, []);

    const EpisodeSkeleton: React.FC = () => (
        <div className="bg-dark rounded-2xl overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-darker"></div>
            <div className="p-5">
                <div className="h-6 w-3/4 bg-darker rounded mb-3"></div>
                <div className="h-4 w-1/2 bg-darker rounded mb-4"></div>
                <div className="flex justify-between items-center border-t border-darker pt-3 mt-3">
                    <div className="h-4 w-1/4 bg-darker rounded"></div>
                    <div className="h-4 w-1/4 bg-darker rounded"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div id="episodes" className="py-24 sm:py-32 bg-darker">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader title="Descubre Más Episodios" subtitle="Lo último de nuestros podcasters" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => <EpisodeSkeleton key={i} />)
                    ) : (
                        episodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)
                    )}
                </div>
                <div className="text-center mt-16">
                    <Link to="/episodes" className="bg-primary text-darker font-bold py-4 px-8 rounded-xl inline-flex items-center gap-2 text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
                        Ver Todos los Episodios
                    </Link>
                </div>
            </div>
        </div>
    );
};

const FeaturesCtaSection: React.FC = () => {
    const features = [
        { icon: Sparkles, title: "Creatividad sin Límites", description: "Un espacio seguro para que los niños exploren su imaginación y creen historias únicas." },
        { icon: GraduationCap, title: "Habilidades para el Futuro", description: "Desarrollan oratoria, escritura, investigación y confianza en sí mismos." },
        { icon: Gamepad2, title: "Aprendizaje Divertido", description: "Convierten temas curriculares en emocionantes aventuras de audio." },
        { icon: Users, title: "Comunidad Escolar", description: "Fortalecen lazos entre alumnos, profesores y padres a través de la colaboración." },
    ];
    return (
        <div className="bg-light-gray py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="font-heading text-4xl lg:text-5xl font-bold text-darker">¿Qué Hace a Smart Kids Especial?</h2>
                    <p className="mt-4 text-lg text-dark/70">Herramientas y valores que impulsan el aprendizaje en cada episodio.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div key={i} className="bg-light p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
                                <div className="bg-primary/10 p-4 rounded-full mb-5">
                                    <Icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-heading text-xl font-bold text-darker mb-3">{feature.title}</h3>
                                <p className="text-dark/70">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const TestimonialsSection: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setIsLoading(true);
                const data = await api.getTestimonials();
                setTestimonials(data);
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];
    
    const animationStyle = `
        @keyframes contentFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-content-fade-in {
            animation: contentFadeIn 0.5s ease-in-out;
        }
    `;

    const TestimonialSkeleton: React.FC = () => (
        <div className="bg-dark p-8 sm:p-12 rounded-2xl flex flex-col text-center h-[320px] sm:h-[280px] justify-between animate-pulse">
            <div className="space-y-3">
                <div className="h-6 bg-darker rounded w-full"></div>
                <div className="h-6 bg-darker rounded w-full"></div>
                <div className="h-6 bg-darker rounded w-3/4 mx-auto"></div>
            </div>
            <div className="mt-6 pt-6 border-t border-darker">
                <div className="h-6 w-1/2 bg-darker rounded mx-auto mb-3"></div>
                <div className="h-4 w-1/3 bg-primary/20 rounded mx-auto"></div>
            </div>
        </div>
    );

    return (
        <div className="relative py-24 sm:py-32 bg-darker overflow-hidden">
            <style>{animationStyle}</style>
             <img src="https://picsum.photos/seed/testimonials-bg/1920/1080" alt="Estudiantes colaborando" className="absolute inset-0 w-full h-full object-cover opacity-10 blur-sm" />
             <div className="absolute inset-0 bg-gradient-to-t from-darker via-darker/90 to-darker"></div>
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="font-heading text-4xl lg:text-5xl font-bold text-light">Lo que dicen de nosotros</h2>
                    <p className="mt-4 text-lg text-light/70">Voces de nuestra comunidad que inspiran y validan nuestro proyecto.</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {isLoading ? <TestimonialSkeleton /> : currentTestimonial && (
                        <div key={currentIndex} className="bg-dark p-8 sm:p-12 rounded-2xl shadow-lg flex flex-col text-center h-[320px] sm:h-[280px] justify-between animate-content-fade-in">
                            <p className="text-light/80 italic text-xl sm:text-2xl">"{currentTestimonial.quote}"</p>
                            <div className="mt-6 pt-6 border-t border-darker">
                                <p className="font-bold text-light text-lg">{currentTestimonial.name}</p>
                                <p className="text-primary text-base font-semibold">{currentTestimonial.role}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button 
                            onClick={handlePrev} 
                            disabled={isLoading}
                            className="border-2 border-primary text-primary hover:bg-primary hover:text-darker rounded-full p-3 transition-colors duration-300 disabled:opacity-50"
                            aria-label="Testimonio anterior"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={handleNext} 
                            disabled={isLoading}
                            className="bg-primary text-darker hover:bg-primary/90 rounded-full p-3 transition-colors duration-300 disabled:opacity-50"
                            aria-label="Siguiente testimonio"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const SubscribeSection: React.FC = () => {
    const FORMSPARK_ACTION_URL = "https://submit-form.com/n7zm4n7k3";
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error_server' | 'error_blocked'>('idle');
    const [message, setMessage] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Basic regex for email validation
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus('error_server'); // Re-use this state for inline errors
            setMessage('Por favor, introduce una dirección de correo válida.');
            return;
        }
        setStatus('submitting');
        setMessage('');

        try {
            const response = await fetch(FORMSPARK_ACTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Gracias por unirte. Revisa tu bandeja de entrada para confirmar tu suscripción.');
                setEmail('');
            } else {
                setStatus('error_server');
                setMessage('Ocurrió un error en el servidor. Por favor, intenta de nuevo más tarde.');
            }
        } catch (error) {
            setStatus('error_blocked');
        }
    };
    
    const renderFormContent = () => {
        switch (status) {
            case 'success':
                return (
                    <div className="flex flex-col items-center justify-center text-center bg-darker p-8 rounded-xl transition-all duration-500" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div className="bg-primary/10 p-4 rounded-full mb-5">
                            <Check className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-lg text-light">{message}</p>
                    </div>
                );
            case 'error_blocked':
                return (
                     <div className="text-center bg-darker p-8 rounded-xl border border-secondary transition-all duration-500" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <div className="flex justify-center mb-4">
                            <ShieldOff className="w-10 h-10 text-secondary" />
                        </div>
                        <h3 className="text-xl font-bold text-light mb-3">Conexión Bloqueada</h3>
                        <p className="text-light/80 mb-6 max-w-md mx-auto">
                           Parece que un bloqueador de anuncios o tu red impidió el envío.
                           Completa la suscripción en una nueva pestaña para asegurar que llegue.
                        </p>
                        <form
                            action={FORMSPARK_ACTION_URL}
                            method="POST"
                            target="_blank"
                            onSubmit={() => {
                                setTimeout(() => {
                                    setStatus('success');
                                    setMessage('¡Gracias! Revisa la nueva pestaña que abrimos para completar tu suscripción.');
                                }, 300);
                            }}
                        >
                            <input type="hidden" name="email" value={email} />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 bg-secondary text-light font-bold py-3 px-6 rounded-xl hover:bg-secondary/90 transition-colors duration-300 transform hover:scale-105"
                            >
                                <ArrowRight size={20} /> Intentar de nuevo
                            </button>
                        </form>
                    </div>
                );
            default: // idle, submitting, error_server
                return (
                    <>
                        <form
                            onSubmit={handleSubmit}
                            className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4"
                        >
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'submitting'}
                                className="w-full bg-light/90 text-darker text-lg px-6 py-4 rounded-xl placeholder-dark/50 focus:outline-none focus:ring-4 focus:ring-primary/50 transition disabled:opacity-50"
                                aria-label="Correo electrónico"
                            />
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="bg-primary text-darker font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? 'Enviando...' : 'Suscribirme'}
                            </button>
                        </form>
                        {status === 'error_server' && (
                            <p className="text-sm text-red-500 mt-4">{message}</p>
                        )}
                        {/* FIX: The original condition was always true within this `default` switch case due to TypeScript's type narrowing, which caused an error. The privacy notice should be shown whenever the form is visible. */}
                        <p className="text-xs text-light/50 mt-4">
                            Respetamos tu privacidad. No spam.
                        </p>
                    </>
                );
        }
    };

    return (
        <div id="subscribe" className="py-24 sm:py-32 bg-light-gray">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-dark p-8 md:p-16 rounded-2xl text-center border border-darker shadow-2xl">
                    <h2 className="font-heading text-4xl font-bold text-light mb-4">
                        {status === 'success' ? '¡Suscripción Exitosa!' : '¡No te pierdas ningún episodio!'}
                    </h2>
                    <p className="max-w-2xl mx-auto text-light/70 mb-8">
                        {status === 'success' 
                            ? message
                            : status === 'error_blocked' 
                            ? 'El último paso para mantenerte conectado con nuestras historias.'
                            : 'Suscríbete para recibir notificaciones de nuevos episodios y noticias del proyecto directamente en tu correo.'}
                    </p>

                    {renderFormContent()}
                </div>
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
    return (
        <div className="bg-darker text-light">
            <HeroSection />
            <TrendingSection />
            <FeaturedEpisodesSection />
            <FeaturesCtaSection />
            <TestimonialsSection />
            <SubscribeSection />
        </div>
    );
};

export default HomePage;