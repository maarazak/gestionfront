import { useState, useEffect } from 'react';

/**
 * Hook SSR-safe pour la gestion des tokens d'authentification
 */
export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      setIsLoaded(true);
    }
  }, []);

  const setAuthToken = (newToken: string | null) => {
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('token', newToken);
      } else {
        localStorage.removeItem('token');
      }
    }
    setToken(newToken);
  };

  return { token, setToken: setAuthToken, isLoaded };
};
