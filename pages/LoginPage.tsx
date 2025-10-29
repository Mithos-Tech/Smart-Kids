import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound } from 'lucide-react';
import { authService } from '../src/firebase/auth';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await authService.login(email, password);
        
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.error || 'Error al iniciar sesión');
        }
        
        setLoading(false);
    };

    return (
        <div className="bg-darker text-light py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-dark p-8 sm:p-12 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h1 className="font-heading text-4xl font-bold text-light mb-2">Acceso Docentes</h1>
                        <p className="text-light/70 mb-8">Esta área es exclusiva para el personal autorizado.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-light/80 mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-5 w-5 text-light/40" />
                                </span>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu-correo@escuela.com" 
                                    required 
                                    className="w-full bg-darker text-light px-4 py-3 pl-10 rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary" 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-light/80 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <KeyRound className="h-5 w-5 text-light/40" />
                                </span>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    required 
                                    className="w-full bg-darker text-light px-4 py-3 pl-10 rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary" 
                                />
                            </div>
                        </div>

                        {/* Mensaje de error */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-darker font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <a 
                            href="/"
                            className="text-sm text-primary/80 hover:text-primary transition"
                        >
                            ← Volver al sitio principal
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;