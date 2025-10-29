import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/lib/alerts';
import { Tenant } from '@/types/api';

interface CreateTenantData {
  name: string;
}

interface UpdateTenantData {
  name: string;
}

export function useTenants() {
  const [isLoading, setIsLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/tenants');
      setTenants(data.data);
      return data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des organisations');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createTenant = async (tenantData: CreateTenantData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/tenants', tenantData);
      toast.success('Organisation créée avec succès');
      return data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data?.message || 'Erreur lors de la création';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTenant = async (tenantId: string, tenantData: UpdateTenantData) => {
    setIsLoading(true);
    try {
      const { data } = await api.put(`/tenants/${tenantId}`, tenantData);
      toast.success('Organisation mise à jour avec succès');
      return data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTenant = async (tenantId: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/tenants/${tenantId}`);
      toast.success('Organisation supprimée avec succès');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tenants,
    isLoading,
    fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
  };
}
