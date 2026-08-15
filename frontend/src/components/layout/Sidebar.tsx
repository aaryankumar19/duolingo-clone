'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, ShoppingBag, Scroll, Languages, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/use-auth-store';
import { Modal } from '@/components/ui/Modal';

const NAV_ITEMS = [
  { label: 'LEARN', href: '/learn', icon: Home, color: 'text-[#1cb0f6]' },
  { label: 'CHARACTERS', href: '/characters', icon: Languages, color: 'text-[#1cb0f6]' },
  { label: 'LEADERBOARDS', href: '/leaderboard', icon: Trophy, color: 'text-[#ffc800]' },
  { label: 'QUESTS', href: '/quests', icon: Scroll, color: 'text-[#ff9600]' },
  { label: 'SHOP', href: '/shop', icon: ShoppingBag, color: 'text-[#ff4b4b]' },
  { label: 'PROFILE', href: '/profile', icon: User, color: 'text-[#1cb0f6]' },
  { label: 'MORE', href: '#', icon: MoreHorizontal, color: 'text-[#afafaf]' },
];

const MoreDropdown: React.FC<{
  item: typeof NAV_ITEMS[number];
  onOpenComingSoon: (feature: string) => void;
}> = ({ item, onOpenComingSoon }) => {
  const { logout } = useAuthStore();

  return (
    <div className="relative group">
      {/* Trigger Button */}
      <button
        type="button"
        className={cn(
          'w-full flex items-center gap-4 px-4 py-3 rounded-2xl font-extrabold tracking-wider text-xs border-2 transition-all duration-150 uppercase border-transparent text-[#778e9a] group-hover:bg-[#202f36] group-hover:text-white'
        )}
      >
        <div className="w-6 h-6 rounded-full bg-[#c87be5] flex items-center justify-center shrink-0">
          <div className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-white"></span>
            <span className="w-1 h-1 rounded-full bg-white"></span>
            <span className="w-1 h-1 rounded-full bg-white"></span>
          </div>
        </div>
        <span>{item.label}</span>
      </button>

      {/* Popover Menu */}
      <div className="absolute left-full bottom-0 pl-2 hidden group-hover:block z-50">
        <div className="w-72 bg-[#202f36] border-2 border-[#2b3840] rounded-2xl py-2 shadow-2xl flex flex-col">
          {/* Duolingo English Test */}
          <button
            type="button"
            onClick={() => onOpenComingSoon('Duolingo English Test')}
            className="px-4 py-3.5 flex items-center gap-4 hover:bg-[#2b3840] transition-colors rounded-t-xl text-left w-full cursor-pointer"
          >
            {/* Custom SVG Rosette */}
            <svg viewBox="0 0 32 32" className="w-8 h-8 shrink-0">
              <g fill="#58cc02">
                <circle cx="16" cy="16" r="11" />
                <circle cx="26.5" cy="16" r="3.5" />
                <circle cx="25.1" cy="21.25" r="3.5" />
                <circle cx="21.25" cy="25.1" r="3.5" />
                <circle cx="16" cy="26.5" r="3.5" />
                <circle cx="10.75" cy="25.1" r="3.5" />
                <circle cx="6.9" cy="21.25" r="3.5" />
                <circle cx="5.5" cy="16" r="3.5" />
                <circle cx="6.9" cy="10.75" r="3.5" />
                <circle cx="10.75" cy="6.9" r="3.5" />
                <circle cx="16" cy="5.5" r="3.5" />
                <circle cx="21.25" cy="6.9" r="3.5" />
                <circle cx="25.1" cy="10.75" r="3.5" />
              </g>
              {/* Face of Duo in white and green and orange */}
              <path d="M16 10c-3 0-5.5 1.8-5.5 5 0 .5.1.9.2 1.3.7 3.5 3 6.2 5.3 6.2s4.6-2.7 5.3-6.2c.1-.4.2-.8.2-1.3 0-3.2-2.5-5-5-5z" fill="white" />
              {/* Eyes */}
              <circle cx="13.5" cy="14.5" r="2.2" fill="#58cc02" />
              <circle cx="18.5" cy="14.5" r="2.2" fill="#58cc02" />
              <circle cx="13.5" cy="14.5" r="0.8" fill="white" />
              <circle cx="18.5" cy="14.5" r="0.8" fill="white" />
              {/* Beak */}
              <path d="M16 15l-1.5 2 3 0z" fill="#ff9600" />
            </svg>
            <span className="font-extrabold text-white text-xs tracking-wider uppercase">
              DUOLINGO ENGLISH TEST
            </span>
          </button>

          {/* Schools */}
          <button
            type="button"
            onClick={() => onOpenComingSoon('Schools')}
            className="px-4 py-3.5 flex items-center gap-4 hover:bg-[#2b3840] transition-colors text-left w-full cursor-pointer"
          >
            {/* Custom SVG Globe */}
            <svg viewBox="0 0 32 32" className="w-8 h-8 shrink-0">
              {/* Globe sphere (ocean) */}
              <circle cx="16" cy="13" r="9" fill="#2b9bf4" />
              
              {/* Continents/Landmasses (green) */}
              <path d="M12 8c1-1 3-1.5 4-.5.5 1-1.5 3-2.5 3.5s-2-.5-1.5-3z" fill="#78c800" />
              <path d="M18 7c1-.5 2 0 2.5 1s0 2.5-1 2.5-2.5-1-1.5-3.5z" fill="#78c800" />
              <path d="M10 13c1.5-.5 3 0 3.5 1s.5 2-.5 3-2.5.5-3-1.5.5-2 0-2.5z" fill="#78c800" />
              <path d="M20 12c1 0 2 1 1.5 2s-1.5 1.5-2.5.5 0-2 1-2.5z" fill="#78c800" />
              <path d="M14 17c1 0 2 1 1.5 2s-1.5 1.5-2.5.5 0-2 1-2.5z" fill="#78c800" />
              
              {/* Stand (yellow/gold arch) */}
              <path d="M16 3a10 10 0 0 0-10 10 10 10 0 0 0 2.9 7.1" stroke="#ff9600" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              
              {/* Stand connection and base */}
              <path d="M16 2v1M16 23v3" stroke="#ff9600" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M11 26h10" stroke="#ff9600" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
            <span className="font-extrabold text-white text-xs tracking-wider uppercase">
              SCHOOLS
            </span>
          </button>

          {/* Divider */}
          <div className="border-t-2 border-[#2b3840] my-1" />

          {/* Settings */}
          <Link
            href="/profile"
            className="px-4 py-3 flex items-center hover:bg-[#2b3840] transition-colors font-extrabold text-[#778e9a] hover:text-white uppercase tracking-wider text-xs"
          >
            SETTINGS
          </Link>

          {/* Help */}
          <button
            type="button"
            onClick={() => onOpenComingSoon('Help Center')}
            className="px-4 py-3 flex items-center hover:bg-[#2b3840] transition-colors font-extrabold text-[#778e9a] hover:text-white uppercase tracking-wider text-xs text-left w-full cursor-pointer"
          >
            HELP
          </button>

          {/* Log Out */}
          <button
            type="button"
            onClick={logout}
            className="px-4 py-3 flex items-center hover:bg-[#2b3840] transition-colors font-extrabold text-[#778e9a] hover:text-white uppercase tracking-wider text-xs text-left w-full rounded-b-xl cursor-pointer"
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 h-screen border-r-2 border-[#2b3840] px-4 py-6 fixed left-0 top-0 bg-[#131f24] z-40 select-none">
        <div className="flex-1">
          {/* Logo */}
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

              if (item.label === 'MORE') {
                return (
                  <MoreDropdown
                    key={item.label}
                    item={item}
                    onOpenComingSoon={(feature) => setComingSoonFeature(feature)}
                  />
                );
              }

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

      {/* Coming Soon Modal */}
      <Modal
        isOpen={!!comingSoonFeature}
        onClose={() => setComingSoonFeature(null)}
        title="Coming Soon!"
      >
        <div className="flex flex-col items-center text-center p-2 gap-4 select-none">
          <div className="w-24 h-24 relative animate-bounce">
            <Image
              src="/duo/ad9ec13f2b161e008ab1.svg"
              alt="Duo"
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <h3 className="text-lg font-extrabold text-[#4b4b4b]">
            {comingSoonFeature} is coming soon!
          </h3>
          <p className="text-xs font-bold text-[#778e9a] max-w-xs leading-relaxed">
            Duo is hard at work building this feature for you. Check back soon!
          </p>
          <button
            onClick={() => setComingSoonFeature(null)}
            className="w-full mt-2 py-3 bg-[#58cc02] hover:bg-[#61e002] text-white font-extrabold text-xs tracking-widest uppercase rounded-2xl shadow-[0_4px_0_0_#46a302] active:shadow-none active:translate-y-[4px] transition cursor-pointer"
          >
            GOT IT
          </button>
        </div>
      </Modal>
    </>
  );
};

