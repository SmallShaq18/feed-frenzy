import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';
import Subscriber from '../models/subscriber';

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
  async sendNewsletter(
    subject: string,
    htmlContent: string,
    textContent: string
  ): Promise<number> {
    const subscribers = await Subscriber.find({ status: 'active' }).lean();

    logger.info(`📧 Sending newsletter to ${subscribers.length} subscribers`);

    let successCount = 0;

    for (const subscriber of subscribers) {
      try {
        await this.transporter.sendMail({
          from: env.EMAIL_FROM,
          to: subscriber.email,
          subject,
          html: htmlContent,
          text: textContent,
        });
        successCount++;
      } catch (error) {
        logger.error(`Failed to send to ${subscriber.email}:`, error);
      }
    }

    logger.info(`✅ Newsletter sent to ${successCount}/${subscribers.length} subscribers`);
    return successCount;
  }

  /**
   * Send test email
   */
  async sendTestEmail(to: string, subject: string, body: string): Promise<void> {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      text: body,
    });
    logger.info(`Test email sent to ${to}`);
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