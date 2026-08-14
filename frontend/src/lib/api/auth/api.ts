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
      useAuthStore.getState().setAuth(user, user.auth_token);
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
      useAuthStore.getState().setAuth(user, user.auth_token);
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
    const res = await apiClient<{ data: UserProfile }>('/profile/');
    if (res.data) {
      useAuthStore.getState().updateUser(res.data);
    }
    return res.data;
  },
};
