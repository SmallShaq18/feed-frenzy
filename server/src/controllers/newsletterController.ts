import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandlers';
import Subscriber from '../models/subscriber'; // ← UPDATED IMPORT
import emailService from '../services/emailService';
import { ApiResponse } from '../types';
import AppError from '../utils/appErrors';

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Check if already subscribed
  const existing = await Subscriber.findOne({ email });
  if (existing) {
    if (existing.status === 'unsubscribed') {
      // Reactivate subscription
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

  const response: ApiResponse = {
    success: true,
    data: subscriber,
    message: 'Successfully subscribed to newsletter!',
  };

  res.status(201).json(response);
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

  if (!subscriber) {
    throw new AppError('Invalid unsubscribe token', 404);
  }

  subscriber.status = 'unsubscribed';
  await subscriber.save();

  const response: ApiResponse = {
    success: true,
    message: 'Successfully unsubscribed',
  };

  res.status(200).json(response);
});

export const sendTestNewsletter = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  await emailService.sendTestEmail(
    email,
    'Feed Frenzy Test Newsletter',
    'This is a test newsletter from Feed Frenzy!'
  );

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