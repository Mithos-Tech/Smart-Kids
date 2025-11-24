// firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ⚠️ IMPORTANTE: Ve a Firebase Console y copia TUS credenciales
// Proyecto → Configuración → Tu app web → Configuración
// NO uses estas credenciales de ejemplo, son ficticias

const firebaseConfig = {
  apiKey: "AIzaSyAswJJwJuuSt89kNGD4zpWm2FH-p19vHGk", // Tu API Key
  authDomain: "smart-kids-podcast-a1463.firebaseapp.com",
  projectId: "smart-kids-podcast-a1463",
  storageBucket: "smart-kids-podcast-a1463.firebasestorage.app",
  messagingSenderId: "837882038250",
  appId: "1:837882038250:web:15d5c30cd5643542ff9493"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;