import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchHeadlines } from '../api/headlines';
import type { HeadlineFilters } from '../types/api';

/**
 * Standard paginated headlines hook.
 * Used on pages that show a fixed list with pagination.
 */
export function useHeadlines(filters: HeadlineFilters = {}) {
  return useQuery({
    queryKey: ['headlines', filters],
    queryFn: () => fetchHeadlines(filters),
    // Keep previous data while new page loads — no layout flash
    placeholderData: previousData => previousData,
    staleTime: 2 * 60 * 1000, // 2 minutes before background refetch
  });
}

/**
 * Infinite scroll headlines hook.
 * Used on the main feed where the user scrolls to load more.
 */
export function useInfiniteHeadlines(filters: Omit<HeadlineFilters, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: ['headlines-infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchHeadlines({ ...filters, page: pageParam as number, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const { page, pages } = lastPage.pagination;
      // Return next page number or undefined to stop fetching
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
}