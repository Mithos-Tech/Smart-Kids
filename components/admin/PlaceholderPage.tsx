import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Breadcrumbs from '../../components/admin/Breadcrumbs';

interface PlaceholderPageProps {
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; path?: string }>;
  status: 'working' | 'coming-soon' | 'needs-improvement';
  icon?: React.ReactNode;
  statusMessage?: string;
  features?: string[];
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  breadcrumbs,
  status,
  icon,
  statusMessage,
  features
}) => {
  const navigate = useNavigate();

  const statusConfig = {
    'working': {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-500',
      icon: <CheckCircle className="w-6 h-6" />,
      label: 'Funcionando'
    },
    'coming-soon': {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-500',
      icon: <Construction className="w-6 h-6" />,
      label: 'Próximamente'
    },
    'needs-improvement': {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-500',
      icon: <AlertTriangle className="w-6 h-6" />,
      label: 'Por Mejorar'
    }
  };

  const config = statusConfig[status];

  return (
    <AdminLayout>
      <Breadcrumbs items={breadcrumbs} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {icon || <Construction className="w-10 h-10 text-primary" />}
          </div>
          <h1 className="text-3xl font-bold text-light mb-2">{title}</h1>
          <p className="text-light/60">{description}</p>
        </div>

        {/* Status */}
        <div className={`mb-8 p-6 ${config.bg} border ${config.border} rounded-xl`}>
          <div className="flex items-start gap-4">
            <div className={config.text}>
              {config.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold mb-1 ${config.text}`}>
                Estado: {config.label}
              </h3>
              <p className="text-light/70 text-sm">
                {statusMessage || 'Esta sección está en desarrollo y estará disponible pronto.'}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="bg-dark rounded-xl p-6 border border-light/10 mb-8">
            <h3 className="text-lg font-semibold text-light mb-4">
              Funcionalidades Planificadas
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-light/70">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 px-6 py-3 bg-dark border border-light/10 rounded-lg text-light hover:border-primary/30 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al Dashboard
          </button>
          
          {status === 'working' && (
            <button className="flex-1 bg-primary text-darker font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all">
              Abrir Sección
            </button>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-blue-400 text-sm">
            <strong>Proyecto Demo:</strong> Esta página forma parte del portafolio Inspyrio. 
            Las funcionalidades marcadas como "Próximamente" muestran la arquitectura planificada del sistema.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PlaceholderPage;