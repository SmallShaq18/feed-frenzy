/**
 * Mocked now. When real auth lands:
 * - replace mockLogin() in useAuthStore with a real API call
 * - token gets stored here and injected by the Axios interceptor
 */
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}