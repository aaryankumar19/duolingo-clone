'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { authApi } from '@/lib/api/auth/api';
import Image from 'next/image';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      authApi.getProfile().catch((err) => console.error('Failed to sync profile:', err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-20 h-20 bg-[#58cc02] rounded-3xl flex items-center justify-center shadow-lg border-b-4 border-[#46a302]">
            <Image
              src="/duolingo_logo.png"
              alt="Duolingo"
              width={60}
              height={60}
              className="object-contain brightness-0 invert"
            />
          </div>
          <p className="text-sm font-extrabold text-[#58cc02] uppercase tracking-widest">
            Loading Duolingo...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
