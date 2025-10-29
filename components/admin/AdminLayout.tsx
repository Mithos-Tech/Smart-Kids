import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { signOut } from 'firebase/auth';
import { auth } from '../../src/firebase/config';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-dark">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-darker border-b border-light/10 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              {title && (
                <>
                  <h1 className="text-2xl font-bold text-light">{title}</h1>
                  {subtitle && (
                    <p className="text-light/60 text-sm mt-1">{subtitle}</p>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 text-light/70 hover:text-light transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Sitio</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
