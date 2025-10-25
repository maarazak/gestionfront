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
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'manager':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
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
        variant: 'bg-green-50 text-green-700 border-green-200'
      };
    } else if (user?.role === 'manager') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez créer, modifier et supprimer des projets',
        variant: 'bg-green-50 text-green-700 border-green-200'
      };
    } else {
      return {
        access: 'Lecture seule',
        description: 'Vous pouvez uniquement voir les projets',
        variant: 'bg-gray-50 text-gray-600 border-gray-200'
      };
    }
  };

  const getTaskPermissions = () => {
    if (user?.role === 'admin') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez créer, modifier, supprimer et changer le statut des tâches',
        variant: 'bg-green-50 text-green-700 border-green-200'
      };
    } else if (user?.role === 'manager') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez créer, modifier, supprimer et changer le statut des tâches',
        variant: 'bg-green-50 text-green-700 border-green-200'
      };
    } else {
      return {
        access: 'Lecture et modification',
        description: 'Vous pouvez voir les tâches et modifier leur statut',
        variant: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    }
  };

  const getUserPermissions = () => {
    if (user?.role === 'admin') {
      return {
        access: 'Accès complet',
        description: 'Vous pouvez inviter, modifier et gérer tous les utilisateurs',
        variant: 'bg-green-50 text-green-700 border-green-200'
      };
    } else {
      return {
        access: 'Aucun accès',
        description: 'Vous ne pouvez pas accéder à la gestion des utilisateurs',
        variant: 'bg-red-50 text-red-700 border-red-200'
      };
    }
  };

  const projectPerms = getProjectPermissions();
  const taskPerms = getTaskPermissions();
  const userPerms = getUserPermissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-500 mt-2">
          Gérez vos informations personnelles et vos paramètres de compte
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Vos informations de base et votre rôle dans l'organisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-3xl shadow-lg">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
                <Badge className={`mt-2 ${getRoleBadgeColor(user?.role || '')}`}>
                  {getRoleLabel(user?.role || '')}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 pt-4 border-t">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Rôle</p>
                  <p className="text-base text-gray-900 capitalize">{getRoleLabel(user?.role || '')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">ID Utilisateur</p>
                  <p className="text-base text-gray-900 font-mono">{user?.id}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Modifier le profil
              </Button>
              <Button className="flex-1" variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Changer le mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organisation</CardTitle>
            <CardDescription>
              Informations sur votre organisation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold text-2xl shadow-lg">
              {user?.tenant.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.tenant.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                @{user?.tenant.slug}
              </p>
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Organisation:</span>
                <span className="font-medium text-gray-900">{user?.tenant.name}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Tenant ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {user?.tenant.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permissions et accès</CardTitle>
          <CardDescription>
            Vos droits d'accès dans l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Projets</span>
                <Badge variant="outline" className={projectPerms.variant}>
                  {projectPerms.access}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {projectPerms.description}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Tâches</span>
                <Badge variant="outline" className={taskPerms.variant}>
                  {taskPerms.access}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {taskPerms.description}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Utilisateurs</span>
                <Badge 
                  variant="outline" 
                  className={userPerms.variant}
                >
                  {userPerms.access}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {userPerms.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
