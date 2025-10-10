import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EpisodesPage from './pages/EpisodesPage';
import TeamPage from './pages/TeamPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingPlayer from './components/FloatingPlayer';
import { PlayerProvider, usePlayer } from './context/PlayerContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent: React.FC = () => {
    const { currentEpisode } = usePlayer();
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20"> 
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/episodes" element={<EpisodesPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/terminos" element={<TermsPage />} />
                    <Route path="/privacidad" element={<PrivacyPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </main>
            <Footer />
            {currentEpisode && <FloatingPlayer />}
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