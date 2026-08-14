import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileNav } from '@/components/layout/MobileNav';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#131f24] text-white flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 md:pl-64 flex flex-col min-h-screen pb-20 md:pb-0 bg-[#131f24]">
          <main className="flex-1 w-full max-w-[1056px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <MobileNav />
        </div>
      </div>
    </AuthGuard>
  );
}
