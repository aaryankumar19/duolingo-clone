import { apiClient } from '../client';
import { useAuthStore, UserProfile } from '@/store/use-auth-store';

export const userApi = {
  /**
   * POST /api/hearts/refill-gems/
   * Deducts 100 gems and restores hearts to 5.
   */
  refillHearts: async (): Promise<{ hearts: number; gems: number }> => {
    const res = await apiClient<{ data: { hearts: number; gems: number } }>(
      '/hearts/refill-gems/',
      { method: 'POST' }
    );
    if (res.data) {
      useAuthStore.getState().updateUser({
        hearts: res.data.hearts,
        gems: res.data.gems,
      });
    }
    return res.data;
  },

  /** GET /api/profile/ — sync latest user data into auth store */
  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient<{ data: UserProfile }>('/profile/');
    if (res.data) {
      useAuthStore.getState().updateUser(res.data);
    }
    return res.data;
  },
};
