export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatarUrl?: string;
  xp: number;
  isCurrentUser?: boolean;
}

export type LeaderboardTimeframe = 'weekly' | 'all_time';
