import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCF1cz_CAwJ-ghI7BTT9srEqMBDTYMftD8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cristo-vive-web.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cristo-vive-web",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cristo-vive-web.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1070187625614",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1070187625614:web:c410a5ed63f48be44f5ddf"
};

console.log('🔥 Inicializando Firebase com projeto:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('✅ Firebase inicializado com sucesso!');