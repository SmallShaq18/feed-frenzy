import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandlers';
import trendService from '../services/trendService';
import { ApiResponse } from '../types';

export const getTrends = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const trends = await trendService.getTrends(
    status as 'rising' | 'peak' | 'declining' | undefined
  );

  const response: ApiResponse = {
    success: true,
    data: trends,
  };

  res.status(200).json(response);
});

export const getTrendingKeywords = asyncHandler(async (req: Request, res: Response) => {
  const { days } = req.query;
  const keywords = await trendService.getTrendingKeywords(
    days ? parseInt(days as string) : 7
  );

  const response: ApiResponse = {
    success: true,
    data: keywords,
  };

  res.status(200).json(response);
});