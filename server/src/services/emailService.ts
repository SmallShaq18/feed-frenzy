import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';
import Subscriber from '../models/subscriber';
import { generateNewsletterHTML, generateNewsletterText } from './emailTemplateService';

/**
 * Email service for newsletter sending
 */

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  /**
   * Send newsletter to all active subscribers
   */
  
  async sendNewsletter(content: {
    insights: any[];
    trends: any[];
    topHeadlines: any[];
    stats: {
      totalArticles: number;
      topSources: Array<{ source: string; count: number }>;
    };
  }): Promise<{ sent: number; failed: number }> {
    const subscribers = await Subscriber.find({ status: 'active' }).lean();

    if (subscribers.length === 0) {
      logger.warn('No active subscribers to send newsletter to');
      return { sent: 0, failed: 0 };
    }

    logger.info(`📧 Sending newsletter to ${subscribers.length} subscribers`);

    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const subject = `Feed Frenzy Weekly — ${date}`;

    let successCount = 0;
    let failCount = 0;

    // Send in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (subscriber) => {
          try {
            // Generate HTML and text with personalized unsubscribe link
            const unsubscribeUrl = `${env.FRONTEND_URL}/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;

            const htmlContent = generateNewsletterHTML(content)
              .replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl); // Replace all instances

            const textContent = generateNewsletterText(content)
              .replace(/\{\{unsubscribeUrl\}\}/g, unsubscribeUrl);

            await this.transporter.sendMail({
              from: env.EMAIL_FROM,
              to: subscriber.email,
              subject,
              html: htmlContent,
              text: textContent,
            });

            successCount++;
            logger.debug(`✓ Sent to ${subscriber.email}`);
          } catch (error) {
            failCount++;
            logger.error(`✗ Failed to send to ${subscriber.email}:`, error);
          }
        })
      );

      // Wait between batches to avoid rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    logger.info(`✅ Newsletter sent: ${successCount} succeeded, ${failCount} failed`);
    return { sent: successCount, failed: failCount };
  }

  /**
   * Send test newsletter to a specific email
   */
  async sendTestNewsletter(email: string, content: any): Promise<void> {
    const subject = `Feed Frenzy Weekly — TEST`;

    const htmlContent = generateNewsletterHTML(content)
      .replace('{{unsubscribeUrl}}', 'https://feedfrenzy.com/unsubscribe/test');

    const textContent = generateNewsletterText(content)
      .replace('{{unsubscribeUrl}}', 'https://feedfrenzy.com/unsubscribe/test');

    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: email,
      subject,
      html: htmlContent,
      text: textContent,
    });

    logger.info(`Test newsletter sent to ${email}`);
  }

  /**
   * Get subscriber count by status
   */
  async getSubscriberStats(): Promise<{
    total: number;
    active: number;
    unsubscribed: number;
  }> {
    const [total, active, unsubscribed] = await Promise.all([
      Subscriber.countDocuments(),
      Subscriber.countDocuments({ status: 'active' }),
      Subscriber.countDocuments({ status: 'unsubscribed' }),
    ]);

    return { total, active, unsubscribed };
  }
}

export default new EmailService();