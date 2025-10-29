'use client';

import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Building2, Check, ChevronDown, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/alerts';

export function TenantSwitcher() {
  const { user, switchTenant } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }

  const handleSwitchTenant = async (tenantId: string) => {
    if (tenantId === user.current_tenant?.id) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(false);
    
    try {
      await switchTenant(tenantId);
      toast.success('Organisation changée avec succès');
    } catch (error) {
      toast.error('Erreur lors du changement d\'organisation');
    } finally {
      setIsLoading(false);
    }
  };

  const userTenants = user.tenants || [];
  const currentTenant = user.current_tenant || user.tenant;
  const isAdmin = user.role === 'admin';

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <Building2 className="h-4 w-4 mr-2" />
        <span className="max-w-[150px] truncate">
          {currentTenant?.name || 'Organisation'}
        </span>
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="p-2">
            <div className="px-2 py-1.5 text-sm font-semibold">
              Organisations ({userTenants.length})
            </div>
            <div className="h-px bg-border my-1" />
            
            {userTenants.length > 0 ? (
              <div className="space-y-1">
                {userTenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => handleSwitchTenant(tenant.id)}
                    className="w-full flex items-center justify-between px-2 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{tenant.name}</span>
                      <span className="text-xs text-muted-foreground">{tenant.slug}</span>
                    </div>
                    {tenant.id === currentTenant?.id && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Aucune organisation
              </div>
            )}
            
            {isAdmin && (
              <>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/tenants');
                  }}
                  className="w-full flex items-center px-2 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer transition-colors text-primary"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gérer les organisations
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
