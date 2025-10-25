'use client';

import { useState } from 'react';
import { Task, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import { TaskDialog } from './task-dialog';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { showDeleteConfirmAlert, showSuccessAlert, showErrorAlert } from '@/lib/alerts';

interface TaskListProps {
  tasks: Task[];
  projectId?: string;
}

export function TaskList({ tasks, projectId }: TaskListProps) {
  const { user } = useAuthStore();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const isAdmin = user?.role === 'admin';

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await updateTask.mutateAsync({ id: taskId, status: newStatus });
  };

  const handleDelete = async (e: React.MouseEvent, taskId: string, taskTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = await showDeleteConfirmAlert(
      'Êtes-vous sûr?',
      `La tâche "${taskTitle}" sera définitivement supprimée.`
    );

    if (result.isConfirmed) {
      try {
        await deleteTask.mutateAsync(taskId);
        showSuccessAlert('Tâche supprimée');
      } catch (error: any) {
        showErrorAlert(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingTask(task);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      default:
        return 'bg-secondary text-muted-foreground hover:bg-secondary/80';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
      default:
        return 'bg-secondary text-muted-foreground';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Aucune tâche pour le moment</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group relative flex items-start gap-4 p-4 border border-border rounded-xl hover:shadow-soft transition-all duration-200 bg-card overflow-visible"
          >
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
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3
                    className={`font-medium text-sm text-foreground ${
                      task.status === 'done' ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {!projectId && task.project && (
                  <Link href={`/projects/${task.project_id}`}>
                    <Badge variant="outline" className="text-[10px] hover:bg-secondary cursor-pointer">
                      {task.project.name}
                    </Badge>
                  </Link>
                )}

                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded-md border-0 cursor-pointer ${getStatusColor(task.status)}`}
                >
                  <option value="todo">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="done">Terminé</option>
                </select>

                <Badge className={`text-[10px] ${getPriorityColor(task.priority)}`}>
                  {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Moyen' : 'Bas'}
                </Badge>

                {task.due_date && (
                  <div className="flex items-center text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(task.due_date).toLocaleDateString('fr-FR')}
                  </div>
                )}

                {task.assigned_user && (
                  <div className="flex items-center text-[10px] text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {task.assigned_user.name}
                  </div>
                )}
              </div>
            </div>

            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={(e) => handleEdit(e, task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 hover:text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={(e) => handleDelete(e, task.id, task.title)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={(open) => !open && setEditingTask(null)}
          task={editingTask}
          defaultProjectId={projectId}
        />
      )}
    </>
  );
}
