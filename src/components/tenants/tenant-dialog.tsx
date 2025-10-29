'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateTenant, useUpdateTenant } from '@/hooks/useTenants';
import { Tenant } from '@/types/api';

interface TenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: Tenant | null;
  onSuccess?: () => void;
}

export function TenantDialog({ open, onOpenChange, tenant, onSuccess }: TenantDialogProps) {
  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();
  const [name, setName] = useState('');

  const isLoading = createTenantMutation.isPending || updateTenantMutation.isPending;

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || '');
    } else {
      setName('');
    }
  }, [tenant, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (tenant) {
        await updateTenantMutation.mutateAsync({ id: tenant.id, name });
      } else {
        await createTenantMutation.mutateAsync({ name });
      }
      onOpenChange(false);
      setName('');
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {tenant ? 'Modifier l\'organisation' : 'Nouvelle organisation'}
          </DialogTitle>
          <DialogDescription>
            {tenant 
              ? 'Modifiez le nom de l\'organisation. Le slug sera automatiquement mis à jour.' 
              : 'Créez une nouvelle organisation. Le slug sera généré automatiquement et vous serez ajouté en tant qu\'administrateur.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de l'organisation</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mon entreprise"
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Le slug sera généré automatiquement à partir du nom (ex: "mon-entreprise")
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'En cours...' : tenant ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
