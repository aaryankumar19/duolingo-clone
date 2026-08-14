'use client';

import React from 'react';
import { UserStats } from '@/types/profile';
import { Flame, Zap, Trophy, Award } from 'lucide-react';

interface Props {
  username: string;
  avatarUrl?: string;
  joinedDate?: string;
  stats: UserStats;
}

export const ProfileHeader: React.FC<Props> = ({
  username,
  joinedDate = 'Joined August 2026',
  stats,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      {/* Profile info header */}
      <div className="flex items-center gap-6 pb-8 border-b-2 border-gray-200">
        <div className="w-24 h-24 bg-[#58CC02] rounded-full flex items-center justify-center text-white text-4xl font-extrabold shadow-md border-b-4 border-[#46A302]">
          {username.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">{username}</h1>
          <p className="text-sm font-bold text-gray-400 mt-1">{joinedDate}</p>
        </div>
      </div>

      {/* Overview Statistics Grid */}
      <h2 className="text-xl font-extrabold text-gray-800 mt-8 mb-4">Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border-2 border-gray-200 flex items-center gap-4">
          <Flame className="w-8 h-8 text-[#FF9600] fill-[#FF9600]" />
          <div>
            <div className="font-extrabold text-xl text-gray-800">{stats.streakDays}</div>
            <div className="text-xs font-bold text-gray-400">Day streak</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border-2 border-gray-200 flex items-center gap-4">
          <Zap className="w-8 h-8 text-[#FFC800] fill-[#FFC800]" />
          <div>
            <div className="font-extrabold text-xl text-gray-800">{stats.totalXP}</div>
            <div className="text-xs font-bold text-gray-400">Total XP</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border-2 border-gray-200 flex items-center gap-4">
          <Trophy className="w-8 h-8 text-[#1CB0F6] fill-[#1CB0F6]" />
          <div>
            <div className="font-extrabold text-xl text-gray-800">{stats.currentLeague}</div>
            <div className="text-xs font-bold text-gray-400">Current League</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border-2 border-gray-200 flex items-center gap-4">
          <Award className="w-8 h-8 text-[#CE82FF] fill-[#CE82FF]" />
          <div>
            <div className="font-extrabold text-xl text-gray-800">{stats.top3Finishes}</div>
            <div className="text-xs font-bold text-gray-400">Top 3 finishes</div>
          </div>
        </div>
      </div>
    </div>
  );
};
