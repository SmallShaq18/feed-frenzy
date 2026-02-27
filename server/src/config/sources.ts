/**
 * Configuration for news sources to scrape
 * Each source has RSS feeds and/or scraping rules
 */

export interface NewsSource {
  name: string;
  enabled: boolean;
  type: 'rss' | 'html' | 'both';
  rssUrl?: string;
  websiteUrl?: string;
  category?: string;
  scrapeRules?: {
    articleSelector?: string;
    titleSelector?: string;
    linkSelector?: string;
    dateSelector?: string;
    summarySelector?: string;
    imageSelector?: string;
  };
}

export const NEWS_SOURCES: NewsSource[] = [
  // Tech News
  {
    name: 'TechCrunch',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://techcrunch.com/feed/',
    category: 'tech',
  },
  {
    name: 'The Verge',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
  },
  {
    name: 'Ars Technica',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'tech',
  },
  {
    name: 'Hacker News',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://hnrss.org/frontpage',
    category: 'tech',
  },
  {
    name: 'Wired',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.wired.com/feed/rss',
    category: 'tech',
  },
  
  // Movies
{
  name: 'Variety - Film News',
  enabled: true,
  type: 'rss',
  rssUrl: 'https://variety.com/v/film/feed/',
  category: 'movies',
},
{
  name: 'The Hollywood Reporter - Movies',
  enabled: true,
  type: 'rss',
  rssUrl: 'https://www.hollywoodreporter.com/t/movies/feed/',
  category: 'movies',
},
{
  name: 'Screen Rant - Movie News',
  enabled: true,
  type: 'rss',
  rssUrl: 'https://screenrant.com/movie-news/feed/',
  category: 'movies',
},
{
  name: 'Rotten Tomatoes - Movie News',
  enabled: true,
  type: 'rss',
  rssUrl: 'https://editorial.rottentomatoes.com/feed/',
  category: 'movies',
},
{
  name: 'ComingSoon.net - Movies',
  enabled: true,
  type: 'rss',
  rssUrl: 'https://www.comingsoon.net/category/movies/feed',
  category: 'movies',
},

  // Anime & Manga
  {
    name: 'Crunchyroll News',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.crunchyroll.com/news/rss',
    category: 'anime',
  },
  {
    name: 'Anime News Network',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.animenewsnetwork.com/news/rss.xml',
    category: 'anime',
  },
  {
    name: 'MyAnimeList News',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://myanimelist.net/rss/news.xml',
    category: 'anime',
  },
  
  // AI & Machine Learning
  {
    name: 'MIT Technology Review',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.technologyreview.com/feed/',
    category: 'ai',
  },
  {
    name: 'VentureBeat AI',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://venturebeat.com/category/ai/feed/',
    category: 'ai',
  },

  // General News
  {
    name: 'BBC Technology',
    enabled: true,
    type: 'rss',
    rssUrl: 'http://feeds.bbci.co.uk/news/technology/rss.xml',
    category: 'tech',
  },
  {
    name: 'The Guardian Tech',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.theguardian.com/technology/rss',
    category: 'tech',
  },

  // Crypto & Web3
  {
    name: 'CoinDesk',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'crypto',
  },
  {
    name: 'The Block',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.theblock.co/rss.xml',
    category: 'crypto',
  },

  // Startups & Venture Capital
  {
    name: 'TechCrunch Startups',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://techcrunch.com/category/startups/feed/',
    category: 'startups',
  },
  {
    name: 'TechCrunch Venture',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://techcrunch.com/category/venture/feed/',
    category: 'startups',
  },
  {
    name: 'VentureBeat',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://venturebeat.com/feed/',
    category: 'startups',
  },
  {
    name: 'Crunchbase News',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://news.crunchbase.com/feed/',
    category: 'startups',
  },
  {
    name: 'Entrepreneur Startups',
    enabled: true,
    type: 'rss',
    rssUrl: 'https://www.entrepreneur.com/latest.rss',
    category: 'startups',
  }
];

/**
 * Get enabled sources only
 */
export function getEnabledSources(): NewsSource[] {
  return NEWS_SOURCES.filter(source => source.enabled);
}

/**
 * Get sources by category
 */
export function getSourcesByCategory(category: string): NewsSource[] {
  return NEWS_SOURCES.filter(
    source => source.enabled && source.category === category
  );
}

/**
 * Get source by name
 */
export function getSourceByName(name: string): NewsSource | undefined {
  return NEWS_SOURCES.find(source => source.name === name);
}