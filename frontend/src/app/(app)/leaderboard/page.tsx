'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from '@/lib/api/leaderboard/api';
import { LeaderboardTimeframe } from '@/types/leaderboard';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { Loader2, Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('weekly');

  const { data: entries, isLoading, error } = useQuery({
    queryKey: ['leaderboard', timeframe],
    queryFn: () => leaderboardApi.getLeaderboard(timeframe),
    staleTime: 1000 * 30,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#ffc800] rounded-2xl flex items-center justify-center shadow-lg">
          <Trophy className="w-5 h-5 fill-white text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">Leaderboard</h1>
          <p className="text-xs font-bold text-[#778e9a]">Top learners this week</p>
        </div>
      </div>

      {/* Timeframe toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-[#202f36] rounded-2xl border-2 border-[#2b3840]">
        {(['weekly', 'all_time'] as LeaderboardTimeframe[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 ${
              timeframe === tf
                ? 'bg-[#ffc800] text-[#131f24] shadow-md'
                : 'text-[#778e9a] hover:text-white'
            }`}
          >
            {tf === 'weekly' ? 'This Week' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#ffc800] animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="text-center py-8 text-[#778e9a] font-bold text-sm">
          Unable to load leaderboard. Try again later.
        </div>
      )}

      {/* Leaderboard */}
      {!isLoading && entries && (
        entries.length > 0 ? (
          <Leaderboard entries={entries} />
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-[#2b3840] mx-auto mb-4" />
            <p className="text-[#778e9a] font-bold">No rankings yet for this period.</p>
            <p className="text-[#52656d] font-bold text-sm mt-1">Complete lessons to appear here!</p>
          </div>
        )
      )}
    </div>
  );
}
