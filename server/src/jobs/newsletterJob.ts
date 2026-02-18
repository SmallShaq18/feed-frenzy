import cron from 'node-cron';
import { env } from '../config/env';
import logger from '../config/logger';
import insightService from '../services/insightService';
import trendService from '../services/trendService';
import emailService from '../services/emailService';
import { Newsletter } from '../models/newsletter';
import Subscriber from '../models/subscriber';

/**
 * Scheduled job for weekly newsletter
 */
export const startNewsletterJob = () => {
  cron.schedule(env.NEWSLETTER_SCHEDULE, async () => {
    logger.info('📬 Newsletter job started');

    try {
      // Fetch featured insights
      const insights = await insightService.getInsights({ featured: true, limit: 5 });

      // Fetch rising trends
      const trends = await trendService.getTrends('rising');

      if (insights.length === 0 && trends.length === 0) {
        logger.warn('No content for newsletter. Skipping send.');
        return;
      }

      // Compose email (placeholder - you'd build HTML template)
      const subject = `Feed Frenzy Weekly — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      const htmlContent = `
        <h1>This Week in Feed Frenzy</h1>
        <h2>Top Insights</h2>
        <ul>
          ${insights.map(i => `<li>${i.title}</li>`).join('')}
        </ul>
        <h2>Trending Keywords</h2>
        <ul>
          ${trends.slice(0, 5).map(t => `<li>${t.keyword} (${t.count} mentions)</li>`).join('')}
        </ul>
      `;
      const textContent = `This week's top insights: ${insights.map(i => i.title).join(', ')}`;

      // Send to all active subscribers
      const recipientCount = await emailService.sendNewsletter(subject, htmlContent, textContent);

      // Get recipient emails for archive
      const subscribers = await Subscriber.find({ status: 'active' }).select('email').lean();
      const recipientEmails = subscribers.map(s => s.email);

      // Archive newsletter
      await Newsletter.create({
        subject,
        htmlContent,
        textContent,
        recipients: recipientCount,
        recipientEmails,
        insights: insights.map(i => i._id.toString()),
        trends: trends.slice(0, 5).map(t => t._id.toString()),
      });

      logger.info('✅ Newsletter job completed');
    } catch (error) {
      logger.error('Newsletter job failed:', error);
    }
  });

  logger.info(`📬 Newsletter job scheduled: ${env.NEWSLETTER_SCHEDULE}`);
};