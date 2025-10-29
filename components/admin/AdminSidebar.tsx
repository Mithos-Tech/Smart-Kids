import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Mic2, FileText, Users, Settings, Image } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Episodios',
      path: '/admin/contenido',
      icon: <Mic2 className="w-5 h-5" />
    },
    {
      name: 'Contenido del Sitio',
      path: '/admin/sitio',
      icon: <Image className="w-5 h-5" />
    },
    {
      name: 'Equipo',
      path: '/admin/equipo',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Configuración',
      path: '/admin/config',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-darker border-r border-light/10 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-light/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Mic2 className="w-6 h-6 text-darker" />
          </div>
          <div>
            <h2 className="text-light font-bold text-lg">Smart Kids</h2>
            <p className="text-light/50 text-xs">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-primary text-darker font-semibold'
                : 'text-light/70 hover:bg-light/5 hover:text-light'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-light/10">
        <div className="flex items-center gap-3 text-light/70 text-sm">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold">A</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-light truncate">admin@smartkids.edu.pe</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
