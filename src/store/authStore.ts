import { create } from 'zustand';
import { api, ensureCSRFToken } from '@/lib/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/constants';
import axios, { AxiosError } from 'axios';
import { Tenant } from '@/types/api';

interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  role: string;
  tenant: Tenant;
  current_tenant: Tenant;
  tenants: Tenant[];
}

interface RegisterData {
  tenant_name: string;
  tenant_slug: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, tenantSlug: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,

  login: async (email, password, tenantSlug) => {
    set({ isLoading: true, error: null });
    try {
      await ensureCSRFToken();

      const { data } = await api.post('/login', {
        email,
        password,
        tenant_slug: tenantSlug,
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.data.token);
      }
      
      set({ user: data.data.user, token: data.data.token });
    } catch (error: unknown) {
      let errorMessage: string = ERROR_MESSAGES.NETWORK_ERROR;
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        }
      }
      
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (registerData) => {
    set({ isLoading: true, error: null });
    try {
      await ensureCSRFToken();

      const { data } = await api.post('/register', registerData);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.data.token);
      }
      
      set({ user: data.data.user, token: data.data.token });
    } catch (error: unknown) {
      let errorMessage: string = ERROR_MESSAGES.NETWORK_ERROR;
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        }
      }
      
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, error: null });
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/me');
      set({ user: data.data, error: null });
    } catch (error: unknown) {
      set({ user: null, token: null, error: ERROR_MESSAGES.UNAUTHORIZED });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
  },

  refreshUser: async () => {
    try {
      const { data } = await api.get('/me');
      set({ user: data.data, error: null });
    } catch (error: unknown) {
      console.error('Error refreshing user:', error);
    }
  },

  switchTenant: async (tenantId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/switch-tenant', {
        tenant_id: tenantId,
      });
      
      set({ user: data.data, error: null });
      
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error: unknown) {
      let errorMessage: string = ERROR_MESSAGES.NETWORK_ERROR;
      
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        }
      }
      
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
