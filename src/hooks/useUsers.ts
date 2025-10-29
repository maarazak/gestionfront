import { useGenericQuery, useGenericCreate, useGenericDelete } from './useGenericApi';
import { QUERY_KEYS } from '@/lib/constants';

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface InviteUserData {
  name: string;
  email: string;
  password: string;
}

/**
 * Récupérer tous les utilisateurs
 */
export const useUsers = () => {
  return useGenericQuery<User[]>(
    QUERY_KEYS.USERS,
    '/users'
  );
};

/**
 * Inviter un nouvel utilisateur
 */
export const useInviteUser = () => {
  return useGenericCreate<User, InviteUserData>(
    '/users/invite',
    [QUERY_KEYS.USERS],
    {
      onError: (error) => {
        console.error('Error inviting user:', error);
      },
    }
  );
};

/**
 * Supprimer un utilisateur
 */
export const useDeleteUser = () => {
  return useGenericDelete(
    (userUuid) => `/users/${userUuid}`,
    [QUERY_KEYS.USERS],
    {
      onError: (error) => {
        console.error('Error deleting user:', error);
      },
    }
  );
};
