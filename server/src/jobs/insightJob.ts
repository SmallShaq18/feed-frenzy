import cron from 'node-cron';
import { env } from '../config/env';
import logger from '../config/logger';
import insightService from '../services/insightService';

/**
 * Scheduled job for insight generation
 * Runs daily at 3 AM
 */
export const startInsightJob = () => {
  cron.schedule(env.INSIGHTS_SCHEDULE, async () => {
    logger.info('💡 Insight generation job started (scheduled)');

    try {
      await insightService.generateInsights();
      logger.info('✅ Insight generation job completed (scheduled)');
    } catch (error) {
      logger.error('❌ Insight generation job failed:', error);
    }
  });

  logger.info(`💡 Insight generation job scheduled: ${env.INSIGHTS_SCHEDULE}`);
};