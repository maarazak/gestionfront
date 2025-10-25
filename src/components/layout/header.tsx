'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Header() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/projects') return 'Projets';
    if (pathname.startsWith('/projects/')) return 'Détails du projet';
    if (pathname === '/tasks') return 'Tâches';
    if (pathname === '/users') return 'Utilisateurs';
    if (pathname === '/profile') return 'Mon Profil';
    return '';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border glass-effect px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          {getBreadcrumb()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/profile">
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full p-0 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-sm font-semibold shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
          </Button>
        </Link>
      </div>
    </header>
  );
}
