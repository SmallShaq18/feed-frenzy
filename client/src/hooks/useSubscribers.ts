import { useQuery } from '@tanstack/react-query';
import { getSubscribers } from '../api/newsletter';

export function useSubscribers() {
  return useQuery({
    queryKey: ['subscribers'],
    queryFn: getSubscribers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}