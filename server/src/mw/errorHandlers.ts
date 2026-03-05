import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appErrors';
import logger from '../config/logger';
import { env } from '../config/env';

/**
 * Global error handling middleware
 * Catches all errors and sends consistent JSON responses
 */

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err = new AppError(`${field} already exists`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(', ');
    err = new AppError(message, 400);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    err = new AppError('Invalid ID format', 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};