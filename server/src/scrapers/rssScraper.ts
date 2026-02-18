import Parser from 'rss-parser';
import logger from '../config/logger';
import { NewsSource } from '../config/sources';
import { IHeadline } from '../types';

/**
 * RSS Feed Scraper
 * Parses RSS/Atom feeds and converts to headline format
 */

const parser = new Parser({
  timeout: 10000, // 10 second timeout
  customFields: {
    item: [
      ['media:content', 'media'],
      ['media:thumbnail', 'thumbnail'],
      ['content:encoded', 'fullContent'],
      ['dc:creator', 'author'],
    ],
  },
});

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
  enclosure?: {
    url?: string;
  };
  [key: string]: any;
}

/**
 * Scrape a single RSS feed
 */
export async function scrapeRSSFeed(source: NewsSource): Promise<Partial<IHeadline>[]> {
  if (!source.rssUrl) {
    throw new Error(`No RSS URL configured for ${source.name}`);
  }

  try {
    logger.info(`📡 Fetching RSS feed from ${source.name}`);

    const feed = await parser.parseURL(source.rssUrl);
    const headlines: Partial<IHeadline>[] = [];

    for (const item of feed.items as RSSItem[]) {
      try {
        // Skip if missing required fields
        if (!item.title || !item.link) {
          logger.warn(`Skipping item from ${source.name}: missing title or link`);
          continue;
        }

        // Parse publication date
        let publishedAt: Date;
        if (item.isoDate) {
          publishedAt = new Date(item.isoDate);
        } else if (item.pubDate) {
          publishedAt = new Date(item.pubDate);
        } else {
          publishedAt = new Date(); // Fallback to now
        }

        // Extract author
        const author = item.creator || item.author || item['dc:creator'] || undefined;

        // Extract summary/description
        let summary = item.contentSnippet || item.content || '';
        
        // Clean up summary (remove HTML tags if any leaked through)
        summary = summary
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 500); // Limit to 500 chars

        // Extract image URL
        let imageUrl: string | undefined;
        
        // Try different image sources
        if (item.enclosure?.url) {
          imageUrl = item.enclosure.url;
        } else if (item.media?.$ && item.media.$.url) {
          imageUrl = item.media.$.url;
        } else if (item.thumbnail?.$ && item.thumbnail.$.url) {
          imageUrl = item.thumbnail.$.url;
        }

        const headline: Partial<IHeadline> = {
          title: item.title.trim(),
          url: item.link.trim(),
          source: source.name,
          author,
          publishedAt,
          scrapedAt: new Date(),
          summary,
          category: source.category,
          imageUrl,
          metadata: {
            clicks: 0,
            shares: 0,
          },
        };

        headlines.push(headline);
      } catch (itemError) {
        logger.error(`Error parsing item from ${source.name}:`, itemError);
      }
    }

    logger.info(`✅ Scraped ${headlines.length} articles from ${source.name}`);
    return headlines;
  } catch (error) {
    logger.error(`❌ Failed to scrape ${source.name}:`, error);
    throw error;
  }
}

/**
 * Scrape multiple RSS feeds concurrently
 */
export async function scrapeMultipleRSSFeeds(
  sources: NewsSource[]
): Promise<Partial<IHeadline>[]> {
  const rssFeeds = sources.filter(s => s.type === 'rss' || s.type === 'both');

  logger.info(`📡 Scraping ${rssFeeds.length} RSS feeds concurrently`);

  // Scrape all feeds in parallel
  const results = await Promise.allSettled(
    rssFeeds.map(source => scrapeRSSFeed(source))
  );

  // Collect successful results
  const allHeadlines: Partial<IHeadline>[] = [];
  let successCount = 0;
  let failCount = 0;

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allHeadlines.push(...result.value);
      successCount++;
    } else {
      failCount++;
      logger.error(`Failed to scrape ${rssFeeds[index].name}:`, result.reason);
    }
  });

  logger.info(
    `📊 RSS scraping complete: ${successCount} succeeded, ${failCount} failed, ${allHeadlines.length} total articles`
  );

  return allHeadlines;
}