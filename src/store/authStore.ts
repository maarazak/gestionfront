import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, tenantSlug: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,

  login: async (email, password, tenantSlug) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/login', {
        email,
        password,
        tenant_slug: tenantSlug,
      });
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (registerData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/register', registerData);
      localStorage.setItem('token', data.token);
      set({ user: data.user, token: data.token });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/me');
      set({ user: data });
    } catch (error) {
      set({ user: null, token: null });
      localStorage.removeItem('token');
    }
  },
}));
