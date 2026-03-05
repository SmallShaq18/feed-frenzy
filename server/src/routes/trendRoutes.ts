import { Router } from 'express';
import * as trendController from '../controllers/trendController';

const router = Router();

/**
 * @route   GET /api/trends
 * @desc    Get all trends, optionally filter by status
 * @query   status (rising, peak, declining)
 */

router.get('/', trendController.getTrends);

/**
 * @route   GET /api/trends/keywords
 * @desc    Get trending keywords for the past N days
 * @query   days (default: 7)
 */

router.get('/keywords', trendController.getTrendingKeywords);

export default router;