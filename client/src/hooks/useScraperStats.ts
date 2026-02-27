import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchScrapingStats, triggerFullScrape } from '../api/scraper';
import toast from 'react-hot-toast';
import { triggerInsightGeneration } from '../api/insights';
import { triggerTrendDetection } from '../api/trends';

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

export function useTriggerInsightGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: triggerInsightGeneration,
    onSuccess: () => {  
      toast.success('✅ Insight generation triggered. Sit tight!');
      // Invalidate insights so they refresh when ready
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
    onError: () => {
      toast.error('❌ Insight generation failed. Check the logs.');
    },
  });
}

export function useTriggerTrendDetection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: triggerTrendDetection,  
    onSuccess: () => {  
      toast.success('✅ Trend detection triggered. Sit tight!');  
      // Invalidate trends so they refresh when ready
      queryClient.invalidateQueries({ queryKey: ['trends'] });
    },
    onError: () => {
      toast.error('❌ Trend detection failed. Check the logs.');
    },
  });
}