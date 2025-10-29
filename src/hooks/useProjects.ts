import { useGenericQuery, useGenericCreate, useGenericUpdate, useGenericDelete } from './useGenericApi';
import { Task } from './useTasks';
import { QUERY_KEYS } from '@/lib/constants';

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

/**
 * Récupérer tous les projets
 */
export const useProjects = () => {
  return useGenericQuery<Project[]>(
    QUERY_KEYS.PROJECTS,
    '/projects'
  );
};

/**
 * Récupérer un projet spécifique
 */
export const useProject = (id: string) => {
  return useGenericQuery<Project>(
    QUERY_KEYS.PROJECT(id),
    `/projects/${id}`,
    { enabled: !!id }
  );
};

/**
 * Créer un nouveau projet
 */
export const useCreateProject = () => {
  return useGenericCreate<Project>(
    '/projects',
    [QUERY_KEYS.PROJECTS],
    {
      onError: (error) => {
        console.error('Error creating project:', error);
      },
    }
  );
};

/**
 * Mettre à jour un projet
 */
export const useUpdateProject = () => {
  return useGenericUpdate<Project, Partial<Project> & { id: string }>(
    (id) => `/projects/${id}`,
    (variables) => [QUERY_KEYS.PROJECTS, QUERY_KEYS.PROJECT(variables.id)],
    {
      onError: (error) => {
        console.error('Error updating project:', error);
      },
    }
  );
};

/**
 * Supprimer un projet
 */
export const useDeleteProject = () => {
  return useGenericDelete(
    (id) => `/projects/${id}`,
    [QUERY_KEYS.PROJECTS],
    {
      onError: (error) => {
        console.error('Error deleting project:', error);
      },
    }
  );
};
