import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import logger from './config/logger';
import { errorHandler } from './mw/errorHandlers';
import { limiter } from './mw/rateLimiter';
import routes from './routes';
import { startScrapeJob } from './jobs/scrapeJob';
import { startTrendJob } from './jobs/trendJob';
import { startNewsletterJob } from './jobs/newsletterJob';
import { startInsightJob } from './jobs/insightJob';

const app: Application = express();

/**
 * Middleware
 */
app.use(helmet()); // Security headers
app.use(cors({ origin: env.ALLOWED_ORIGINS.split(',') })); // CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logging

/**
 * Rate limiting
 */
app.use('/api', limiter);

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Feed Frenzy backend is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use('/api', routes);

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    status: 404,
  });
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
});

/**
 * Global Error Handler (must be last)
 */
app.use(errorHandler);

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start cron jobs
    startScrapeJob();
    startTrendJob();
    startNewsletterJob();
    startInsightJob();

    // Start Express server
    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🌐 CORS enabled for: ${env.ALLOWED_ORIGINS}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();