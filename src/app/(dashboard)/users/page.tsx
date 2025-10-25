'use client';

import { useState } from 'react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Users as UsersIcon } from 'lucide-react';
import { InviteUserDialog } from '@/components/users/invite-user-dialog';
import { showDeleteConfirmAlert, showSuccessAlert, showErrorAlert } from '@/lib/alerts';

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <UsersIcon className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Accès réservé aux administrateurs
        </h3>
        <p className="text-gray-500">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
      </div>
    );
  }

  const handleDelete = async (userId: string, userName: string) => {
    const result = await showDeleteConfirmAlert(
      'Êtes-vous sûr?',
      `L'utilisateur "${userName}" sera supprimé et n'aura plus accès à l'organisation.`
    );

    if (result.isConfirmed) {
      try {
        await deleteUser.mutateAsync(userId);
        showSuccessAlert('Utilisateur supprimé');
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression';
        showErrorAlert(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gérez les membres de votre organisation</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Inviter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membres de l'équipe ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                  {user.role !== 'admin' && user.id !== currentUser.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.uuid, user.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <InviteUserDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
