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
                              <div className="flex items-center justify-center min-h-screen bg-darker">
                              <p className="text-light">Formulario Crear Profesor (próximamente)</p>
                              </div>
                           </ProtectedRoute>
                        }
                     />
<Route
    path="/admin/professors/edit/:id"
    element={
        <ProtectedRoute>
            <div className="flex items-center justify-center min-h-screen bg-darker">
                <p className="text-light">Formulario Editar Profesor (próximamente)</p>
            </div>
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