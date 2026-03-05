import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandlers';
import scraperOrchestrator from '../scrapers/scraperOrchestrator';
import { ApiResponse } from '../types';

/**
 * Manually trigger a full scrape
 */

export const triggerFullScrape = asyncHandler(async (req: Request, res: Response) => {
  const result = await scraperOrchestrator.runFullScrape();

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'Scraping job completed successfully',
  };

  res.status(200).json(response);
});

/**
 * Scrape specific sources
 */

export const scrapeSpecificSources = asyncHandler(
  async (req: Request, res: Response) => {
    const { sources } = req.body;

    if (!sources || !Array.isArray(sources)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of source names',
      });
    }

    const headlines = await scraperOrchestrator.scrapeSources(sources);

    const response: ApiResponse = {
      success: true,
      data: {
        scraped: headlines.length,
        sources,
      },
      message: `Scraped ${headlines.length} articles from specified sources`,
    };

    res.status(200).json(response);
  }
);

/**
 * Get scraping statistics
 */

export const getScrapingStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await scraperOrchestrator.getScrapingStats();

  const response: ApiResponse = {
    success: true,
    data: stats,
  };

  res.status(200).json(response);
});