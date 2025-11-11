import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../src/firebase/config';
import { 
  Mic, 
  Play, 
  Users, 
  MessageSquare,
  TrendingUp,
  Home,
  Headphones,
  Users as UsersIcon,
  ExternalLink,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { getEpisodes } from '../../src/firebase/episodes';
import { getProfessors } from '../../src/firebase/professors';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEpisodes: 0,
    publishedEpisodes: 0,
    totalProfessors: 0,
    totalPlays: 0,
    featuredEpisodes: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || '');
      } else {
        navigate('/login');
      }
    });

    loadStats();

    return () => unsubscribe();
  }, [navigate]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const episodes = await getEpisodes();
      const professors = await getProfessors();

      const totalPlays = episodes.reduce((sum, ep) => sum + ep.plays, 0);
      const publishedEpisodes = episodes.filter(ep => ep.status === 'published').length;
      const featuredEpisodes = episodes.filter(ep => ep.featured === true).length;

      setStats({
        totalEpisodes: episodes.length,
        publishedEpisodes,
        totalProfessors: professors.length,
        totalPlays,
        featuredEpisodes
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-darker rounded-xl p-6 border border-light/10 hover:border-light/20 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-light/60 text-sm mb-1">{title}</p>
          {isLoading ? (
            <div className="h-10 w-20 bg-light/10 rounded animate-pulse"></div>
          ) : (
            <p className="text-4xl font-bold text-light">{value}</p>
          )}
          {subtitle && (
            <p className="text-light/40 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const PageSection = ({ 
    title, 
    icon: Icon, 
    color,
    children 
  }: { 
    title: string; 
    icon: any; 
    color: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-dark rounded-xl p-6 border border-light/10">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-light/10">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-light">{title}</h2>
          <p className="text-light/50 text-xs">Gestiona el contenido de esta página</p>
        </div>
      </div>
      {children}
    </div>
  );

  const ActionCard = ({ 
    title, 
    description, 
    path,
    icon: Icon,
    color,
    badge
  }: { 
    title: string; 
    description: string; 
    path: string;
    icon: any;
    color: string;
    badge?: string;
  }) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full p-4 ${color} border rounded-lg text-left hover:scale-[1.02] transition-all group`}
    >
      <div className="flex items-start justify-between mb-2">
        <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
        {badge && (
          <span className="text-[10px] px-2 py-1 bg-light/10 text-light rounded">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-light mb-1 text-sm">{title}</h3>
      <p className="text-xs text-light/60">{description}</p>
      <ArrowRight className="w-4 h-4 text-light/40 group-hover:text-light group-hover:translate-x-1 transition-all mt-2" />
    </button>
  );

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`Bienvenido, ${userEmail}`}
    >
      {/* Estadísticas Globales */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-light flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Estadísticas Generales del Sitio
          </h2>
          <a
            href="/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver Sitio Web
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Episodios"
            value={stats.totalEpisodes}
            icon={Mic}
            color="bg-blue-600/20 text-blue-500"
            subtitle={`${stats.publishedEpisodes} publicados`}
          />

          <StatCard
            title="Reproducciones"
            value={stats.totalPlays.toLocaleString()}
            icon={Play}
            color="bg-green-600/20 text-green-500"
            subtitle="Total acumulado"
          />

          <StatCard
            title="Equipo"
            value={stats.totalProfessors}
            icon={Users}
            color="bg-purple-600/20 text-purple-500"
            subtitle="Profesores registrados"
          />

          <StatCard
            title="Destacados"
            value={stats.featuredEpisodes}
            icon={TrendingUp}
            color="bg-yellow-600/20 text-yellow-500"
            subtitle="En homepage"
          />
        </div>
      </div>

      {/* Gestión por Páginas */}
      <div className="space-y-6">
        {/* PÁGINA: INICIO */}
        <PageSection
          title="Página: Inicio"
          icon={Home}
          color="bg-blue-600/20 text-blue-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              title="Hero Principal"
              description="Editar imagen y textos del banner principal"
              path="/admin/pages/home/hero"
              icon={Home}
              color="bg-blue-600/10 border-blue-600/20 text-blue-500"
              badge="Funcionando"
            />
            <ActionCard
              title="Episodios Destacados"
              description="Gestionar 'Popular & Tendencia'"
              path="/admin/pages/home/featured"
              icon={TrendingUp}
              color="bg-yellow-600/10 border-yellow-600/20 text-yellow-500"
              badge="Por mejorar"
            />
            <ActionCard
              title="Testimonios"
              description="Agregar y editar opiniones"
              path="/admin/testimonials"
              icon={MessageSquare}
              color="bg-purple-600/10 border-purple-600/20 text-purple-500"
              badge="Nuevo"
            />
          </div>
        </PageSection>

        {/* PÁGINA: EPISODIOS */}
        <PageSection
          title="Página: Episodios"
          icon={Headphones}
          color="bg-green-600/20 text-green-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
              title="Gestión de Episodios"
              description={`${stats.totalEpisodes} episodios • ${stats.publishedEpisodes} publicados`}
              path="/admin/episodes"
              icon={Mic}
              color="bg-green-600/10 border-green-600/20 text-green-500"
              badge="Funcionando"
            />
            <div className="p-4 bg-darker/50 border border-light/5 rounded-lg flex items-center justify-center">
              <p className="text-light/40 text-sm text-center">
                Filtros y búsqueda ya implementados en la página
              </p>
            </div>
          </div>
        </PageSection>

        {/* PÁGINA: NOSOTROS */}
        <PageSection
          title="Página: Nosotros"
          icon={UsersIcon}
          color="bg-purple-600/20 text-purple-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionCard
              title="Equipo (Profesores)"
              description={`${stats.totalProfessors} miembros registrados`}
              path="/admin/professors"
              icon={Users}
              color="bg-purple-600/10 border-purple-600/20 text-purple-500"
              badge="Funcionando"
            />
            <ActionCard
              title="Galería del Proyecto"
              description="Gestionar imágenes con Cloudinary"
              path="/admin/gallery"
              icon={MessageSquare}
              color="bg-pink-600/10 border-pink-600/20 text-pink-500"
              badge="Funcionando"
            />
            <ActionCard
              title="Contenido de Página"
              description="Editar misión, visión y timeline"
              path="/admin/pages/about"
              icon={MessageSquare}
              color="bg-orange-600/10 border-orange-600/20 text-orange-500"
              badge="Próximamente"
            />
          </div>
        </PageSection>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;