import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey
} from '@tanstack/react-query';
import { api } from '@/lib/api';
import { API_CONFIG } from '@/lib/constants';
import { AxiosError } from 'axios';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Hook générique pour les requêtes GET
 */
export function useGenericQuery<T>(
  queryKey: QueryKey,
  endpoint: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, AxiosError>({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<T>>(endpoint);
      return data.data;
    },
    staleTime: API_CONFIG.STALE_TIME,
    retry: API_CONFIG.RETRY_ATTEMPTS,
    ...options,
  });
}

/**
 * Hook générique pour les mutations POST
 */
export function useGenericCreate<TData, TVariables = Partial<TData>>(
  endpoint: string,
  invalidateKeys: QueryKey[],
  options?: Omit<UseMutationOptions<TData, AxiosError, TVariables>, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (data) => {
      const response = await api.post<ApiResponse<TData>>(endpoint, data);
      return response.data.data;
    },
    onSuccess: (data, variables, context) => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
  });
}

/**
 * Hook générique pour les mutations PUT
 */
export function useGenericUpdate<TData, TVariables = Partial<TData> & { id: string }>(
  getEndpoint: (id: string) => string,
  invalidateKeys: (variables: TVariables) => QueryKey[],
  options?: Omit<UseMutationOptions<TData, AxiosError, TVariables>, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const { id, ...data } = variables as any;
      const response = await api.put<ApiResponse<TData>>(getEndpoint(id), data);
      return response.data.data;
    },
    onSuccess: (data, variables, context) => {
      invalidateKeys(variables).forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
  });
}

/**
 * Hook générique pour les mutations DELETE
 */
export function useGenericDelete(
  getEndpoint: (id: string) => string,
  invalidateKeys: QueryKey[],
  options?: Omit<UseMutationOptions<void, AxiosError, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();
  
  return useMutation<void, AxiosError, string>({
    mutationFn: async (id) => {
      await api.delete(getEndpoint(id));
    },
    onSuccess: (data, variables, context) => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
  });
}
