import Trend from '../models/trend';
import Headline from '../models/headline';
import { ITrend } from '../types';
import logger from '../config/logger';
import { detectTrends, detectAnomalies } from '../analyser/trendDetector';
import { findCooccurringKeywords } from '../analyser/keywordExtractor';

/**
 * Trend detection and analysis service
 */

class TrendService {
  /**
   * Get all trends, optionally filter by status
   */

  async getTrends(status?: 'rising' | 'peak' | 'declining') {
    const query = status ? { status } : {};
    const trends = await Trend.find(query)
      .sort({ velocity: -1 })
      .populate('representativeArticles.articleId', 'title url source publishedAt')
      .lean();
    return trends;
  }

  /**
   * Detect trends from recent headlines
   */

  async detectTrends(): Promise<void> {
    logger.info('🔍 Trend detection job started');

    try {
      // Get headlines from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const headlines = await Headline.find({
        publishedAt: { $gte: sevenDaysAgo },
      })
        .select('title summary keywords publishedAt')
        .lean();

      if (headlines.length === 0) {
        logger.warn('No headlines found for trend detection');
        return;
      }

      logger.info(`Analyzing ${headlines.length} headlines for trends`);

      // Prepare documents for analysis
      const documents = headlines.map(h => ({
        text: `${h.title} ${h.summary || ''}`,
        date: h.publishedAt,
      }));

      // Detect trends
      const detectedTrends = detectTrends(documents, 3); // Minimum 3 mentions

      logger.info(`Detected ${detectedTrends.length} trends`);

      // Find co-occurring keywords
      const cooccurrence = findCooccurringKeywords(
        headlines.map(h => `${h.title} ${h.summary || ''}`),
        2
      );

      // Save or update trends in database
      for (const trend of detectedTrends) {
        // Find representative articles for this trend
        const representativeArticles = headlines
          .filter(h => {
            const text = `${h.title} ${h.summary || ''}`.toLowerCase();
            return text.includes(trend.keyword.toLowerCase());
          })
          .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
          .slice(0, 3)
          .map(h => ({
            articleId: h._id,
            relevance: 1, // Could calculate actual relevance score
          }));

        // Get related keywords
        const relatedKeywords = cooccurrence.get(trend.keyword) || [];

        await Trend.findOneAndUpdate(
          { keyword: trend.keyword },
          {
            keyword: trend.keyword,
            count: trend.count,
            firstSeen: trend.firstSeen,
            lastSeen: trend.lastSeen,
            velocity: trend.velocity,
            status: trend.status,
            relatedKeywords: relatedKeywords.slice(0, 5),
            representativeArticles,
            generatedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      }

      // Clean up old declining trends (older than 14 days)
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      await Trend.deleteMany({
        status: 'declining',
        lastSeen: { $lt: fourteenDaysAgo },
      });

      logger.info('✅ Trend detection job completed');
    } catch (error) {
      logger.error('Trend detection failed:', error);
      throw error;
    }
  }

  /**
   * Get trending keywords for a specific time range
   */

  async getTrendingKeywords(days: number = 3): Promise<string[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await Trend.find({
      lastSeen: { $gte: startDate },
    })
      .sort({ velocity: -1 })
      .limit(20)
      .select('keyword')
      .lean();

    return trends.map(t => t.keyword);
  }

  /**
   * Detect anomalies in current trends vs historical baseline
   */
  
  async detectAnomalies(): Promise<any[]> {
    // Get current trends (last 7 days)
    const currentTrends = await Trend.find({
      generatedAt: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    }).lean();

    // Get historical baseline (8-30 days ago)
    const historicalTrends = await Trend.find({
      generatedAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    }).lean();

    // Calculate historical averages
    const baseline = new Map<string, number>();
    historicalTrends.forEach(trend => {
      baseline.set(trend.keyword, trend.count);
    });

    // Detect anomalies
    const anomalies = detectAnomalies(
      currentTrends.map(t => ({
        keyword: t.keyword,
        count: t.count,
        firstSeen: t.firstSeen,
        lastSeen: t.lastSeen,
        velocity: t.velocity,
        status: t.status,
      })),
      baseline
    );

    return anomalies;
  }
}

export default new TrendService();