import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  ALLOWED_ORIGINS: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  EMAIL_FROM: string;
  SCRAPE_SCHEDULE: string;
  TREND_SCHEDULE: string;
  NEWSLETTER_SCHEDULE: string;
  INSIGHTS_SCHEDULE: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

/**
 * Validates and exports environment variables
 * Throws error if required variables are missing
 */
const getEnvConfig = (): EnvConfig => {
  const requiredEnvVars = [
    'MONGO_URI',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
  ];

  // Check for missing required variables
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGO_URI: process.env.MONGO_URI!,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,
    EMAIL_FROM: process.env.EMAIL_FROM || 'Feed Frenzy <noreply@feedfrenzy.com>',
    SCRAPE_SCHEDULE: process.env.SCRAPE_SCHEDULE || '0 */4 * * *',
    TREND_SCHEDULE: process.env.TREND_SCHEDULE || '0 2 * * *',
    INSIGHTS_SCHEDULE: process.env.INSIGHTS_SCHEDULE || '0 3 * * *',
    NEWSLETTER_SCHEDULE: process.env.NEWSLETTER_SCHEDULE || '0 9 * * 0',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  };
};

export const env = getEnvConfig();