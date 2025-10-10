import React from 'react';
import { User, KeyRound } from 'lucide-react';

const LoginPage: React.FC = () => {
    return (
        <div className="bg-darker text-light py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-dark p-8 sm:p-12 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h1 className="font-heading text-4xl font-bold text-light mb-2">Acceso Docentes</h1>
                        <p className="text-light/70 mb-8">Esta área es exclusiva para el personal autorizado.</p>
                    </div>
                    
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-light/80 mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-5 w-5 text-light/40" />
                                </span>
                                <input type="email" id="email" name="email" placeholder="tu-correo@escuela.com" required className="w-full bg-darker text-light px-4 py-3 pl-10 rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-light/80 mb-2">Contraseña</label>
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <KeyRound className="h-5 w-5 text-light/40" />
                                </span>
                                <input type="password" id="password" name="password" placeholder="••••••••" required className="w-full bg-darker text-light px-4 py-3 pl-10 rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                        </div>
                        <div className="text-right">
                            <a href="#" className="text-sm text-primary/80 hover:text-primary transition">¿Olvidaste tu contraseña?</a>
                        </div>
                        <div>
                            <button
                                type="submit"
                                onClick={(e) => e.preventDefault()} // Prevent submission for now
                                className="w-full bg-primary text-darker font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-8 text-center text-sm text-light/50">
                        <p>La lógica de autenticación se implementará con el backend.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;