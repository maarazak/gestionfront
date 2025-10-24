import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ensureCSRFToken } from '@/lib/api';
import { Task } from './useTasks';
import { QUERY_KEYS, API_CONFIG } from '@/lib/constants';

export interface Project {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const useProjects = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Project[]>>('/projects');
      return data.data; 
    },
    staleTime: API_CONFIG.STALE_TIME,
    retry: API_CONFIG.RETRY_ATTEMPTS,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`);
      return data.data; 
    },
    enabled: !!id,
    staleTime: API_CONFIG.STALE_TIME,
    retry: API_CONFIG.RETRY_ATTEMPTS,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      await ensureCSRFToken();
      const { data } = await api.post<ApiResponse<Project>>('/projects', projectData);
      return data.data; 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...projectData }: Partial<Project> & { id: string }) => {
      await ensureCSRFToken();
      const { data } = await api.put<ApiResponse<Project>>(`/projects/${id}`, projectData);
      return data.data; 
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECT(variables.id) });
    },
    onError: (error) => {
      console.error('Error updating project:', error);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await ensureCSRFToken();
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
    },
  });
};
