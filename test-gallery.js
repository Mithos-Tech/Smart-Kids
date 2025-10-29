import { getSiteContent } from './src/firebase/content.ts';

async function testGallery() {
  console.log('🔍 Verificando contenido en Firestore...\n');
  
  try {
    const allContent = await getSiteContent();
    console.log('📦 Total de documentos:', allContent.length);
    
    const gallery = allContent.filter(c => c.section === 'gallery');
    console.log('🖼️ Imágenes en galería:', gallery.length);
    
    gallery.forEach((img, index) => {
      console.log(`\nImagen ${index + 1}:`);
      console.log('  - ID:', img.id);
      console.log('  - Order:', img.order);
      console.log('  - URL:', img.imageUrl.substring(0, 50) + '...');
      console.log('  - Active:', img.active);
    });
    
    if (gallery.length === 0) {
      console.log('\n❌ No se encontraron imágenes en la galería');
      console.log('Verifica que hayas guardado las imágenes correctamente en /admin/sitio');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGallery();
