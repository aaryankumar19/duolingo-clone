'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/learn');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col items-center justify-center p-4">
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
          Redirecting...
        </p>
      </div>
    </div>
  );
}
