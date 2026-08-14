import { apiClient } from '../client';
import { useAuthStore, UserProfile } from '@/store/use-auth-store';

export const userApi = {
  refillHearts: async (): Promise<{ hearts: number; gems: number }> => {
    const res = await apiClient<{ data: { hearts: number; gems: number } }>('/hearts/refill/', {
      method: 'POST',
    });
    if (res.data) {
      useAuthStore.getState().updateUser({
        hearts: res.data.hearts,
        gems: res.data.gems,
      });
    }
    return res.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient<{ data: UserProfile }>('/profile/');
    if (res.data) {
      useAuthStore.getState().updateUser(res.data);
    }
    return res.data;
  },
};
