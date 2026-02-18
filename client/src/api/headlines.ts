import client from './client';
import type { HeadlineFilters } from '../types/api';
import type { HeadlineListResponse, Headline } from '../types/index';

/**
 * Fetch paginated, filterable headlines.
 * TanStack Query calls this — it should only fetch, never cache.
 */
export async function fetchHeadlines(
  filters: HeadlineFilters = {}
): Promise<HeadlineListResponse> {
  const { data } = await client.get('/headlines', { params: filters });
  // Backend wraps in ApiResponse, unwrap the data field
  return data.data;
}

/**
 * Fetch a single headline by ID.
 */
export async function fetchHeadlineById(id: string): Promise<Headline> {
  const { data } = await client.get(`/headlines/${id}`);
  return data.data;
}

/**
 * Fetch headlines grouped by source (for filter sidebar counts).
 */
/*export async function fetchHeadlinesBySource(): Promise
  Array<{ source: string; count: number }>
> {
  const { data } = await client.get('/headlines/by-source');
  return data.data;
};*/