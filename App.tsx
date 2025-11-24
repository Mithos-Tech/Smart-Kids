import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import Team from './pages/Team';
import Admin from './pages/Admin';
import Login from './pages/Login';

// Component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- SECURITY GUARD ---
// This component checks if the user has a digital key (token) in their browser.
// If not, it kicks them back to the Login Command Center.
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('smart_auth_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/episodes" element={<Episodes />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* PROTECTED ROUTE: Only accessible with a key */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </HashRouter>
  );
};

export default App;