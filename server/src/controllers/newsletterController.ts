import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandlers';
import Subscriber from '../models/subscriber';
import emailService from '../services/emailService';
import insightService from '../services/insightService';
import trendService from '../services/trendService';
import headlineService from '../services/headlineService';
import { sendWeeklyNewsletter } from '../jobs/newsletterJob';
import { ApiResponse } from '../types';
import AppError from '../utils/appErrors';
import logger from '../config/logger';

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (existing.status === 'unsubscribed') {
      existing.status = 'active';
      existing.subscribedAt = new Date();
      await existing.save();

      const response: ApiResponse = {
        success: true,
        data: existing,
        message: 'Welcome back! Subscription reactivated.',
      };
      return res.status(200).json(response);
    }

    throw new AppError('Email already subscribed', 400);
  }

  const subscriber = await Subscriber.create({ email });

  logger.info(`✅ New subscriber: ${email} (token: ${subscriber.unsubscribeToken})`);

  const response: ApiResponse = {
    success: true,
    data: subscriber,
    message: 'Successfully subscribed to newsletter!',
  };

  res.status(201).json(response);
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  logger.info(`🔍 Unsubscribe attempt with token: ${token}`);

  const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

  if (!subscriber) {
    logger.warn(`❌ Invalid unsubscribe token: ${token}`);
    throw new AppError('Invalid or expired unsubscribe link', 404);
  }

  if (subscriber.status === 'unsubscribed') {
    logger.info(`ℹ️ Subscriber already unsubscribed: ${subscriber.email}`);
    const response: ApiResponse = {
      success: true,
      message: 'You are already unsubscribed',
    };
    return res.status(200).json(response);
  }

  subscriber.status = 'unsubscribed';
  await subscriber.save();

  logger.info(`✅ Unsubscribed: ${subscriber.email}`);

  const response: ApiResponse = {
    success: true,
    message: 'Successfully unsubscribed from newsletter',
  };

  res.status(200).json(response);
});

export const sendTestNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const allInsights = await insightService.getInsights({ limit: 10 });
  const insights = allInsights.slice(0, 3);

  const trends = await trendService.getTrends('rising');

  const headlinesResponse = await headlineService.getHeadlines({
    page: 1,
    limit: 10,
  });

  const headlinesBySource = await headlineService.getHeadlinesBySource();

  const testContent = {
    insights,
    trends: trends.slice(0, 5),
    topHeadlines: headlinesResponse.headlines.slice(0, 5),
    stats: {
      totalArticles: headlinesResponse.pagination.total,
      topSources: headlinesBySource.slice(0, 5),
    },
  };

  await emailService.sendTestNewsletter(email, testContent);

  const response: ApiResponse = {
    success: true,
    message: 'Test newsletter sent!',
  };

  res.status(200).json(response);
});

export const getSubscribers = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const query: any = {};

  if (status) {
    query.status = status;
  }

  const subscribers = await Subscriber.find(query)
    .sort({ subscribedAt: -1 })
    .lean();

  const response: ApiResponse = {
    success: true,
    data: {
      subscribers,
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    },
  };

  res.status(200).json(response);
});

export const sendNewsletterNow = asyncHandler(async (req: Request, res: Response) => {
  await sendWeeklyNewsletter();

  const response: ApiResponse = {
    success: true,
    message: 'Newsletter sent successfully',
  };

  res.status(200).json(response);
});