import { apiClient } from '../client';
import { useAuthStore, UserProfile } from '@/store/use-auth-store';

export interface BackendUser {
  username: string;
  email: string;
  age?: number | null;
  avatar_url?: string | null;
  xp: number;
  gems: number;
  hearts: number;
  streak?: number;
  streak_count?: number;
  auth_token: string;
}

export interface BackendAuthResponse {
  code: string;
  status: number;
  data: {
    user: BackendUser;
  };
}

export const authApi = {
  login: async (credentials: { identifier: string; password: string }): Promise<BackendUser> => {
    const res = await apiClient<BackendAuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    const user = res.data.user;
    if (user?.auth_token) {
      const streak = user.streak ?? user.streak_count ?? 0;
      useAuthStore.getState().setAuth({ ...user, streak }, user.auth_token);
    }
    return user;
  },

  register: async (userData: { email: string; password: string; age?: number; name?: string }): Promise<BackendUser> => {
    const res = await apiClient<BackendAuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const user = res.data.user;
    if (user?.auth_token) {
      const streak = user.streak ?? user.streak_count ?? 0;
      useAuthStore.getState().setAuth({ ...user, streak }, user.auth_token);
    }
    return user;
  },


  logout: async (): Promise<void> => {
    try {
      await apiClient('/auth/logout/', {
        method: 'POST',
        body: JSON.stringify({ clear_all_sessions: false }),
      });
    } catch {
      // Ignore network/session errors on logout
    } finally {
      useAuthStore.getState().logout();
    }
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient<{ data: any }>('/profile/');
    const data = res.data;
    if (data) {
      const userData = data.user || data;
      const streak = data.streak ?? data.streak_count ?? userData.streak ?? userData.streak_count ?? 0;
      const profileToUpdate: UserProfile = {
        ...userData,
        streak,
      };
      useAuthStore.getState().updateUser(profileToUpdate);
      return profileToUpdate;
    }
    return data;
  },
};
