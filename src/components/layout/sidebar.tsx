'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare,
  Users,
  Building2,
  LogOut,
  UserCircle
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
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: false },
    { name: 'Projets', href: '/projects', icon: FolderKanban, adminOnly: false },
    { name: 'Tâches', href: '/tasks', icon: CheckSquare, adminOnly: false },
    { name: 'Utilisateurs', href: '/users', icon: Users, adminOnly: true },
  ];

  const visibleNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

  const handleLogout = async () => {
    logout();
    await showSuccessAlert('Déconnexion réussie');
    router.push('/login');
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.tenant.name}
              </h2>
              <p className="text-xs text-gray-500">
                {user?.name}
                {isAdmin && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Admin
                  </span>
                )}
              </p>
            </div>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {visibleNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="px-2 mt-auto space-y-1 pt-4 border-t">
            <Link
              href="/profile"
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                pathname === '/profile'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <UserCircle
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  pathname === '/profile' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              Mon Profil
            </Link>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
