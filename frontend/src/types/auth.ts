export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  streak: number;
  xp: number;
  hearts: number;
  gems: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}
