'use client';

import { useState } from 'react';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Eye, FolderKanban, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ProjectDialog } from '@/components/projects/project-dialog';
import { showDeleteConfirmAlert, showSuccessAlert, showErrorAlert } from '@/lib/alerts';

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canManageProjects = isAdmin || isManager;

  const handleDelete = async (e: React.MouseEvent, projectId: string, projectName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = await showDeleteConfirmAlert(
      'Êtes-vous sûr?',
      `Le projet "${projectName}" et toutes ses tâches seront définitivement supprimés.`
    );

    if (result.isConfirmed) {
      try {
        await deleteProject.mutateAsync(projectId);
        showSuccessAlert('Projet supprimé');
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
          <h1 className="text-3xl font-semibold text-foreground tracking-tight flex items-center gap-3">
            Projets
            <Sparkles className="h-6 w-6 text-blue-500" />
          </h1>
          <p className="text-muted-foreground mt-2">
            {canManageProjects ? 'Gérez tous vos projets' : 'Vos projets avec tâches assignées'}
          </p>
        </div>
        {canManageProjects && (
          <Button onClick={() => setDialogOpen(true)} className="shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Projet
          </Button>
        )}
      </div>

      {projects?.length === 0 ? (
        <Card className="border-border shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6 shadow-lg">
              <FolderKanban className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {canManageProjects ? 'Aucun projet pour le moment' : 'Aucun projet assigné'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm text-center">
              {canManageProjects 
                ? 'Commencez par créer votre premier projet'
                : 'Vous n\'avez pas encore de tâches assignées dans un projet'
              }
            </p>
            {canManageProjects && (
              <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Créer un projet
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <div key={project.id} className="group relative">
              <Link href={`/projects/${project.id}`}>
                <Card className="border-border shadow-soft hover:shadow-glow transition-all duration-300 card-hover-lift overflow-hidden cursor-pointer h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardHeader className="pb-3 relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                          {project.name}
                        </CardTitle>
                        <span
                          className={`inline-block mt-2 px-2.5 py-1 text-[10px] font-medium rounded-lg shadow-sm ${
                            project.status === 'active'
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                              : project.status === 'completed'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {project.status === 'active'
                            ? 'Actif'
                            : project.status === 'completed'
                            ? 'Terminé'
                            : 'Archivé'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                      {project.description || 'Pas de description'}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        {project.tasks?.length || 0} tâche{(project.tasks?.length || 0) > 1 ? 's' : ''}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {canManageProjects && (
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
                  <Link href={`/projects/${project.id}`}>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={(e) => handleDelete(e, project.id, project.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {canManageProjects && <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  );
}
