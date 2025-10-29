export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  settings?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  pivot?: {
    role_id: number;
    user_id: number;
    tenant_id: string;
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    uuid: string;
    name: string;
    email: string;
    role: string;
    tenant: Tenant;
    current_tenant: Tenant;
    tenants: Tenant[];
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

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

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  tenant: Tenant;
  current_tenant?: Tenant;
  tenants?: Tenant[];
  created_at: string;
  updated_at: string;
}

export interface StatsResponse {
  total_projects: number;
  active_projects: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}

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
