import { Router } from 'express';
import * as headlineController from '../controllers/headlineController';

const router = Router();

/**
 * @route   GET /api/headlines
 * @desc    Get paginated headlines with filters
 * @query   page, limit, source, category, keyword
 */

router.get('/', headlineController.getHeadlines);

/**
 * @route   GET /api/headlines/:id
 * @desc    Get single headline by ID
 */

router.get('/:id', headlineController.getHeadlineById);

/**
 * @route   POST /api/headlines
 * @desc    Create a headline (for testing)
 */

router.post('/', headlineController.createHeadline);

/**
 * @route   POST /api/headlines/:id/track-click
 * @desc    Track article click
 */

router.post('/:id/track-click', headlineController.trackClick);

export default router;