import cron from 'node-cron';
import { env } from '../config/env';
import logger from '../config/logger';
import scraperOrchestrator from '../scrapers/scraperOrchestrator';

/**
 * Scheduled job for scraping news sources
 */
export const startScrapeJob = () => {
  cron.schedule(env.SCRAPE_SCHEDULE, async () => {
    logger.info('🕷️  Scheduled scrape job triggered');

    try {
      const result = await scraperOrchestrator.runFullScrape();
      
      logger.info(
        `✅ Scrape job completed: ${result.saved} new articles saved, ${result.duplicates} duplicates skipped`
      );
    } catch (error) {
      logger.error('❌ Scrape job failed:', error);
    }
  });

  logger.info(`🕷️  Scrape job scheduled: ${env.SCRAPE_SCHEDULE}`);
  
  // Optionally run immediately on startup (for testing)
  if (env.NODE_ENV === 'development') {
    logger.info('🔧 Development mode: Running initial scrape...');
    scraperOrchestrator.runFullScrape().catch(err => {
      logger.error('Initial scrape failed:', err);
    });
  }
};