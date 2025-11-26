import React, { useState, useEffect, useContext, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

// 1. Criar o Contexto
const AuthContext = createContext();

// 2. Criar o componente Provedor (Provider)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth não foi inicializado corretamente');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Limpa a inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
  );
}

// 3. Criar o Hook customizado para consumir o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};