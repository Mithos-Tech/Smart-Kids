import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5gKay2Rx-1jwTlQURBm7o3cNN3yBn1GA",
  authDomain: "smart-kids-podcast-2025.firebaseapp.com",
  projectId: "smart-kids-podcast-2025",
  storageBucket: "smart-kids-podcast-2025.firebasestorage.app",
  messagingSenderId: "547700061145",
  appId: "1:547700061145:web:f569322939a3be5891dfc8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;