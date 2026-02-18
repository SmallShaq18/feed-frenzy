import logger from '../config/logger';
import { analyzeKeywordFrequency } from './keywordExtractor';

/**
 * Detects trending keywords and their velocity
 */

export interface DetectedTrend {
  keyword: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  velocity: number; // Articles per day
  status: 'rising' | 'peak' | 'declining';
}

/**
 * Detect trends from documents over time
 */
export function detectTrends(
  documents: Array<{ text: string; date: Date }>,
  minMentions: number = 3
): DetectedTrend[] {
  const keywordFrequency = analyzeKeywordFrequency(documents);
  const trends: DetectedTrend[] = [];

  keywordFrequency.forEach((data, keyword) => {
    if (data.count < minMentions) return;

    const dates = data.dates.sort((a, b) => a.getTime() - b.getTime());
    const firstSeen = dates[0];
    const lastSeen = dates[dates.length - 1];

    // Calculate velocity (mentions per day)
    const timeSpanDays =
      (lastSeen.getTime() - firstSeen.getTime()) / (1000 * 60 * 60 * 24) || 1;
    const velocity = data.count / timeSpanDays;

    // Determine status based on recent activity
    const now = new Date();
    const hoursSinceLastSeen = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60);
    
    let status: 'rising' | 'peak' | 'declining' = 'peak';
    if (hoursSinceLastSeen < 24 && velocity > 1) {
      status = 'rising';
    } else if (hoursSinceLastSeen > 48) {
      status = 'declining';
    }

    trends.push({
      keyword,
      count: data.count,
      firstSeen,
      lastSeen,
      velocity,
      status,
    });
  });

  // Sort by velocity (hottest trends first)
  return trends.sort((a, b) => b.velocity - a.velocity);
}

/**
 * Detect anomalies (sudden spikes in mentions)
 */
export function detectAnomalies(
  currentTrends: DetectedTrend[],
  historicalBaseline: Map<string, number>
): Array<{ keyword: string; currentCount: number; historicalAvg: number; percentChange: number }> {
  const anomalies: Array<{
    keyword: string;
    currentCount: number;
    historicalAvg: number;
    percentChange: number;
  }> = [];

  currentTrends.forEach(trend => {
    const baseline = historicalBaseline.get(trend.keyword);
    if (baseline && baseline > 0) {
      const percentChange = ((trend.count - baseline) / baseline) * 100;

      // Flag if >100% increase or >50% decrease
      if (Math.abs(percentChange) > 100) {
        anomalies.push({
          keyword: trend.keyword,
          currentCount: trend.count,
          historicalAvg: baseline,
          percentChange,
        });
      }
    }
  });

  return anomalies.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
}

/**
 * Calculate trend momentum (rate of change)
 */
export function calculateMomentum(
  keyword: string,
  documents: Array<{ text: string; date: Date }>
): {
  keyword: string;
  momentum: 'accelerating' | 'steady' | 'decelerating';
  recentVelocity: number;
  previousVelocity: number;
} {
  // Split documents into recent vs previous periods
  const sortedDocs = documents.sort((a, b) => b.date.getTime() - a.date.getTime());
  const midPoint = Math.floor(sortedDocs.length / 2);
  
  const recentDocs = sortedDocs.slice(0, midPoint);
  const previousDocs = sortedDocs.slice(midPoint);

  const recentMentions = recentDocs.filter(doc => 
    doc.text.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  const previousMentions = previousDocs.filter(doc =>
    doc.text.toLowerCase().includes(keyword.toLowerCase())
  ).length;

  const recentVelocity = recentMentions / (midPoint || 1);
  const previousVelocity = previousMentions / (sortedDocs.length - midPoint || 1);

  let momentum: 'accelerating' | 'steady' | 'decelerating' = 'steady';
  const change = recentVelocity - previousVelocity;
  
  if (change > 0.5) momentum = 'accelerating';
  else if (change < -0.5) momentum = 'decelerating';

  return { keyword, momentum, recentVelocity, previousVelocity };
}

logger.info('✅ Trend detector loaded');