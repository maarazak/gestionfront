'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/task-dialog';
import { TaskList } from '@/components/tasks/task-list';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function TasksPage() {
  const { user } = useAuthStore();
  const { data: tasks, isLoading } = useTasks();
  const { data: projects } = useProjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = user?.role === 'admin';

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

  const filteredTasks = tasks?.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || task.project_id === projectFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesProject && matchesSearch;
  }) || [];

  const taskStats = {
    total: tasks?.length || 0,
    todo: tasks?.filter(t => t.status === 'todo').length || 0,
    inProgress: tasks?.filter(t => t.status === 'in_progress').length || 0,
    done: tasks?.filter(t => t.status === 'done').length || 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Tâches</h1>
          <p className="text-muted-foreground mt-2">
            {isAdmin ? 'Gérez toutes les tâches' : 'Vos tâches assignées'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setDialogOpen(true)} className="shadow-soft">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Tâche
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight">{taskStats.total}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-border shadow-soft hover:shadow-elevated transition-all duration-200" onClick={() => setStatusFilter('todo')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">À faire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-muted-foreground">{taskStats.todo}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-border shadow-soft hover:shadow-elevated transition-all duration-200" onClick={() => setStatusFilter('in_progress')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-blue-600">{taskStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer border-border shadow-soft hover:shadow-elevated transition-all duration-200" onClick={() => setStatusFilter('done')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight text-emerald-600">{taskStats.done}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Filtres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="todo">À faire</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="done">Terminé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Projet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les projets</SelectItem>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(statusFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all' || searchQuery) && (
            <div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setProjectFilter('all');
                  setSearchQuery('');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">
            {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {tasks?.length === 0 
                ? (isAdmin ? 'Aucune tâche créée' : 'Aucune tâche assignée')
                : 'Aucune tâche ne correspond aux filtres'
              }
            </div>
          ) : (
            <TaskList tasks={filteredTasks} />
          )}
        </CardContent>
      </Card>

      {isAdmin && <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  );
}
