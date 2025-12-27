import React, { useState, useEffect, memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Mail, MapPin, Phone, Facebook, Instagram, Twitter, Youtube, Linkedin, User, Bell } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// 🎯 OPTIMIZACIÓN #1: Background simplificado con will-change
const Background = memo(() => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0f1e]">
      <div className="noise-bg opacity-[0.03]"></div>

      {/* Blobs optimizados: menos blur, transiciones más rápidas */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full mix-blend-screen filter blur-[100px]"
            animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          />
          <motion.div
            className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-secondary/5 rounded-full mix-blend-screen filter blur-[120px]"
            animate={{ y: [0, -60, 0], x: [0, -40, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          />
        </>
      )}
    </div>
  );
});
Background.displayName = 'Background';

// 🎯 OPTIMIZACIÓN #2: Navbar con useCallback y memo
const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    // Throttle scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Episodios', path: '/episodes' },
    { name: 'Nosotros', path: '/team' },
  ];

  const handleSubscribeClick = useCallback(() => {
    if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
            document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  // Transiciones más rápidas para mobile
  const menuVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0f1e]/90 backdrop-blur-xl py-3 border-b border-white/5 shadow-lg' : 'bg-transparent py-6 md:py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group z-20">
          <img
            src="https://res.cloudinary.com/dkoshgzxo/image/upload/q_auto,f_auto/v1763694145/Logo_SmartKids_og849e.svg"
            alt="Smart Kids Logo"
            className="h-10 md:h-12 w-auto object-contain drop-shadow-lg group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-300"
            loading="eager"
          />
          <div className="flex flex-col justify-center">
            <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight leading-none">
              <span className="text-white">Smart</span> <span className="text-primary">Kids</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-bold tracking-wide transition-colors hover:text-primary relative py-2 ${location.pathname === link.path ? 'text-white' : 'text-gray-400'}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-0 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6 z-20">
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors relative group" title="Acceso Docente">
               <User size={22} />
               <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">Acceso Docente</span>
            </Link>

            <div className="h-6 w-px bg-white/10"></div>

            <button
                onClick={handleSubscribeClick}
                className="group relative bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            >
              <Bell size={14} className="group-hover:rotate-12 transition-transform" />
              Suscríbete
            </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white w-10 h-10 flex items-center justify-center bg-white/5 rounded-full z-20 border border-white/10" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* Mobile Menu - Optimizado */}
      <AnimatePresence>
        {isOpen && (
            <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.15 }}
                className="absolute top-20 left-4 right-4 bg-[#1a1f35]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl z-40 lg:hidden flex flex-col items-center"
            >
                <div className="flex flex-col gap-6 w-full items-center mb-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-bold text-gray-200 hover:text-primary transition-colors w-full text-center py-2"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-xl font-bold text-gray-200 hover:text-primary transition-colors w-full text-center py-2"
                    >
                        Acceso Docente
                    </Link>
                </div>

                <div className="w-16 h-px bg-white/10 mb-8"></div>

                <button
                    onClick={() => { setIsOpen(false); handleSubscribeClick(); }}
                    className="w-full max-w-xs bg-primary hover:bg-primary-dark text-white py-4 rounded-full font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all"
                >
                    <Bell size={18} /> Suscríbete Gratis
                </button>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});
Navbar.displayName = 'Navbar';

// 🎯 OPTIMIZACIÓN #3: Footer con memo
const Footer = memo(() => {
  const platformLogos = [
    { name: 'Spotify', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/q_auto,f_auto,w_120/v1763670317/Spotify_oabsyx.png', link: 'https://spotify.com' },
    { name: 'Apple Podcasts', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/q_auto,f_auto,w_120/v1763670317/Apple_Podcasts_fwt12k.png', link: 'https://apple.com/podcasts' },
    { name: 'Google Podcasts', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/q_auto,f_auto,w_120/v1763670316/Google_Podcasts_blyorr.png', link: 'https://podcasts.google.com' },
    { name: 'SoundCloud', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/q_auto,f_auto,w_120/v1763670317/soundcloud_flfrpq.png', link: 'https://soundcloud.com' },
    { name: 'Pocket Casts', url: 'https://res.cloudinary.com/dkoshgzxo/image/upload/q_auto,f_auto,w_120/v1763670316/pocketcasts_xqo0zl.png', link: 'https://pocketcasts.com' },
  ];

  return (
    <footer className="relative z-10 pt-32 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#0a0f1e]/90 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-12 mb-12">
                <div className="space-y-6 max-w-md">
                    <div className="flex items-center gap-4 group cursor-default">
                      <img
                        src="https://res.cloudinary.com/dkoshgzxo/image/upload/q_auto,f_auto/v1763694145/Logo_SmartKids_og849e.svg"
                        alt="Smart Kids"
                        className="h-14 md:h-16 w-auto object-contain filter drop-shadow-lg"
                        loading="lazy"
                      />
                      <span className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-none">
                        <span className="text-white">Smart</span> <span className="text-primary">Kids</span>
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed pl-1">
                       Una plataforma educativa donde cada historia cuenta.
                    </p>
                </div>

                <div className="flex gap-6 items-center flex-wrap">
                   {platformLogos.map((platform, i) => (
                      <a
                        key={i}
                        href={platform.link}
                        className="opacity-100 hover:scale-110 transition-all duration-300"
                        title={platform.name}
                      >
                         <img src={platform.url} alt={platform.name} className="h-6 md:h-8 w-auto" loading="lazy" />
                      </a>
                   ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                <div>
                    <h4 className="text-white font-bold mb-6">Explorar</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                        <li><Link to="/episodes" className="hover:text-primary transition-colors">Episodios</Link></li>
                        <li><Link to="/team" className="hover:text-primary transition-colors">Nosotros</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6">Categorías</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-primary transition-colors">Cuentos</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Ciencia</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Historia</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6">Comunidad</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-primary transition-colors">Para Docentes</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Para Padres</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Blog Escolar</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6">Contacto</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex items-center gap-2"><Mail size={16}/> contacto@smartkids.edu</li>
                        <li className="flex items-center gap-2"><Phone size={16}/> (01) 234-5678</li>
                        <li className="flex items-center gap-2"><MapPin size={16}/> Lima, Perú</li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm">
                    © 2025 Smart Kids by <span className="text-white font-bold">Inspyrio</span>. Todos los derechos reservados.
                </p>

                <div className="flex gap-6">
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Facebook size={18}/></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={18}/></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram size={18}/></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={18}/></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Youtube size={18}/></a>
                </div>
            </div>
        </div>
    </footer>
  );
});
Footer.displayName = 'Footer';

export const Layout = memo(({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen font-sans text-white selection:bg-primary selection:text-white flex flex-col">
      <Background />
      <Navbar />
      <main className="relative z-10 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
});