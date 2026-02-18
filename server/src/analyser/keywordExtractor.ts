import logger from '../config/logger';

/**
 * Extracts keywords from text using simple NLP techniques
 * Uses noun phrase extraction and frequency analysis
 */

// Common words to ignore (stopwords)
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
  'new', 'says', 'said', 'one', 'two', 'three', 'first', 'second', 'last'
]);

interface KeywordScore {
  keyword: string;
  score: number;
  frequency: number;
}

/**
 * Clean and normalize text
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Remove punctuation except hyphens
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Extract potential keywords (2-3 word phrases and single important words)
 */
function extractPhrases(text: string): string[] {
  const words = cleanText(text).split(' ');
  const phrases: string[] = [];

  // Single words (filtered by stopwords and length)
  words.forEach(word => {
    if (word.length > 3 && !STOPWORDS.has(word)) {
      phrases.push(word);
    }
  });

  // Two-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    if (!STOPWORDS.has(words[i]) && !STOPWORDS.has(words[i + 1])) {
      phrases.push(phrase);
    }
  }

  // Three-word phrases (more selective)
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    // At least one word must be > 4 chars
    if (words[i].length > 4 || words[i + 1].length > 4 || words[i + 2].length > 4) {
      phrases.push(phrase);
    }
  }

  return phrases;
}

/**
 * Calculate TF-IDF-like scores for keywords
 */
function scoreKeywords(phrases: string[]): KeywordScore[] {
  const frequency = new Map<string, number>();

  // Count frequencies
  phrases.forEach(phrase => {
    frequency.set(phrase, (frequency.get(phrase) || 0) + 1);
  });

  // Convert to scores (frequency-based with length bonus)
  const scores: KeywordScore[] = Array.from(frequency.entries()).map(([keyword, freq]) => {
    const wordCount = keyword.split(' ').length;
    const lengthBonus = wordCount * 0.5; // Multi-word phrases get bonus
    const score = freq + lengthBonus;

    return { keyword, score, frequency: freq };
  });

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Extract top keywords from text
 */
export function extractKeywords(text: string, limit: number = 10): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const phrases = extractPhrases(text);
  const scored = scoreKeywords(phrases);

  return scored.slice(0, limit).map(item => item.keyword);
}

/**
 * Extract keywords from multiple texts (e.g., title + summary)
 */
export function extractKeywordsFromMultiple(
  texts: string[],
  limit: number = 10
): string[] {
  const combinedText = texts.filter(Boolean).join(' ');
  return extractKeywords(combinedText, limit);
}

/**
 * Analyze keyword trends across multiple documents
 */
export function analyzeKeywordFrequency(
  documents: Array<{ text: string; date: Date }>
): Map<string, { count: number; dates: Date[] }> {
  const keywordMap = new Map<string, { count: number; dates: Date[] }>();

  documents.forEach(doc => {
    const keywords = extractKeywords(doc.text, 20);
    keywords.forEach(keyword => {
      const existing = keywordMap.get(keyword);
      if (existing) {
        existing.count++;
        existing.dates.push(doc.date);
      } else {
        keywordMap.set(keyword, { count: 1, dates: [doc.date] });
      }
    });
  });

  return keywordMap;
}

/**
 * Find co-occurring keywords (keywords that appear together)
 */
export function findCooccurringKeywords(
  documents: string[],
  minCooccurrence: number = 2
): Map<string, string[]> {
  const cooccurrenceMap = new Map<string, Map<string, number>>();

  documents.forEach(doc => {
    const keywords = extractKeywords(doc, 15);

    // For each pair of keywords in this document
    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const keyword1 = keywords[i];
        const keyword2 = keywords[j];

        // Track co-occurrence
        if (!cooccurrenceMap.has(keyword1)) {
          cooccurrenceMap.set(keyword1, new Map());
        }
        const related = cooccurrenceMap.get(keyword1)!;
        related.set(keyword2, (related.get(keyword2) || 0) + 1);
      }
    }
  });

  // Convert to final format (only keep keywords with min co-occurrence)
  const result = new Map<string, string[]>();
  cooccurrenceMap.forEach((relatedMap, keyword) => {
    const related = Array.from(relatedMap.entries())
      .filter(([_, count]) => count >= minCooccurrence)
      .sort((a, b) => b[1] - a[1])
      .map(([relatedKeyword, _]) => relatedKeyword);

    if (related.length > 0) {
      result.set(keyword, related);
    }
  });

  return result;
}

logger.info('✅ Keyword extractor loaded');