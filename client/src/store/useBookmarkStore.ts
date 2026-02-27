import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Headline } from '../types/index';

/**
 * Bookmark store — persists to localStorage.
 * No backend needed. Bookmarks are per-browser.
 * Future: sync to user account when auth is real.
 */

interface BookmarkStore {
  bookmarks: Headline[];
  add: (headline: Headline) => void;
  remove: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clear: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      add: (headline) => {
        // Prevent duplicates
        if (get().isBookmarked(headline._id)) return;
        set(state => ({ bookmarks: [headline, ...state.bookmarks] }));
      },

      remove: (id) => {
        set(state => ({
          bookmarks: state.bookmarks.filter(b => b._id !== id),
        }));
      },

      isBookmarked: (id) => {
        return get().bookmarks.some(b => b._id === id);
      },

      clear: () => {
      if (!confirm('Clear all bookmarks? This cannot be undone.')) return;
      set({ bookmarks: [] });
    },
    }),
    {
      name: 'feed-frenzy-bookmarks',
    }
  )
);