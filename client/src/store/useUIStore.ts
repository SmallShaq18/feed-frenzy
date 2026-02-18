import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI store — handles layout and visual preferences.
 * sidebarOpen and activeModal are session-only.
 * theme is persisted so the user's preference sticks.
 */

type Theme = 'dark' | 'light'; // Dark is default, light is future
type ModalId = 'subscribe' | 'login' | 'article-preview' | null;

interface UIStore {
  sidebarOpen: boolean;
  theme: Theme;
  activeModal: ModalId;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'dark',
      activeModal: null,

      toggleSidebar: () =>
        set(state => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setTheme: (theme) => set({ theme }),

      openModal: (id) => set({ activeModal: id }),

      closeModal: () => set({ activeModal: null }),
    }),
    {
      name: 'feed-frenzy-ui',
      // Only persist theme preference, not transient layout state
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);