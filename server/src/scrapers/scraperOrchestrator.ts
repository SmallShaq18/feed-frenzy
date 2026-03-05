import logger from '../config/logger';
import { getEnabledSources } from '../config/sources';
import { scrapeMultipleRSSFeeds } from './rssScraper';
import { scrapeHTMLPage } from './htmlScraper';
import headlineService from '../services/headlineService';
import { IHeadline } from '../types';

/**
 * Orchestrates all scraping operations
 * Manages RSS and HTML scrapers, deduplication, and database insertion
 */

class ScraperOrchestrator {
  /**
   * Run full scraping job (RSS + HTML sources)
   */
  async runFullScrape(): Promise<{ scraped: number; saved: number; duplicates: number }> {
    logger.info('🚀 Starting full scraping job');

    const startTime = Date.now();
    let allHeadlines: Partial<IHeadline>[] = [];

    try {
      const sources = getEnabledSources();
      logger.info(`Found ${sources.length} enabled sources`);

      // 1. Scrape RSS feeds
      const rssSources = sources.filter(s => s.type === 'rss' || s.type === 'both');
      if (rssSources.length > 0) {
        const rssHeadlines = await scrapeMultipleRSSFeeds(rssSources);
        allHeadlines.push(...rssHeadlines);
        logger.info(`📰 Collected ${rssHeadlines.length} articles from RSS feeds`);
      }

      // 2. Scrape HTML pages (if any sources have HTML scraping enabled)
      const htmlSources = sources.filter(s => s.type === 'html' || s.type === 'both');
      if (htmlSources.length > 0) {
        logger.info(`🕷️  Scraping ${htmlSources.length} HTML sources`);
        
        for (const source of htmlSources) {
          try {
            const htmlHeadlines = await scrapeHTMLPage(source);
            allHeadlines.push(...htmlHeadlines);
          } catch (error) {
            logger.error(`Failed to scrape HTML from ${source.name}:`, error);
          }
        }
      }

      // 3. Deduplicate by URL
      const uniqueHeadlines = this.deduplicateHeadlines(allHeadlines);
      logger.info(
        `🔍 Deduplicated: ${allHeadlines.length} → ${uniqueHeadlines.length} unique articles`
      );

      // 4. Save to database
      const savedCount = await headlineService.bulkCreateHeadlines(uniqueHeadlines);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      logger.info(
        `✅ Scraping complete in ${duration}s: ${allHeadlines.length} scraped, ${uniqueHeadlines.length} unique, ${savedCount} saved`
      );

      return {
        scraped: allHeadlines.length,
        saved: savedCount,
        duplicates: allHeadlines.length - uniqueHeadlines.length,
      };
    } catch (error) {
      logger.error('❌ Scraping job failed:', error);
      throw error;
    }
  }

  /**
   * Scrape only specific sources
   */
  async scrapeSources(sourceNames: string[]): Promise<Partial<IHeadline>[]> {
    const sources = getEnabledSources().filter(s => sourceNames.includes(s.name));
    
    if (sources.length === 0) {
      logger.warn(`No enabled sources found for: ${sourceNames.join(', ')}`);
      return [];
    }

    logger.info(`🎯 Scraping specific sources: ${sourceNames.join(', ')}`);

    const headlines: Partial<IHeadline>[] = [];

    for (const source of sources) {
      try {
        if (source.type === 'rss' || source.type === 'both') {
          const { scrapeRSSFeed } = await import('./rssScraper');
          const rssHeadlines = await scrapeRSSFeed(source);
          headlines.push(...rssHeadlines);
        }

        if (source.type === 'html' || source.type === 'both') {
          const htmlHeadlines = await scrapeHTMLPage(source);
          headlines.push(...htmlHeadlines);
        }
      } catch (error) {
        logger.error(`Failed to scrape ${source.name}:`, error);
      }
    }

    return headlines;
  }

  /**
   * Deduplicate headlines by URL
   */
  private deduplicateHeadlines(headlines: Partial<IHeadline>[]): Partial<IHeadline>[] {
    const seen = new Set<string>();
    const unique: Partial<IHeadline>[] = [];

    for (const headline of headlines) {
      if (!headline.url) continue;

      // Normalize URL (remove trailing slashes, query params, etc.)
      const normalizedUrl = this.normalizeUrl(headline.url);

      if (!seen.has(normalizedUrl)) {
        seen.add(normalizedUrl);
        unique.push(headline);
      }
    }

    return unique;
  }

  /**
   * Normalize URL for deduplication
   */
  
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove trailing slash and common tracking params
      let normalized = `${urlObj.origin}${urlObj.pathname}`.replace(/\/$/, '');
      return normalized.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  /**
   * Get scraping statistics
   */
  async getScrapingStats(): Promise<{
    totalHeadlines: number;
    headlinesBySource: Array<{ source: string; count: number }>;
    lastScrapedAt: Date | null;
  }> {
    const totalHeadlines = await headlineService.getHeadlines({ limit: 1 });
    const headlinesBySource = await headlineService.getHeadlinesBySource();

    // Get most recent scrape time
    const recentHeadline = await headlineService.getHeadlines({
      limit: 1,
      page: 1,
    });

    const lastScrapedAt =
      recentHeadline.headlines.length > 0
        ? recentHeadline.headlines[0].scrapedAt
        : null;

    return {
      totalHeadlines: totalHeadlines.pagination.total,
      headlinesBySource,
      lastScrapedAt,
    };
  }
}

export default new ScraperOrchestrator();