'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { TaskList } from '@/components/tasks/task-list';
import { ProjectDialog } from '@/components/projects/project-dialog';
import { useAuthStore } from '@/store/authStore';
import { showDeleteConfirmAlert, showSuccessAlert, showErrorAlert } from '@/lib/alerts';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuthStore();
  
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const { data: tasks, isLoading: tasksLoading } = useTasks(projectId);
  const deleteProject = useDeleteProject();
  
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';

  const handleDelete = async () => {
    const result = await showDeleteConfirmAlert(
      'Êtes-vous sûr?',
      `Le projet "${project?.name}" et toutes ses tâches seront définitivement supprimés.`
    );

    if (result.isConfirmed) {
      try {
        await deleteProject.mutateAsync(projectId);
        showSuccessAlert('Projet supprimé');
        router.push('/projects');
      } catch (error: any) {
        showErrorAlert(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (projectError) {
    const status = (projectError as any).response?.status;
    const message = (projectError as any).response?.data?.message;
  
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          {status === 403 ? "Accès refusé" : "Projet non trouvé"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {message || "Vous n'avez pas accès à ce projet."}
        </p>
        <Link href="/projects">
          <Button>Retour aux projets</Button>
        </Link>
      </div>
    );
  }
  

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Projet non trouvé</h2>
        <Link href="/projects">
          <Button>Retour aux projets</Button>
        </Link>
      </div>
    );
  }

  const taskStats = {
    total: tasks?.length || 0,
    todo: tasks?.filter(t => t.status === 'todo').length || 0,
    inProgress: tasks?.filter(t => t.status === 'in_progress').length || 0,
    done: tasks?.filter(t => t.status === 'done').length || 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{project.description || 'Pas de description'}</p>
          </div>
          <span
            className={`px-2.5 py-0.5 text-[10px] font-medium rounded-md ${
              project.status === 'active'
                ? 'bg-emerald-100 text-emerald-700'
                : project.status === 'completed'
                ? 'bg-blue-100 text-blue-700'
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
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              À faire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-muted-foreground">{taskStats.todo}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              En cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-blue-600">{taskStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card className="border-border shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-emerald-600">{taskStats.done}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Tâches du projet</CardTitle>
            {isAdmin && (
              <Button onClick={() => setTaskDialogOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Tâche
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <TaskList tasks={tasks || []} projectId={projectId} />
        </CardContent>
      </Card>

      <TaskDialog 
        open={taskDialogOpen} 
        onOpenChange={setTaskDialogOpen}
        defaultProjectId={projectId}
      />

      <ProjectDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        project={project}
      />
    </div>
  );
}
