import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';
type ModalId = 'subscribe' | 'login' | 'article-preview' | null;

interface UIStore {
  sidebarOpen: boolean;
  theme: Theme;
  activeModal: ModalId;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void; // NEW
  openModal: (id: ModalId) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      theme: 'light',
      activeModal: null,

      toggleSidebar: () =>
        set(state => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
      },

      openModal: (id) => set({ activeModal: id }),

      closeModal: () => set({ activeModal: null }),
    }),
    {
      name: 'feed-frenzy-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);