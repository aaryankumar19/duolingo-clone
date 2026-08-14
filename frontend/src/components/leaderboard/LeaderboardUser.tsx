'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { cn } from '@/lib/utils';
import { Shield, Zap } from 'lucide-react';

interface Props {
  entry: LeaderboardEntry;
}

export const LeaderboardUser: React.FC<Props> = ({ entry }) => {
  const getBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-[#FFC800] text-white border-b-4 border-[#E5B200]';
    if (rank === 2) return 'bg-gray-300 text-gray-700 border-b-4 border-gray-400';
    if (rank === 3) return 'bg-amber-600 text-white border-b-4 border-amber-800';
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-150',
        entry.isCurrentUser
          ? 'bg-sky-50 border-[#84d8ff] shadow-sm'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm',
            getBadgeColor(entry.rank)
          )}
        >
          {entry.rank}
        </div>

        <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-extrabold text-lg border-2 border-gray-300">
          {entry.username.charAt(0)}
        </div>

        <div className="flex flex-col">
          <span className="font-extrabold text-base text-gray-800">
            {entry.username}
          </span>
          {entry.isCurrentUser && (
            <span className="text-[10px] font-extrabold text-[#1CB0F6] uppercase tracking-wider">
              YOU
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 font-extrabold text-amber-500">
        <Zap className="w-5 h-5 fill-amber-400" />
        <span>{entry.xp} XP</span>
      </div>
    </div>
  );
};
