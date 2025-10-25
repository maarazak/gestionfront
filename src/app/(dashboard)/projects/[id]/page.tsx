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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {projectError.response?.status === 403 
            ? "Accès refusé" 
            : "Projet non trouvé"}
        </h2>
        <p className="text-gray-600 mb-4">
          {projectError.response?.data?.message || "Vous n'avez pas accès à ce projet."}
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h2>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description || 'Pas de description'}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
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
        {isAdmin && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              À faire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">{taskStats.todo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.done}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tâches du projet</CardTitle>
            {isAdmin && (
              <Button onClick={() => setTaskDialogOpen(true)}>
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
