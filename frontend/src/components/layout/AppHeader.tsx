'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { StreakDisplay } from './StreakDisplay';
import { HeartsDisplay } from './HeartsDisplay';
import { GemsDisplay } from './GemsDisplay';
import { ES } from 'country-flag-icons/react/3x2';
import { Plus } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isFlagOpen, setIsFlagOpen] = useState(false);
  const flagTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleFlagMouseEnter = () => {
    if (flagTimeoutRef.current) clearTimeout(flagTimeoutRef.current);
    setIsFlagOpen(true);
  };

  const handleFlagMouseLeave = () => {
    flagTimeoutRef.current = setTimeout(() => {
      setIsFlagOpen(false);
    }, 150);
  };

  const hearts = user?.hearts ?? 5;
  const gems = user?.gems ?? 500;
  const streak = user?.streak ?? 0;

  return (
    <>
      <header className="w-full flex items-center py-1 text-white">
        {/* User Stats Counters - occupies 100% full width of right sidebar */}
        <div className="w-full flex items-center justify-between px-1">
          {/* Flag with Hover Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleFlagMouseEnter}
            onMouseLeave={handleFlagMouseLeave}
          >
            <button
              onClick={() => router.push('/courses')}
              className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-[#202f36] transition border border-transparent"
            >
              <ES className="w-7 h-5 rounded-xs shadow-xs object-cover" />
            </button>

            {isFlagOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-[#18262d] border-2 border-[#2b3840] rounded-2xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 before:absolute before:-top-4 before:left-0 before:right-0 before:h-5">
                {/* Arrow indicator */}
                <div className="absolute -top-2 left-5 w-3 h-3 bg-[#18262d] border-t-2 border-l-2 border-[#2b3840] rotate-45" />


                {/* Header */}
                <div className="text-[10px] font-black text-[#52656d] uppercase tracking-wider px-3 pt-1 pb-2 text-left">
                  MY COURSES
                </div>

                {/* Current Enrolled Course */}
                <div
                  onClick={() => {
                    setIsFlagOpen(false);
                    router.push('/learn');
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#202f36] hover:bg-[#283b44] cursor-pointer transition border border-[#2b3840]"
                >
                  <div className="w-8 h-6 rounded-xs overflow-hidden shrink-0 shadow-xs">
                    <ES className="w-full h-full object-cover" />
                  </div>
                  <span className="font-extrabold text-sm text-[#1cb0f6]">Spanish</span>
                </div>

                {/* Divider */}
                <div className="border-t border-[#2b3840] my-2.5" />

                {/* Add a new course */}
                <button
                  onClick={() => {
                    setIsFlagOpen(false);
                    router.push('/courses');
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#202f36] cursor-pointer transition group text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#202f36] border-2 border-[#2b3840] flex items-center justify-center text-[#778e9a] group-hover:text-white group-hover:border-[#37464f] shrink-0 transition">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="font-extrabold text-sm text-[#778e9a] group-hover:text-white transition">
                    Add a new course
                  </span>
                </button>
              </div>
            )}
          </div>

          <StreakDisplay streak={streak} />
          <GemsDisplay gems={gems} />
          <HeartsDisplay hearts={hearts} />
        </div>
      </header>
    </>
  );
};

