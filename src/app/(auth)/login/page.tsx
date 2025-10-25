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

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    tenant_slug: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tenant_slug) {
      showErrorAlert('Le champ Organisation est requis');
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
    
    try {
      await login(formData.email, formData.password, formData.tenant_slug);
      await showSuccessAlert('Connexion réussie');
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Identifiants incorrects';
      showErrorAlert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNGMwIDItMiA0LTIgNHMtMi0yLTItNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-2xl mb-4 animate-pulse">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Bienvenue
            <Sparkles className="h-6 w-6" />
          </h1>
          <p className="text-sm text-white/90 mt-2">Connectez-vous à votre espace</p>
        </div>

        <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/95">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Connexion
              </CardTitle>
              <CardDescription className="text-sm">
                Entrez vos informations pour continuer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenant_slug" className="text-sm font-medium">Organisation</Label>
                <Input
                  id="tenant_slug"
                  placeholder="mon-entreprise"
                  value={formData.tenant_slug}
                  onChange={(e) => setFormData({ ...formData, tenant_slug: e.target.value })}
                  required
                  className="h-10 border-2 focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-10 border-2 focus:border-purple-500 transition-colors"
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
                  className="h-10 border-2 focus:border-purple-500 transition-colors"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                  Créer une organisation
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
