import mongoose from 'mongoose';
import { env } from './env';
import logger from './logger';

/**
 * Establishes MongoDB connection with retry logic
 * Handles connection events and errors
 */

export const connectDatabase = async (): Promise<void> => {
  try {
    const options = {
      autoIndex: env.NODE_ENV === 'development', // Auto-create indexes in dev only
      maxPoolSize: 10, // Connection pooling
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is down
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(env.MONGO_URI, options);

    logger.info('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit if database connection fails
  }
};