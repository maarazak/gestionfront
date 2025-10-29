import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Variable pour suivre si le CSRF a été initialisé
let csrfInitialized = false;
let csrfInitPromise: Promise<void> | null = null;

// Fonction utilitaire pour initialiser le CSRF
export const ensureCSRFToken = async (): Promise<void> => {
  // Si déjà initialisé, ne rien faire
  if (csrfInitialized) {
    return;
  }

  // Si une initialisation est en cours, attendre sa fin
  if (csrfInitPromise) {
    return csrfInitPromise;
  }

  // Créer une nouvelle promesse d'initialisation
  csrfInitPromise = (async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
      
      const csrfClient = axios.create({
        baseURL,
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const response = await csrfClient.get('/sanctum/csrf-cookie');
      
      if (response.data.csrf_token) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('csrf_token', response.data.csrf_token);
        }
      }
      
      csrfInitialized = true;
    } catch (error) {
      console.error('Failed to initialize CSRF token:', error);
      throw error;
    } finally {
      csrfInitPromise = null;
    }
  })();

  return csrfInitPromise;
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

// Intercepteur pour ajouter le token et gérer le CSRF automatiquement
api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Pour les requêtes qui modifient les données, s'assurer que le CSRF est initialisé
  const method = config.method?.toLowerCase() || '';
  if (['post', 'put', 'delete', 'patch'].includes(method)) {
    // Initialiser le CSRF si nécessaire (ne fait rien si déjà fait)
    await ensureCSRFToken();
    
    // Ajouter le token CSRF
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si erreur 419 (CSRF token mismatch), réinitialiser le CSRF
    if (error.response?.status === 419) {
      csrfInitialized = false;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('csrf_token');
      }
    }
    
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
