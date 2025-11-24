import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Lock, ArrowRight, AlertTriangle, CheckCircle2, Fingerprint, Mic2, Crown, Music4, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginState, setLoginState] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [userRole, setUserRole] = useState<{ name: string; role: string; color: string } | null>(null);
  const navigate = useNavigate();

  // High Quality Studio Background
  const STUDIO_BG = "https://res.cloudinary.com/dkoshgzxo/image/upload/v1763759394/Login_background_mdc8c1.jpg";

  useEffect(() => {
    // Check if already logged in, redirect if so
    if (localStorage.getItem('smart_auth_token')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoginState('scanning');
    setIsLoading(true);

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Determine user role based on email
      let role = { name: 'Administrador', role: 'Acceso Root', color: 'text-purple-400' };
      
      if (email.includes('miriam')) {
        role = { name: 'Miriam Foster', role: 'Directora General', color: 'text-emerald-400' };
      } else if (email.includes('mario')) {
        role = { name: 'Mario Liberato', role: 'Productor Técnico', color: 'text-blue-400' };
      }

      setUserRole(role);

      // Save token
      localStorage.setItem('smart_auth_token', token);
      localStorage.setItem('smart_user_email', email);

      setLoginState('success');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err: any) {
      setLoginState('error');
      setIsLoading(false);
      setTimeout(() => {
        setLoginState('idle');
        setPassword('');
      }, 2000);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Return Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/5 hover:border-white/20"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-bold">Volver al inicio</span>
      </Link>

      {/* 1. Background Layer with Studio Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={STUDIO_BG} 
          alt="Studio Background" 
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Gradient overlay - Radial gradient to keep center visible but text readable */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,15,30,0.4)_0%,rgba(10,15,30,0.8)_100%)]" />
      </div>

      {/* 2. Floating Blobs for Brand Identity */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1f35]/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Decorative Header */}
          <div className="h-2 w-full bg-gradient-to-r from-cyan-400 via-white to-indigo-400 opacity-70"></div>
          
          <div className="p-10 md:p-12">
            
            {/* Header Logo/Icon Area */}
            <div className="text-center mb-10">
              <div className="relative w-24 h-24 mx-auto mb-6">
                {/* Animated Rings */}
                <div className={`absolute inset-0 rounded-full border-2 border-dashed border-white/10 ${loginState === 'scanning' ? 'animate-spin' : ''}`}></div>
                <div className={`absolute inset-2 rounded-full border border-white/5 ${loginState === 'scanning' ? 'animate-spin-slow' : ''}`}></div>
                
                {/* Central Icon Status */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {loginState === 'idle' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="bg-white/5 p-4 rounded-full border border-white/10">
                        <Lock size={32} className="text-gray-300" />
                      </motion.div>
                    )}
                    {loginState === 'scanning' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/30">
                        <Fingerprint size={32} className="text-cyan-400 animate-pulse" />
                      </motion.div>
                    )}
                    {loginState === 'success' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="bg-emerald-500/20 p-4 rounded-full border border-emerald-500/50">
                        <CheckCircle2 size={32} className="text-emerald-400" />
                      </motion.div>
                    )}
                    {loginState === 'error' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="bg-red-500/20 p-4 rounded-full border border-red-500/50">
                        <AlertTriangle size={32} className="text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <h2 className="font-display font-bold text-2xl text-white mb-2 tracking-tight">
                Acceso Restringido
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Panel de Control de Smart Kids
              </p>
            </div>

            {/* Interaction Area */}
            <AnimatePresence mode="wait">
              {loginState === 'success' && userRole ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center mb-4"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border-2 border-white/10 flex items-center justify-center shadow-lg">
                      <UserIcon role={userRole.role} />
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Bienvenido/a</div>
                  <h3 className={`text-xl font-bold ${userRole.color} mb-1`}>{userRole.name}</h3>
                  <div className="text-white/50 text-xs font-medium">{userRole.role}</div>
                </motion.div>
              ) : (
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleLogin} 
                  className="space-y-4 relative"
                >
                  {/* Email Input */}
                  <div className="group relative">
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-[#0a0f1e]/50 border-2 ${loginState === 'error' ? 'border-red-500/50 text-red-400' : 'border-white/10 focus:border-cyan-400/50 text-white'} rounded-2xl px-6 py-3 text-sm outline-none transition-all placeholder-gray-500 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)]`}
                      placeholder="Email"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password Input */}
                  <div className="group relative">
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-[#0a0f1e]/50 border-2 ${loginState === 'error' ? 'border-red-500/50 text-red-400' : 'border-white/10 focus:border-cyan-400/50 text-white'} rounded-2xl px-6 py-3 text-sm outline-none transition-all placeholder-gray-500 focus:shadow-[0_0_20px_rgba(34,211,238,0.1)]`}
                      placeholder="Contraseña"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Error Message */}
                  {loginState === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-2 text-center"
                    >
                      <p className="text-red-400 text-xs font-bold uppercase tracking-wider">
                        Credenciales inválidas
                      </p>
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all transform active:scale-95
                      ${loginState === 'error' 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/30 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-cyan-400 hover:text-black border border-transparent hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                  >
                    {isLoading ? 'Verificando...' : 'Desbloquear Sistema'}
                    {!isLoading && <ArrowRight size={16} />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper icon component
const UserIcon = ({ role }: { role: string }) => {
  if (role.includes('Directora')) return <Crown size={20} className="text-emerald-200" />;
  if (role.includes('Productor')) return <Music4 size={20} className="text-blue-200" />;
  return <CheckCircle2 size={20} className="text-purple-200" />;
}

export default Login;