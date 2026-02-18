import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';

/**
 * Auth store — mocked for now.
 * When real auth lands:
 * 1. Replace mockLogin with an actual API call to /api/auth/login
 * 2. Store the JWT token and add it to the Axios interceptor in client.ts
 * 3. Add a refreshToken action for silent token renewal
 *
 * persist middleware keeps auth across page refreshes via localStorage.
 */

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// Mock admin user for development
const MOCK_ADMIN: User = {
  _id: 'mock-admin-001',
  email: 'admin@feedfrenzy.com',
  name: 'Admin',
  role: 'admin',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        // MOCK: In real auth, call POST /api/auth/login
        // const { data } = await client.post('/auth/login', { email, password });
        // set({ user: data.user, token: data.token, isAuthenticated: true });

        // For now, any login with admin@feedfrenzy.com grants admin
        if (email === MOCK_ADMIN.email) {
          set({
            user: MOCK_ADMIN,
            token: 'mock-token-admin',
            isAuthenticated: true,
          });
        } else {
          throw new Error('Invalid credentials (use admin@feedfrenzy.com)');
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'feed-frenzy-auth', // localStorage key
      // Only persist user and token, not actions
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);