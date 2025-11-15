import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Cole aqui as credenciais que você copiou do Firebase
  apiKey: "AIzaSyCF1cz_CAwJ-ghI7BTT9srEqMBDTYMftD8",
  authDomain: "cristo-vive-web.firebaseapp.com",
  projectId: "cristo-vive-web",
  storageBucket: "cristo-vive-web.firebasestorage.app",
  messagingSenderId: "1070187625614",
  appId: "1:1070187625614:web:c410a5ed63f48be44f5ddf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);