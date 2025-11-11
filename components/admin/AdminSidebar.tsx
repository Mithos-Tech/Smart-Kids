import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home,
  Headphones,
  Users as UsersIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Mic2,
  MessageSquare,
  Image,
  FileText
} from 'lucide-react';

interface NavSection {
  title: string;
  icon: React.ReactNode;
  badge?: string;
  items: NavItem[];
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'Página: Inicio',
    'Página: Episodios',
    'Página: Nosotros'
  ]);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const sections: NavSection[] = [
    {
      title: 'Página: Inicio',
      icon: <Home className="w-5 h-5" />,
      badge: 'Web',
      items: [
        {
          name: 'Hero Principal',
          path: '/admin/pages/home/hero',
          icon: <Image className="w-4 h-4" />
        },
        {
          name: 'Episodios Destacados',
          path: '/admin/pages/home/featured',
          icon: <Mic2 className="w-4 h-4" />,
          badge: 'Popular'
        },
        {
          name: 'Testimonios',
          path: '/admin/testimonials',
          icon: <MessageSquare className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Página: Episodios',
      icon: <Headphones className="w-5 h-5" />,
      badge: 'Web',
      items: [
        {
          name: 'Gestión de Episodios',
          path: '/admin/episodes',
          icon: <Mic2 className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Página: Nosotros',
      icon: <UsersIcon className="w-5 h-5" />,
      badge: 'Web',
      items: [
        {
          name: 'Equipo (Profesores)',
          path: '/admin/professors',
          icon: <UsersIcon className="w-4 h-4" />
        },
        {
          name: 'Galería del Proyecto',
          path: '/admin/gallery',
          icon: <Image className="w-4 h-4" />
        },
        {
          name: 'Contenido de Página',
          path: '/admin/pages/about',
          icon: <FileText className="w-4 h-4" />,
          badge: 'Pronto'
        }
      ]
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSectionActive = (items: NavItem[]) => {
    return items.some(item => isActive(item.path));
  };

  return (
    <aside className="w-64 bg-darker border-r border-light/10 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-light/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden group-hover:scale-110 transition-transform">
  <img 
    src="https://res.cloudinary.com/dkoshgzxo/image/upload/v1762821044/Logo_Smart_iob3qz.png" 
    alt="Smart Kids Logo" 
    className="w-full h-full object-cover"
  />
</div>
          <div>
            <h2 className="text-light font-bold text-lg">Smart Kids</h2>
            <p className="text-light/50 text-xs">Panel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
        {/* Dashboard (siempre visible) */}
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            location.pathname === '/admin/dashboard'
              ? 'bg-primary text-darker font-semibold shadow-lg shadow-primary/20'
              : 'text-light/70 hover:bg-light/5 hover:text-light'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <div className="h-px bg-light/10 my-3"></div>

        {/* Secciones por página */}
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.title);
          const hasActiveItem = isSectionActive(section.items);

          return (
            <div key={section.title} className="space-y-1">
              {/* Header de la sección */}
              <button
                onClick={() => toggleSection(section.title)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                  hasActiveItem
                    ? 'bg-light/5 text-light'
                    : 'text-light/50 hover:bg-light/5 hover:text-light/70'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`flex-shrink-0 ${hasActiveItem ? 'text-primary' : ''}`}>
                    {section.icon}
                  </div>
                  <span className="font-semibold text-xs uppercase tracking-wide truncate">
                    {section.title}
                  </span>
                  {section.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary rounded flex-shrink-0">
                      {section.badge}
                    </span>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Items de la sección */}
              {isExpanded && (
                <div className="ml-2 pl-4 border-l-2 border-light/10 space-y-1">
                  {section.items.map((item) => {
                    const itemActive = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                          itemActive
                            ? 'bg-primary text-darker font-semibold'
                            : 'text-light/70 hover:bg-light/5 hover:text-light'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {item.icon}
                          <span className="text-sm truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded flex-shrink-0 ${
                            itemActive 
                              ? 'bg-darker/20 text-darker'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Configuración (separado) */}
        <div className="pt-3 mt-3 border-t border-light/10">
          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              location.pathname === '/admin/settings'
                ? 'bg-primary text-darker font-semibold'
                : 'text-light/70 hover:bg-light/5 hover:text-light'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Configuración</span>
          </Link>
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-light/10">
        <div className="flex items-center gap-3 text-light/70 text-sm">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-xs">A</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-light truncate text-xs">
              admin@smartkids
            </p>
            <p className="text-light/40 text-xs">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;