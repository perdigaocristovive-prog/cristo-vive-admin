import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se o Firebase foi inicializado corretamente
    if (!auth) {
      console.error('Firebase Auth não foi inicializado corretamente');
      setError('Firebase não configurado');
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          console.log('Auth state changed:', currentUser ? 'Usuário logado' : 'Sem usuário');
          setUser(currentUser);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Erro no onAuthStateChanged:', error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => {
        console.log('Limpando subscription do auth');
        unsubscribe();
      };
    } catch (err) {
      console.error('Erro ao configurar onAuthStateChanged:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { user, loading, error };
};