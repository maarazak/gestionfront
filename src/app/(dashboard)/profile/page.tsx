'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Shield, 
  Building2, 
  Calendar,
  Edit,
  Key
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary';
      case 'manager':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-secondary text-muted-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'manager':
        return 'Gestionnaire';
      default:
        return 'Utilisateur';
    }
  };

  const getProjectPermissions = () => {
    if (user?.role === 'admin') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez créer, modifier et supprimer des projets',
        variant: 'bg-emerald-100 text-emerald-700'
      };
    } else if (user?.role === 'manager') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez créer, modifier et supprimer des projets',
        variant: 'bg-emerald-100 text-emerald-700'
      };
    } else {
      return {
        access: 'Lecture seule',
        description: 'Vous pouvez uniquement voir les projets',
        variant: 'bg-secondary text-muted-foreground'
      };
    }
  };

  const getTaskPermissions = () => {
    if (user?.role === 'admin') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez créer, modifier, supprimer et changer le statut des tâches',
        variant: 'bg-emerald-100 text-emerald-700'
      };
    } else if (user?.role === 'manager') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez créer, modifier, supprimer et changer le statut des tâches',
        variant: 'bg-emerald-100 text-emerald-700'
      };
    } else {
      return {
        access: 'Lecture et modification',
        description: 'Vous pouvez voir les tâches et modifier leur statut',
        variant: 'bg-blue-100 text-blue-700'
      };
    }
  };

  const getUserPermissions = () => {
    if (user?.role === 'admin') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez inviter, modifier et gérer tous les utilisateurs',
        variant: 'bg-emerald-100 text-emerald-700'
      };
    } else {
      return {
        access: 'Aucun accès',
        description: 'Vous ne pouvez pas accéder à la gestion des utilisateurs',
        variant: 'bg-red-100 text-red-700'
      };
    }
  };

  const projectPerms = getProjectPermissions();
  const taskPerms = getTaskPermissions();
  const userPerms = getUserPermissions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et vos paramètres de compte
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-border shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Informations personnelles</CardTitle>
            <CardDescription className="text-sm">
              Vos informations de base et votre rôle dans l'organisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-semibold text-3xl shadow-soft">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
                <Badge className={`mt-2 ${getRoleBadgeColor(user?.role || '')}`}>
                  {getRoleLabel(user?.role || '')}
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Rôle</p>
                  <p className="text-sm text-foreground capitalize">{getRoleLabel(user?.role || '')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">ID Utilisateur</p>
                  <p className="text-xs text-muted-foreground font-mono">{user?.id}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Modifier le profil
              </Button>
              <Button className="flex-1" variant="outline" size="sm">
                <Key className="mr-2 h-4 w-4" />
                Changer le mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Organisation</CardTitle>
            <CardDescription className="text-sm">
              Informations sur votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-16 w-16 items-center justify-center mx-auto rounded-2xl bg-primary text-primary-foreground font-semibold text-2xl shadow-soft">
              {user?.tenant.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground">
                {user?.tenant.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                @{user?.tenant.slug}
              </p>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Organisation:</span>
                <span className="font-medium text-foreground">{user?.tenant.name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Tenant ID:</span>
                <span className="font-mono text-[10px] bg-secondary px-2 py-1 rounded">
                  {user?.tenant.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Permissions et accès</CardTitle>
          <CardDescription className="text-sm">
            Vos droits d'accès dans l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Projets</span>
                <Badge variant="outline" className={projectPerms.variant}>
                  {projectPerms.access}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {projectPerms.description}
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Tâches</span>
                <Badge variant="outline" className={taskPerms.variant}>
                  {taskPerms.access}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {taskPerms.description}
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Utilisateurs</span>
                <Badge 
                  variant="outline" 
                  className={userPerms.variant}
                >
                  {userPerms.access}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {userPerms.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
