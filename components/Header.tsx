import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Mic, Menu, X, Search } from 'lucide-react';
import SearchModal from './SearchModal';

const NavLinks: React.FC<{ className?: string, onLinkClick?: () => void }> = ({ className, onLinkClick }) => {
    const linkStyle = "text-light/70 hover:text-primary transition-colors duration-300";
    const activeLinkStyle = "text-primary";
    
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleTrendingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onLinkClick) onLinkClick();

        if (location.pathname === '/') {
            document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
            }, 100); // Delay to allow page transition
        }
    };
    
    return (
        <>
            <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`} onClick={onLinkClick}>Inicio</NavLink>
            <a href="#trending" onClick={handleTrendingClick} className={linkStyle}>Tendencia</a>
            <NavLink to="/episodes" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`} onClick={onLinkClick}>Episodios</NavLink>
            <NavLink to="/team" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`} onClick={onLinkClick}>Nosotros</NavLink>
        </>
    );
};

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSearchVisible || isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [isSearchVisible, isMobileMenuOpen]);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    
    const handleSubscribeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        closeMobileMenu();

        if (location.pathname === '/') {
            document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            // Use a timeout to ensure the homepage is rendered before scrolling
            setTimeout(() => {
                document.getElementById('subscribe')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <>
            <header className="bg-darker/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <NavLink to="/" className="flex items-center gap-2">
                            <Mic className="w-8 h-8 text-primary" />
                            <span className="font-heading text-2xl font-bold text-light">Smart Kids</span>
                        </NavLink>

                        <nav className="hidden md:flex items-center gap-8 font-medium">
                            <NavLinks />
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={() => setIsSearchVisible(true)}
                                className="text-light/70 hover:text-primary transition-colors p-2"
                                aria-label="Buscar"
                            >
                                <Search size={22} />
                            </button>
                             <a href="#subscribe" onClick={handleSubscribeClick} className="hidden sm:block bg-transparent border-2 border-light text-light font-semibold py-2 px-6 rounded-xl hover:bg-primary hover:border-primary hover:text-darker transition-colors duration-300">
                                Suscríbete
                            </a>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden text-light hover:text-primary transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-darker border-t border-dark">
                        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 py-8">
                           <NavLinks onLinkClick={closeMobileMenu} />
                            <a href="#subscribe" onClick={handleSubscribeClick} className="w-full text-center bg-transparent border-2 border-light text-light font-semibold py-3 px-6 rounded-xl hover:bg-primary hover:border-primary hover:text-darker transition-colors duration-300">
                                Suscríbete
                            </a>
                        </nav>
                    </div>
                )}
            </header>
            
            {isSearchVisible && <SearchModal onClose={() => setIsSearchVisible(false)} />}
        </>
    );
};

export default Header;