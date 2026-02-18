import mongoose, { Schema } from 'mongoose';
import { IInsight } from '../types';

const InsightSchema = new Schema<IInsight>(
  {
    type: {
      type: String,
      enum: ['pattern', 'anomaly', 'prediction', 'summary'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed, // Flexible JSON data
      default: {},
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    relatedTrends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Trend',
      },
    ],
    featured: {
      type: Boolean,
      default: false,
      index: true, // Fast querying of featured insights
    },
    tone: {
      type: String,
      enum: ['playful', 'shocking', 'informative'],
      default: 'informative',
    },
  },
  {
    timestamps: true,
  }
);

// Index for homepage queries (featured, recent)
InsightSchema.index({ featured: -1, createdAt: -1 });

export default mongoose.model<IInsight>('Insight', InsightSchema);