import cron from 'node-cron';
import { env } from '../config/env';
import logger from '../config/logger';
import insightService from '../services/insightService';
import trendService from '../services/trendService';
import headlineService from '../services/headlineService';
import emailService from '../services/emailService';
import { Newsletter } from '../models/newsletter';
import Subscriber from '../models/subscriber';
import { generateNewsletterHTML, generateNewsletterText } from '../services/emailTemplateService';

/**
 * Scheduled job for weekly newsletter
 * Runs every Sunday at 9 AM
 */

export const startNewsletterJob = () => {
  cron.schedule(env.NEWSLETTER_SCHEDULE, async () => {
    logger.info('📬 Newsletter job started (scheduled)');

    try {
      await sendWeeklyNewsletter();
      logger.info('✅ Newsletter job completed (scheduled)');
    } catch (error) {
      logger.error('❌ Newsletter job failed:', error);
    }
  });

  logger.info(`📬 Newsletter job scheduled: ${env.NEWSLETTER_SCHEDULE}`);
};

/**
 * Send weekly newsletter (can be called manually or by cron)
 */

export async function sendWeeklyNewsletter(): Promise<void> {
  // Get content for newsletter
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch top insights (featured first)
  const allInsights = await insightService.getInsights({ limit: 20 });
  const insights = allInsights
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 5);

  // Fetch rising trends
  const trends = await trendService.getTrends('rising');

  // Fetch top headlines from the week
  const headlinesResponse = await headlineService.getHeadlines({
    page: 1,
    limit: 15,
  });
  const topHeadlines = headlinesResponse.headlines
    .filter(h => new Date(h.publishedAt) >= sevenDaysAgo)
    .slice(0, 10);

  // Get stats
  const headlinesBySource = await headlineService.getHeadlinesBySource();
  const weeklyHeadlines = await headlineService.getHeadlines({
    page: 1,
    limit: 1000,
  });

  const weeklyCount = weeklyHeadlines.headlines.filter(
    h => new Date(h.publishedAt) >= sevenDaysAgo
  ).length;

  const newsletterContent = {
    insights,
    trends: trends.slice(0, 8),
    topHeadlines,
    stats: {
      totalArticles: weeklyCount,
      topSources: headlinesBySource.slice(0, 5),
    },
  };

  // Check if we have enough content
  if (insights.length === 0 && trends.length === 0 && topHeadlines.length === 0) {
    logger.warn('Not enough content for newsletter. Skipping send.');
    return;
  }

  // Send newsletter
  const result = await emailService.sendNewsletter(newsletterContent);

  // Get recipient emails for archive
  const subscribers = await Subscriber.find({ status: 'active' }).select('email').lean();
  const recipientEmails = subscribers.map(s => s.email);

  // Archive newsletter
  const htmlContent = generateNewsletterHTML(newsletterContent);
  const textContent = generateNewsletterText(newsletterContent);

  await Newsletter.create({
    subject: `Feed Frenzy Weekly — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    htmlContent,
    textContent,
    recipients: result.sent,
    recipientEmails,
    insights: insights.map(i => i._id.toString()),
    trends: trends.slice(0, 8).map(t => t._id.toString()),
  });

  logger.info(`📬 Newsletter archived. Sent to ${result.sent} subscribers.`);
}