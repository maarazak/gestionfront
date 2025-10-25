'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { showErrorAlert, showSuccessAlert } from '@/lib/alerts';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    tenant_name: '',
    tenant_slug: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenant_name) {
      showErrorAlert('Le champ Nom de l\'organisation est requis');
      return;
    }

    if (!formData.tenant_slug) {
      showErrorAlert('Le champ Slug est requis');
      return;
    }

    if (!formData.name) {
      showErrorAlert('Le champ Nom complet est requis');
      return;
    }

    if (!formData.email) {
      showErrorAlert('Le champ Email est requis');
      return;
    }

    if (!formData.password) {
      showErrorAlert('Le champ Mot de passe est requis');
      return;
    }

    if (formData.password.length < 8) {
      showErrorAlert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (!formData.password_confirmation) {
      showErrorAlert('Veuillez confirmer votre mot de passe');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      showErrorAlert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await register(formData);
      await showSuccessAlert('Organisation créée avec succès');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue';
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstError = Object.values(errors)[0];
        showErrorAlert(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        showErrorAlert(errorMessage);
      }
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold">Créer une organisation</CardTitle>
          <CardDescription className="text-center">
            Démarrez avec votre espace multi-tenant
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="tenant_name">Nom de l'organisation</Label>
              <Input
                id="tenant_name"
                placeholder="Mon Entreprise"
                value={formData.tenant_name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({ 
                    ...formData, 
                    tenant_name: name,
                    tenant_slug: generateSlug(name)
                  });
                }}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenant_slug">Slug (URL unique)</Label>
              <Input
                id="tenant_slug"
                placeholder="mon-entreprise"
                value={formData.tenant_slug}
                onChange={(e) => setFormData({ ...formData, tenant_slug: e.target.value })}
                required
                className="h-11"
              />
              <p className="text-xs text-gray-500 mt-1">
                Utilisé pour identifier votre organisation
              </p>
            </div>

            <div className="border-t pt-6 mt-6">
              <p className="text-sm font-semibold mb-5 text-gray-700">Compte administrateur</p>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 caractères
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer l\'organisation'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
