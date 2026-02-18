import logger from '../config/logger';
import { DetectedTrend } from './trendDetector';
import { Sentiment } from './sentimentAnalyser';

/**
 * Generates human-readable insights with chaotic-fun personality
 */

interface InsightData {
  type: 'pattern' | 'anomaly' | 'prediction' | 'summary';
  title: string;
  body: string;
  data: Record<string, any>;
  tone: 'playful' | 'shocking' | 'informative';
}

/**
 * Generate spike insight
 */
export function generateSpikeInsight(
  keyword: string,
  percentChange: number,
  currentCount: number,
  historicalAvg: number
): InsightData {
  const isPositive = percentChange > 0;
  const magnitude = Math.abs(Math.round(percentChange));

  const playfulIntros = [
    `Holy smokes! 🎢`,
    `Plot twist incoming: 🌪️`,
    `The internet can't stop talking about`,
    `Breaking the charts:`,
    `Whoa there, cowboy! 🤠`,
  ];

  const intro = playfulIntros[Math.floor(Math.random() * playfulIntros.length)];

  const title = `${intro} "${keyword}" ${isPositive ? 'exploded' : 'crashed'} ${magnitude}%`;

  const body = isPositive
    ? `"${keyword}" mentions skyrocketed from ${historicalAvg.toFixed(1)} to ${currentCount} articles. That's a ${magnitude}% spike! Either everyone suddenly cares about this, or we're witnessing the birth of a new obsession. 📈`
    : `"${keyword}" mentions nosedived from ${historicalAvg.toFixed(1)} to ${currentCount} articles—a ${magnitude}% drop. Did everyone lose interest overnight, or did something better come along? 📉`;

  return {
    type: 'anomaly',
    title,
    body,
    data: {
      keyword,
      percentChange,
      currentCount,
      historicalAvg,
      chartData: {
        before: historicalAvg,
        after: currentCount,
      },
    },
    tone: 'playful',
  };
}

/**
 * Generate trending topic insight
 */
export function generateTrendingInsight(trends: DetectedTrend[]): InsightData {
  const topTrend = trends[0];
  
  const title = `"${topTrend.keyword}" is ON FIRE 🔥`;
  
  const body = `With ${topTrend.count} mentions and a velocity of ${topTrend.velocity.toFixed(1)} articles/day, "${topTrend.keyword}" is dominating the conversation. First spotted ${formatTimeAgo(topTrend.firstSeen)}, it's showing no signs of slowing down.`;

  const topKeywords = trends.slice(0, 5).map(t => t.keyword);

  return {
    type: 'pattern',
    title,
    body,
    data: {
      topTrend: topTrend.keyword,
      velocity: topTrend.velocity,
      count: topTrend.count,
      relatedTrends: topKeywords,
    },
    tone: 'playful',
  };
}

/**
 * Generate sentiment shift insight
 */
export function generateSentimentShiftInsight(
  keyword: string,
  oldSentiment: Sentiment,
  newSentiment: Sentiment,
  percentChange: number
): InsightData {
  const direction = oldSentiment === 'positive' && newSentiment === 'negative' 
    ? 'soured' 
    : 'improved';

  const emoji = direction === 'soured' ? '😬' : '😊';

  const title = `Vibes check: "${keyword}" sentiment ${direction} ${emoji}`;

  const body = `The mood around "${keyword}" shifted from ${oldSentiment} to ${newSentiment}. That's a ${Math.abs(percentChange).toFixed(0)}% change in how people are talking about it. What happened?`;

  return {
    type: 'pattern',
    title,
    body,
    data: {
      keyword,
      oldSentiment,
      newSentiment,
      percentChange,
    },
    tone: newSentiment === 'negative' ? 'shocking' : 'informative',
  };
}

/**
 * Generate weekly summary insight
 */
export function generateWeeklySummary(
  topTrends: DetectedTrend[],
  totalArticles: number,
  topSources: Array<{ source: string; count: number }>
): InsightData {
  const topKeywords = topTrends.slice(0, 3).map(t => t.keyword).join(', ');

  const title = `This week in chaos: ${totalArticles} headlines, infinite opinions 🎪`;

  const body = `We scraped ${totalArticles} articles this week. The internet was obsessed with: ${topKeywords}. ${topSources[0]?.source || 'Various sources'} led the pack with ${topSources[0]?.count || 0} articles. What a ride.`;

  return {
    type: 'summary',
    title,
    body,
    data: {
      totalArticles,
      topTrends: topKeywords,
      topSources: topSources.slice(0, 3),
      period: 'week',
    },
    tone: 'playful',
  };
}

/**
 * Generate correlation insight (when two trends move together)
 */
export function generateCorrelationInsight(
  keyword1: string,
  keyword2: string,
  correlation: number
): InsightData {
  const strength = correlation > 0.7 ? 'strongly' : 'loosely';
  
  const title = `"${keyword1}" and "${keyword2}" are ${strength} connected 🔗`;
  
  const body = `Whenever "${keyword1}" trends, "${keyword2}" tends to follow. These topics are moving together with a ${(correlation * 100).toFixed(0)}% correlation. Coincidence? We think not.`;

  return {
    type: 'pattern',
    title,
    body,
    data: {
      keyword1,
      keyword2,
      correlation,
    },
    tone: 'informative',
  };
}

/**
 * Helper: Format time ago
 */
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

logger.info('✅ Insight generator loaded');