import React from 'react';
import { Mic, Twitter, Facebook, Instagram, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleTrendingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        
        if (location.pathname === '/') {
            document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <footer id="contact" className="bg-darker border-t border-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Column 1: Brand & Actions */}
                    <div className="flex flex-col gap-4 items-start md:col-span-6 lg:col-span-7">
<Link to="/" className="flex items-center gap-3">
    <img
        src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1762821044/Logo_Smart_iob3qz.png"
        alt="Smart Kids Logo"
        className="h-8 w-auto" // h-8 es más pequeño que el h-10 del Header, ideal para el footer.
    />
    <span className="font-heading text-xl font-bold text-light">Smart Kids</span>
</Link>
                        <p className="text-light/60 text-sm max-w-md">
                            El hogar digital del proyecto "Cerebros Brillantes", donde los estudiantes descubren su voz, cuentan sus historias y aprenden juntos.
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                            <a href="#" className="text-light/60 hover:text-primary transition" aria-label="Visita nuestro perfil de Twitter"><Twitter /></a>
                            <a href="#" className="text-light/60 hover:text-primary transition" aria-label="Visita nuestro perfil de Facebook"><Facebook /></a>
                            <a href="#" className="text-light/60 hover:text-primary transition" aria-label="Visita nuestro perfil de Instagram"><Instagram /></a>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="md:col-span-3 lg:col-span-2">
                        <h3 className="font-heading text-lg font-bold text-light mb-4">Navegación</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-light/60 hover:text-primary transition">Inicio</Link></li>
                             <li><a href="#trending" onClick={handleTrendingClick} className="text-light/60 hover:text-primary transition">Tendencia</a></li>
                            <li><Link to="/episodes" className="text-light/60 hover:text-primary transition">Episodios</Link></li>
                            <li><Link to="/team" className="text-light/60 hover:text-primary transition">Nosotros</Link></li>
                        </ul>
                    </div>
                    
                    {/* Column 3: Resources & CTA */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <h3 className="font-heading text-lg font-bold text-light mb-4">Recursos</h3>
                        <ul className="space-y-3 mb-6">
                            <li><Link to="/terminos" className="text-light/60 hover:text-primary transition">Términos de Uso</Link></li>
                            <li><Link to="/privacidad" className="text-light/60 hover:text-primary transition">Política de Privacidad</Link></li>
                        </ul>
                        <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-darker font-semibold py-3 px-5 rounded-xl hover:bg-primary/90 transition-colors duration-300 transform hover:scale-105">
                            Acceso Docentes
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="border-t border-dark py-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-light/40">
                    <p>© 2025 Smart Kids by <span className="font-medium text-primary/80">Inspyrio</span>. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;