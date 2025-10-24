'use client';

import { useState } from 'react';
import { Task, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Calendar, User } from 'lucide-react';
import { TaskDialog } from './task-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface TaskListProps {
  tasks: Task[];
  projectId?: string;
}

export function TaskList({ tasks, projectId }: TaskListProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await updateTask.mutateAsync({ id: taskId, status: newStatus });
  };

  const handleDelete = async () => {
    if (taskToDelete) {
      await deleteTask.mutateAsync(taskToDelete);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucune tâche pour le moment</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            {/* Checkbox pour statut */}
            <div className="flex items-start pt-1">
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={(e) =>
                  handleStatusChange(
                    task.id,
                    e.target.checked ? 'done' : 'todo'
                  )
                }
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3
                    className={`font-medium text-gray-900 ${
                      task.status === 'done' ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingTask(task)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setTaskToDelete(task.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* Projet */}
                {!projectId && task.project && (
                  <Link href={`/projects/${task.project_id}`}>
                    <Badge variant="outline" className="hover:bg-gray-50">
                      {task.project.name}
                    </Badge>
                  </Link>
                )}

                {/* Statut */}
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                  className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusColor(task.status)}`}
                >
                  <option value="todo">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="done">Terminé</option>
                </select>

                {/* Priorité */}
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </Badge>

                {/* Date d'échéance */}
                {task.due_date && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(task.due_date).toLocaleDateString('fr-FR')}
                  </div>
                )}

                {/* Assigné à */}
                {task.assigned_user && (
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    {task.assigned_user.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          task={editingTask}
          defaultProjectId={projectId}
        />
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La tâche sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
