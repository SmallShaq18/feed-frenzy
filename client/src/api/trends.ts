import client from './client';
import type { Trend } from '../types/index';

export async function fetchTrends(
  status?: 'rising' | 'peak' | 'declining'
): Promise<Trend[]> {
  const { data } = await client.get('/trends', {
    params: status ? { status } : undefined,
  });
  return data.data;
}

export async function fetchTrendingKeywords(days = 3): Promise<string[]> {
  const { data } = await client.get('/trends/keywords', {
    params: { days },
  });
  return data.data;
}

export async function triggerTrendDetection(): Promise<void> {
  await client.post('/scraper/trigger-trends');
}