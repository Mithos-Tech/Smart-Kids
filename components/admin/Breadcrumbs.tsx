import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Botón de retorno */}
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 bg-dark border border-light/10 rounded-lg text-light/70 hover:text-light hover:border-primary/30 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Atrás</span>
        </button>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 text-light/60 hover:text-primary transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-light/30" />
            {item.path ? (
              <Link
                to={item.path}
                className="text-light/60 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-light font-semibold">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default Breadcrumbs;