'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookOpen, Star, Lock, Trophy, Zap, Gift, FastForward } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';
import { Button } from '@/components/ui/Button';

export default function LearnPage() {
  const { user } = useAuthStore();

  // Active popover node ID: 'node-1' (defaults to active), 'node-2', 'node-3', 'node-4', 'node-5', 'node-6', or null
  const [activeNodeId, setActiveNodeId] = useState<string | null>('node-1');

  const toggleNode = (nodeId: string) => {
    setActiveNodeId((current) => (current === nodeId ? null : nodeId));
  };

  return (
    <div
      onClick={() => setActiveNodeId(null)}
      className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 py-4 px-2 sm:px-4 text-white font-sans selection:bg-[#58cc02] relative"
    >
      {/* LEFT / CENTER COLUMN: Skill Path Tree */}
      <div className="flex flex-col items-center w-full max-w-xl mx-auto">
        {/* Top Green Unit Header Banner */}
        <div className="w-full bg-[#58cc02] text-white p-5 rounded-3xl shadow-lg mb-10 flex items-center justify-between border-b-6 border-[#46a302]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase opacity-90">
              <ArrowLeft className="w-4 h-4 cursor-pointer hover:opacity-75" />
              <span>Section 1, Unit 1</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
              Order food and drinks
            </h1>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border-2 border-white/40 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shrink-0">
            <BookOpen className="w-4 h-4" />
            <span>Guidebook</span>
          </button>
        </div>

        {/* Snake Skill Path Nodes */}
        <div className="w-full flex flex-col items-center relative space-y-12 my-4">
          {/* NODE 1: Active START node */}
          <div
            className={`relative flex flex-col items-center ${
              activeNodeId === 'node-1' ? 'z-[60]' : 'z-20'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* START speech-bubble badge matching Image 1 */}
            <div className="relative mb-3 flex flex-col items-center">
              <div className="bg-[#202f36] border-2 border-[#2b3840] text-[#58cc02] text-xs font-black px-4 py-1.5 rounded-2xl uppercase tracking-widest shadow-lg">
                START
              </div>
              <div className="w-3 h-3 bg-[#202f36] border-r-2 border-b-2 border-[#2b3840] rotate-45 -mt-1.5" />
            </div>

            {/* Outer dark ring container */}
            <div className="w-[92px] h-[92px] rounded-full border-4 border-[#2b3840] bg-[#202f36]/40 flex items-center justify-center p-1">
              <button
                onClick={() => toggleNode('node-1')}
                className="w-20 h-20 bg-[#58cc02] hover:bg-[#61e002] border-b-8 border-[#46a302] active:border-b-0 active:translate-y-[4px] rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ring-8 ring-[#58cc02]/20"
              >
                <Star className="w-9 h-9 fill-white" />
              </button>
            </div>

            {/* GREEN ACTIVE POPOVER */}
            {activeNodeId === 'node-1' && (
              <div className="absolute top-36 z-[100] w-72 sm:w-80 bg-[#58cc02] text-white rounded-[22px] p-5 shadow-2xl border-b-6 border-[#46a302] animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#58cc02] rotate-45" />

                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight mb-1 text-left">
                  Order food and drinks
                </h3>
                <p className="text-xs sm:text-sm font-bold text-white/90 mb-4 text-left">
                  Lesson 1 of 4
                </p>

                <Link
                  href="/lesson/1"
                  className="w-full py-3.5 bg-white hover:bg-gray-50 border-b-4 border-[#e5e5e5] text-[#58cc02] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md active:translate-y-[2px] active:border-b-0 transition-all flex items-center justify-center cursor-pointer select-none text-center"
                >
                  START +10 XP
                </Link>
              </div>
            )}
          </div>

          {/* NODE 2: Locked star node */}
          <div
            className={`relative flex flex-col items-center translate-x-[-35px] ${
              activeNodeId === 'node-2' ? 'z-[60]' : 'z-10'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[80px] h-[80px] rounded-full border-4 border-[#2b3840] bg-[#202f36]/40 flex items-center justify-center p-1">
              <button
                onClick={() => toggleNode('node-2')}
                className="w-16 h-16 bg-[#202f36] hover:bg-[#283b44] border-b-6 border-[#2b3840] rounded-full flex items-center justify-center text-[#52656d] transition-all cursor-pointer"
              >
                <Star className="w-7 h-7 fill-[#37464f]" />
              </button>
            </div>

            {/* DARK LOCKED POPOVER FOR NODE 2 */}
            {activeNodeId === 'node-2' && (
              <div className="absolute top-24 z-[100] w-72 sm:w-80 bg-[#202f36] border-2 border-[#2b3840] text-white rounded-[22px] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#202f36] border-t-2 border-l-2 border-[#2b3840] rotate-45" />

                <h3 className="text-base sm:text-lg font-extrabold text-[#778e9a] leading-tight mb-2 text-left">
                  Order food and drinks
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#52656d] mb-4 leading-relaxed text-left">
                  Complete all levels above to unlock this!
                </p>

                <div className="w-full py-3.5 bg-[#2b3840] text-[#52656d] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl text-center opacity-70 cursor-not-allowed select-none">
                  LOCKED
                </div>
              </div>
            )}
          </div>

          {/* NODE 3: Locked Chest / Duo Mascot standing alongside */}
          <div
            className={`relative flex items-center justify-center w-full translate-x-[-20px] ${
              activeNodeId === 'node-3' ? 'z-[60]' : 'z-10'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[80px] h-[80px] rounded-3xl border-4 border-[#2b3840] bg-[#202f36]/40 flex items-center justify-center p-1">
              <button
                onClick={() => toggleNode('node-3')}
                className="w-16 h-16 bg-[#202f36] hover:bg-[#283b44] border-b-6 border-[#2b3840] rounded-2xl flex items-center justify-center text-[#52656d] transition-all cursor-pointer"
              >
                <Gift className="w-7 h-7 fill-[#37464f]" />
              </button>
            </div>

            {/* Duo Mascot standing next to path */}
            <div className="absolute left-[62%] top-[-20px] w-24 h-24 pointer-events-none">
              <Image
                src="/duo/3aeb9f981f17977278cf.svg"
                alt="Duo"
                width={96}
                height={96}
                priority
                className="w-full h-full object-contain"
              />
            </div>

            {/* DARK LOCKED POPOVER FOR NODE 3 */}
            {activeNodeId === 'node-3' && (
              <div className="absolute top-24 z-[100] w-72 sm:w-80 bg-[#202f36] border-2 border-[#2b3840] text-white rounded-[22px] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#202f36] border-t-2 border-l-2 border-[#2b3840] rotate-45" />

                <h3 className="text-base sm:text-lg font-extrabold text-[#778e9a] leading-tight mb-2 text-left">
                  Order food and drinks
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#52656d] mb-4 leading-relaxed text-left">
                  Complete all levels above to unlock this!
                </p>

                <div className="w-full py-3.5 bg-[#2b3840] text-[#52656d] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl text-center opacity-70 cursor-not-allowed select-none">
                  LOCKED
                </div>
              </div>
            )}
          </div>

          {/* NODE 4: Locked star node */}
          <div
            className={`relative flex flex-col items-center translate-x-[-35px] ${
              activeNodeId === 'node-4' ? 'z-[60]' : 'z-10'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[80px] h-[80px] rounded-full border-4 border-[#2b3840] bg-[#202f36]/40 flex items-center justify-center p-1">
              <button
                onClick={() => toggleNode('node-4')}
                className="w-16 h-16 bg-[#202f36] hover:bg-[#283b44] border-b-6 border-[#2b3840] rounded-full flex items-center justify-center text-[#52656d] transition-all cursor-pointer"
              >
                <Star className="w-7 h-7 fill-[#37464f]" />
              </button>
            </div>

            {/* DARK LOCKED POPOVER FOR NODE 4 */}
            {activeNodeId === 'node-4' && (
              <div className="absolute top-24 z-[100] w-72 sm:w-80 bg-[#202f36] border-2 border-[#2b3840] text-white rounded-[22px] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#202f36] border-t-2 border-l-2 border-[#2b3840] rotate-45" />

                <h3 className="text-base sm:text-lg font-extrabold text-[#778e9a] leading-tight mb-2 text-left">
                  Order food and drinks
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#52656d] mb-4 leading-relaxed text-left">
                  Complete all levels above to unlock this!
                </p>

                <div className="w-full py-3.5 bg-[#2b3840] text-[#52656d] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl text-center opacity-70 cursor-not-allowed select-none">
                  LOCKED
                </div>
              </div>
            )}
          </div>

          {/* NODE 5: Locked trophy node */}
          <div
            className={`relative flex flex-col items-center ${
              activeNodeId === 'node-5' ? 'z-[60]' : 'z-10'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[80px] h-[80px] rounded-full border-4 border-[#2b3840] bg-[#202f36]/40 flex items-center justify-center p-1">
              <button
                onClick={() => toggleNode('node-5')}
                className="w-16 h-16 bg-[#202f36] hover:bg-[#283b44] border-b-6 border-[#2b3840] rounded-full flex items-center justify-center text-[#52656d] transition-all cursor-pointer"
              >
                <Trophy className="w-7 h-7 fill-[#37464f]" />
              </button>
            </div>

            {/* DARK LOCKED POPOVER FOR NODE 5 */}
            {activeNodeId === 'node-5' && (
              <div className="absolute top-24 z-[100] w-72 sm:w-80 bg-[#202f36] border-2 border-[#2b3840] text-white rounded-[22px] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#202f36] border-t-2 border-l-2 border-[#2b3840] rotate-45" />

                <h3 className="text-base sm:text-lg font-extrabold text-[#778e9a] leading-tight mb-2 text-left">
                  Order food and drinks
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#52656d] mb-4 leading-relaxed text-left">
                  Complete all levels above to unlock this!
                </p>

                <div className="w-full py-3.5 bg-[#2b3840] text-[#52656d] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl text-center opacity-70 cursor-not-allowed select-none">
                  LOCKED
                </div>
              </div>
            )}
          </div>

          {/* Section Divider: Describe people */}
          <div className="w-full flex items-center gap-4 my-8 max-w-md">
            <div className="flex-1 border-t-2 border-[#2b3840]" />
            <span className="text-xs font-extrabold text-[#52656d] uppercase tracking-widest text-center">
              Describe people
            </span>
            <div className="flex-1 border-t-2 border-[#2b3840]" />
          </div>

          {/* NODE 6: Purple Jump Here node */}
          <div
            className={`relative flex flex-col items-center ${
              activeNodeId === 'node-6' ? 'z-[60]' : 'z-10'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-10 bg-[#202f36] border-2 border-[#a855f7] text-[#a855f7] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              JUMP HERE?
            </div>
            <button
              onClick={() => toggleNode('node-6')}
              className="w-16 h-16 bg-[#a855f7] hover:bg-[#b875f8] border-b-6 border-[#7e22ce] rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg active:translate-y-[2px] transition-all"
            >
              <FastForward className="w-7 h-7 fill-white" />
            </button>

            {/* DARK LOCKED POPOVER FOR NODE 6 */}
            {activeNodeId === 'node-6' && (
              <div className="absolute top-20 z-[100] w-72 sm:w-80 bg-[#202f36] border-2 border-[#2b3840] text-white rounded-[22px] p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#202f36] border-t-2 border-l-2 border-[#2b3840] rotate-45" />

                <h3 className="text-base sm:text-lg font-extrabold text-[#778e9a] leading-tight mb-2 text-left">
                  Order food and drinks
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#52656d] mb-4 leading-relaxed text-left">
                  Complete all levels above to unlock this!
                </p>

                <div className="w-full py-3.5 bg-[#2b3840] text-[#52656d] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl text-center opacity-70 cursor-not-allowed select-none">
                  LOCKED
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR COLUMN: Widgets & Super Duolingo */}
      <div className="hidden lg:flex flex-col gap-5 w-full">
        {/* Widget 1: Try Super for free */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 max-w-[200px]">
              <span className="text-xs font-black uppercase text-[#a855f7] tracking-widest">
                SUPER
              </span>
              <h3 className="text-base font-extrabold text-white">
                Try Super for free
              </h3>
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

          <Button variant="secondary" fullWidth className="bg-[#5865f2] hover:bg-[#4752c4] shadow-[0_4px_0_0_#3b429f]">
            TRY 1 WEEK FREE
          </Button>
        </div>

        {/* Widget 2: Unlock Leaderboards */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-3">
          <h3 className="text-sm font-extrabold text-white">
            Unlock Leaderboards!
          </h3>
          <div className="flex items-center gap-4 bg-[#131f24] p-3 rounded-2xl border border-[#2b3840]">
            <div className="w-12 h-12 bg-[#202f36] rounded-xl flex items-center justify-center text-[#52656d] shrink-0 border border-[#2b3840]">
              <Lock className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
              Complete 3 more lessons to start competing
            </p>
          </div>
        </div>

        {/* Widget 3: Daily Quests */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">
              Daily Quests
            </h3>
            <span className="text-[11px] font-extrabold text-[#1cb0f6] uppercase tracking-wider cursor-pointer hover:underline">
              VIEW ALL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ffc800] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-xs font-extrabold text-white">
                Earn 10 XP
              </span>
              <div className="w-full h-3 bg-[#131f24] rounded-full overflow-hidden relative border border-[#2b3840]">
                <div className="h-full bg-[#ffc800] w-0 transition-all duration-300" />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-gray-400">
                  0 / 10
                </span>
              </div>
            </div>
            <Gift className="w-6 h-6 text-[#ff9600] shrink-0" />
          </div>
        </div>

        {/* Widget 4: Using an ad blocker? */}
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
          <h3 className="text-base font-extrabold text-white">
            Using an ad blocker?
          </h3>
          <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
            Support education with Super Duolingo and we'll remove ads for you
          </p>
          <button className="w-full py-3.5 bg-white hover:bg-gray-100 text-[#131f24] font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#e5e5e5] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer">
            TRY SUPER FOR FREE
          </button>
        </div>
      </div>
    </div>
  );
}
