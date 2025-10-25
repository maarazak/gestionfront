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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-6">
          <UsersIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Accès réservé aux administrateurs
        </h3>
        <p className="text-sm text-muted-foreground">
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
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground mt-2">Gérez les membres de votre organisation</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          Inviter un utilisateur
        </Button>
      </div>

      <Card className="border-border shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Membres de l'équipe ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users?.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-primary font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-medium rounded-md ${
                      user.role === 'admin'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-blue-500/10 text-blue-600'
                    }`}
                  >
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                  {user.role !== 'admin' && user.id !== currentUser.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(user.uuid, user.name)}
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
