'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { LeaderboardUser } from './LeaderboardUser';
import { Trophy, ShieldCheck } from 'lucide-react';

interface Props {
  entries: LeaderboardEntry[];
  leagueName?: string;
}

export const Leaderboard: React.FC<Props> = ({
  entries,
  leagueName = 'Gold League',
}) => {
  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4">
      <div className="bg-gradient-to-b from-amber-400 to-amber-500 rounded-3xl p-6 text-white text-center shadow-lg mb-8 border-b-8 border-amber-600">
        <div className="w-16 h-16 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-2">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold">{leagueName}</h1>
        <p className="text-xs font-bold opacity-90 mt-1">
          Top 3 advance to Sapphire League!
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <LeaderboardUser key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};
