'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { Zap } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';

interface Props {
  entries: LeaderboardEntry[];
}

const MEDAL: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const RANK_COLORS: Record<number, string> = {
  1: 'border-[#ffc800] bg-[#ffc800]/10',
  2: 'border-[#94a3b8] bg-[#94a3b8]/10',
  3: 'border-[#cd7c3c] bg-[#cd7c3c]/10',
};

export const Leaderboard: React.FC<Props> = ({ entries }) => {
  const user = useAuthStore((s) => s.user);
  const currentUsername = user?.username;

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => {
        const isCurrentUser =
          entry.isCurrentUser || entry.username === currentUsername;
        const medal = MEDAL[entry.rank];
        const rankColor = RANK_COLORS[entry.rank];

        return (
          <div
            key={entry.id}
            className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
              isCurrentUser
                ? 'bg-[#58cc02]/10 border-[#58cc02]'
                : rankColor
                ? `${rankColor}`
                : 'bg-[#202f36] border-[#2b3840]'
            }`}
          >
            {/* Rank */}
            <div className="w-8 text-center shrink-0">
              {medal ? (
                <span className="text-xl">{medal}</span>
              ) : (
                <span className="text-sm font-extrabold text-[#778e9a]">
                  #{entry.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-base shrink-0 border-2 ${
                isCurrentUser
                  ? 'bg-[#58cc02] border-[#46a302] text-white'
                  : 'bg-[#131f24] border-[#2b3840] text-[#778e9a]'
              }`}
            >
              {entry.username.charAt(0).toUpperCase()}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-extrabold truncate ${
                  isCurrentUser ? 'text-[#58cc02]' : 'text-white'
                }`}
              >
                {entry.username}
                {isCurrentUser && (
                  <span className="ml-2 text-[10px] font-black text-[#58cc02] uppercase tracking-widest">
                    YOU
                  </span>
                )}
              </p>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1 shrink-0">
              <Zap className="w-4 h-4 fill-[#ffc800] text-[#ffc800]" />
              <span className="text-sm font-extrabold text-[#ffc800]">
                {entry.xp.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
