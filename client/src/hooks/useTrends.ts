import { useQuery } from '@tanstack/react-query';
import { fetchTrends, fetchTrendingKeywords } from '../api/trends';

export function useTrends(status?: 'rising' | 'peak' | 'declining') {
  return useQuery({
    queryKey: ['trends', status],
    queryFn: () => fetchTrends(status),
    staleTime: 5 * 60 * 1000, // Trends change less frequently — 5 min cache
  });
}

export function useTrendingKeywords(days = 3) {
  return useQuery({
    queryKey: ['trending-keywords', days],
    queryFn: () => fetchTrendingKeywords(days),
    staleTime: 5 * 60 * 1000,
  });
}