import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Image, Save, CheckCircle } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Breadcrumbs from '../../../components/admin/Breadcrumbs';

const HeroEditor: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <Breadcrumbs 
        items={[
          { label: 'Página: Inicio', path: '/admin/dashboard' },
          { label: 'Hero Principal' }
        ]}
      />

      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-light">Editor del Hero Principal</h1>
              <p className="text-light/60 text-sm">Configura la primera sección de tu página de inicio</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-green-500 font-semibold">Sección Funcionando</p>
            <p className="text-light/60 text-sm">Esta sección ya está implementada en el sitio</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-dark rounded-xl p-6 border border-light/10 space-y-6">
          {/* Título Principal */}
          <div>
            <label className="block text-light font-semibold mb-2">
              Título Principal
            </label>
            <input
              type="text"
              defaultValue="Hablamos,"
              className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
              placeholder="Ej: Hablamos,"
            />
          </div>

          {/* Subtítulo Destacado */}
          <div>
            <label className="block text-light font-semibold mb-2">
              Subtítulo Destacado
            </label>
            <input
              type="text"
              defaultValue="Tú Escuchas"
              className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
              placeholder="Ej: Tú Escuchas"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-light font-semibold mb-2">
              Descripción
            </label>
            <textarea
              rows={3}
              defaultValue="Descubre el talento y la creatividad de nuestros estudiantes a través de podcasts educativos hechos por y para niños."
              className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Imagen de fondo */}
          <div>
            <label className="block text-light font-semibold mb-3">
              Imagen de Fondo
            </label>
            <div className="border-2 border-dashed border-light/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Image className="w-12 h-12 text-light/40 mx-auto mb-3" />
              <p className="text-light/60 mb-1">Haz clic para cambiar imagen</p>
              <p className="text-light/40 text-xs">Actualmente vinculado con Cloudinary</p>
            </div>
          </div>

          {/* Botón CTA */}
          <div>
            <label className="block text-light font-semibold mb-2">
              Texto del Botón
            </label>
            <input
              type="text"
              defaultValue="Escucha ahora"
              className="w-full bg-darker text-light px-4 py-3 rounded-lg border border-light/10 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4 pt-6 border-t border-light/10">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3 bg-darker text-light rounded-lg hover:bg-light/5 transition-colors"
            >
              Cancelar
            </button>
            <button className="flex-1 bg-primary text-darker font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2">
              <Save size={20} />
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-blue-400 text-sm">
            <strong>Nota:</strong> Esta es una página de demostración. Para funcionalidad completa, 
            conecta con Firebase o tu sistema de gestión de contenido.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HeroEditor;