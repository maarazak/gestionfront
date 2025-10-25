'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare,
  Users,
  LogOut,
  UserCircle,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { showSuccessAlert } from '@/lib/alerts';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: false, gradient: 'from-purple-500 to-purple-600' },
    { name: 'Projets', href: '/projects', icon: FolderKanban, adminOnly: false, gradient: 'from-blue-500 to-blue-600' },
    { name: 'Tâches', href: '/tasks', icon: CheckSquare, adminOnly: false, gradient: 'from-emerald-500 to-emerald-600' },
    { name: 'Utilisateurs', href: '/users', icon: Users, adminOnly: true, gradient: 'from-amber-500 to-amber-600' },
  ];

  const visibleNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

  const handleLogout = async () => {
    logout();
    await showSuccessAlert('Déconnexion réussie');
    router.push('/login');
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-[240px] border-r border-border bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
        
        <div className="flex flex-col h-full relative z-10">
          <div className="px-3 py-6">
            <div className="flex items-center gap-3 px-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold text-foreground leading-none">
                  {user?.tenant.name}
                </h2>
                {isAdmin && (
                  <span className="text-[10px] text-primary mt-1 uppercase tracking-wider font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 pb-3">
            <div className="space-y-1">
              {visibleNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                      isActive
                        ? 'bg-white shadow-soft text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                    )}
                  >
                    {isActive && (
                      <div className={cn(
                        'absolute inset-0 bg-gradient-to-r opacity-10',
                        item.gradient
                      )}></div>
                    )}
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                      isActive 
                        ? `bg-gradient-to-br ${item.gradient} text-white shadow-md`
                        : 'bg-secondary/50 group-hover:bg-secondary'
                    )}>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="flex-1 relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-border px-3 py-3 bg-gradient-to-t from-slate-50 to-transparent">
            <div className="space-y-1">
              <Link
                href="/profile"
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 mb-1',
                  pathname === '/profile'
                    ? 'bg-white shadow-soft text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                )}
              >
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200',
                  pathname === '/profile'
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md'
                    : 'bg-secondary/50 group-hover:bg-secondary'
                )}>
                  <UserCircle className="h-4 w-4 flex-shrink-0" />
                </div>
                <span className="flex-1 truncate">{user?.name}</span>
              </Link>

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start h-10 px-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-xl"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors mr-3">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
