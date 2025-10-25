'use client';

import { useState } from 'react';
import { useInviteUser } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { showSuccessAlert, showErrorAlert, showLoadingAlert, closeAlert } from '@/lib/alerts';

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const inviteUser = useInviteUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      showErrorAlert(
        'Champs requis',
        'Veuillez remplir tous les champs du formulaire'
      );
      return;
    }

    if (formData.password.length < 8) {
      showErrorAlert(
        'Mot de passe trop court',
        'Le mot de passe doit contenir au moins 8 caractères'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showErrorAlert(
        'Email invalide',
        'Veuillez entrer une adresse email valide'
      );
      return;
    }

    showLoadingAlert('Invitation en cours...');

    try {
      await inviteUser.mutateAsync(formData);
      closeAlert();
      await showSuccessAlert(
        'Utilisateur invité !',
        `L'invitation a été envoyée à ${formData.email}`
      );
      setFormData({ name: '', email: '', password: '' });
      onOpenChange(false);
    } catch (error: any) {
      closeAlert();
      showErrorAlert(
        'Erreur lors de l\'invitation',
        error.message || 'Une erreur est survenue lors de l\'invitation de l\'utilisateur'
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Inviter un utilisateur</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau membre à votre organisation. Il recevra le rôle d'utilisateur.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe temporaire</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 caractères"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500">
                L'utilisateur pourra changer son mot de passe après la première connexion.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={inviteUser.isPending}>
              {inviteUser.isPending ? 'Envoi...' : 'Inviter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
