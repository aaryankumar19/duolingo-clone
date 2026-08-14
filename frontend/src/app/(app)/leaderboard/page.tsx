'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from '@/lib/api/leaderboard/api';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';

export default function LeaderboardPage() {
  const { data: entries, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardApi.getLeaderboard(),
  });

  if (isLoading || !entries) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#FFC800] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <Leaderboard entries={entries} />;
}
