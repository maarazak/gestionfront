import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';

export const useTenantSwitch = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { switchTenant } = useAuthStore();

  const handleSwitchTenant = async (tenantId: string) => {
    try {
      await switchTenant(tenantId);
      
      queryClient.clear();
      
      router.push('/dashboard');
      
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Error switching tenant:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de changer d\'organisation',
      });
      throw error;
    }
  };

  return { handleSwitchTenant };
};
