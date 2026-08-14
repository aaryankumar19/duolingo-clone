'use client';

import React from 'react';
import Image from 'next/image';
import { Zap, Flame, Heart, Gem, BookOpen } from 'lucide-react';
import { UserStats } from '@/lib/api/profile/api';
import { useAuthStore } from '@/store/use-auth-store';

interface Props {
  username: string;
  stats: UserStats;
}

export const ProfileHeader: React.FC<Props> = ({ username, stats }) => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="bg-[#202f36] border-b-2 border-[#2b3840] px-4 pt-8 pb-6">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="w-20 h-20 rounded-full bg-[#131f24] border-4 border-[#2b3840] flex items-center justify-center text-3xl font-extrabold text-[#58cc02] overflow-hidden">
          {user?.avatar_url ? (
            <Image src={user.avatar_url} alt={username} width={80} height={80} className="w-full h-full object-cover" />
          ) : (
            username.charAt(0).toUpperCase()
          )}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-white">{username}</h1>
          <p className="text-sm font-bold text-[#778e9a]">{stats.currentLeague}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#131f24] rounded-2xl p-3 flex flex-col items-center border border-[#2b3840]">
          <div className="flex items-center gap-1 text-[#ff9600] font-extrabold text-xl mb-0.5">
            <Flame className="w-5 h-5 fill-[#ff9600]" />
            <span>{stats.streakDays ?? 0}</span>
          </div>
          <span className="text-[10px] font-bold text-[#52656d] uppercase tracking-wider">Day Streak</span>
        </div>

        <div className="bg-[#131f24] rounded-2xl p-3 flex flex-col items-center border border-[#2b3840]">
          <div className="flex items-center gap-1 text-[#ffc800] font-extrabold text-xl mb-0.5">
            <Zap className="w-5 h-5 fill-[#ffc800]" />
            <span>{(stats.totalXP ?? 0).toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-bold text-[#52656d] uppercase tracking-wider">Total XP</span>
        </div>

        <div className="bg-[#131f24] rounded-2xl p-3 flex flex-col items-center border border-[#2b3840]">
          <div className="flex items-center gap-1 text-[#1cb0f6] font-extrabold text-xl mb-0.5">
            <Gem className="w-5 h-5 fill-[#1cb0f6]" />
            <span>{stats.gems ?? 0}</span>
          </div>
          <span className="text-[10px] font-bold text-[#52656d] uppercase tracking-wider">Gems</span>
        </div>

        <div className="bg-[#131f24] rounded-2xl p-3 flex flex-col items-center border border-[#2b3840]">
          <div className="flex items-center gap-1 text-[#ff4b4b] font-extrabold text-xl mb-0.5">
            <Heart className="w-5 h-5 fill-[#ff4b4b]" />
            <span>{stats.hearts ?? 0}</span>
          </div>
          <span className="text-[10px] font-bold text-[#52656d] uppercase tracking-wider">Hearts</span>
        </div>

        <div className="bg-[#131f24] rounded-2xl p-3 flex flex-col items-center border border-[#2b3840]">
          <div className="flex items-center gap-1 text-[#58cc02] font-extrabold text-xl mb-0.5">
            <BookOpen className="w-5 h-5" />
            <span>{stats.completedSkills ?? 0}</span>
          </div>
          <span className="text-[10px] font-bold text-[#52656d] uppercase tracking-wider">Skills</span>
        </div>

        <div className="bg-[#131f24] rounded-2xl p-3 flex flex-col items-center border border-[#2b3840]">
          <div className="flex items-center gap-1 text-[#a855f7] font-extrabold text-xl mb-0.5">
            🏆 <span>{stats.top3Finishes ?? 0}</span>
          </div>
          <span className="text-[10px] font-bold text-[#52656d] uppercase tracking-wider">Top 3</span>
        </div>
      </div>
    </div>
  );
};
