import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../src/firebase/config';
import { Mic, TrendingUp, Play } from 'lucide-react';
import { api } from '../../src/services/api';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [stats, setStats] = useState({
    totalEpisodes: 0,
    trending: 0,
    totalPlays: 0
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
      const episodes = await api.getEpisodes();
      const totalPlays = episodes.reduce((sum, ep) => sum + ep.plays, 0);
      const trending = episodes.filter(ep => ep.plays > 1500).length;

      setStats({
        totalEpisodes: episodes.length,
        trending,
        totalPlays
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle={`Bienvenido, ${userEmail}`}
    >
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Episodios */}
        <div className="bg-darker rounded-lg p-6 border border-light/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light/60 text-sm">Total Episodios</p>
              <p className="text-4xl font-bold text-light mt-2">{stats.totalEpisodes}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* En Tendencia */}
        <div className="bg-darker rounded-lg p-6 border border-light/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light/60 text-sm">En Tendencia</p>
              <p className="text-4xl font-bold text-light mt-2">{stats.trending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Total Reproducciones */}
        <div className="bg-darker rounded-lg p-6 border border-light/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light/60 text-sm">Total Reproducciones</p>
              <p className="text-4xl font-bold text-light mt-2">
                {stats.totalPlays.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-darker rounded-lg p-6 border border-light/10">
        <h2 className="text-xl font-bold text-light mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/admin/contenido')}
            className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-left hover:bg-primary/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-5 h-5 text-darker" />
              </div>
              <div>
                <h3 className="font-semibold text-light">Agregar Nuevo Episodio</h3>
                <p className="text-sm text-light/60">Crear un nuevo podcast</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/sitio')}
            className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg text-left hover:bg-blue-600/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">🖼️</span>
              </div>
              <div>
                <h3 className="font-semibold text-light">Editar Contenido del Sitio</h3>
                <p className="text-sm text-light/60">Gestionar imágenes y textos</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
