'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNGMwIDItMiA0LTIgNHMtMi0yLTItNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-2xl mb-4 animate-pulse">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Créer une organisation
            <Sparkles className="h-6 w-6" />
          </h1>
          <p className="text-sm text-white/90 mt-2">Démarrez avec votre espace</p>
        </div>

        <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/95">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nouvelle organisation
              </CardTitle>
              <CardDescription className="text-sm">
                Configurez votre espace de travail
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant_name" className="text-sm font-medium">Nom de l'organisation</Label>
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
                  className="h-10 border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenant_slug" className="text-sm font-medium">Slug (URL unique)</Label>
                <Input
                  id="tenant_slug"
                  placeholder="mon-entreprise"
                  value={formData.tenant_slug}
                  onChange={(e) => setFormData({ ...formData, tenant_slug: e.target.value })}
                  required
                  className="h-10 border-2 focus:border-blue-500 transition-colors"
                />
                <p className="text-[10px] text-muted-foreground">
                  Utilisé pour identifier votre organisation
                </p>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-xs font-semibold mb-4 text-foreground uppercase tracking-wider">Compte administrateur</p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Nom complet</Label>
                    <Input
                      id="name"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-10 border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-10 border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={8}
                      className="h-10 border-2 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Minimum 8 caractères
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-sm font-medium">Confirmer le mot de passe</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password_confirmation}
                      onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                      required
                      className="h-10 border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? 'Création...' : 'Créer l\'organisation'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Déjà un compte ?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
