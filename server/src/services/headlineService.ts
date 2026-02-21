import Headline from '../models/headline';
import { IHeadline } from '../types';
import AppError from '../utils/appErrors';
import { extractKeywordsFromMultiple } from '../analyser/keywordExtractor';
import { analyzeSentiment } from '../analyser/sentimentAnalyser';
import logger from '../config/logger';

/**
 * Business logic for headline operations
 */
class HeadlineService {
  /**
   * Retrieve paginated headlines with optional filters
   */
  async getHeadlines(filters: {
    page?: number;
    limit?: number;
    source?: string;
    category?: string;
    keyword?: string;
    search?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (filters.source) query.source = filters.source;
    if (filters.category) query.category = filters.category;
    if (filters.keyword) query.keywords = { $in: [filters.keyword] };
    if (filters.sentiment) query.sentiment = filters.sentiment;
    if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { summary: { $regex: filters.search, $options: 'i' } },
      { keywords: { $in: [new RegExp(filters.search, 'i')] } },
    ];
  }

    const [headlines, total] = await Promise.all([
      Headline.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Headline.countDocuments(query),
    ]);

    return {
      headlines,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single headline by ID
   */
  async getHeadlineById(id: string): Promise<IHeadline> {
    const headline = await Headline.findById(id);
    if (!headline) {
      throw new AppError('Headline not found', 404);
    }
    return headline;
  }

  /**
   * Create new headline with automatic keyword extraction and sentiment analysis
   */
  async createHeadline(data: Partial<IHeadline>): Promise<IHeadline> {
    try {
      // Extract keywords if not provided
      if (!data.keywords || data.keywords.length === 0) {
        const texts = [data.title, data.summary, data.content].filter(Boolean) as string[];
        data.keywords = extractKeywordsFromMultiple(texts, 10);
        logger.debug(`Extracted keywords for "${data.title}": ${data.keywords.join(', ')}`);
      }

      // Analyze sentiment if not provided
      if (!data.sentiment) {
        const text = `${data.title} ${data.summary || ''}`;
        const sentimentResult = analyzeSentiment(text);
        data.sentiment = sentimentResult.sentiment;
        logger.debug(`Analyzed sentiment for "${data.title}": ${data.sentiment}`);
      }

      const headline = await Headline.create(data);
      return headline;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Headline with this URL already exists', 400);
      }
      throw error;
    }
  }

  async trackClick(id: string): Promise<IHeadline> {
    const headline = await Headline.findByIdAndUpdate(
      id,
      { $inc: { 'metadata.clicks': 1 } },
      { new: true }
    );    
    if (!headline) {
      throw new AppError('Headline not found', 404);
    }
    return headline;
  }


  /**
   * Bulk insert headlines (for scraper efficiency)
   * Automatically extracts keywords and sentiment for each
   */
  async bulkCreateHeadlines(headlines: Partial<IHeadline>[]): Promise<number> {
    try {
      // Process each headline
      const processedHeadlines = headlines.map(h => {
        // Extract keywords
        if (!h.keywords || h.keywords.length === 0) {
          const texts = [h.title, h.summary, h.content].filter(Boolean) as string[];
          h.keywords = extractKeywordsFromMultiple(texts, 10);
        }

        // Analyze sentiment
        if (!h.sentiment) {
          const text = `${h.title} ${h.summary || ''}`;
          h.sentiment = analyzeSentiment(text).sentiment;
        }

        return h;
      });

      const result = await Headline.insertMany(processedHeadlines, { ordered: false });
      logger.info(`✅ Bulk inserted ${result.length} headlines`);
      return result.length;
    } catch (error: any) {
      // Some may fail due to duplicates, return successful count
      const insertedCount = error.insertedDocs?.length || 0;
      logger.warn(`Bulk insert completed with ${insertedCount} successful inserts`);
      return insertedCount;
    }
  }

  /**
   * Get headlines grouped by source
   */
  async getHeadlinesBySource(): Promise<Array<{ source: string; count: number }>> {
    const result = await Headline.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          source: '$_id',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return result;
  }
}

export default new HeadlineService();