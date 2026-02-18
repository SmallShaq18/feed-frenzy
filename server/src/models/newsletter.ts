import mongoose, { Schema } from 'mongoose';
import { INewsletter } from '../types';


const NewsletterSchema = new Schema<INewsletter>(
  {
    subject: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    textContent: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    recipients: {
      type: Number,
      required: true,
    },
    insights: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Insight',
      },
    ],
    trends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Trend',
      },
    ],
    subscribers: [
  { type: Schema.Types.ObjectId, ref: 'Subscriber' }
],
recipientEmails: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

//export const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
export const Newsletter = mongoose.model<INewsletter>('Newsletter', NewsletterSchema);