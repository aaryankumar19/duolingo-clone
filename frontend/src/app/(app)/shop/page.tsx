'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/AppHeader';
import { useAuthStore } from '@/store/use-auth-store';
import { useQuery } from '@tanstack/react-query';
import { learningApi } from '@/lib/api/learning/api';
import { userApi } from '@/lib/api/user/api';
import { Heart, Infinity as InfinityIcon, Snowflake, Lock, Zap, Loader2 } from 'lucide-react';

export default function ShopPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const hearts = user?.hearts ?? 5;
  const gems = user?.gems ?? 500;
  const isHeartsFull = hearts >= 5;

  const [isRefilling, setIsRefilling] = useState(false);
  const [refillMsg, setRefillMsg] = useState<string | null>(null);

  const { data: activityData } = useQuery({
    queryKey: ['dailyActivity'],
    queryFn: learningApi.getDailyActivity,
    staleTime: 1000 * 5,
  });

  const raw = activityData as any;
  const xpToday = raw?.xp_today ?? raw?.xp_gained ?? 10;
  const goalXP = raw?.daily_goal ?? raw?.xp_goal ?? 10;

  const handleRefillHearts = async () => {
    if (isHeartsFull) return;
    if (gems < 100) {
      setRefillMsg('You need at least 100 gems!');
      return;
    }
    setIsRefilling(true);
    setRefillMsg(null);
    try {
      await userApi.refillHearts();
      setRefillMsg('Hearts refilled!');
    } catch (err: any) {
      setRefillMsg(err?.message || 'Failed to refill.');
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <div className="w-full max-w-[1056px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 py-4 text-white font-sans">
      {/* ── Left Column (Main Content) ───────────────────────────────── */}
      <div className="flex flex-col gap-8 w-full max-w-xl mx-auto">

        {/* ── Super Duolingo Banner ─────────────────────────────────── */}
        <div className="bg-gradient-to-r from-[#2c1b4d] via-[#1a237e] to-[#4a148c] border-2 border-[#5c3c92] rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-2xl">
          {/* SUPER Badge */}
          <div className="absolute top-5 right-6 bg-[#a855f7] text-white font-black text-[11px] italic px-3 py-1 rounded-md tracking-wider shadow-md">
            SUPER
          </div>

          <div className="flex items-center gap-6 mb-6">
            {/* Cosmic Super Duo Owl illustration */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 relative shrink-0">
              <Image
                src="/duo/ad9ec13f2b161e008ab1.svg"
                alt="Super Duo"
                width={112}
                height={112}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
            <div className="flex flex-col gap-1 pr-12">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                Start a 1 week free trial to enjoy exclusive Super benefits
              </h1>
            </div>
          </div>

          <button
            onClick={() => router.push('/courses')}
            className="w-full py-4 bg-white hover:bg-gray-100 text-[#1a237e] border-b-4 border-[#c5cae9] active:border-b-0 active:translate-y-[2px] font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all cursor-pointer text-center"
          >
            START MY FREE 7 DAYS
          </button>
        </div>

        {/* ── Hearts Section ────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold text-white">Hearts</h2>
          <div className="border-t border-[#2b3840]" />

          {/* Row 1: Refill Hearts */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ff4b4b]/10 border-2 border-[#ff4b4b]/30 flex items-center justify-center shrink-0">
                <Heart className="w-8 h-8 fill-[#ff4b4b] text-[#ff4b4b]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-extrabold text-white">Refill Hearts</h3>
                <p className="text-xs font-bold text-[#778e9a] max-w-sm leading-relaxed">
                  Get full hearts so you can worry less about making mistakes in a lesson
                </p>
                {refillMsg && (
                  <span className="text-xs font-bold text-[#58cc02] mt-1">{refillMsg}</span>
                )}
              </div>
            </div>

            <button
              onClick={handleRefillHearts}
              disabled={isHeartsFull || isRefilling}
              className={`px-6 py-3 rounded-2xl border-2 font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shrink-0 ${
                isHeartsFull
                  ? 'bg-[#202f36] border-[#2b3840] text-[#52656d] cursor-not-allowed'
                  : 'bg-[#1cb0f6] hover:bg-[#1899d6] border-[#1482b8] text-white border-b-4 active:border-b-0 active:translate-y-[2px]'
              }`}
            >
              {isRefilling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isHeartsFull ? (
                'FULL'
              ) : (
                'REFILL 100 💎'
              )}
            </button>
          </div>

          <div className="border-t border-[#2b3840]" />

          {/* Row 2: Unlimited Hearts */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1cb0f6] to-[#a855f7] flex items-center justify-center shrink-0 shadow-md">
                <InfinityIcon className="w-8 h-8 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-extrabold text-white">Unlimited Hearts</h3>
                <p className="text-xs font-bold text-[#778e9a] max-w-sm leading-relaxed">
                  Never run out of hearts with Super!
                </p>
              </div>
            </div>

            <button className="px-6 py-3 rounded-2xl border-2 border-[#2b3840] bg-[#202f36] hover:bg-[#283b44] text-[#a855f7] font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shrink-0">
              FREE TRIAL
            </button>
          </div>
        </div>

        {/* ── Power-Ups Section ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold text-white">Power-Ups</h2>
          <div className="border-t border-[#2b3840]" />

          {/* Row 1: Streak Freeze */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1cb0f6]/10 border-2 border-[#1cb0f6]/30 flex items-center justify-center shrink-0">
                <Snowflake className="w-8 h-8 text-[#1cb0f6]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">Streak Freeze</h3>
                  <span className="text-[10px] font-black text-[#58cc02] uppercase tracking-wider bg-[#58cc02]/10 border border-[#58cc02]/30 px-2 py-0.5 rounded-md">
                    2 / 2 EQUIPPED
                  </span>
                </div>
                <p className="text-xs font-bold text-[#778e9a] max-w-sm leading-relaxed">
                  Streak Freeze allows your streak to remain in place for one full day of inactivity.
                </p>
              </div>
            </div>

            <button disabled className="px-6 py-3 rounded-2xl border-2 border-[#2b3840] bg-[#202f36] text-[#52656d] font-extrabold text-xs uppercase tracking-wider cursor-not-allowed shrink-0">
              EQUIPPED
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Column (Sidebar) ───────────────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-6 w-[310px] shrink-0">
        <AppHeader />

        {/* Unlock Leaderboards Widget */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-white">Unlock Leaderboards!</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#131f24] border border-[#2b3840] rounded-2xl flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#52656d]" />
            </div>
            <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
              Complete 2 more lessons to start competing
            </p>
          </div>
        </div>

        {/* Daily Quests Widget */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Daily Quests</h3>
            <button
              onClick={() => router.push('/quests')}
              className="text-xs font-extrabold text-[#1cb0f6] hover:underline uppercase tracking-wider cursor-pointer"
            >
              VIEW ALL
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffc800] rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-xs font-extrabold text-white">Earn {goalXP} XP</span>
              <div className="w-full h-3 bg-[#131f24] rounded-full overflow-hidden relative border border-[#2b3840]">
                <div
                  className="h-full bg-[#ffc800] transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min((xpToday / goalXP) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ad Blocker Promotion Box */}
        <div className="bg-gradient-to-b from-[#1a237e] via-[#2c1b4d] to-[#4a148c] border-2 border-[#5c3c92] rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-xl">
          <div className="w-20 h-20 relative">
            <Image
              src="/duo/266788168c5f135b35e3.svg"
              alt="Ad blocker Duo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-lg font-extrabold text-white">Using an ad blocker?</h3>
          <p className="text-xs font-bold text-white/80 leading-relaxed">
            Support education with Super Duolingo and we&apos;ll remove ads for you
          </p>

          <button className="w-full py-3.5 bg-white hover:bg-gray-100 text-[#1a237e] font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer">
            TRY SUPER FOR FREE
          </button>

          <button className="text-xs font-black text-white/90 hover:text-white uppercase tracking-wider cursor-pointer">
            DISABLE AD BLOCKER
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
