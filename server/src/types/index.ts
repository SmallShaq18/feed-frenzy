import { Document } from 'mongoose';

// Headline (Article) Types
export interface IHeadline extends Document {
  title: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: Date;
  scrapedAt: Date;
  content?: string;
  summary?: string;
  keywords: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  category?: string;
  imageUrl?: string;
  processing?: boolean;
  sourceType: 'rss' | 'html' | 'api';
  metadata: {
    clicks: number;
    shares: number;
  };
}

// Trend Types
export interface ITrend extends Document {
  keyword: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  velocity: number;
  window: string;
  relatedKeywords: string[];
  representativeArticles: Array<{
    articleId: string;
    relevance: number;
  }>;
  status: 'rising' | 'peak' | 'declining';
  generatedAt: Date;
}

// Insight Types
export interface IInsight extends Document {
  type: 'pattern' | 'anomaly' | 'prediction' | 'summary';
  title: string;
  body: string;
  confidence: number;
  data: Record<string, any>;
  relatedTrends: string[];
  createdAt: Date;
  featured: boolean;
  tone: 'playful' | 'shocking' | 'informative';
}

// Newsletter Types
export interface ISubscriber {
  email: string;
  subscribedAt: Date;
  status: 'active' | 'unsubscribed';
  preferences: {
    frequency: 'weekly' | 'daily';
    topics: string[];
  };
  unsubscribeToken: string;
  subscriberIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INewsletter extends Document {
  subject: string;
  htmlContent: string;
  textContent: string;
  sentAt: Date;
  recipients: number;
  insights: string[]; // Insight IDs
  trends: string[]; // Trend IDs
  subscribers: ISubscriber[];
  recipientEmails: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscribePayload {
  email: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}