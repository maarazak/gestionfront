import { useGenericQuery, useGenericCreate, useGenericUpdate, useGenericDelete } from './useGenericApi';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from '@/lib/alerts';
import { Tenant } from '@/types/api';

interface CreateTenantData {
  name: string;
}

interface UpdateTenantData {
  name: string;
}

/**
 * Récupérer tous les tenants
 */
export const useTenants = () => {
  return useGenericQuery<Tenant[]>(
    QUERY_KEYS.TENANTS,
    '/tenants'
  );
};

/**
 * Récupérer un tenant spécifique
 */
export const useTenant = (id: string) => {
  return useGenericQuery<Tenant>(
    QUERY_KEYS.TENANT(id),
    `/tenants/${id}`,
    { enabled: !!id }
  );
};

/**
 * Créer un nouveau tenant
 */
export const useCreateTenant = () => {
  return useGenericCreate<Tenant, CreateTenantData>(
    '/tenants',
    [QUERY_KEYS.TENANTS],
    {
      onSuccess: () => {
        toast.success('Organisation créée avec succès');
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.errors 
          ? Object.values(error.response.data.errors).flat().join(', ')
          : error.response?.data?.message || 'Erreur lors de la création';
        toast.error(errorMessage);
      },
    }
  );
};

/**
 * Mettre à jour un tenant
 */
export const useUpdateTenant = () => {
  return useGenericUpdate<Tenant, UpdateTenantData & { id: string }>(
    (id) => `/tenants/${id}`,
    (variables) => [QUERY_KEYS.TENANTS, QUERY_KEYS.TENANT(variables.id)],
    {
      onSuccess: () => {
        toast.success('Organisation mise à jour avec succès');
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.errors 
          ? Object.values(error.response.data.errors).flat().join(', ')
          : error.response?.data?.message || 'Erreur lors de la mise à jour';
        toast.error(errorMessage);
      },
    }
  );
};

/**
 * Supprimer un tenant
 */
export const useDeleteTenant = () => {
  return useGenericDelete(
    (id) => `/tenants/${id}`,
    [QUERY_KEYS.TENANTS],
    {
      onSuccess: () => {
        toast.success('Organisation supprimée avec succès');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      },
    }
  );
};
