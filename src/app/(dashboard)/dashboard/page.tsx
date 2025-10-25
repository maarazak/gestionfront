'use client';

import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, CheckSquare, Clock, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const stats = {
    totalProjects: projects?.length || 0,
    activeProjects: projects?.filter(p => p.status === 'active').length || 0,
    totalTasks: tasks?.length || 0,
    completedTasks: tasks?.filter(t => t.status === 'done').length || 0,
    inProgressTasks: tasks?.filter(t => t.status === 'in_progress').length || 0,
    todoTasks: tasks?.filter(t => t.status === 'todo').length || 0,
  };

  const recentTasks = tasks?.slice(0, 5) || [];
  const upcomingTasks = tasks
    ?.filter(t => t.due_date && new Date(t.due_date) > new Date() && t.status !== 'done')
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5) || [];

  if (projectsLoading || tasksLoading) {
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
            Dashboard
            <Sparkles className="h-6 w-6 text-primary" />
          </h1>
          <p className="text-muted-foreground mt-2">Vue d'ensemble de vos projets et tâches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-soft hover:shadow-elevated transition-all duration-300 card-hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projets Actifs
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
              <FolderKanban className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {stats.activeProjects}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              sur {stats.totalProjects} total
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft hover:shadow-elevated transition-all duration-300 card-hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tâches Totales
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              {stats.totalTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completedTasks} terminées
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft hover:shadow-elevated transition-all duration-300 card-hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Cours
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-br from-amber-600 to-amber-800 bg-clip-text text-transparent">
              {stats.inProgressTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              tâches actives
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft hover:shadow-elevated transition-all duration-300 card-hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              À Faire
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {stats.todoTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              tâches en attente
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-soft card-hover-lift">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></span>
                Tâches Récentes
              </CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-primary/10 hover:text-primary">
                  Voir tout
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="py-12 text-center">
                <CheckSquare className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">Aucune tâche pour le moment</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 border border-transparent hover:border-purple-200"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.project?.name}
                      </p>
                    </div>
                    <span
                      className={`ml-3 px-2 py-0.5 text-[10px] font-medium rounded-md whitespace-nowrap ${
                        task.status === 'done'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                          : task.status === 'in_progress'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {task.status === 'done' ? 'Terminé' : task.status === 'in_progress' ? 'En cours' : 'À faire'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft card-hover-lift">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse"></span>
                Échéances Proches
              </CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-primary/10 hover:text-primary">
                  Voir tout
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="py-12 text-center">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">Aucune échéance à venir</p>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200 border border-transparent hover:border-amber-200"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">{task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.project?.name}
                      </p>
                    </div>
                    <div className="ml-3 text-right flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-md whitespace-nowrap ${
                        task.priority === 'high'
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                          : task.priority === 'medium'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Moyen' : 'Bas'}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(task.due_date!).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-soft card-hover-lift">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"></span>
              Projets Actifs
            </CardTitle>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-primary/10 hover:text-primary">
                Voir tout
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {projects?.filter(p => p.status === 'active').length === 0 ? (
            <div className="py-12 text-center">
              <FolderKanban className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">Aucun projet actif</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects?.filter(p => p.status === 'active').slice(0, 6).map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="group p-4 border border-border rounded-xl hover:border-primary hover:shadow-glow transition-all duration-200 cursor-pointer bg-card card-hover-lift overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{project.name}</h4>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {project.description || 'Pas de description'}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {project.tasks?.length || 0} tâches
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md">
                          Actif
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
