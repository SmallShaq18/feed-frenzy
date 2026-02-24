import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { fetchHeadlines, fetchHeadlineById, trackArticleClick } from '../api/headlines';
import type { HeadlineFilters } from '../types/api';

/**
 * Standard paginated headlines hook.
 */
export function useHeadlines(filters: HeadlineFilters = {}) {
  return useQuery({
    queryKey: ['headlines', filters], // ✅ This includes all filters
    queryFn: () => fetchHeadlines(filters),
    placeholderData: previousData => previousData,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Infinite scroll headlines hook.
 * FIX: Include ALL filters in the queryKey
 */
export function useInfiniteHeadlines(filters: Omit<HeadlineFilters, 'page'> = {}) {
  return useInfiniteQuery({
    // ✅ CRITICAL: queryKey must include ALL filter values
    // This tells React Query to refetch when ANY filter changes
    queryKey: ['headlines-infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchHeadlines({ ...filters, page: pageParam as number, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch single headline by ID for detail panel
 */
export function useHeadlineDetail(id: string | null) {
  return useQuery({
    queryKey: ['headline', id],
    queryFn: () => fetchHeadlineById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Track article click
 */
export function useTrackClick() {
  return useMutation({
    mutationFn: (id: string) => trackArticleClick(id),
  });
}