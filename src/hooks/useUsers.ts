import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ensureCSRFToken } from '@/lib/api';

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface InviteUserData {
  name: string;
  email: string;
  password: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>('/users');
      return data.data;
    },
  });
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: InviteUserData) => {
      await ensureCSRFToken();
      const { data } = await api.post<ApiResponse<User>>('/users/invite', userData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error inviting user:', error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      await ensureCSRFToken();
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
    },
  });
};
