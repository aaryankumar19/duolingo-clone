import { apiClient } from '../client';
import {
  LeaderboardEntry,
  LeaderboardTimeframe,
  BackendLeaderboardResponse,
} from '@/types/leaderboard';

export const leaderboardApi = {
  /**
   * GET /api/leaderboard/?timeframe=weekly|all_time
   * Returns ranked XP leaderboard. Falls back to empty array on error.
   */
  getLeaderboard: async (
    timeframe: LeaderboardTimeframe = 'weekly'
  ): Promise<LeaderboardEntry[]> => {
    try {
      const res = await apiClient<BackendLeaderboardResponse>(
        `/leaderboard/?timeframe=${timeframe}`
      );
      const entries = res.data?.leaderboard ?? [];
      return entries.map((e) => ({
        rank: e.rank,
        id: e.user_id,
        username: e.username,
        xp: e.xp,
        avatar_url: e.avatar_url ?? null,
        isCurrentUser: e.is_current_user ?? false,
      }));
    } catch {
      return [];
    }
  },
};
