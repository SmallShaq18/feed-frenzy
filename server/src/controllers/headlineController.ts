import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandlers';
import headlineService from '../services/headlineService';
import { ApiResponse } from '../types';

/**
 * Controller for headline routes
 * Thin layer that calls service methods
 */
export const getHeadlines = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, source, category, keyword, sentiment, search, sortBy,      // NEW
    dateRange,  minViews, hasImage, } = req.query;

  const result = await headlineService.getHeadlines({
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    source: source as string,
    category: category as string,
    keyword: keyword as string,
    sentiment: sentiment as any,
    search: search as string,
    sortBy: sortBy as 'recent' | 'trending' | 'relevant',           // NEW
    dateRange: dateRange as 'today' | 'week' | 'month' | 'all',     // NEW
    inViews: minViews ? parseInt(minViews as string) : undefined,  // NEW
    hasImage: hasImage === 'true', 
  });

  const response: ApiResponse = {
    success: true,
    data: result,
  };

  res.status(200).json(response);
});

export const getHeadlineById = asyncHandler(async (req: Request, res: Response) => {
  const headline = await headlineService.getHeadlineById(req.params.id);

  const response: ApiResponse = {
    success: true,
    data: headline,
  };

  res.status(200).json(response);
});

/**
 * @route   POST /api/headlines (for testing)
 * @desc    Manually create a headline
 */
export const createHeadline = asyncHandler(async (req: Request, res: Response) => {
  const headline = await headlineService.createHeadline(req.body);

  const response: ApiResponse = {
    success: true,
    data: headline,
    message: 'Headline created successfully',
  };

  res.status(201).json(response);
});

/**
 * @route   POST /api/headlines/:id/track-click
 * @desc    Increment click count for an article
 */

export const trackClick = asyncHandler(async (req: Request, res: Response) => {
  const headline = await headlineService.trackClick(req.params.id);

  const response: ApiResponse = {
    success: true,
    data: headline,
  };

  res.status(200).json(response);
});