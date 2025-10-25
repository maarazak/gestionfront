'use client';

import { useEffect, useState } from 'react';
import { Task, useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useUsers } from '@/hooks/useUsers';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from '@/lib/alerts';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  defaultProjectId?: string;
}

export function TaskDialog({ open, onOpenChange, task, defaultProjectId }: TaskDialogProps) {
  const { user: currentUser } = useAuthStore();
  const { data: projects } = useProjects();
  const { data: users } = useUsers();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';
  const canModifyTask = isAdmin || isManager;
  const isEditingOwnTask = task && task.assigned_to === currentUser?.id?.toString();

  const [formData, setFormData] = useState({
    project_id: defaultProjectId || '',
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assigned_to: '',
    due_date: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        project_id: task.project_id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assigned_to: task.assigned_to || '',
        due_date: task.due_date || '',
      });
    } else {
      setFormData({
        project_id: defaultProjectId || '',
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assigned_to: currentUser?.id?.toString() || '',
        due_date: '',
      });
    }
  }, [task, defaultProjectId, open, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canModifyTask && !isEditingOwnTask) {
      showErrorAlert(
        'Action non autorisée',
        'Vous n\'avez pas les permissions nécessaires'
      );
      return;
    }

    if (canModifyTask && !formData.title.trim()) {
      showErrorAlert(
        'Titre requis',
        'Le titre de la tâche est obligatoire'
      );
      return;
    }

    if (canModifyTask && !formData.project_id) {
      showErrorAlert(
        'Projet requis',
        'Veuillez sélectionner un projet'
      );
      return;
    }

    setIsSubmitting(true);
    showLoadingAlert(task ? 'Mise à jour de la tâche...' : 'Création de la tâche...');

    try {
      if (task) {
        if (!canModifyTask && isEditingOwnTask) {
          await updateTask.mutateAsync({ 
            id: task.id, 
            status: formData.status 
          });
          closeAlert();
          await showSuccessAlert(
            'Statut modifié !',
            'Le statut de votre tâche a été mis à jour'
          );
        } else if (canModifyTask) {
          await updateTask.mutateAsync({ id: task.id, ...formData });
          closeAlert();
          await showSuccessAlert(
            'Tâche modifiée !',
            'La tâche a été mise à jour avec succès'
          );
        }
      } else {
        if (!canModifyTask) {
          closeAlert();
          showErrorAlert(
            'Action non autorisée',
            'Seuls les administrateurs et managers peuvent créer des tâches'
          );
          return;
        }
        await createTask.mutateAsync(formData);
        closeAlert();
        await showSuccessAlert(
          'Tâche créée !',
          'La nouvelle tâche a été créée avec succès'
        );
      }
      onOpenChange(false);
    } catch (error: any) {
      closeAlert();
      showErrorAlert(
        'Erreur',
        error.message || 'Une erreur est survenue lors de l\'enregistrement de la tâche'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canModifyTask && task && !isEditingOwnTask) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</DialogTitle>
          <DialogDescription>
            {task 
              ? (canModifyTask ? 'Modifiez les détails de la tâche' : 'Modifiez le statut de votre tâche')
              : 'Créez une nouvelle tâche et assignez-la à un membre'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {canModifyTask && (
              <div className="grid gap-2">
                <Label htmlFor="project_id">Projet *</Label>
                <Select
                  value={formData.project_id}
                  onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                  required
                  disabled={!!task}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {canModifyTask && (
              <div className="grid gap-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de la tâche"
                  required
                />
              </div>
            )}

            {!canModifyTask && task && (
              <div className="grid gap-2">
                <Label>Titre</Label>
                <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded border">
                  {task.title}
                </p>
              </div>
            )}

            {canModifyTask && (
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la tâche"
                  rows={4}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="status">Statut *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Task['status'] })}
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="done">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {canModifyTask && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as Task['priority'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="assigned_to">Assigner à *</Label>
                  <Select
                    value={formData.assigned_to}
                    onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="due_date">Date d'échéance</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : task ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
