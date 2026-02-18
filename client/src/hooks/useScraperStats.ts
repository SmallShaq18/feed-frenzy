import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchScrapingStats, triggerFullScrape } from '../api/scraper';
import toast from 'react-hot-toast';

export function useScrapingStats() {
  return useQuery({
    queryKey: ['scraping-stats'],
    queryFn: fetchScrapingStats,
    // Refresh stats every 30 seconds on the admin page
    refetchInterval: 30_000,
  });
}

export function useTriggerScrape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: triggerFullScrape,
    onSuccess: result => {
      toast.success(
        `✅ Scraped ${result.scraped} articles, saved ${result.saved} new ones`
      );
      // Invalidate headlines and stats so they refresh
      queryClient.invalidateQueries({ queryKey: ['headlines'] });
      queryClient.invalidateQueries({ queryKey: ['scraping-stats'] });
    },
    onError: () => {
      toast.error('❌ Scrape job failed. Check the logs.');
    },
  });
}