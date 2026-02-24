import { create } from 'zustand';
import type { SortBy, DateRange } from '../types/api';

/**
 * Filter store — drives the headline feed query.
 * Sidebar filters, category pills, search, and sentiment
 * all write here. useHeadlines reads from here.
 *
 * NOT persisted — filters reset on page load (intentional).
 */

type Sentiment = 'positive' | 'neutral' | 'negative';

interface FilterState {
  source: string;
  category: string;
  sentiment: Sentiment | '';
  searchQuery: string;
  sortBy: SortBy;
  dateRange: DateRange;
  minViews: number;
  hasImage: boolean;

  setFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

const DEFAULT_FILTERS = {
  source: '',
  category: '',
  sentiment: '' as const,
  searchQuery: '',
  sortBy: 'recent' as SortBy,
  dateRange: 'all' as DateRange,
  minViews: 0,
  hasImage: false,
};

export const useFilterStore = create<FilterState>()((set, get) => ({
  ...DEFAULT_FILTERS,

  setFilter: (key, value) => set({ [key]: value }),

  clearFilters: () => set(DEFAULT_FILTERS),

  hasActiveFilters: () => {
    const { source, category, sentiment, searchQuery, sortBy, dateRange, minViews, hasImage } = get();
    return !!(source || category || sentiment || searchQuery || sortBy !== 'recent' || dateRange !== 'all' || minViews > 0 || hasImage);
  },
}));