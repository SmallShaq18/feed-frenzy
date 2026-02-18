import { Router } from 'express';
import * as insightController from '../controllers/insightController';

const router = Router();

/**
 * @route   GET /api/insights
 * @desc    Get insights with filters
 * @query   featured, type
 */
router.get('/', insightController.getInsights);

/**
 * @route   POST /api/insights
 * @desc    Create a new insight (for testing/manual entry)
 */
router.post('/', insightController.createInsight);

export default router;