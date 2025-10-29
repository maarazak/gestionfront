import { useGenericQuery, useGenericCreate, useGenericUpdate, useGenericDelete } from './useGenericApi';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { API_CONFIG } from '@/lib/constants';

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

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Récupérer toutes les tâches (avec filtre optionnel par projet)
 * Note: Ce hook ne peut pas utiliser useGenericQuery car il a besoin de paramètres dynamiques
 */
export const useTasks = (projectId?: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const params = projectId ? { project_id: projectId } : {};
      const { data } = await api.get<ApiResponse<Task[]>>('/tasks', { params });
      return data.data;
    },
    staleTime: API_CONFIG.STALE_TIME,
    retry: API_CONFIG.RETRY_ATTEMPTS,
  });
};

/**
 * Créer une nouvelle tâche
 */
export const useCreateTask = () => {
  return useGenericCreate<Task>(
    '/tasks',
    [['tasks']],
    {
      onSuccess: (_, variables) => {
        // Pas besoin d'invalidation supplémentaire, déjà géré par useGenericCreate
      },
    }
  );
};

/**
 * Mettre à jour une tâche
 */
export const useUpdateTask = () => {
  return useGenericUpdate<Task, Partial<Task> & { id: string }>(
    (id) => `/tasks/${id}`,
    (variables) => [['tasks'], ['projects', variables.project_id]],
    {
      onError: (error) => {
        console.error('Error updating task:', error);
      },
    }
  );
};

/**
 * Supprimer une tâche
 */
export const useDeleteTask = () => {
  return useGenericDelete(
    (id) => `/tasks/${id}`,
    [['tasks'], ['projects']],
    {
      onError: (error) => {
        console.error('Error deleting task:', error);
      },
    }
  );
};
