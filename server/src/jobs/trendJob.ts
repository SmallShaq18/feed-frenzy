import cron from 'node-cron';
import { env } from '../config/env';
import logger from '../config/logger';
import trendService from '../services/trendService';

/**
 * Scheduled job for trend detection
 */

export const startTrendJob = () => {
  cron.schedule(env.TREND_SCHEDULE, async () => {
    try {
      await trendService.detectTrends();
    } catch (error) {
      logger.error('Trend job failed:', error);
    }
  });

  logger.info(`Trend detection job scheduled: ${env.TREND_SCHEDULE}`);
};