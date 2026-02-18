import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandlers';
import insightService from '../services/insightService';
import { ApiResponse } from '../types';

export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const { featured, type } = req.query;

  const insights = await insightService.getInsights({
    featured: featured === 'true',
    type: type as string,
  });

  const response: ApiResponse = {
    success: true,
    data: insights,
  };

  res.status(200).json(response);
});

export const createInsight = asyncHandler(async (req: Request, res: Response) => {
  const insight = await insightService.createInsight(req.body);

  const response: ApiResponse = {
    success: true,
    data: insight,
    message: 'Insight created successfully',
  };

  res.status(201).json(response);
});