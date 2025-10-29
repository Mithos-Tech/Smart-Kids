import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ImageUploader } from '../../components/ImageUploader';
import { getSiteContent, updateSiteContent, createSiteContent, SiteContent } from '../../src/firebase/content';
import { Save, Info, Trash2, Edit } from 'lucide-react';

type TabType = 'hero' | 'trending' | 'gallery' | 'professors';

const SiteContentEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroContent, setHeroContent] = useState<SiteContent | null>(null);
  const [galleryContent, setGalleryContent] = useState<SiteContent[]>([]);
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null);
  const [galleryUploadUrl, setGalleryUploadUrl] = useState<string>('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const allContent = await getSiteContent();
      
      const hero = allContent.find(c => c.section === 'hero');
      if (hero) setHeroContent(hero);
      
      const gallery = allContent.filter(c => c.section === 'gallery').sort((a, b) => (a.order || 0) - (b.order || 0));
      setGalleryContent(gallery);
      
    } catch (error) {
      console.error('Error cargando contenido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    if (!heroContent) return;
    
    setSaving(true);
    try {
      if (heroContent.id) {
        await updateSiteContent(heroContent.id, {
          title: heroContent.title,
          subtitle: heroContent.subtitle,
          imageUrl: heroContent.imageUrl
        });
      } else {
        await createSiteContent({
          section: 'hero',
          title: heroContent.title || '',
          subtitle: heroContent.subtitle || '',
          imageUrl: heroContent.imageUrl,
          active: true,
          order: 0
        });
      }
      alert('✅ Hero actualizado correctamente');
      loadContent();
    } catch (error) {
      console.error('Error guardando hero:', error);
      alert('❌ Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGalleryImage = async (order: number) => {
    if (!galleryUploadUrl) return;

    setSaving(true);
    try {
      const existingImage = galleryContent.find(g => g.order === order);
      
      if (existingImage) {
        await updateSiteContent(existingImage.id, {
          imageUrl: galleryUploadUrl,
          title: `Galería ${order + 1}`
        });
      } else {
        await createSiteContent({
          section: 'gallery',
          title: `Galería ${order + 1}`,
          imageUrl: galleryUploadUrl,
          active: true,
          order: order
        });
      }
      
      alert('✅ Imagen guardada correctamente');
      setEditingGalleryIndex(null);
      setGalleryUploadUrl('');
      loadContent();
    } catch (error) {
      console.error('Error guardando imagen:', error);
      alert('❌ Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, name: 'Hero Principal', icon: '🏠' },
    { id: 'trending' as TabType, name: 'Trending', icon: '🔥' },
    { id: 'gallery' as TabType, name: 'Galería', icon: '🖼️' },
    { id: 'professors' as TabType, name: 'Profesores', icon: '👥' }
  ];

  if (loading) {
    return (
      <AdminLayout title="Contenido del Sitio" subtitle="Gestiona las imágenes y textos del sitio web">
        <div className="flex items-center justify-center h-96">
          <div className="text-light/50">Cargando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contenido del Sitio" subtitle="Gestiona las imágenes y textos del sitio web">
      <div className="bg-darker rounded-lg p-2 flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-darker font-semibold'
                : 'text-light/70 hover:text-light hover:bg-light/5'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* HERO TAB */}
      {activeTab === 'hero' && (
        <div className="bg-darker rounded-lg p-8 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-light/80">
              <p className="font-semibold text-blue-400 mb-1">Imagen del Hero Principal</p>
              <p>Esta es la imagen de fondo de la sección principal de tu sitio.</p>
              <p className="mt-2 text-xs text-light/60">
                <strong>Formato:</strong> JPG, WebP • <strong>Tamaño:</strong> 1920x1080px • <strong>Peso máx:</strong> 2MB
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-light mb-2">Título Principal *</label>
            <input
              type="text"
              value={heroContent?.title || ''}
              onChange={(e) => setHeroContent(prev => prev ? {...prev, title: e.target.value} : null)}
              placeholder="Ej: Hablamos,"
              className="w-full bg-dark border border-light/10 rounded-lg px-4 py-3 text-light placeholder-light/30 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light mb-2">Subtítulo (texto resaltado) *</label>
            <input
              type="text"
              value={heroContent?.subtitle || ''}
              onChange={(e) => setHeroContent(prev => prev ? {...prev, subtitle: e.target.value} : null)}
              placeholder="Ej: Tú Escuchas"
              className="w-full bg-dark border border-light/10 rounded-lg px-4 py-3 text-light placeholder-light/30 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light mb-2">Imagen de Fondo *</label>
            <ImageUploader
              currentImageUrl={heroContent?.imageUrl}
              onImageUploaded={(url) => setHeroContent(prev => prev ? {...prev, imageUrl: url} : {
                id: '',
                section: 'hero',
                imageUrl: url,
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })}
            />
          </div>

          {heroContent?.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-light mb-2">Preview Actual</label>
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-dark">
                <img src={heroContent.imageUrl} alt="Hero preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-darker/90 to-transparent flex items-center">
                  <div className="p-8">
                    <h2 className="text-4xl font-bold text-light">{heroContent.title || 'Título'}</h2>
                    <h3 className="text-3xl font-bold text-primary mt-2">{heroContent.subtitle || 'Subtítulo'}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveHero}
              disabled={saving || !heroContent?.imageUrl}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-darker font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      )}

      {/* TRENDING TAB */}
      {activeTab === 'trending' && (
        <div className="bg-darker rounded-lg p-8 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
            <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-light/80">
              <p className="font-semibold text-yellow-400 mb-1">Sección Trending</p>
              <p>Esta sección muestra el episodio más popular de la plataforma.</p>
              <p className="mt-2 text-xs text-light/60">Se actualiza automáticamente según las reproducciones.</p>
            </div>
          </div>
          
          <div className="text-center py-12 text-light/50">
            <p className="text-lg">🔥 Esta sección se actualiza automáticamente</p>
            <p className="text-sm mt-2">Muestra el episodio con más reproducciones (&gt;1500 plays)</p>
          </div>
        </div>
      )}

      {/* GALLERY TAB */}
      {activeTab === 'gallery' && (
        <div className="bg-darker rounded-lg p-8 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg">
            <Info className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-light/80">
              <p className="font-semibold text-purple-400 mb-1">Galería del Proyecto</p>
              <p>Sube hasta 8 imágenes que se mostrarán en la galería de la página principal.</p>
              <p className="mt-2 text-xs text-light/60">
                <strong>Formato:</strong> JPG, WebP • <strong>Tamaño:</strong> 1200x800px • <strong>Peso máx:</strong> 1.5MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((order) => {
              const existingImage = galleryContent.find(g => g.order === order);
              const isEditing = editingGalleryIndex === order;

              return (
                <div key={order} className="bg-dark rounded-lg border border-light/10 overflow-hidden">
                  {isEditing ? (
                    <div className="p-4 space-y-3">
                      <p className="text-sm font-medium text-light">Imagen {order + 1}</p>
                      <ImageUploader
                        currentImageUrl={existingImage?.imageUrl}
                        onImageUploaded={(url) => setGalleryUploadUrl(url)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveGalleryImage(order)}
                          disabled={!galleryUploadUrl}
                          className="flex-1 px-3 py-2 bg-primary text-darker text-sm font-semibold rounded-lg disabled:opacity-50"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setEditingGalleryIndex(null);
                            setGalleryUploadUrl('');
                          }}
                          className="px-3 py-2 bg-light/10 text-light text-sm rounded-lg"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/2] relative group">
                      {existingImage ? (
                        <>
                          <img src={existingImage.imageUrl} alt={`Galería ${order + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => setEditingGalleryIndex(order)}
                              className="px-4 py-2 bg-primary text-darker rounded-lg text-sm font-semibold flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Cambiar
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingGalleryIndex(order)}
                          className="w-full h-full flex flex-col items-center justify-center text-light/30 hover:text-light/50 hover:bg-light/5 transition-all"
                        >
                          <span className="text-3xl mb-2">+</span>
                          <span className="text-xs">Subir imagen {order + 1}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROFESSORS TAB */}
      {activeTab === 'professors' && (
        <div className="bg-darker rounded-lg p-8 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
            <Info className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-light/80">
              <p className="font-semibold text-green-400 mb-1">Profesores Guía</p>
              <p>Gestiona las fotos y información de los profesores del equipo.</p>
              <p className="mt-2 text-xs text-light/60">
                <strong>Formato:</strong> JPG, PNG • <strong>Tamaño:</strong> 400x400px (cuadrada) • <strong>Peso máx:</strong> 500KB
              </p>
            </div>
          </div>

          <div className="text-center py-12 text-light/50">
            <p className="text-lg">👥 Gestión de profesores</p>
            <p className="text-sm mt-2">Próximamente disponible</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SiteContentEditor;
