import { apiClient } from '../client';
import { useAuthStore } from '@/store/use-auth-store';
import { ActivityDay } from '@/types/learning';

// ─── Backend Response Shapes ──────────────────────────────────────────────────

export interface BackendProfile {
  username: string;
  email: string;
  age?: number | null;
  avatar_url?: string | null;
  xp: number;
  gems: number;
  hearts: number;
  streak?: number;
  streak_count?: number;
  completed_skills_count: number;
  stats?: {
    xp?: number;
    streak?: number;
    streak_count?: number;
    gems?: number;
    hearts?: number;
  };
}

export interface BackendAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
  progress?: number;
  max_progress?: number;
}

// ─── Frontend-compatible Achievement (used by AchievementBadge) ───────────────

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
  unlockedAt?: string | null;
}

export interface UserStats {
  streakDays: number;
  totalXP: number;
  currentLeague: string;
  top3Finishes: number;
  gems: number;
  hearts: number;
  completedSkills: number;
}

// ─── Profile API ──────────────────────────────────────────────────────────────

export const profileApi = {
  /** GET /api/profile/ — full user stats */
  getUserProfile: async (): Promise<UserStats> => {
    const res = await apiClient<{ data: BackendProfile }>('/profile/');
    const d = res.data;
    const streak = d.streak ?? d.streak_count ?? d.stats?.streak ?? d.stats?.streak_count ?? 0;
    // Keep auth store in sync
    useAuthStore.getState().updateUser({
      username: d.username,
      email: d.email,
      xp: d.xp,
      gems: d.gems,
      hearts: d.hearts,
      streak: streak,
    });
    return {
      streakDays: streak,
      totalXP: d.xp,
      currentLeague: 'Bronze League', // Backend doesn't return this yet
      top3Finishes: 0,
      gems: d.gems,
      hearts: d.hearts,
      completedSkills: d.completed_skills_count,
    };
  },


  /** GET /api/achievements/ — all achievements with unlock state */
  getAchievements: async (): Promise<Achievement[]> => {
    const res = await apiClient<{ data: { achievements: BackendAchievement[] } }>(
      '/achievements/'
    );
    return (res.data.achievements ?? []).map((a, i) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon || 'Star',
      level: a.is_unlocked ? 1 : 0,
      maxLevel: 5,
      progress: a.progress ?? 0,
      maxProgress: a.max_progress ?? 100,
      unlocked: a.is_unlocked,
      unlockedAt: a.unlocked_at,
    }));
  },

  /** GET /api/activity/?days=N — historical daily XP */
  getActivityHistory: async (days: number = 7): Promise<ActivityDay[]> => {
    const res = await apiClient<{ data: { activity: ActivityDay[] } }>(
      `/activity/?days=${days}`
    );
    return res.data.activity ?? [];
  },
};
