import logger from '../config/logger';

/**
 * Simple sentiment analysis using lexicon-based approach
 * For production, consider using a library like 'sentiment' or 'natural'
 */

// Positive words
const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'wonderful',
  'best', 'better', 'love', 'loved', 'perfect', 'brilliant', 'outstanding',
  'success', 'successful', 'win', 'winner', 'won', 'breakthrough', 'innovation',
  'revolutionary', 'innovative', 'growth', 'profit', 'gain', 'surge', 'boom',
  'rise', 'rising', 'soar', 'soaring', 'excited', 'exciting', 'celebration',
  'milestone', 'achievement', 'record', 'high', 'positive', 'optimistic',
  'bullish', 'upgrade', 'improved', 'launch', 'launched', 'debut'
]);

// Negative words
const NEGATIVE_WORDS = new Set([
  'bad', 'worst', 'terrible', 'awful', 'horrible', 'disappointing', 'failed',
  'failure', 'lose', 'lost', 'loss', 'decline', 'fall', 'falling', 'drop',
  'crash', 'crisis', 'scandal', 'controversy', 'lawsuit', 'investigation',
  'fraud', 'scam', 'hack', 'hacked', 'breach', 'concern', 'worried', 'fear',
  'threat', 'risk', 'danger', 'problem', 'issue', 'trouble', 'difficult',
  'challenge', 'struggle', 'struggling', 'warning', 'alert', 'critical',
  'emergency', 'disaster', 'catastrophe', 'devastating', 'negative', 'bearish',
  'downgrade', 'cut', 'layoff', 'layoffs', 'recession', 'downturn'
]);

export type Sentiment = 'positive' | 'neutral' | 'negative';

interface SentimentScore {
  sentiment: Sentiment;
  score: number; // -1 to 1
  positiveCount: number;
  negativeCount: number;
}

/**
 * Analyze sentiment of text
 */
export function analyzeSentiment(text: string): SentimentScore {
  if (!text || text.trim().length === 0) {
    return {
      sentiment: 'neutral',
      score: 0,
      positiveCount: 0,
      negativeCount: 0,
    };
  }

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (POSITIVE_WORDS.has(word)) positiveCount++;
    if (NEGATIVE_WORDS.has(word)) negativeCount++;
  });

  // Calculate normalized score
  const totalSentimentWords = positiveCount + negativeCount;
  let score = 0;

  if (totalSentimentWords > 0) {
    score = (positiveCount - negativeCount) / totalSentimentWords;
  }

  // Determine sentiment category
  let sentiment: Sentiment = 'neutral';
  if (score > 0.2) sentiment = 'positive';
  else if (score < -0.2) sentiment = 'negative';

  return {
    sentiment,
    score,
    positiveCount,
    negativeCount,
  };
}

/**
 * Analyze sentiment trend over time
 */
export function analyzeSentimentTrend(
  documents: Array<{ text: string; date: Date }>
): {
  overall: Sentiment;
  trend: 'improving' | 'declining' | 'stable';
  timeSeriesData: Array<{ date: Date; score: number }>;
} {
  const timeSeriesData = documents.map(doc => ({
    date: doc.date,
    score: analyzeSentiment(doc.text).score,
  }));

  // Sort by date
  timeSeriesData.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate overall sentiment
  const averageScore =
    timeSeriesData.reduce((sum, item) => sum + item.score, 0) / timeSeriesData.length;

  let overall: Sentiment = 'neutral';
  if (averageScore > 0.2) overall = 'positive';
  else if (averageScore < -0.2) overall = 'negative';

  // Detect trend (compare first half vs second half)
  const midPoint = Math.floor(timeSeriesData.length / 2);
  const firstHalfAvg =
    timeSeriesData.slice(0, midPoint).reduce((sum, item) => sum + item.score, 0) / midPoint;
  const secondHalfAvg =
    timeSeriesData
      .slice(midPoint)
      .reduce((sum, item) => sum + item.score, 0) /
    (timeSeriesData.length - midPoint);

  const difference = secondHalfAvg - firstHalfAvg;
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (difference > 0.15) trend = 'improving';
  else if (difference < -0.15) trend = 'declining';

  return { overall, trend, timeSeriesData };
}

logger.info('✅ Sentiment analyzer loaded');