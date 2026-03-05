import mongoose, { Schema } from 'mongoose';
import { IHeadline } from '../types';

const HeadlineSchema = new Schema<IHeadline>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      unique: true, // Prevent duplicate articles
      trim: true,
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
      index: true, // Fast filtering by source
    },
    author: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
      required: true,
      index: true, // Fast sorting by date
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
    },
    summary: {
      type: String,
      maxlength: [1000, 'Summary cannot exceed 1000 characters'],
    },
    keywords: {
      type: [String],
      default: [],
      index: true, // Fast searching by keywords
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
    },
    category: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    processing: {
        keywordsExtracted: { type: Boolean, default: false },
        sentimentAnalyzed: { type: Boolean, default: false },
        addedToTrends: { type: Boolean, default: false },
        usedInInsight: { type: Boolean, default: false }
      },
    sourceType: {
        type: String,
        enum: ['rss', 'html', 'api'],
        default: 'html'
      },
    metadata: {
      clicks: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true, // Auto-creates createdAt and updatedAt
  }
);

// Compound index for efficient queries
HeadlineSchema.index({ publishedAt: -1, source: 1 });

export default mongoose.model<IHeadline>('Headline', HeadlineSchema);