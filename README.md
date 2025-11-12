# 🎙️ Smart Kids Podcast

Plataforma educativa de gestión de contenido audiovisual para estudiantes de primaria.

![Homepage](docs/screenshots/homepage.png)

## 🌐 Demo en Vivo

- **🌍 Sitio Público:** [https://smart-kids-podcast.vercel.app](https://smart-kids-podcast.vercel.app)
- **🔐 Panel Admin:** [https://smart-kids-podcast.vercel.app/#/admin](https://smart-kids-podcast.vercel.app/#/admin)
- **📂 Repositorio:** [GitHub](https://github.com/Mithos-Tech/Smart-Kids)

---

## 🚀 Características Principales

### 🎯 Panel Administrativo Completo

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de episodios (CRUD)
- ✅ Gestión de equipo docente (CRUD)
- ✅ Sistema de testimonios (CRUD)
- ✅ Autenticación segura con Firebase Auth
- ✅ Breadcrumbs y navegación intuitiva

### 🎵 Integración con Spotify

![Gestión de Episodios](docs/screenshots/admin-episodes.png)

- 🎧 Reproductores embebidos de Spotify
- 📊 Sistema de categorías y filtros
- 🔍 Búsqueda avanzada de episodios
- ⭐ Episodios destacados en homepage
- 📈 Contador de reproducciones

### 📱 Diseño Responsive

![Vista Mobile](docs/screenshots/mobile-view.png)

- 📱 Optimizado para todos los dispositivos
- 🎨 Interfaz moderna con Tailwind CSS
- ⚡ Carga rápida y optimizada
- 🌙 Modo oscuro por defecto

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 19** - Framework principal
- **TypeScript** - Type safety
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos
- **React Router** - Navegación
- **Lucide React** - Iconografía

### Backend & Services

- **Firebase Auth** - Autenticación
- **Cloud Firestore** - Base de datos NoSQL
- **Firebase Hosting** - Assets
- **Cloudinary** - Gestión de imágenes
- **Spotify API** - Reproductores embebidos

### DevOps

- **Vercel** - Hosting y CI/CD
- **GitHub** - Control de versiones
- **Git** - Version control

---

## 📦 Instalación Local

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Firebase
- Variables de entorno configuradas

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/Mithos-Tech/Smart-Kids.git
cd Smart-Kids
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
# Crear archivo .env en la raíz
cp .env.example .env

# Editar .env con tus credenciales de Firebase
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

4. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

5. **Abrir en el navegador**

```
http://localhost:3000
```

---

## 🚀 Deployment

### Deploy automático con Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy a producción
vercel --prod
```

### Variables de entorno en Vercel

Configura las mismas variables de `.env` en:

```
Vercel Dashboard → Project → Settings → Environment Variables
```

---

## 📊 Estructura del Proyecto

```
smart-kids/
├── src/
│   ├── firebase/          # Configuración y servicios de Firebase
│   │   ├── auth.ts
│   │   ├── config.ts
│   │   ├── episodes.ts
│   │   ├── professors.ts
│   │   └── testimonials.ts
│   ├── services/          # Servicios externos (API, Cloudinary)
│   └── index.css
├── pages/
│   ├── admin/             # Páginas del panel administrativo
│   │   ├── AdminDashboard.tsx
│   │   ├── EpisodesManager.tsx
│   │   ├── EpisodeForm.tsx
│   │   ├── ProfessorsManager.tsx
│   │   ├── ProfessorForm.tsx
│   │   ├── TestimonialsManager.tsx
│   │   └── TestimonialForm.tsx
│   ├── HomePage.tsx       # Página principal
│   ├── EpisodesPage.tsx   # Biblioteca de episodios
│   ├── TeamPage.tsx       # Equipo docente
│   └── LoginPage.tsx      # Autenticación
├── components/
│   ├── admin/             # Componentes del admin
│   │   ├── AdminLayout.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── ProtectedRoute.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── EpisodeCard.tsx
├── App.tsx
├── index.html
└── vite.config.ts
```

---

## 🔐 Seguridad

- ✅ Autenticación requerida para panel admin
- ✅ Reglas de Firestore configuradas (lectura pública, escritura protegida)
- ✅ Variables de entorno protegidas
- ✅ HTTPS en producción (Vercel)
- ✅ CORS configurado
- ✅ Rate limiting en Firebase

---

## 🎯 Funcionalidades Técnicas

### CRUD de Episodios

- Crear, leer, actualizar y eliminar episodios
- Integración con Spotify embeds
- Sistema de categorías y grados
- Estados: publicado/borrador
- Contador de reproducciones
- Marcado como destacado

### CRUD de Profesores

- Gestión completa del equipo docente
- Subida de fotos a Cloudinary
- Estados activo/inactivo
- Orden personalizable
- Especialidades y roles

### CRUD de Testimonios

- Sistema de opiniones
- Calificación con estrellas (1-5)
- Destacados en homepage
- Estados activo/inactivo
- Carrusel interactivo

### Dashboard Administrativo

- Estadísticas en tiempo real
- Métricas por página del sitio
- Accesos rápidos organizados
- Navegación con breadcrumbs
- Sidebar colapsable por secciones

---

## 🧪 Testing

```bash
# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 📝 Roadmap Futuro

- [ ] Analytics integrado (Google Analytics / Vercel Analytics)
- [ ] Sistema de comentarios en episodios
- [ ] Newsletter automática
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Dark/Light mode toggle
- [ ] Búsqueda avanzada con filtros múltiples

---

## 👨‍💻 Autor

**Mithos Tech**

- GitHub: [@Mithos-Tech](https://github.com/Mithos-Tech)
- Proyecto: [Inspyrio Portfolio](https://inspyrio.com)

---

## 📄 Licencia

Este proyecto fue desarrollado como parte del portafolio profesional de Inspyrio.

---

## 🙏 Agradecimientos

- Firebase por la infraestructura backend
- Vercel por el hosting gratuito
- Spotify por la API de embeds
- Cloudinary por la gestión de assets

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub**
