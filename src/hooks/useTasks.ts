import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ensureCSRFToken } from '@/lib/api';

export interface Task {
  id: string;
  tenant_id: string;
  project_id: string;
  assigned_to: string | null;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    name: string;
  };
  assigned_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const useTasks = (projectId?: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const params = projectId ? { project_id: projectId } : {};
      const { data } = await api.get<Task[]>('/tasks', { params });
      return data;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskData: Partial<Task>) => {
      await ensureCSRFToken();
      const { data } = await api.post('/tasks', taskData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (variables.project_id) {
        queryClient.invalidateQueries({ queryKey: ['projects', variables.project_id] });
      }
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...taskData }: Partial<Task> & { id: string }) => {
      await ensureCSRFToken();
      const { data } = await api.put(`/tasks/${id}`, taskData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects', data.project_id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await ensureCSRFToken();
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
