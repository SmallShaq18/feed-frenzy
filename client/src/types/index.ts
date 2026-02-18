/**
 * Mirrors the IHeadline interface from the backend.
 * Keep in sync with src/types/index.ts on the server.
 */
export interface Headline {
  _id: string;
  title: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: string;   // ISO string from JSON
  scrapedAt: string;
  content?: string;
  summary?: string;
  keywords: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  category?: string;
  imageUrl?: string;
  metadata: {
    clicks: number;
    shares: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Shape returned by GET /api/headlines
 */
export interface HeadlineListResponse {
  headlines: Headline[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TrendArticleRef {
  articleId: string;
  relevance: number;
}

export interface Trend {
  _id: string;
  keyword: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  velocity: number;
  relatedKeywords: string[];
  representativeArticles: TrendArticleRef[];
  status: 'rising' | 'peak' | 'declining';
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type InsightType = 'pattern' | 'anomaly' | 'prediction' | 'summary';
export type InsightTone = 'playful' | 'shocking' | 'informative';

export interface Insight {
  _id: string;
  type: InsightType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  relatedTrends: string[];
  featured: boolean;
  tone: InsightTone;
  createdAt: string;
  updatedAt: string;
}

export type SubscriberStatus = 'active' | 'unsubscribed';

export interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  status: SubscriberStatus;
  preferences: {
    frequency: 'weekly' | 'daily';
    topics: string[];
  };
}

export interface Newsletter {
  _id: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  sentAt: string;
  recipients: number;
  insights: string[];
  trends: string[];
}

export interface SubscribePayload {
  email: string;
}

