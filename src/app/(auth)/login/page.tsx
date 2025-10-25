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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre espace multi-tenant
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="tenant_slug">Organisation (slug)</Label>
              <Input
                id="tenant_slug"
                placeholder="mon-entreprise"
                value={formData.tenant_slug}
                onChange={(e) => setFormData({ ...formData, tenant_slug: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
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
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                Créer une organisation
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
