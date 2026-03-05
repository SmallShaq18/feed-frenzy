import axios from 'axios';
import * as cheerio from 'cheerio';
import logger from '../config/logger';
import { NewsSource } from '../config/sources';
import { IHeadline } from '../types';

/**
 * HTML Web Scraper using Cheerio
 * For sites without RSS feeds or when you need custom scraping
 */

/**
 * Scrape articles from a website using custom selectors
 */

export async function scrapeHTMLPage(source: NewsSource): Promise<Partial<IHeadline>[]> {
  if (!source.websiteUrl || !source.scrapeRules) {
    throw new Error(`No website URL or scrape rules configured for ${source.name}`);
  }

  try {
    logger.info(`🕷️  Scraping HTML from ${source.name}`);

    // Fetch the page
    const response = await axios.get(source.websiteUrl, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const headlines: Partial<IHeadline>[] = [];
    const rules = source.scrapeRules;

    // Find all article elements
    const articles = $(rules.articleSelector || 'article');

    articles.each((index, element) => {
      try {
        const $article = $(element);

        // Extract title
        const title = rules.titleSelector
          ? $article.find(rules.titleSelector).text().trim()
          : $article.find('h1, h2, h3').first().text().trim();

        if (!title) return; // Skip if no title

        // Extract link
        let link = rules.linkSelector
          ? $article.find(rules.linkSelector).attr('href')
          : $article.find('a').first().attr('href');

        if (!link) return; // Skip if no link

        // Make absolute URL if relative
        
        // Make absolute URL if relative
        if (link.startsWith('/')) {
          if (!source.websiteUrl) {
            logger.warn(`Skipping relative link for ${source.name}: no websiteUrl configured`);
            return;  // Skip this link
          }
          
          const baseUrl = new URL(source.websiteUrl);  // ✓ TypeScript knows it's defined now
          link = `${baseUrl.origin}${link}`;
        }

        // Extract summary
        const summary = rules.summarySelector
          ? $article.find(rules.summarySelector).text().trim().substring(0, 500)
          : $article.find('p').first().text().trim().substring(0, 500);

        // Extract image
        const imageUrl = rules.imageSelector
          ? $article.find(rules.imageSelector).attr('src')
          : $article.find('img').first().attr('src');

        // Extract date (tricky - formats vary widely)
        let publishedAt: Date = new Date();
        if (rules.dateSelector) {
          const dateText = $article.find(rules.dateSelector).text().trim();
          const parsedDate = new Date(dateText);
          if (!isNaN(parsedDate.getTime())) {
            publishedAt = parsedDate;
          }
        }

        const headline: Partial<IHeadline> = {
          title,
          url: link,
          source: source.name,
          publishedAt,
          scrapedAt: new Date(),
          summary,
          category: source.category,
          imageUrl: imageUrl?.startsWith('http') ? imageUrl : undefined,
          metadata: {
            clicks: 0,
            shares: 0,
          },
        };

        headlines.push(headline);
      } catch (itemError) {
        logger.error(`Error parsing article from ${source.name}:`, itemError);
      }
    });

    logger.info(`✅ Scraped ${headlines.length} articles from ${source.name} (HTML)`);
    return headlines;
  } catch (error) {
    logger.error(`❌ Failed to scrape HTML from ${source.name}:`, error);
    throw error;
  }
}

/**
 * Scrape full article content from a URL
 * Useful for getting full text beyond RSS summaries
 */

export async function scrapeArticleContent(url: string): Promise<string | null> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $('script, style, nav, header, footer, aside, .ad, .advertisement').remove();

    // Try common article content selectors
    const contentSelectors = [
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '[itemprop="articleBody"]',
      'main',
    ];

    for (const selector of contentSelectors) {
      const content = $(selector).text().trim();
      if (content && content.length > 200) {
        return content.substring(0, 5000); // Limit to 5000 chars
      }
    }

    // Fallback: get all paragraph text
    const paragraphs = $('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .join(' ');

    return paragraphs.substring(0, 5000) || null;
  } catch (error) {
    logger.error(`Failed to scrape article content from ${url}:`, error);
    return null;
  }
}

/**
 * Example: Custom scraper for a specific site (Hacker News HTML if RSS fails)
 */

export async function scrapeHackerNewsHTML(): Promise<Partial<IHeadline>[]> {
  try {
    logger.info('🕷️  Scraping Hacker News HTML');

    const response = await axios.get('https://news.ycombinator.com/', {
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const headlines: Partial<IHeadline>[] = [];

    $('.athing').each((index, element) => {
      try {
        const $row = $(element);
        const $titleLine = $row.find('.titleline > a').first();
        
        const title = $titleLine.text().trim();
        const url = $titleLine.attr('href') || '';

        if (title && url) {
          headlines.push({
            title,
            url: url.startsWith('http') ? url : `https://news.ycombinator.com/${url}`,
            source: 'Hacker News',
            publishedAt: new Date(),
            scrapedAt: new Date(),
            category: 'tech',
            metadata: {
              clicks: 0,
              shares: 0,
            },
          });
        }
      } catch (err) {
        logger.error('Error parsing HN item:', err);
      }
    });

    logger.info(`✅ Scraped ${headlines.length} articles from Hacker News (HTML)`);
    return headlines;
  } catch (error) {
    logger.error('❌ Failed to scrape Hacker News HTML:', error);
    return [];
  }
}