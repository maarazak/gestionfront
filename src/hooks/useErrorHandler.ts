import { useCallback } from 'react';
import toast from 'react-hot-toast';

// Hook pour la gestion centralisée des erreurs avec notifications toast
export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, defaultMessage = 'Une erreur est survenue') => {
    let message = defaultMessage;
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String(error.message);
    }
    
    console.error('Error handled:', error);
    
    toast.error(message);
  }, []);

  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const handleInfo = useCallback((message: string) => {
    toast(message, {
      icon: 'ℹ️',
    });
  }, []);

  return {
    handleError,
    handleSuccess,
    handleInfo,
  };
};
