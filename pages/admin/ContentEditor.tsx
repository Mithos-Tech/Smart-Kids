import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, LogOut, Home, Save } from 'lucide-react';
import { authService } from '../../src/firebase/auth';
import { getHeroContent, updateHeroContent, getTrendingContent, updateTrendingContent } from '../../src/services/content';
import { getAllEpisodes } from '../../src/services/api';
import ImageUploader from '../../components/admin/ImageUploader';

export default function ContentEditor() {
  const [activeTab, setActiveTab] = useState<'hero' | 'trending'>('hero');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [episodes, setEpisodes] = useState<any[]>([]);
  const navigate = useNavigate();

  // Hero data
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
    enabled: true
  });

  // Trending data
  const [trendingData, setTrendingData] = useState({
    title: '',
    subtitle: '',
    featuredEpisodeId: '',
    showFeatured: true,
    enabled: true
  });

  useEffect(() => {
    loadContent();
    loadEpisodes();
    const user = authService.getCurrentUser();
    if (user) setUserEmail(user.email || '');
  }, []);

  const loadContent = async () => {
    const heroResult = await getHeroContent();
    if (heroResult.success && heroResult.data) {
      setHeroData(heroResult.data);
    }

    const trendingResult = await getTrendingContent();
    if (trendingResult.success && trendingResult.data) {
      setTrendingData(trendingResult.data);
    }
  };

  const loadEpisodes = async () => {
    const data = await getAllEpisodes();
    setEpisodes(data);
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleSaveHero = async () => {
    setLoading(true);
    const result = await updateHeroContent(heroData);
    if (result.success) {
      alert('✅ Hero actualizado correctamente');
    } else {
      alert('❌ Error al actualizar');
    }
    setLoading(false);
  };

  const handleSaveTrending = async () => {
    setLoading(true);
    const result = await updateTrendingContent(trendingData);
    if (result.success) {
      alert('✅ Sección Trending actualizada correctamente');
    } else {
      alert('❌ Error al actualizar');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-darker">
      {/* Header */}
      <header className="bg-dark border-b border-light/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-light">Editor de Contenido</h1>
                <p className="text-xs text-light/60">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-light/80 hover:text-light transition"
              >
                <Home size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-light/10">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'hero'
                ? 'text-primary border-b-2 border-primary'
                : 'text-light/60 hover:text-light'
            }`}
          >
            Hero Principal
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'trending'
                ? 'text-primary border-b-2 border-primary'
                : 'text-light/60 hover:text-light'
            }`}
          >
            Sección Trending
          </button>
        </div>

        {/* Hero Editor */}
        {activeTab === 'hero' && (
          <div className="bg-dark border border-light/10 rounded-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-light mb-6">Editar Hero Principal</h2>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">
                Título Principal *
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Hablamos, Tú Escuchas"
              />
            </div>

            {/* Subtítulo */}
            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">
                Subtítulo *
              </label>
              <textarea
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descripción del proyecto..."
              />
            </div>

            {/* Imagen con uploader */}
            <ImageUploader
              currentImage={heroData.imageUrl}
              onImageUploaded={(url) => setHeroData({ ...heroData, imageUrl: url })}
              label="Imagen de Fondo del Hero"
            />

            {/* Texto del botón CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light/80 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={heroData.ctaText}
                  onChange={(e) => setHeroData({ ...heroData, ctaText: e.target.value })}
                  className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ej: Escuchar Ahora"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light/80 mb-2">
                  Enlace del Botón
                </label>
                <input
                  type="text"
                  value={heroData.ctaLink}
                  onChange={(e) => setHeroData({ ...heroData, ctaLink: e.target.value })}
                  className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="/episodes"
                />
              </div>
            </div>

            {/* Toggle enabled */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="heroEnabled"
                checked={heroData.enabled}
                onChange={(e) => setHeroData({ ...heroData, enabled: e.target.checked })}
                className="w-5 h-5 text-primary focus:ring-primary rounded"
              />
              <label htmlFor="heroEnabled" className="text-light/80">
                Mostrar Hero en la página principal
              </label>
            </div>

            {/* Guardar */}
            <button
              onClick={handleSaveHero}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-darker font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        )}

        {/* Trending Editor */}
        {activeTab === 'trending' && (
          <div className="bg-dark border border-light/10 rounded-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-light mb-6">Editar Sección Trending</h2>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">
                Título de la Sección *
              </label>
              <input
                type="text"
                value={trendingData.title}
                onChange={(e) => setTrendingData({ ...trendingData, title: e.target.value })}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Popular & Tendencia"
              />
            </div>

            {/* Subtítulo */}
            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={trendingData.subtitle}
                onChange={(e) => setTrendingData({ ...trendingData, subtitle: e.target.value })}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Los episodios más escuchados"
              />
            </div>

            {/* Episodio destacado */}
            <div>
              <label className="block text-sm font-medium text-light/80 mb-2">
                Episodio Destacado (opcional)
              </label>
              <select
                value={trendingData.featuredEpisodeId}
                onChange={(e) => setTrendingData({ ...trendingData, featuredEpisodeId: e.target.value })}
                className="w-full px-4 py-3 bg-darker text-light rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Automático (más reproducido)</option>
                {episodes.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.title} ({ep.plays} reproducciones)
                  </option>
                ))}
              </select>
              <p className="text-light/50 text-xs mt-1">
                Si no seleccionas ninguno, se mostrará automáticamente el episodio con más reproducciones
              </p>
            </div>

            {/* Toggle enabled */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="trendingEnabled"
                checked={trendingData.enabled}
                onChange={(e) => setTrendingData({ ...trendingData, enabled: e.target.checked })}
                className="w-5 h-5 text-primary focus:ring-primary rounded"
              />
              <label htmlFor="trendingEnabled" className="text-light/80">
                Mostrar sección Trending en la página principal
              </label>
            </div>

            {/* Guardar */}
            <button
              onClick={handleSaveTrending}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-primary text-darker font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}