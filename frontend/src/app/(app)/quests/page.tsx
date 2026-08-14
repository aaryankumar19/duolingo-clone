'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { useQuery } from '@tanstack/react-query';
import { learningApi } from '@/lib/api/learning/api';
import { Zap, Lock, Clock, Gift } from 'lucide-react';

export default function QuestsPage() {
  const router = useRouter();

  const { data: activityData } = useQuery({
    queryKey: ['dailyActivity'],
    queryFn: learningApi.getDailyActivity,
    staleTime: 1000 * 5,
  });

  const raw = activityData as any;
  const xpToday = raw?.xp_today ?? raw?.xp_gained ?? 10;
  const goalXP = raw?.daily_goal ?? raw?.xp_goal ?? 10;
  const isCompleted = xpToday >= goalXP;

  return (
    <div className="w-full max-w-[1056px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 py-4 text-white font-sans">
      {/* ── Left Column ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-[#8b5cf6] rounded-3xl p-6 sm:p-8 flex items-center justify-between relative overflow-hidden shadow-xl">
          <div className="flex flex-col gap-2 max-w-xs z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome!</h1>
            <p className="text-sm font-bold text-white/90 leading-relaxed">
              Complete quests to earn rewards! Quests refresh every day.
            </p>
          </div>
          <div className="w-32 h-32 relative shrink-0 z-10">
            <Image
              src="/duo/ad9ec13f2b161e008ab1.svg"
              alt="Duo with Chest"
              width={128}
              height={128}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Daily Quests Header */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-xl font-extrabold text-white">Daily Quests</h2>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#ff9600] uppercase tracking-wider bg-[#202f36] border border-[#2b3840] px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span>14 HOURS</span>
          </div>
        </div>

        {/* Active Quest Card */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#ffc800] rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-6 h-6 fill-white text-white" />
            </div>
            <span className="text-base font-extrabold text-white">Earn {goalXP} XP</span>
          </div>

          {/* Progress Bar with Chest */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-6 bg-[#131f24] rounded-full overflow-hidden relative border-2 border-[#2b3840]">
              <div
                className="h-full bg-[#ffc800] transition-all duration-500 rounded-full flex items-center justify-center"
                style={{ width: `${Math.min((xpToday / goalXP) * 100, 100)}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow-md">
                {xpToday} / {goalXP}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
              isCompleted ? 'bg-[#ffc800] border-[#d99b00] animate-bounce' : 'bg-[#202f36] border-[#2b3840]'
            }`}>
              <Gift className={`w-5 h-5 ${isCompleted ? 'text-white fill-white' : 'text-[#52656d]'}`} />
            </div>
          </div>
        </div>

        {/* Locked Quest Card */}
        <div className="bg-[#1a2830] border-2 border-[#202f36] rounded-3xl p-6 flex items-center gap-4 opacity-70">
          <div className="w-10 h-10 bg-[#131f24] border-2 border-[#2b3840] rounded-2xl flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[#52656d]" />
          </div>
          <span className="text-sm font-extrabold text-[#778e9a]">
            More quests unlock soon
          </span>
        </div>
      </div>

      {/* ── Right Column ────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-6 w-[310px] shrink-0">
        <AppHeader />

        {/* Monthly Challenges Card */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-6 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 max-w-[180px]">
              <h3 className="text-base font-extrabold text-white leading-tight">
                Monthly challenges unlock soon!
              </h3>
              <p className="text-xs font-bold text-[#778e9a] leading-relaxed mt-1">
                Complete each month&apos;s challenge to earn exclusive badges
              </p>
            </div>
            <div className="w-16 h-16 bg-[#ffc800] rounded-full flex items-center justify-center shrink-0 border-4 border-[#d99b00] shadow-md">
              <Zap className="w-8 h-8 fill-white text-white" />
            </div>
          </div>

          <button
            onClick={() => router.push('/learn')}
            className="w-full py-3.5 bg-[#202f36] hover:bg-[#283b44] border-2 border-[#2b3840] hover:border-[#37464f] font-extrabold text-xs uppercase tracking-wider text-[#1cb0f6] rounded-2xl transition cursor-pointer text-center"
          >
            START A LESSON
          </button>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-1 pt-2">
          {['ABOUT', 'BLOG', 'STORE', 'EFFICACY', 'CAREERS', 'INVESTORS', 'TERMS', 'PRIVACY'].map((link) => (
            <button key={link} className="text-[11px] font-bold text-[#52656d] hover:text-[#778e9a] uppercase tracking-wider cursor-pointer transition">
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
