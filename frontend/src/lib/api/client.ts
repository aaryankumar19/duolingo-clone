import { useAuthStore } from '@/store/use-auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? useAuthStore.getState().authToken || localStorage.getItem('auth_token')
      : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handling 401 Unauthorized globally
    if (response.status === 401 && typeof window !== 'undefined') {
      useAuthStore.getState().logout();
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData.error?.message ||
      errorData.message ||
      (typeof errorData.error === 'string' ? errorData.error : null) ||
      `API Error: ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}
