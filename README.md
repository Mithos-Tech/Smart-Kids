
# Smart Kids - Plataforma Educativa Multimedia 🎙️

> "Donde las voces de los niños construyen el futuro."

Smart Kids es una **plataforma web "headless" de podcasting** diseñada para instituciones educativas. Permite a estudiantes de primaria y secundaria compartir sus creaciones sonoras (cuentos, debates, entrevistas) a través de una interfaz moderna, sofisticada y gamificada.

Desarrollada con ❤️ y excelencia técnica por **Inspyrio**.

## ✨ Características Principales

*   **Diseño Premium:** Interfaz con estética "Dark Glassmorphism", animaciones fluidas y efectos 3D.
*   **Arquitectura Headless:** Catálogo web que reproduce contenido alojado directamente en Spotify (Deep Linking).
*   **Gamificación:** Sistema de votación ("Likes") en tiempo real para destacar los mejores episodios.
*   **Admin Panel CMS:** Centro de control completo para gestionar episodios, docentes y galerías.
*   **Seguridad Biométrica (Simulada):** Login interactivo basado en roles (Director, Productor, Admin).
*   **Responsive:** Experiencia nativa optimizada para móviles y tablets.

## 🛠️ Stack Tecnológico

*   **Frontend:** React 18 + TypeScript
*   **Estilos:** Tailwind CSS (con configuraciones avanzadas de animación)
*   **Animaciones:** Framer Motion
*   **Routing:** React Router DOM
*   **Iconografía:** Lucide React
*   **Assets:** Cloudinary (Optimización de medios)

## 🚀 Estructura del Proyecto

```bash
src/
├── components/     # Componentes reutilizables (EpisodeCard, Layout, Navbar)
├── pages/
│   ├── Home.tsx    # Landing Page (Hero, Carrusel 3D, Testimonios)
│   ├── Episodes.tsx# Catálogo con filtros y búsqueda
│   ├── Team.tsx    # Historia "Cerebros Brillantes" y Galería
│   ├── Admin.tsx   # Panel de Gestión CMS
│   └── Login.tsx   # Acceso de Seguridad
├── constants.ts    # Base de datos simulada (Mock Data)
└── types.ts        # Definiciones TypeScript
```

## 👨‍💻 Créditos

**Diseño y Desarrollo:** [Inspyrio](https://inspyrio.com)
**Versión:** 1.0.0 (Frontend Release)
**Licencia:** Privada - Uso exclusivo para demo educativa.

---
© 2025 Smart Kids. Todos los derechos reservados.
