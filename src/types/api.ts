/**
 * Interfaces strictes pour les réponses API
 */

// Réponse de base pour toutes les API
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

// Réponse d'authentification
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenant: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

// Réponse d'erreur
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// Réponse pour les projets
export interface ProjectResponse {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
  tasks_count?: number;
  completed_tasks_count?: number;
}

// Réponse pour les tâches
export interface TaskResponse {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    name: string;
  };
}

// Réponse pour les utilisateurs
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  created_at: string;
  updated_at: string;
}

// Réponse pour les statistiques
export interface StatsResponse {
  total_projects: number;
  active_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}

// Types pour les filtres et la pagination
export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface TaskFilters {
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  project_id?: string;
  search?: string;
}

export interface ProjectFilters {
  status?: 'active' | 'completed' | 'archived';
  search?: string;
}
