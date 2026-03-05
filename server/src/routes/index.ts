import { Router } from 'express';
import headlineRoutes from './headlineRoutes';
import trendRoutes from './trendRoutes';
import insightRoutes from './insightRoutes';
import newsletterRoutes from './newsletterRoutes';
import scraperRoutes from './scraperRoutes';

const router = Router();

/**
 * Central route registration
 * All API routes are prefixed with /api
 */

router.use('/headlines', headlineRoutes);
router.use('/trends', trendRoutes);
router.use('/insights', insightRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/scraper', scraperRoutes);

export default router;