
# 🔥 Guía de Integración Backend: Smart Kids x Firebase

Esta guía detalla la estructura actual del Frontend v1.0 y cómo mapear cada componente a los servicios de Firebase.

## 1. Estructura del Proyecto (Frontend Actual)

Antes de tocar el código, verifica que estas piezas estén en su lugar:

### 📂 Núcleo
*   **`src/types.ts`**: Contrato de datos. Define la estructura exacta que debe tener tu base de datos.
*   **`src/constants.ts`**: Datos simulados. Tu objetivo es reemplazar estos arrays estáticos por llamadas a la base de datos.
*   **`src/components/Layout.tsx`**: Contiene el Navbar y Footer globales.
*   **`src/App.tsx`**: Maneja las rutas y la protección (`ProtectedRoute`) del Admin.

### 📂 Páginas & Funcionalidad
1.  **Home (`Home.tsx`)**:
    *   *Consumo:* Lee episodios destacados y recientes.
    *   *Interacción:* Botones de "Me Gusta" (requiere escritura en DB).
    *   *Formulario:* Suscripción (Community Hub).
2.  **Episodios (`Episodes.tsx`)**:
    *   *Consumo:* Lee **todos** los episodios.
    *   *Lógica:* Filtros y Búsqueda (actualmente local, escalable a backend).
3.  **Nosotros (`Team.tsx`)**:
    *   *Consumo:* Lee Timeline, Equipo y Galería.
4.  **Admin (`Admin.tsx`)**:
    *   *Gestión:* Crear/Editar/Borrar (CRUD) para todas las colecciones.
5.  **Login (`Login.tsx`)**:
    *   *Seguridad:* Simula autenticación. Debe reemplazarse por Firebase Auth.

---

## 2. Diseño de Base de Datos (Firestore Schema)

Crea estas **4 Colecciones** en tu consola de Firebase (Firestore Database). Los campos deben coincidir exactamente con `src/types.ts`.

### A. Colección: `episodes`
*Cada documento representa un podcast.*
*   `title` (string): Título del episodio.
*   `description` (string): Sinopsis corta.
*   `author` (string): Alumno o grado autor.
*   `grade` (string): Ej: "5° Grado".
*   `category` (string): "Cuentos", "Ciencia", "Historia".
*   `spotifyUrl` (string): **Vital.** Enlace directo al audio.
*   `imageUrl` (string): URL del póster (desde Storage).
*   `likes` (number): Contador de votos.
*   `featured` (boolean): `true` si debe salir en el Carrusel del Home.
*   `createdAt` (timestamp): Para ordenar por "Recientes".

### B. Colección: `team`
*Miembros del equipo docente.*
*   `name` (string)
*   `role` (string): Ej: "Docente - Fundadora".
*   `quote` (string): Cita inspiradora.
*   `imageUrl` (string): Foto de perfil.
*   `isShowcased` (boolean): `true` para mostrar en la sección Testimonios del Home.

### C. Colección: `gallery`
*Fotos para la sección Nosotros.*
*   `title` (string)
*   `imageUrl` (string)
*   `cols` (number): 1 o 2 (para el diseño Bento).
*   `rows` (number): 1 o 2.

### D. Colección: `subscribers`
*Lista de correos capturados.*
*   `email` (string)
*   `date` (timestamp)

---

## 3. Estrategia de Implementación (Paso a Paso)

### Fase 1: Configuración
1.  Crea proyecto en Firebase Console.
2.  Registra la Web App y copia las credenciales (`apiKey`, `projectId`, etc.).
3.  Crea archivo `src/firebase/config.ts` e inicializa la app.

### Fase 2: Autenticación (El Guardián)
1.  En Firebase Auth, activa el proveedor **"Email/Password"**.
2.  Crea usuarios manuales en la consola para tus docentes (ej: `director@smartkids.edu`).
3.  **Modificar `Login.tsx`:**
    *   Elimina el `setTimeout`.
    *   Usa `signInWithEmailAndPassword(auth, email, password)`.
    *   Si es exitoso, guarda el token y redirige.

### Fase 3: Lectura de Datos (Público)
1.  Crea un hook personalizado `useEpisodes` que use `getDocs(collection(db, 'episodes'))`.
2.  En `Home.tsx` y `Episodes.tsx`, reemplaza `import { EPISODES }` por la data que viene de tu hook.

### Fase 4: Escritura de Datos (Admin)
1.  **Modificar `Admin.tsx`:**
    *   En `handleModalSave`, usa `addDoc` o `updateDoc` de Firestore.
    *   Para las imágenes: Implementa `uploadBytes` a Firebase Storage y obtén la URL de descarga antes de guardar el documento.

### Fase 5: Interacción (Likes)
1.  En `EpisodeCard.tsx`, cambia la lógica local por una transacción de Firestore:
    ```javascript
    updateDoc(docRef, { likes: increment(1) });
    ```

## 4. Reglas de Seguridad (Firestore Rules)

Copia esto en la pestaña "Rules" de Firestore para proteger tu data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cualquiera puede LEER los episodios y el equipo
    match /episodes/{document} {
      allow read: if true;
      // Solo admins pueden ESCRIBIR (crear/editar)
      allow write: if request.auth != null;
      // Excepción: Cualquiera puede dar LIKE (actualizar solo ese campo)
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likes']);
    }
    
    match /team/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /subscribers/{document} {
      // Solo admins leen, cualquiera puede crear (suscribirse)
      allow read: if request.auth != null;
      allow create: if true;
    }
  }
}
```
