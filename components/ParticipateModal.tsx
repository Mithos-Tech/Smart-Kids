import React, { useEffect, useState } from 'react';
import { X, Mic, Send, CheckCircle, AlertTriangle } from 'lucide-react';

interface ParticipateModalProps {
    onClose: () => void;
}

const ParticipateModal: React.FC<ParticipateModalProps> = ({ onClose }) => {
    const FORMSPARK_ACTION_URL = "https://submit-form.com/n7zm4n7k3";

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !role || !message) {
            setStatus('error');
            setResponseMessage('Por favor, completa todos los campos.');
            return;
        }
        setStatus('submitting');
        setResponseMessage('');

        try {
            const response = await fetch(FORMSPARK_ACTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    _form: "Contact Form", // Identifier for Formspark
                    name,
                    email,
                    role,
                    message,
                }),
            });

            if (response.ok) {
                setStatus('success');
                setResponseMessage('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
                setName('');
                setEmail('');
                setRole('');
                setMessage('');
            } else {
                setStatus('error');
                setResponseMessage('Ocurrió un error. Por favor, intenta de nuevo más tarde.');
            }
        } catch (error) {
            setStatus('error');
            setResponseMessage('No se pudo enviar. Revisa tu conexión e intenta de nuevo.');
        }
    };
    
    const renderContent = () => {
        if (status === 'success') {
            return (
                <div className="text-center flex flex-col items-center justify-center p-8 min-h-[400px]">
                    <CheckCircle className="w-16 h-16 text-primary mb-6" />
                    <h2 className="font-heading text-3xl font-bold text-light mb-4">¡Mensaje Enviado!</h2>
                    <p className="text-light/80 text-lg max-w-md mx-auto">{responseMessage}</p>
                     <button 
                        onClick={onClose}
                        className="mt-8 bg-secondary text-light font-bold py-3 px-6 rounded-xl hover:bg-secondary/90 transition-colors duration-300"
                    >
                        Cerrar
                    </button>
                </div>
            );
        }

        return (
             <form onSubmit={handleSubmit} className="p-8 lg:p-12">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-primary/10 p-5 rounded-full">
                            <Mic className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <h2 className="font-heading text-4xl font-bold text-light mb-4">¡Forma Parte de Smart Kids!</h2>
                    <p className="text-light/70 text-lg max-w-lg mx-auto">
                        Completa el formulario y nos pondremos en contacto contigo. ¡Estamos emocionados por escucharte!
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-light/80 mb-2">Nombre Completo</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-darker text-light px-4 py-3 rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-light/80 mb-2">Correo Electrónico</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-darker text-light px-4 py-3 rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-light/80 mb-2">Tu Rol</label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value)} required className="w-full bg-darker text-light px-4 py-3 rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
                            <option value="" disabled>Selecciona una opción...</option>
                            <option value="Docente">Docente</option>
                            <option value="Padre de Familia">Padre de Familia</option>
                            <option value="Alumno">Alumno</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-light/80 mb-2">Mensaje</label>
                        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={4} className="w-full bg-darker text-light px-4 py-3 rounded-xl border border-light/10 focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                    </div>
                </div>
                
                <div className="mt-8">
                    <button 
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full flex items-center justify-center gap-2 bg-secondary text-light font-bold py-4 px-8 rounded-xl hover:bg-secondary/90 transition-colors duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                        {status === 'submitting' ? 'Enviando...' : 'Enviar Mensaje'}
                    </button>
                    {status === 'error' && (
                        <p className="text-sm text-red-500 mt-4 text-center flex items-center justify-center gap-2">
                            <AlertTriangle size={16} /> {responseMessage}
                        </p>
                    )}
                </div>
            </form>
        );
    }

    return (
        <div 
            className="fixed inset-0 bg-darker/80 backdrop-blur-lg z-[100] flex justify-center items-center p-4"
            onClick={onClose}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
            <div 
                className="relative bg-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'scaleIn 0.3s ease-out' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-light/70 hover:text-primary transition-colors z-20 bg-darker/50 rounded-full p-2"
                    aria-label="Cerrar modal"
                >
                    <X size={24} />
                </button>
                {renderContent()}
            </div>
        </div>
    );
};

export default ParticipateModal;
