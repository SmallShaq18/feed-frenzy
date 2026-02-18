import mongoose, {Schema} from "mongoose";
import {ISubscriber} from "../types";
import crypto from 'crypto';

const SubscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active',
  },
  preferences: {
    frequency: {
      type: String,
      enum: ['weekly', 'daily'],
      default: 'weekly',
    },
    topics: {
      type: [String],
      default: [],
    },
  },
  unsubscribeToken: {
    type: String,
    default: () => crypto.randomBytes(32).toString('hex'),
    unique: true,
  },  
}, {
  timestamps: true,
});

export default mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);