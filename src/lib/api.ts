import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Fonction utilitaire pour initialiser le CSRF avant les requêtes POST/PUT/DELETE
export const ensureCSRFToken = async (): Promise<void> => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    
    // Créer une instance axios temporaire pour cette requête
    const csrfClient = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    const response = await csrfClient.get('/sanctum/csrf-cookie');
    
    // Stocker le token CSRF pour l'utiliser dans les headers
    if (response.data.csrf_token) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('csrf_token', response.data.csrf_token);
      }
    }
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
    throw error;
  }
};

// Fonction pour récupérer le token CSRF
const getCSRFToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('csrf_token');
  }
  return null;
};

// Fonction SSR-safe pour récupérer le token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Fonction SSR-safe pour supprimer le token
const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Ajouter le token CSRF pour les requêtes POST/PUT/DELETE
  const csrfToken = getCSRFToken();
  if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

