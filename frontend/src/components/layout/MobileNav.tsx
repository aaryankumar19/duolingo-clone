'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/learn', icon: Home, label: 'Learn' },
  { href: '/courses', icon: Globe, label: 'Courses' },
  { href: '/leaderboard', icon: Trophy, label: 'Ranks' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-gray-200 flex items-center justify-around z-40 px-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center p-2 rounded-xl transition',
              isActive ? 'text-[#1CB0F6] bg-sky-50 font-bold' : 'text-gray-400'
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
