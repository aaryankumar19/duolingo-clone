export type LeaderboardTimeframe = 'weekly' | 'all_time';

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  xp: number;
  avatar_url?: string | null;
  isCurrentUser?: boolean;
}

export interface BackendLeaderboardResponse {
  data: {
    timeframe: LeaderboardTimeframe;
    leaderboard: Array<{
      rank: number;
      user_id: string;
      username: string;
      xp: number;
      avatar_url?: string | null;
      is_current_user?: boolean;
    }>;
  };
}
