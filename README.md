# Smart Kids - Plataforma de Podcasts Educativos

![Smart Kids Hero](https://picsum.photos/seed/og-image/1200/630)

## 🚀 Sobre el Proyecto

**Smart Kids** es la plataforma web para el proyecto educativo "Cerebros Brillantes" de una escuela pública peruana. Este espacio digital sirve como un escenario para que los estudiantes de 4°, 5° y 6° grado de primaria puedan crear, compartir y descubrir podcasts hechos por ellos mismos.

La plataforma no solo muestra el increíble talento de los niños, sino que también funciona como una herramienta pedagógica que fomenta habilidades cruciales como la oratoria, la investigación, la escritura creativa y el trabajo en equipo.

## ✨ Características Principales

-   **Interfaz Moderna y Atractiva:** Un diseño limpio, responsivo y centrado en la experiencia de usuario.
-   **Exploración de Episodios:** Descubre los últimos podcasts, filtrados por grado y categoría.
-   **Reproductor de Audio Flotante:** Escucha tus episodios favoritos mientras navegas por el sitio sin interrupciones.
-   **Línea de Tiempo Interactiva:** Conoce la historia y la evolución del proyecto "Cerebros Brillantes".
-   **Diseño Responsivo:** Experiencia de usuario optimizada para cualquier dispositivo, desde móviles hasta ordenadores de escritorio.
-   **SEO Optimizado:** Mejorado con metadatos y datos estructurados (JSON-LD) para ser descubierto por los motores de búsqueda.

## 📂 Estructura del Proyecto

El proyecto está organizado de manera modular para facilitar el mantenimiento y la escalabilidad.

```
/
├── components/         # Componentes reutilizables (EpisodeCard, Header, etc.)
├── constants/          # Datos estáticos y constantes (listas de episodios, etc.)
├── context/            # Contextos de React (PlayerContext)
├── pages/              # Componentes de página (HomePage, EpisodesPage, etc.)
├── types/              # Definiciones de TypeScript
├── App.tsx             # Componente raíz y enrutador principal
├── index.html          # Punto de entrada HTML
├── index.tsx           # Montaje de la aplicación React en el DOM
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido con un enfoque moderno y ligero, sin necesidad de un paso de compilación (no build step):

-   **React:** Para construir la interfaz de usuario interactiva.
-   **React Router:** Para el enrutamiento del lado del cliente.
-   **Tailwind CSS (vía CDN):** Para un diseño rápido y personalizable.
-   **Lucide React:** Para un conjunto de iconos limpios y consistentes.
-   **TypeScript:** Para un código más robusto y mantenible.
-   **ESM (EcmaScript Modules):** Uso de `importmap` para cargar dependencias directamente en el navegador.

## ⚙️ Instalación y Uso Local

Dado que el proyecto no requiere un paso de compilación, ejecutarlo localmente es extremadamente simple.

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/smart-kids.git
    cd smart-kids
    ```
2.  **Inicia un servidor web local:**
    Puedes usar cualquier servidor estático. Una opción popular es `live-server` de VS Code, o puedes usar Python:
    
    _Si tienes Python 3:_
    ```bash
    python -m http.server 8000
    ```
    
    _Si tienes Python 2:_
    ```bash
    python -m SimpleHTTPServer 8000
    ```

3.  Abre tu navegador y ve a `http://localhost:8000`.

¡Eso es todo! El sitio debería estar funcionando.

##  Backend Integration - Próximos Pasos

Para preparar la aplicación para una integración completa con un backend, se deben seguir los siguientes pasos:

1.  **Crear una Capa de API:** Centralizar todas las llamadas `fetch` en un directorio `services/` para gestionar endpoints, cabeceras y errores de forma unificada.
2.  **Migrar Lógica al Servidor:** La paginación, búsqueda y filtrado de episodios deben ser manejados por el backend. El frontend enviará los parámetros y renderizará los resultados.
3.  **Implementar Autenticación:** Añadir un `AuthContext`, páginas de login/registro y rutas protegidas para el "Acceso Docentes".
4.  **Añadir Estados de Carga y Error:** Integrar indicadores visuales (skeletons, spinners) y notificaciones de error para mejorar la UX durante las peticiones de red.
5.  **Refactorizar Formularios:** Modificar los formularios de suscripción y contacto para que envíen los datos a los nuevos endpoints del backend en lugar de a servicios de terceros.

## 🚀 Despliegue

La forma más recomendada para desplegar este proyecto es usando **Vercel**, gracias a su integración perfecta con GitHub y su CDN global de alto rendimiento.

1.  **Sube tu código a un repositorio de GitHub.**
2.  **Regístrate en Vercel** usando tu cuenta de GitHub.
3.  **Crea un nuevo proyecto en Vercel** e importa tu repositorio de GitHub.
4.  Vercel detectará automáticamente que es un sitio estático. **No se necesita ninguna configuración de compilación.**
5.  Haz clic en **"Deploy"**.

En menos de un minuto, tu proyecto estará en línea en una URL pública.

## 👨‍💻 Autor

Desarrollado con ❤️ por **Inspyrio**.

---
*Este README es una plantilla y puede ser ajustado según sea necesario.*