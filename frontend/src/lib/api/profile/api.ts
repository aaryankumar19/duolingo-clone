import { Achievement, UserStats } from '@/types/profile';

export const mockStats: UserStats = {
  streakDays: 7,
  totalXP: 1420,
  currentLeague: 'Gold League',
  top3Finishes: 3,
};

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Wildfire',
    description: 'Reach a 7 day streak',
    icon: 'Flame',
    level: 2,
    maxLevel: 5,
    progress: 7,
    maxProgress: 14,
    unlocked: true,
  },
  {
    id: 'ach-2',
    title: 'Sage',
    description: 'Earn 1000 XP in total',
    icon: 'Zap',
    level: 3,
    maxLevel: 5,
    progress: 1420,
    maxProgress: 2000,
    unlocked: true,
  },
  {
    id: 'ach-3',
    title: 'Scholar',
    description: 'Learn 50 new words',
    icon: 'GraduationCap',
    level: 1,
    maxLevel: 3,
    progress: 35,
    maxProgress: 50,
    unlocked: false,
  },
];

export const profileApi = {
  getUserProfile: async () => {
    return {
      stats: mockStats,
      achievements: mockAchievements,
    };
  },
};
