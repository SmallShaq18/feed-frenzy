import { useQuery } from '@tanstack/react-query';
import { fetchInsights } from '../api/insights';

export function useInsights(params?: {
  featured?: boolean;
  type?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['insights', params],
    queryFn: () => fetchInsights(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedInsights(limit = 5) {
  return useInsights({ featured: true, limit });
}