import client from './client';
import type { Insight } from '../types/index';

export async function fetchInsights(params?: {
  featured?: boolean;
  type?: string;
  limit?: number;
}): Promise<Insight[]> {
  const { data } = await client.get('/insights', { params });
  return data.data;
}

export async function createInsight(
  payload: Partial<Insight>
): Promise<Insight> {
  const { data } = await client.post('/insights', payload);
  return data.data;
}

export async function triggerInsightGeneration(): Promise<void> {
  await client.post('/trigger-insights');
}