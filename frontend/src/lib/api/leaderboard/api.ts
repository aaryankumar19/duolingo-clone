import { apiClient } from '../client';
import { LeaderboardEntry } from '@/types/leaderboard';

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, id: 'u1', username: 'DuoMaster', xp: 2450 },
  { rank: 2, id: 'u2', username: 'PollyGlot', xp: 2180 },
  { rank: 3, id: 'u3', username: 'SpanishWizard', xp: 1950 },
  { rank: 4, id: 'u4', username: 'You', xp: 1420, isCurrentUser: true },
  { rank: 5, id: 'u5', username: 'LanguageFan', xp: 1200 },
  { rank: 6, id: 'u6', username: 'OwlFriend', xp: 980 },
  { rank: 7, id: 'u7', username: 'TapasLover', xp: 850 },
];

export const leaderboardApi = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      const res = await apiClient<{ data: { leaderboard: LeaderboardEntry[] } }>('/leaderboard/?timeframe=weekly');
      if (res.data?.leaderboard && res.data.leaderboard.length > 0) {
        return res.data.leaderboard;
      }
    } catch {
      // Fallback to mock leaderboard if backend returns empty or error
    }
    return mockLeaderboard;
  },
};
