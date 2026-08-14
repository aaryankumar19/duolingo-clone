import { create } from 'zustand';

export interface UserProfile {
  username: string;
  email: string;
  age?: number | null;
  avatar_url?: string | null;
  xp: number;
  gems: number;
  hearts: number;
  streak?: number;
  auth_token?: string;
}

interface AuthStoreState {
  user: UserProfile | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: UserProfile, token: string) => void;
  updateUser: (partialUser: Partial<UserProfile>) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  authToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, auth_token: token }));
    }
    set({
      user: { ...user, auth_token: token },
      authToken: token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: (partialUser) => {
    const { user, authToken } = get();
    if (!user) return;
    const updatedUser = { ...user, ...partialUser };
    if (typeof window !== 'undefined' && authToken) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    set({ user: updatedUser });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    set({
      user: null,
      authToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initializeAuth: () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false });
      return;
    }

    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        set({
          user: parsedUser,
          authToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }

    set({
      user: null,
      authToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
