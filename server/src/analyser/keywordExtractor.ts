import logger from '../config/logger';

/**
 * Production-grade keyword extraction with aggressive filtering
 */

// Comprehensive stopwords
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
  'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
  'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'between',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'also',
  'new', 'says', 'said', 'one', 'two', 'three', 'first', 'second', 'last',
  'make', 'made', 'way', 'find', 'use', 'get', 'give', 'take', 'see',
  'come', 'think', 'look', 'want', 'work', 'call', 'try', 'now', 'well', 'their',
  'over', 'year', 'down', 'your', 'streaming', 'platform', 'service', 'company', 'industry', 'market', 'world',
  'appeared', 'appears', 'gets', 'getting', 'like', 'likes', 'million', 'billion',
  'points', 'comments', 'online', 'today', 'yesterday', 'january', 'february', 'march', 'april',
  'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
  'while', 'next', 'still', 'data', 'game', 'official', 'release', 'new', 'latest', 'breaking', 'exclusive',
  'website', 'app', 'mobile', 'desktop', 'version', 'update', 'news', 'media', 'social', 'network',
  'user', 'users', 'audience', 'viewers', 'fans', 'followers', 'subscribers', 'movie', 'film', 'show', 'series', 'season', 'episode', 'trailer', 'teaser', 'review', 'box office',
  'time', 'years', 'revealed', 'announced', 'reported', 'confirmed', 'rumored', 'leaked', 'upcoming', 'coming soon',
  'week', 'month', 'day', 'hour', 'minute', 'second', 'ago', 'later', 'early', 'late',
  'firm', 'source', 'sources', 'reportedly', 'according to', 'claims', 'says', 'said', 'told', 'reports', 'reporting',
  'name', 'names', 'called', 'known as', 'famous for', 'best known for', 'based in', 'headquartered in',
  'additional cast', 'cast includes', 'starring', 'featuring', 'directed by', 'produced by', 'written by',
  'month', 'day', 'year', 'decade', 'century', 'week', 'weekend', 'weekday', 'holiday',
  'released', 'release date', 'premiere', 'box office', 'grossed', 'earned', 'made', 'budget', 'cost',
  'tools', 'technology', 'platform', 'service', 'company', 'industry', 'market', 'world',
  'appeared', 'appears', 'gets', 'getting', 'like', 'likes', 'million', 'billion',
  'shows', 'series', 'season', 'episode', 'trailer', 'teaser', 'review', 'box office',
  'time', 'years', 'revealed', 'announced', 'reported', 'confirmed', 'rumored', 'leaked', 'upcoming', 'coming soon',
  'early', 'late', 'back', 'next', 'still', 'data', 'game', 'official', 'release', 'new', 'latest', 'breaking', 'exclusive',
  'staff', 'star', 'director', 'producer', 'writer', 'cast', 'featuring', 'starring', 'directed by', 'produced by', 'written by',
  

]);

// Penalize overly generic industry words unless they appear as a 2-word phrase
const GENERIC_CONTEXT_WORDS = new Set([
  'movie', 'film', 'company', 'streaming',
  'crypto', 'tech', 'startup'
]);

// Meta text to aggressively filter
const NOISE_PATTERNS = [
  // Source attributions
  /^(source|via|from|bloomberg|reuters|techcrunch|verge|comingsoon)/i,
  /tech source/i,
  /news source/i,
  
  // Generic document terms
  /^(article|story|report|post|update|news)/i,
  /^(read|view|watch|click|link)/i,
  /^(discussion|comment|thread)/i,
  
  // Meta content
  /^(url|http|www|html|rss|xml|json)/i,
  /promotional|teaser|trailer|preview/i,
  /open interest|trending|viral/i,
  
  // Dates and numbers
  /\d{4}-\d{2}-\d{2}/,
  /^\d+$/,
  /^\d+\s+(hours?|days?|weeks?|months?|years?)/i,
  
  // Social media noise
  /^(twitter|reddit|facebook|instagram)/i,
  /social media/i,
  
  // Generic descriptors
  /^(new|latest|breaking|exclusive)/i,
  /^(top|best|worst|most)/i,
];

// Domain-specific noise words
const DOMAIN_NOISE = new Set([
  'com', 'net', 'org', 'io', 'tv', 'co', 'www', 'amp',
  'source', 'tech', 'news', 'media', 'blog', 'site',
  'video', 'image', 'photo', 'audio', 'file',
  'teaser', 'promotional', 'trailer', 'preview',
  'article', 'story', 'report', 'post', 'update',
]);

// Known high-quality entities (boost these)
const KNOWN_ENTITIES = new Set([
  'openai', 'google', 'microsoft', 'apple', 'meta', 'amazon',
  'netflix', 'disney', 'warner bros', 'pixar', 'marvel', 'a24',
  'tesla', 'spacex', 'nvidia', 'intel', 'amd',
  'bitcoin', 'ethereum', 'chatgpt', 'claude', 'gemini',
]);

interface KeywordScore {
  keyword: string;
  score: number;
  frequency: number;
}

/**
 * Aggressively clean text
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    // Remove URLs completely
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/www\.\S+/gi, ' ')
    // Remove email addresses
    .replace(/\S+@\S+\.\S+/gi, ' ')
    // Remove everything in parentheses/brackets (often meta info)
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    // Remove punctuation but keep hyphens in words
    .replace(/[^\w\s-]/g, ' ')
    // Remove standalone numbers
    .replace(/\b\d+\b/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if phrase should be filtered out
 */
function shouldFilterOut(phrase: string): boolean {
  // Too short
  if (phrase.length < 3) return true;

  // Check noise patterns
  if (NOISE_PATTERNS.some(pattern => pattern.test(phrase))) return true;

  const words = phrase.split(' ');

  // Single stopword
  if (words.length === 1 && STOPWORDS.has(phrase)) return true;

  // Contains domain noise
  if (words.some(w => DOMAIN_NOISE.has(w))) return true;

  // Too many stopwords (>50% for multi-word phrases)
  if (words.length > 1) {
    const stopwordCount = words.filter(w => STOPWORDS.has(w)).length;
    if (stopwordCount / words.length > 0.5) return true;
  }


  // Ends with preposition/conjunction
  const lastWord = words[words.length - 1];
  const badEndings = ['to', 'of', 'in', 'at', 'by', 'with', 'is', 'are', 'was', 'and', 'or', 'for'];
  if (badEndings.includes(lastWord)) return true;

  // Starts with generic words
  const firstWord = words[0];
  const badStarts = ['the', 'a', 'an', 'this', 'that', 'these', 'those'];
  if (badStarts.includes(firstWord)) return true;

  return false;
}

/**
 * Extract meaningful phrases
 */
function extractPhrases(text: string): string[] {
  const cleaned = cleanText(text);
  const words = cleaned.split(' ').filter(Boolean);
  const phrases: string[] = [];
  //const capitalizedMatches = text.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b/g);

  // ONLY extract 1-word and 2-word phrases
  // (3+ word phrases are almost always noise)

  // Single words (4+ chars, not stopwords)
  words.forEach(word => {
    if (word.length >= 4 && !STOPWORDS.has(word) && !shouldFilterOut(word)) {
      phrases.push(word);
    }
  });

  // Two-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    // Both words must be substantial (not stopwords)
    if (STOPWORDS.has(words[i]) || STOPWORDS.has(words[i + 1])) continue;
    if (words[i].length < 3 || words[i + 1].length < 3) continue;

    const phrase = `${words[i]} ${words[i + 1]}`;
    if (!shouldFilterOut(phrase)) {
      phrases.push(phrase);
    }
  }

  return phrases;
}

/**
 * Remove sub-phrases (e.g., if "social media" exists, remove "social" and "media")
 */
function removeSubphrases(keywords: string[]): string[] {
  // Sort by word count (longest first)
  const sorted = [...keywords].sort((a, b) => {
    const aWords = a.split(' ').length;
    const bWords = b.split(' ').length;
    return bWords - aWords;
  });

  const final: string[] = [];

  for (const candidate of sorted) {
    // Check if this phrase is a subphrase of any already-selected phrase
    const isSubphrase = final.some(existing => {
      // "media" is a subphrase of "social media"
      const pattern = new RegExp(`\\b${candidate}\\b`, 'i');
      return pattern.test(existing);
    });

    if (!isSubphrase) {
      final.push(candidate);
    }
  }

  return final;
}

/**
 * Score keywords by frequency and quality
 */
function scoreKeywords(phrases: string[]): KeywordScore[] {
  const frequency = new Map<string, number>();

  // Count occurrences
  phrases.forEach(phrase => {
    frequency.set(phrase, (frequency.get(phrase) || 0) + 1);
  });

  // Convert to scores
  const scores: KeywordScore[] = Array.from(frequency.entries()).map(([keyword, freq]) => {
    const wordCount = keyword.split(' ').length;
    let score = freq;

    // 2-word phrases are usually better than single words
    if (wordCount === 2) {
      score *= 1.8;
    }

    // Penalize generic single words
if (wordCount === 1 && GENERIC_CONTEXT_WORDS.has(keyword)) {
  score *= 0.4;
}

    // Boost known entities significantly
    if (KNOWN_ENTITIES.has(keyword.toLowerCase())) {
      score *= 3;
    }

    // Penalize very common single words
    if (wordCount === 1 && freq < 4) {
      score *= 0.3;
    }

    return { keyword, score, frequency: freq };
  });

  return scores
    .filter(item => item.frequency >= 3) // MUST appear at least 3 times
    .sort((a, b) => b.score - a.score);
}

/**
 * Extract top keywords from a single text
 */
export function extractKeywords(text: string, limit: number = 10): string[] {
  if (!text || text.trim().length === 0) return [];

  const phrases = extractPhrases(text);
  const scored = scoreKeywords(phrases);

  return scored.slice(0, limit).map(item => item.keyword);
}

/**
 * Extract keywords from multiple texts (corpus-level)
 */
export function extractKeywordsFromMultiple(
  texts: string[],
  limit: number = 20
): string[] {
  if (texts.length === 0) return [];

  // Extract all phrases
  const allPhrases: string[] = [];
  texts.forEach(text => {
    allPhrases.push(...extractPhrases(text));
  });

  // Score them
  const scored = scoreKeywords(allPhrases);

  // Get top candidates
  const candidates = scored.slice(0, limit * 2).map(item => item.keyword);

  // Remove sub-phrases
  const final = removeSubphrases(candidates);

  // Return top N
  return final.slice(0, limit);
}

/**
 * Analyze keyword frequency across documents
 */
export function analyzeKeywordFrequency(
  documents: Array<{ text: string; date: Date }>
): Map<string, { count: number; dates: Date[] }> {
  const keywordMap = new Map<string, { count: number; dates: Date[] }>();

  const allTexts = documents.map(d => d.text);
  const corpusKeywords = extractKeywordsFromMultiple(allTexts, 50);

  documents.forEach(doc => {
    const docPhrases = new Set(extractPhrases(doc.text));

    corpusKeywords.forEach(keyword => {
      if (docPhrases.has(keyword)) {
        const existing = keywordMap.get(keyword);
        if (existing) {
          existing.count++;
          existing.dates.push(doc.date);
        } else {
          keywordMap.set(keyword, { count: 1, dates: [doc.date] });
        }
      }
    });
  });

  return keywordMap;
}

/**
 * Find co-occurring keywords
 */
export function findCooccurringKeywords(
  documents: string[],
  minCooccurrence: number = 3
): Map<string, string[]> {
  const cooccurrenceMap = new Map<string, Map<string, number>>();

  documents.forEach(doc => {
    const keywords = extractKeywords(doc, 15);

    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const kw1 = keywords[i];
        const kw2 = keywords[j];

        if (!cooccurrenceMap.has(kw1)) {
          cooccurrenceMap.set(kw1, new Map());
        }
        const related = cooccurrenceMap.get(kw1)!;
        related.set(kw2, (related.get(kw2) || 0) + 1);
      }
    }
  });

  const result = new Map<string, string[]>();
  cooccurrenceMap.forEach((relatedMap, keyword) => {
    const related = Array.from(relatedMap.entries())
      .filter(([_, count]) => count >= minCooccurrence)
      .sort((a, b) => b[1] - a[1])
      .map(([kw, _]) => kw);

    if (related.length > 0) {
      result.set(keyword, related);
    }
  });

  return result;
}

logger.info('✅ Keyword extractor loaded (production-grade)');