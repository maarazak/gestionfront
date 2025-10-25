'use client';

import { useState } from 'react';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MoreVertical, Trash2, Eye, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { ProjectDialog } from '@/components/projects/project-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showDeleteConfirmAlert, showSuccessAlert, showErrorAlert } from '@/lib/alerts';

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canManageProjects = isAdmin || isManager;

  const handleDelete = async (projectId: string, projectName: string) => {
    const result = await showDeleteConfirmAlert(
      'Supprimer ce projet ?',
      `Le projet "${projectName}" et toutes ses tâches seront définitivement supprimés.`
    );

    if (result.isConfirmed) {
      try {
        await deleteProject.mutateAsync(projectId);
        showSuccessAlert(
          'Projet supprimé !',
          'Le projet a été supprimé avec succès'
        );
      } catch (error: any) {
        showErrorAlert(
          'Erreur de suppression',
          error.message || 'Une erreur est survenue lors de la suppression du projet'
        );
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
          <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-1">
            {canManageProjects ? 'Gérez tous vos projets' : 'Vos projets avec tâches assignées'}
          </p>
        </div>
        {canManageProjects && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Projet
          </Button>
        )}
      </div>

      {projects?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderKanban className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {canManageProjects ? 'Aucun projet pour le moment' : 'Aucun projet assigné'}
            </h3>
            <p className="text-gray-500 mb-4">
              {canManageProjects 
                ? 'Commencez par créer votre premier projet'
                : 'Vous n\'avez pas encore de tâches assignées dans un projet'
              }
            </p>
            {canManageProjects && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un projet
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {project.status === 'active'
                        ? 'Actif'
                        : project.status === 'completed'
                        ? 'Terminé'
                        : 'Archivé'}
                    </span>
                  </div>
                  {canManageProjects && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}`} className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            Voir détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(project.id, project.name)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {project.description || 'Pas de description'}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    {project.tasks?.length || 0} tâche{(project.tasks?.length || 0) > 1 ? 's' : ''}
                  </span>
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="ghost" size="sm">
                      Voir détails
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {canManageProjects && <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  );
}
