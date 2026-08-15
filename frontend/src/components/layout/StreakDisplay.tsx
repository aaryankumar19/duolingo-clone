'use client';

import React, { useState } from 'react';
import { Flame, Check, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Props {
  streak: number;
}

export const StreakDisplay: React.FC<Props> = ({ streak }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Determine active days in the weekly bar based on current day & streak count
  const isDayCompleted = (index: number) => {
    if (streak <= 0) return false;
    if (index === todayIndex) return true;
    const diff = (todayIndex - index + 7) % 7;
    return diff < streak && diff > 0;
  };

  return (
    <>
      <div
        className="relative inline-block text-left"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Streak Button Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className={`flex items-center gap-2 font-extrabold text-base sm:text-lg text-[#FF9600] px-3 py-1.5 rounded-xl transition border cursor-pointer select-none ${
            isOpen
              ? 'bg-[#202f36] border-[#2b3840] shadow-md'
              : 'border-transparent hover:bg-[#202f36]/60'
          }`}
        >
          <Flame className="w-6 h-6 fill-[#FF9600] text-[#FF9600]" />
          <span>{streak}</span>
        </button>

        {/* Popover Card UI */}
        {isOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-[340px] sm:w-[360px] bg-[#131f24] border-2 border-[#2b3840] rounded-3xl p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3 text-left before:absolute before:-top-3 before:left-0 before:right-0 before:h-4">
            {/* Top Pointer Arrow Centered */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#bd7b18] border-t border-l border-[#2b3840] rotate-45 z-20" />

            {/* SECTION 1: Golden Amber Streak Header Card */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#bd7b18] via-[#c67d13] to-[#ab6c12] p-4 text-white overflow-hidden shadow-inner">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-black text-2xl text-white tracking-tight leading-tight">
                    {streak} day streak
                  </h3>
                  <p className="text-[#fef3c7] font-bold text-xs leading-snug mt-1 max-w-[210px]">
                    {streak > 0
                      ? "You've earned your longest streak ever!"
                      : 'Complete a lesson today to start your streak!'}
                  </p>
                </div>

                {/* Big Flame Badge Graphic */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d97706]/40 border-4 border-[#f59e0b]/40 flex items-center justify-center shrink-0 shadow-inner">
                  <Flame className="w-8 h-8 sm:w-9 sm:h-9 text-[#ffc800] fill-[#ff9600] drop-shadow-md" />
                </div>
              </div>

              {/* 7-Day Calendar Bar */}
              <div className="bg-[#131f24] rounded-2xl p-3 border border-[#2b3840]/60 mt-3.5">
                {/* Days Headers */}
                <div className="grid grid-cols-7 gap-1 text-center font-black text-xs text-[#52656d] mb-2">
                  {daysOfWeek.map((day, idx) => (
                    <span
                      key={idx}
                      className={idx === todayIndex ? 'text-white font-extrabold' : ''}
                    >
                      {day}
                    </span>
                  ))}
                </div>

                {/* Days Circles */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysOfWeek.map((_, idx) => {
                    const completed = isDayCompleted(idx);
                    return (
                      <div key={idx} className="flex justify-center items-center">
                        {completed ? (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ffc800] text-[#131f24] flex items-center justify-center shadow-sm font-black">
                            <Check className="w-4 h-4 text-[#131f24] stroke-[3.5]" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#202f36] border border-[#2b3840]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 2: Friend Streaks Card */}
            <div className="relative rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#fb923c] p-4 text-white overflow-hidden shadow-md border border-orange-500/20 flex items-center gap-3">
              {/* Mascot Duo & Flame SVG Illustration */}
              <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 100" fill="none">
                  {/* Duo Body */}
                  <path d="M22 68 C22 42 34 28 50 28 C66 28 78 42 78 68 C78 82 66 88 50 88 C34 88 22 82 22 68 Z" fill="#58cc02"/>
                  <path d="M32 63 C32 48 40 38 50 38 C60 38 68 48 68 63 C68 76 60 81 50 81 C40 81 32 76 32 63 Z" fill="#89e219"/>
                  {/* Duo Eyes */}
                  <circle cx="41" cy="46" r="8" fill="white"/>
                  <circle cx="59" cy="46" r="8" fill="white"/>
                  <circle cx="43" cy="46" r="3.5" fill="#3c3c3c"/>
                  <circle cx="57" cy="46" r="3.5" fill="#3c3c3c"/>
                  {/* Duo Beak */}
                  <polygon points="50,50 45,56 55,56" fill="#ff9600"/>

                  {/* Flame character */}
                  <path d="M72 40 C76 26 86 22 86 12 C93 24 95 34 95 46 C95 58 87 64 77 64 C80 52 72 40 72 40 Z" fill="#ff9600"/>
                  <path d="M78 45 C81 36 88 32 88 24 C92 31 93 38 93 47 C93 54 88 58 81 58 Z" fill="#ffc800"/>
                  <circle cx="82" cy="46" r="2" fill="#3c3c3c"/>
                  <circle cx="89" cy="46" r="2" fill="#3c3c3c"/>
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-black text-base text-white tracking-wide mb-0.5">
                  Friend Streaks
                </h4>
                <p className="text-white/95 font-bold text-xs mb-2.5">
                  0 active Friend Streaks
                </p>
                <button
                  type="button"
                  onClick={() => setIsFriendModalOpen(true)}
                  className="w-full bg-white hover:bg-orange-50 active:bg-gray-100 text-[#ea580c] font-black py-2 px-3 rounded-xl text-xs tracking-wider uppercase shadow-md active:translate-y-0.5 transition border-b-2 border-orange-200 cursor-pointer text-center"
                >
                  VIEW LIST
                </button>
              </div>
            </div>

            {/* SECTION 3: Streak Society Card */}
            <div className="rounded-2xl bg-[#18262d] border-2 border-[#2b3840] p-4 flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#202f36] border border-[#2b3840] flex items-center justify-center shrink-0 text-[#52656d]">
                <Lock className="w-5 h-5 text-[#52656d] stroke-[2.5]" />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-white tracking-wide">
                  Streak Society
                </h4>
                <p className="text-[#8496a0] font-bold text-xs leading-relaxed mt-0.5">
                  Reach a 7 day streak to join the Streak Society and earn exclusive rewards.
                </p>
              </div>
            </div>

            {/* SECTION 4: Bottom Action Button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push('/profile');
              }}
              className="w-full bg-[#1cb0f6] hover:bg-[#189bdc] active:bg-[#1482b8] text-white font-black py-3 rounded-xl border-b-4 border-[#1482b8] active:border-b-0 uppercase tracking-wider text-sm shadow-md cursor-pointer transition flex items-center justify-center gap-2"
            >
              VIEW MORE
            </button>
          </div>
        )}
      </div>

      {/* Friend Streaks Modal */}
      <Modal
        isOpen={isFriendModalOpen}
        onClose={() => setIsFriendModalOpen(false)}
        title="Friend Streaks"
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-[#ff9600]">
            <Flame className="w-12 h-12 fill-[#ff9600]" />
          </div>

          <h3 className="text-xl font-black text-white">No active Friend Streaks</h3>

          <p className="text-sm font-bold text-[#8496a0] leading-relaxed max-w-sm">
            Practice together every day to build a streak with your friends! Connect with friends on Duolingo to start a Friend Streak.
          </p>

          <div className="flex flex-col gap-2.5 w-full pt-2">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setIsFriendModalOpen(false);
                router.push('/profile');
              }}
            >
              FIND FRIENDS
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setIsFriendModalOpen(false)}
            >
              CLOSE
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

