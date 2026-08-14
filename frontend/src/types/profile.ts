export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: number;
  maxLevel: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export interface UserStats {
  streakDays: number;
  totalXP: number;
  currentLeague: string;
  top3Finishes: number;
}
