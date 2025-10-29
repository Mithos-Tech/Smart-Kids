import React, { useState, useEffect } from 'react';
import { ImageUploader } from '../../components/ImageUploader';
import { getSiteContent, updateSiteContent, createSiteContent, SiteContent } from '../../src/firebase/content';

const ContentManager: React.FC = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [editingItem, setEditingItem] = useState<SiteContent | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const data = await getSiteContent();
    setContent(data);
    setLoading(false);
  };

  const handleImageUpload = async (url: string, itemId?: string) => {
    if (itemId) {
      // Actualizar existente
      await updateSiteContent(itemId, { imageUrl: url });
    } else if (editingItem) {
      // Crear nuevo
      await createSiteContent({
        section: editingItem.section,
        title: editingItem.title,
        subtitle: editingItem.subtitle,
        imageUrl: url,
        order: editingItem.order || 0,
        active: true
      });
    }
    loadContent();
    setEditingItem(null);
  };

  const sections = [
    { id: 'hero', name: 'Hero Principal' },
    { id: 'gallery', name: 'Galería' },
    { id: 'professors', name: 'Profesores' },
    { id: 'episodes', name: 'Episodios' }
  ];

  const filteredContent = content.filter(item => item.section === selectedSection);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Contenido Visual</h1>

      {/* Selector de Sección */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Selecciona una sección</h2>
        <div className="flex gap-2 flex-wrap">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {section.name}
            </button>
          ))}
        </div>
      </div>

      {/* Botón Agregar Nuevo */}
      <div className="mb-6">
        <button
          onClick={() => setEditingItem({
            id: '',
            section: selectedSection as any,
            imageUrl: '',
            active: true,
            createdAt: '',
            updatedAt: ''
          })}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          + Agregar Nueva Imagen
        </button>
      </div>

      {/* Lista de Contenido */}
      {loading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48">
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Imagen'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
                  >
                    ✏️
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{item.title || 'Sin título'}</h3>
                <p className="text-sm text-gray-600">{item.subtitle || ''}</p>
                <div className="mt-2 flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.active ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                  }`}>
                    {item.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Edición */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem.id ? 'Editar' : 'Agregar'} Imagen
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtítulo</label>
                <input
                  type="text"
                  value={editingItem.subtitle || ''}
                  onChange={(e) => setEditingItem({...editingItem, subtitle: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <ImageUploader
                currentImageUrl={editingItem.imageUrl}
                onImageUploaded={(url) => handleImageUpload(url, editingItem.id || undefined)}
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
