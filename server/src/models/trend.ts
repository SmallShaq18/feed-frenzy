import mongoose, { Schema } from 'mongoose';
import { ITrend } from '../types';

const TrendSchema = new Schema<ITrend>(
  {
    keyword: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    firstSeen: {
      type: Date,
      required: true,
    },
    lastSeen: {
      type: Date,
      required: true,
    },
    velocity: {
      type: Number,
      default: 0,
      comment: 'Articles per day mentioning this keyword',
    },
    window: {
      type: String,
      enum: ['24h', '7d', '30d'],
      default: '24h'
    },
    relatedKeywords: {
      type: [String],
      default: [],
    },
    representativeArticles: [
      {
        articleId: {
          type: Schema.Types.ObjectId,
          ref: 'Headline',
        },
        relevance: {
          type: Number,
          min: 0,
          max: 1,
        },
      },
    ],
    status: {
      type: String,
      enum: ['rising', 'peak', 'declining'],
      default: 'rising',
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying by status and velocity
TrendSchema.index({ status: 1, velocity: -1 });

export default mongoose.model<ITrend>('Trend', TrendSchema);