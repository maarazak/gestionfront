/**
 * Constantes centralisées
 */

// Query Keys pour React Query
export const QUERY_KEYS = {
  PROJECTS: ['projects'] as const,
  PROJECT: (id: string) => ['projects', id] as const,
  TASKS: ['tasks'] as const,
  TASK: (id: string) => ['tasks', id] as const,
  USER: ['user'] as const,
  USERS: ['users'] as const,
  TENANTS: ['tenants'] as const,
  TENANT: (id: string) => ['tenants', id] as const,
} as const;

// Routes de l'application
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TASKS: '/tasks',
  SETTINGS: '/settings',
} as const;

// Statuts des projets
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

// Statuts des tâches
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
} as const;

// Priorités des tâches
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Rôles utilisateur
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Configuration API
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  STALE_TIME: 5 * 60 * 1000, 
} as const;

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'Ressource non trouvée.',
  SERVER_ERROR: 'Erreur du serveur. Veuillez réessayer plus tard.',
  VALIDATION_ERROR: 'Données invalides. Vérifiez vos informations.',
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN: 'Connexion réussie',
  LOGOUT: 'Déconnexion réussie',
  PROJECT_CREATED: 'Projet créé avec succès',
  PROJECT_UPDATED: 'Projet mis à jour',
  PROJECT_DELETED: 'Projet supprimé',
  TASK_CREATED: 'Tâche créée avec succès',
  TASK_UPDATED: 'Tâche mise à jour',
  TASK_DELETED: 'Tâche supprimée',
} as const;
