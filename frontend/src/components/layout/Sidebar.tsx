'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, ShoppingBag, Scroll, Languages, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'LEARN', href: '/learn', icon: Home, color: 'text-[#1cb0f6]' },
  { label: 'CHARACTERS', href: '/characters', icon: Languages, color: 'text-[#1cb0f6]' },
  { label: 'LEADERBOARDS', href: '/leaderboard', icon: Trophy, color: 'text-[#ffc800]' },
  { label: 'QUESTS', href: '/quests', icon: Scroll, color: 'text-[#ff9600]' },
  { label: 'SHOP', href: '/shop', icon: ShoppingBag, color: 'text-[#ff4b4b]' },
  { label: 'PROFILE', href: '/profile', icon: User, color: 'text-[#1cb0f6]' },
  { label: 'MORE', href: '#', icon: MoreHorizontal, color: 'text-[#afafaf]' },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r-2 border-[#2b3840] px-4 py-6 fixed left-0 top-0 bg-[#131f24] z-40 select-none">
      <div>
        {/* Official Duolingo SVG Logo */}
        <Link href="/learn" className="flex items-center gap-3 px-4 mb-8">
          <Image
            src="/duolingo_logo.svg"
            alt="duolingo"
            width={140}
            height={32}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-2xl font-extrabold tracking-wider text-xs border-2 transition-all duration-150 uppercase',
                  isActive
                    ? 'border-[#84d8ff] bg-[#202f36] text-[#1cb0f6]'
                    : 'border-transparent text-[#778e9a] hover:bg-[#202f36] hover:text-white'
                )}
              >
                <Icon className={cn('w-6 h-6', item.color)} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
