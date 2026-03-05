import { Router } from 'express';
import * as scraperController from '../controllers/scraperController';
import trendService from '../services/trendService';
import insightService from '../services/insightService';

const router = Router();

/**
 * @route   POST /api/scraper/trigger
 * @desc    Manually trigger a full scrape
 */

router.post('/trigger', scraperController.triggerFullScrape);

/**
 * @route   POST /api/scraper/sources
 * @desc    Scrape specific sources
 * @body    { sources: ["TechCrunch", "The Verge"] }
 */

router.post('/sources', scraperController.scrapeSpecificSources);

/**
 * @route   GET /api/scraper/stats
 * @desc    Get scraping statistics
 */

router.get('/stats', scraperController.getScrapingStats);

/**
 * @route   POST /api/scraper/trigger-trends
 * @desc    Manually trigger a full trend scrape
 */

router.post('/trigger-trends', async (req, res) => {
  try {
    await trendService.detectTrends();
    res.json({ success: true, message: 'Trend detection completed' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Trend detection failed' });
  }
});

/**
 * @route   POST /api/scraper/trigger-insights
 * @desc    Manually trigger a full insight scrape
 */

router.post('/trigger-insights', async (req, res) => {
  try {
    await insightService.generateInsights();
    res.json({ success: true, message: 'Insight generation completed' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Insight generation failed' });
  }
});


export default router;