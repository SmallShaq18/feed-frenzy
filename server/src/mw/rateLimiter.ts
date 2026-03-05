import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * API rate limiter to prevent abuse
 * Applies to all routes
 */

export const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});