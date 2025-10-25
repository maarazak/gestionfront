'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Bienvenue, {user?.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Organisation : {user?.tenant.name}
          </p>
        </div>
        
        <Button 
          onClick={handleProfileClick}
          variant="ghost" 
          size="icon" 
          className="relative rounded-full hover:bg-gray-100 transition-all duration-200 group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
            <User className="h-5 w-5" />
          </div>
        </Button>
      </div>
    </header>
  );
}
