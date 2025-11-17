import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EpisodesPage from './pages/EpisodesPage';
import TeamPage from './pages/TeamPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LoginPage from './pages/LoginPage';
import { TestUploadPage } from './pages/TestUploadPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EpisodesManager from './pages/admin/EpisodesManager';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingPlayer from './components/FloatingPlayer';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import ContentEditor from './pages/admin/ContentEditor';
import SiteContentEditor from './pages/admin/SiteContentEditor';
import ContentManager from './pages/admin/ContentManager';
import EpisodeForm from './pages/admin/EpisodeForm';
import ProfessorsManager from './pages/admin/ProfessorsManager';
import ProfessorForm from './pages/admin/ProfessorForm';
import Breadcrumbs from './components/admin/Breadcrumbs';
import PlaceholderPage from './components/admin/PlaceholderPage';
import HeroEditor from './pages/admin/pages/HeroEditor';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import TestimonialForm from './pages/admin/TestimonialForm';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
    const { currentEpisode } = usePlayer();
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminRoute && <Header />}
            <main className={!isAdminRoute ? "flex-grow pt-20" : "flex-grow"}>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/episodes" element={<EpisodesPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/terminos" element={<TermsPage />} />
                    <Route path="/privacidad" element={<PrivacyPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/test-upload" element={<TestUploadPage />} />

                    {/* Rutas protegidas del admin */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    
                    {/* Rutas de Página: Inicio */}
<Route
  path="/admin/pages/home/hero"
  element={
    <ProtectedRoute>
      <HeroEditor />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/pages/home/featured"
  element={
    <ProtectedRoute>
      <PlaceholderPage
        title="Episodios Destacados"
        description="Gestiona qué episodios aparecen en 'Popular & Tendencia'"
        breadcrumbs={[
          { label: 'Página: Inicio', path: '/admin/dashboard' },
          { label: 'Episodios Destacados' }
        ]}
        status="needs-improvement"
        statusMessage="Esta sección necesita rediseño para usar episodios destacados de Firebase"
        features={[
          'Seleccionar episodios destacados automáticamente por reproducciones',
          'Marcar manualmente episodios como "Popular & Tendencia"',
          'Configurar número de episodios a mostrar',
          'Vista previa de cómo se verán en el sitio'
        ]}
      />
    </ProtectedRoute>
  }
/>

{/* Ruta de Galería */}
<Route
  path="/admin/gallery"
  element={
    <ProtectedRoute>
      <PlaceholderPage
        title="Galería del Proyecto"
        description="Gestión de imágenes vinculadas con Cloudinary"
        breadcrumbs={[
          { label: 'Página: Nosotros', path: '/admin/dashboard' },
          { label: 'Galería' }
        ]}
        status="working"
        statusMessage="Esta sección está vinculada con Cloudinary y funcionando correctamente"
        features={[
          'Subir imágenes a Cloudinary',
          'Organizar galería de fotos del proyecto',
          'Editar y eliminar imágenes',
          'Vista en la página Nosotros'
        ]}
      />
    </ProtectedRoute>
  }
/>

{/* Ruta de Editor de Nosotros */}
<Route
  path="/admin/pages/about"
  element={
    <ProtectedRoute>
      <PlaceholderPage
        title="Editor de Página Nosotros"
        description="Edita el contenido de la página Nosotros"
        breadcrumbs={[
          { label: 'Página: Nosotros', path: '/admin/dashboard' },
          { label: 'Contenido' }
        ]}
        status="coming-soon"
        features={[
          'Editar sección de Misión y Visión',
          'Gestionar timeline del proyecto',
          'Configurar textos y descripciones',
          'Vista previa de cambios'
        ]}
      />
    </ProtectedRoute>
  }
/>

{/* Ruta de Configuración */}
<Route
  path="/admin/settings"
  element={
    <ProtectedRoute>
      <PlaceholderPage
        title="Configuración del Sistema"
        description="Ajustes generales de la plataforma"
        breadcrumbs={[
          { label: 'Configuración' }
        ]}
        status="coming-soon"
        features={[
          'Cambiar contraseña de administrador',
          'Configurar integraciones (Cloudinary, Spotify)',
          'Ajustes de seguridad',
          'Respaldos y exportación de datos'
        ]}
      />
    </ProtectedRoute>
  }
/>

                    {/* NUEVAS RUTAS: Gestión de Episodios */}
                    <Route
                        path="/admin/professors"
                        element={
                           <ProtectedRoute>
                              <ProfessorsManager />
                           </ProtectedRoute>
                        }
                    />
                    <Route
    path="/admin/professors/new"
    element={
       <ProtectedRoute>
          <ProfessorForm />
       </ProtectedRoute>
    }
 />
<Route
    path="/admin/professors/edit/:id"
    element={
        <ProtectedRoute>
            <ProfessorForm />
        </ProtectedRoute>
    }
/>
                    <Route
                        path="/admin/episodes"
                        element={
                            <ProtectedRoute>
                                <EpisodesManager />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/episodes/new"
                        element={
                            <ProtectedRoute>
                                <EpisodeForm />  {/* ← Cambia esto */}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/episodes/edit/:id"
                        element={
                            <ProtectedRoute>
                                <EpisodeForm />  {/* ← Cambia esto */}
                            </ProtectedRoute>
                        }
                    />

                   {/* Rutas de Testimonios */}
<Route
  path="/admin/testimonials"
  element={
    <ProtectedRoute>
      <TestimonialsManager />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/testimonials/new"
  element={
    <ProtectedRoute>
      <TestimonialForm />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/testimonials/edit/:id"
  element={
    <ProtectedRoute>
      <TestimonialForm />
    </ProtectedRoute>
  }
/>

                    {/* Otras rutas admin */}
                    <Route
                       path="/admin/sitio"
                       element={
                            <ProtectedRoute>
                               <SiteContentEditor />
                           </ProtectedRoute>
                        }
                    />
                    <Route
                      path="/admin/imagenes"
                      element={
                           <ProtectedRoute>
                              <ContentManager />
                           </ProtectedRoute>
                        }
                    />
                    <Route
                      path="/admin/contenido"
                      element={
                           <ProtectedRoute>
                             <SiteContentEditor />
                           </ProtectedRoute>
                        }
                    />

                </Routes>
            </main>
            {!isAdminRoute && <Footer />}
            {currentEpisode && !isAdminRoute && <FloatingPlayer />}
        </div>
    );
};

function App() {
  // Remover header inicial cuando React monta
  React.useEffect(() => {
    const initialHeader = document.getElementById('initial-header');
    if (initialHeader) {
      initialHeader.style.display = 'none';
    }
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </HashRouter>
  );
}

export default App;