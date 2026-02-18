import client from './client';

export interface ScrapeResult {
  scraped: number;
  saved: number;
  duplicates: number;
}

export interface ScrapingStats {
  totalHeadlines: number;
  headlinesBySource: Array<{ source: string; count: number }>;
  lastScrapedAt: string | null;
}

export async function triggerFullScrape(): Promise<ScrapeResult> {
  const { data } = await client.post('/scraper/trigger');
  return data.data;
}

export async function scrapeSpecificSources(
  sources: string[]
): Promise<{ scraped: number; sources: string[] }> {
  const { data } = await client.post('/scraper/sources', { sources });
  return data.data;
}

export async function fetchScrapingStats(): Promise<ScrapingStats> {
  const { data } = await client.get('/scraper/stats');
  return data.data;
}