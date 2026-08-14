'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Trophy, Zap, Gift } from 'lucide-react';
import { useLearningPath } from '@/hooks/use-learning-path';
import { useQuery } from '@tanstack/react-query';
import { learningApi } from '@/lib/api/learning/api';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/Button';

// Character avatars for each section
const SECTION_MASCOTS = [
  {
    image: '/duo/duo_waving.svg',
    fallback: '/duo/3aeb9f981f17977278cf.svg',
  },
  {
    image: '/duo/duo_thinking.svg',
    fallback: '/duo/885521149d32d1cf32c3.svg',
  },
  {
    image: '/duo/duo_determined.svg',
    fallback: '/duo/2c82efcd38d61a9bd45e.svg',
  },
  {
    image: '/duo/duo_happy.svg',
    fallback: '/duo/215f9f8714df8f7de63c.svg',
  },
  {
    image: '/duo/duo_sparkle.svg',
    fallback: '/duo/ad9ec13f2b161e008ab1.svg',
  },
];

export default function SectionsPage() {
  const router = useRouter();
  const { data: pathData, isLoading, error } = useLearningPath();

  const { data: dailyActivity } = useQuery({
    queryKey: ['dailyActivity'],
    queryFn: learningApi.getDailyActivity,
    staleTime: 1000 * 5,
  });

  const rawActivity = dailyActivity as any;
  const xp = rawActivity?.xp_today ?? rawActivity?.xp_gained ?? 0;
  const goal = rawActivity?.daily_goal ?? rawActivity?.xp_goal ?? 10;
  const questPct = Math.min((xp / goal) * 100, 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#778e9a] font-bold text-sm">Loading sections...</p>
        </div>
      </div>
    );
  }

  if (error || !pathData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="w-24 h-24">
          <Image
            src="/duo/duo_sad.svg"
            alt="Error"
            width={96}
            height={96}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-white mb-2">Could not load sections</h2>
          <Button variant="primary" onClick={() => router.push('/learn')}>
            BACK TO LEARN
          </Button>
        </div>
      </div>
    );
  }

  const { sections } = pathData;

  // Identify active section (first section with incomplete unlocked units)
  let activeSectionIndex = 0;
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const isUnlocked = s.units.some((u) => u.is_unlocked) || i === 0;
    const isCompleted = s.units.every((u) => u.is_completed);
    if (isUnlocked && !isCompleted) {
      activeSectionIndex = i;
      break;
    }
  }

  return (
    <div className="w-full max-w-[1056px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-10 lg:gap-12 py-2 px-2 sm:px-4 text-white font-sans selection:bg-[#58cc02]">
      {/* ── LEFT: Sections List ────────────────────────────────────────── */}
      <div className="flex flex-col w-full max-w-[592px] mx-auto">
        {/* Mobile top stats header */}
        <div className="lg:hidden w-full flex justify-end mb-4">
          <AppHeader />
        </div>

        {/* Back Link */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 text-sm font-extrabold text-[#778e9a] hover:text-white mb-6 uppercase tracking-wider transition cursor-pointer w-fit group"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3] group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </Link>

        {/* Section Cards */}
        <div className="flex flex-col gap-6 w-full">
          {sections.map((section, sIdx) => {
            const totalUnits = section.units.length;
            const completedUnits = section.units.filter((u) => u.is_completed).length;
            const isUnlocked = section.units.some((u) => u.is_unlocked) || sIdx === 0;
            const isCurrent = sIdx === activeSectionIndex;
            const progressPct =
              totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

            const mascot = SECTION_MASCOTS[sIdx % SECTION_MASCOTS.length];
            const mascotSrc = section.character?.image_url || mascot.image;

            return (
              <div
                key={section.id || sIdx}
                className="w-full bg-[#202f36] border-2 border-[#2b3840] rounded-[28px] p-6 sm:p-7 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Left side details */}
                <div className="flex-1 flex flex-col gap-3 w-full">
                  {/* Level & Details */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1cb0f6] uppercase tracking-wider">
                      A1 • SEE DETAILS
                    </span>
                  </div>

                  {/* Section Title */}
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Section {sIdx + 1}
                  </h2>

                  {/* Progress bar or Locked Units status */}
                  {isUnlocked ? (
                    <div className="flex items-center gap-3 w-full max-w-xs mt-1">
                      <div className="flex-1 h-3.5 bg-[#131f24] rounded-full overflow-hidden border border-[#2b3840] relative">
                        <div
                          className="h-full bg-[#58cc02] rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-[#778e9a] shrink-0 min-w-[32px]">
                        {progressPct}%
                      </span>
                      <Trophy
                        className={`w-5 h-5 shrink-0 ${
                          progressPct === 100
                            ? 'text-[#ffc800] fill-[#ffc800]'
                            : 'text-[#52656d]'
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-black text-[#778e9a] uppercase tracking-widest mt-1">
                      <Lock className="w-4 h-4 text-[#778e9a]" />
                      <span>{totalUnits} UNITS</span>
                    </div>
                  )}

                  {/* Action button */}
                  <div className="mt-3 w-full sm:w-auto">
                    {isCurrent ? (
                      <Button
                        variant="secondary"
                        onClick={() => router.push('/learn')}
                        className="bg-[#1cb0f6] hover:bg-[#1899d6] border-[#1899d6] text-white shadow-[0_4px_0_0_#1479ab] px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider"
                      >
                        CONTINUE
                      </Button>
                    ) : isUnlocked ? (
                      <Button
                        variant="primary"
                        onClick={() => router.push('/learn')}
                        className="bg-[#58cc02] hover:bg-[#46a302] border-[#46a302] text-white shadow-[0_4px_0_0_#388401] px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider"
                      >
                        CONTINUE
                      </Button>
                    ) : (
                      <button
                        onClick={() => router.push('/learn')}
                        className="w-full sm:w-auto px-6 py-3 bg-[#2b3840] hover:bg-[#34424b] text-[#778e9a] hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-[0_4px_0_0_#192226] active:translate-y-[2px] transition-all cursor-pointer"
                      >
                        JUMP TO SECTION {sIdx + 1}
                      </button>
                    )}
                  </div>
                </div>

                {/* Right side mascot + speech bubble */}
                <div className="flex flex-col items-center justify-center shrink-0 relative min-w-[200px]">
                  {/* Speech Bubble */}
                  <div className="relative bg-[#131f24] border-2 border-[#2b3840] rounded-2xl px-4 py-3 shadow-md mb-2 max-w-[210px] text-center">
                    {/* Speech bubble pointer */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#131f24] border-r-2 border-b-2 border-[#2b3840] rotate-45" />

                    {/* Transliteration above */}
                    {section.transliteration && (
                      <p className="text-[10px] font-bold text-[#778e9a] tracking-wider mb-0.5 truncate">
                        {section.transliteration}
                      </p>
                    )}

                    {/* Target language text */}
                    <p className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                      {section.target_language || section.title}
                    </p>
                  </div>

                  {/* Mascot image */}
                  <div className="w-24 h-24 relative mt-1">
                    <Image
                      src={mascotSrc}
                      alt="Section Mascot"
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = mascot.fallback;
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT SIDEBAR: Widgets ───────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-6 w-[310px] shrink-0">
        {/* Top User Stats Bar */}
        <AppHeader />

        {/* Super Duolingo Widget */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 max-w-[200px]">
              <span className="text-xs font-black uppercase text-[#a855f7] tracking-widest">
                SUPER
              </span>
              <h3 className="text-base font-extrabold text-white">Try Super for free</h3>
              <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
                No ads, personalized practice, and unlimited Legendary!
              </p>
            </div>
            <div className="w-20 h-20 relative shrink-0">
              <Image
                src="/duo/ad9ec13f2b161e008ab1.svg"
                alt="Super Duo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <Button
            variant="secondary"
            fullWidth
            className="bg-[#5865f2] hover:bg-[#4752c4] shadow-[0_4px_0_0_#3b429f]"
          >
            TRY 1 WEEK FREE
          </Button>
        </div>

        {/* Unlock Leaderboards Widget */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-white">Unlock Leaderboards!</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#131f24] border border-[#2b3840] rounded-2xl flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#52656d]" />
            </div>
            <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
              Complete 3 more lessons to start competing
            </p>
          </div>
        </div>

        {/* Daily Quest Widget */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Daily Quests</h3>
            <span className="text-xs font-extrabold text-[#1cb0f6] uppercase tracking-wider cursor-pointer hover:underline">
              VIEW ALL
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffc800] rounded-xl flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-xs font-extrabold text-white">Earn {goal} XP</span>
              <div className="w-full h-3 bg-[#131f24] rounded-full overflow-hidden relative border border-[#2b3840]">
                <div
                  className="h-full bg-[#ffc800] transition-all duration-500 rounded-full"
                  style={{ width: `${questPct}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-gray-400">
                  {xp} / {goal}
                </span>
              </div>
            </div>
            {questPct >= 100 && (
              <Gift className="w-6 h-6 text-[#ff9600] shrink-0 animate-bounce" />
            )}
          </div>
        </div>

        {/* Ad-blocker widget */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-4 items-center text-center">
          <div className="w-20 h-20 relative">
            <Image
              src="/duo/266788168c5f135b35e3.svg"
              alt="Ad blocker Duo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-base font-extrabold text-white">Using an ad blocker?</h3>
          <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
            Support education with Super Duolingo and we&apos;ll remove ads for you
          </p>
          <button className="w-full py-3.5 bg-white hover:bg-gray-100 text-[#131f24] font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#e5e5e5] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer">
            TRY SUPER FOR FREE
          </button>
        </div>
      </div>
    </div>
  );
}
