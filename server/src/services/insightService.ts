import Insight from '../models/insight';
import Trend from '../models/trend';
import Headline from '../models/headline';
import { IInsight } from '../types';
import logger from '../config/logger';
import trendService from './trendService';
import {
  generateSpikeInsight,
  generateTrendingInsight,
  generateWeeklySummary,
  generateSentimentShiftInsight,
} from '../analyser/insightGenerator';
import { analyzeSentiment } from '../analyser/sentimentAnalyser';

/**
 * Insight generation engine
 */
class InsightService {
  /**
   * Get insights with optional filters
   */
  async getInsights(filters: { featured?: boolean; type?: string; limit?: number }) {
    const query: any = {};
    if (filters.featured !== undefined) query.featured = filters.featured;
    if (filters.type) query.type = filters.type;

    const insights = await Insight.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 20)
      .populate('relatedTrends', 'keyword velocity status')
      .lean();

    return insights;
  }

  /**
   * Generate insights from trends and headlines
   */
  async generateInsights(): Promise<void> {
    logger.info('💡 Insight generation job started');

    try {
      const generatedInsights: Partial<IInsight>[] = [];

      // 1. Generate anomaly insights (spikes/drops)
      const anomalies = await trendService.detectAnomalies();
      
      for (const anomaly of anomalies.slice(0, 3)) { // Top 3 anomalies
        const insightData = generateSpikeInsight(
          anomaly.keyword,
          anomaly.percentChange,
          anomaly.currentCount,
          anomaly.historicalAvg
        );

        // Find related trend IDs
        const relatedTrend = await Trend.findOne({ keyword: anomaly.keyword });

        generatedInsights.push({
          ...insightData,
          relatedTrends: relatedTrend ? [relatedTrend._id.toString()] : [],
          featured: Math.abs(anomaly.percentChange) > 200, // Feature major spikes
        });
      }

      // 2. Generate trending topic insight
      const risingTrends = await Trend.find({ status: 'rising' })
        .sort({ velocity: -1 })
        .limit(5)
        .lean();

      if (risingTrends.length > 0) {
        const trendingInsight = generateTrendingInsight(
          risingTrends.map(t => ({
            keyword: t.keyword,
            count: t.count,
            firstSeen: t.firstSeen,
            lastSeen: t.lastSeen,
            velocity: t.velocity,
            status: t.status,
          }))
        );

        generatedInsights.push({
          ...trendingInsight,
          relatedTrends: risingTrends.map(t => t._id.toString()),
          featured: true, // Always feature top trending
        });
      }

      // 3. Generate weekly summary
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const weeklyHeadlines = await Headline.find({
        publishedAt: { $gte: sevenDaysAgo },
      }).lean();

      // Get top sources
      const sourceCounts = new Map<string, number>();
      weeklyHeadlines.forEach(h => {
        sourceCounts.set(h.source, (sourceCounts.get(h.source) || 0) + 1);
      });

      const topSources = Array.from(sourceCounts.entries())
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);

      const allTrends = await Trend.find({
        lastSeen: { $gte: sevenDaysAgo },
      })
        .sort({ velocity: -1 })
        .lean();

      if (weeklyHeadlines.length > 0) {
        const summaryInsight = generateWeeklySummary(
          allTrends.map(t => ({
            keyword: t.keyword,
            count: t.count,
            firstSeen: t.firstSeen,
            lastSeen: t.lastSeen,
            velocity: t.velocity,
            status: t.status,
          })),
          weeklyHeadlines.length,
          topSources
        );

        generatedInsights.push({
          ...summaryInsight,
          relatedTrends: allTrends.slice(0, 5).map(t => t._id.toString()),
          featured: false,
        });
      }

      // Save all generated insights
      for (const insight of generatedInsights) {
        await Insight.create(insight);
      }

      logger.info(`✅ Generated ${generatedInsights.length} insights`);

      // Clean up old non-featured insights (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await Insight.deleteMany({
        featured: false,
        createdAt: { $lt: thirtyDaysAgo },
      });

      logger.info('✅ Insight generation job completed');
    } catch (error) {
      logger.error('Insight generation failed:', error);
      throw error;
    }
  }

  /**
   * Create a manual insight (for testing)
   */
  async createInsight(data: Partial<IInsight>): Promise<IInsight> {
    const insight = await Insight.create(data);
    return insight;
  }

  /**
   * Get featured insights for homepage
   */
  async getFeaturedInsights(limit: number = 5): Promise<IInsight[]> {
    return await Insight.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('relatedTrends', 'keyword velocity')
      .lean() as IInsight[];
  }
}

export default new InsightService();