import logger from '../config/logger';

/**
 * Enhanced keyword extraction with better filtering and phrase detection
 */

// Expanded stopwords list
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
  'come', 'think', 'look', 'want', 'give', 'use', 'work', 'call', 'try',
]);

const KNOWN_ENTITIES = new Set([
  'netflix',
  'disney',
  'warner bros',
  'pixar',
  'marvel',
  'a24',
  'paramount',
  'universal',
  'bloomberg',
]);

// Meta text patterns to filter out (from RSS feeds, HTML, etc.)
const META_PATTERNS = [
  /^(discussion|comment|comments|link|url|https?|http|www)/i,
  /^(posted|submitted|source|via|read|more)/i,
  /^(article|story|news|report)/i,
  /^(by|author|written)/i,
  /^(updated|published|edited)/i,
  /\d{4}-\d{2}-\d{2}/, // Dates
  /^\d+$/, // Pure numbers
  //ADD CUSTOM PATTERN
  /^(hackernews|reddit|twitter|feed)/i, // Site names
  /^(rss|xml|json|api)/i, // Technical terms
];

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
    .replace(/https?:\/\/\S+/g, ' ') // remove full URLs
    .replace(/[^\w\s]/g, ' ')        // remove ALL punctuation
    .replace(/\b\d+\b/g, ' ')        // remove standalone numbers
    .replace(/\s+/g, ' ')
    .trim();
}

function removeSubphrases(keywords: string[]): string[] {
  // Sort longest phrases first
  const sorted = [...keywords].sort(
    (a, b) => b.split(' ').length - a.split(' ').length
  );

  const final: string[] = [];

  for (const candidate of sorted) {
    const isSubphrase = final.some(existing => {
      const pattern = new RegExp(`\\b${candidate}\\b`);
      return pattern.test(existing);
    });

    if (!isSubphrase) {
      final.push(candidate);
    }
  }

  return final;
}


const DOMAIN_WORDS = new Set([
  'com', 'net', 'org', 'io', 'tv', 'co',
  'www', 'amp'
]);

/**
 * Check if a word/phrase should be filtered out
 */
function shouldFilterOut(phrase: string): boolean {
  // Too short (except well-known acronyms)
  if (phrase.length < 3) return true;

  // Stopword check
  const words = phrase.split(' ');
  if (words.length === 1 && STOPWORDS.has(phrase)) return true;

  // Meta pattern check
  if (META_PATTERNS.some(pattern => pattern.test(phrase))) return true;

  // Domain words (common in URLs, not useful as keywords)
  if (words.some(w => DOMAIN_WORDS.has(w))) return true;

  // Filter out phrases that are mostly stopwords
  if (words.length > 1) {
    const stopwordCount = words.filter(w => STOPWORDS.has(w)).length;
    const stopwordRatio = stopwordCount / words.length;
    if (stopwordRatio > 0.5) return true; // More than half are stopwords
  }

  

  // Filter incomplete phrases (ending with prepositions/conjunctions)
  const lastWord = words[words.length - 1];
  const badEndings = ['to', 'of', 'in', 'at', 'by', 'with', 'is', 'are', 'was', 'and', 'or'];
  if (badEndings.includes(lastWord)) return true;

  return false;
}

/**
 * Extract candidate keywords and phrases
 */
function extractPhrases(text: string): string[] {
  const cleanedText = cleanText(text);
  const originalWords = text.split(/\s+/);
  const words = cleanedText.split(' ').filter(Boolean);
  const phrases: string[] = [];

  // Single meaningful words (nouns, proper nouns, technical terms)
  words.forEach(word => {
    if (shouldFilterOut(word)) return;
    
    // Prefer words with capital letters in original (proper nouns)
    // or words longer than 4 chars
    if (word.length >= 4) {
      phrases.push(word);
    }
  });

  // Two-word phrases (most useful for trends)
  for (let i = 0; i < words.length - 1; i++) {
    const phrase = `${words[i]} ${words[i + 1]}`;
    
    // Skip if either word is a stopword
    if (STOPWORDS.has(words[i]) || STOPWORDS.has(words[i + 1])) continue;
    
    if (!shouldFilterOut(phrase)) {
      phrases.push(phrase);
    }
  }

  // Three-word phrases (only if they look like proper names or technical terms)
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    
    // More selective for 3-word phrases
    const hasStopword = [words[i], words[i + 1], words[i + 2]].some(w => STOPWORDS.has(w));
    if (hasStopword) continue;
    
    // At least one word must be substantial (6+ chars)
    const hasSubstantialWord = [words[i], words[i + 1], words[i + 2]].some(w => w.length >= 6);
    if (!hasSubstantialWord) continue;
    
    if (!shouldFilterOut(phrase)) {
      phrases.push(phrase);
    }
  }

  return phrases;
}

/**
 * Calculate importance scores for keywords
 */
function scoreKeywords(phrases: string[], originalTexts: string[]): KeywordScore[] {
  const frequency = new Map<string, number>();

  // Count frequencies across all texts
  phrases.forEach(phrase => {
    frequency.set(phrase, (frequency.get(phrase) || 0) + 1);
  });

  // Convert to scores
  const scores: KeywordScore[] = Array.from(frequency.entries()).map(([keyword, freq]) => {
    const wordCount = keyword.split(' ').length;
    
    // Scoring strategy:
    // - Higher frequency is better
    // - 2-word phrases get bonus (they're usually most meaningful)
    // - 3-word phrases need higher frequency to rank
    let score = freq;
    
    if (wordCount === 2) {
      score = freq * 1.5; // Boost 2-word phrases
    } else if (wordCount === 3) {
      score = freq * 1.2; // Slight boost for 3-word phrases
    }

    // Entity boost
const isLikelyEntity = originalTexts.some(text => {
  return text.includes(
    keyword
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  );
});

if (isLikelyEntity) {
  score *= 1.4;
}

if (KNOWN_ENTITIES.has(keyword)) {
  score *= 2;
}
    
    // Penalize very common single words unless they appear frequently
    if (wordCount === 1 && freq < 3) {
      score = freq * 0.5;
    }

    return { keyword, score, frequency: freq };
  });

  

  // Filter out very low frequency items (noise)
  return scores
    .filter(item => item.frequency >= 2 )
    .sort((a, b) => b.score - a.score);
}

/**
 * Extract top keywords from text
 */
export function extractKeywords(text: string, limit: number = 10): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const phrases = extractPhrases(text);
  const scored = scoreKeywords(phrases, [text]);

  return scored.slice(0, limit).map(item => item.keyword);
}

/**
 * Extract keywords from multiple texts (better for trend detection)
 */
export function extractKeywordsFromMultiple(
  texts: string[],
  limit: number = 10
): string[] {
  if (texts.length === 0) return [];

  // Extract phrases from all texts
  const allPhrases: string[] = [];
  texts.forEach(text => {
    const phrases = extractPhrases(text);
    allPhrases.push(...phrases);
  });

  // Score across the corpus
  const scored = scoreKeywords(allPhrases, texts);

// 1️⃣ Enforce frequency floor
const filtered = scored.filter(item => item.frequency >= 2);

// 2️⃣ Convert to plain keyword strings
const keywordList = filtered.map(item => item.keyword);

// 3️⃣ Remove sub-phrases
const compressed = removeSubphrases(keywordList);

// 4️⃣ Finally apply limit
return compressed.slice(0, limit);
}

/**
 * Analyze keyword frequency across multiple documents
 */
export function analyzeKeywordFrequency(
  documents: Array<{ text: string; date: Date }>
): Map<string, { count: number; dates: Date[] }> {
  const keywordMap = new Map<string, { count: number; dates: Date[] }>();

  // Extract from all documents first
  const allTexts = documents.map(d => d.text);
  const corpusKeywords = extractKeywordsFromMultiple(allTexts, 100); // Top 100 from corpus

  // Now count occurrences in each document
  documents.forEach(doc => {
    const docPhrases = extractPhrases(doc.text);
    const docPhrasesSet = new Set(docPhrases);

    // Only track keywords that made it into the top corpus keywords
    corpusKeywords.forEach(keyword => {
      if (docPhrasesSet.has(keyword)) {
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
  minCooccurrence: number = 2
): Map<string, string[]> {
  const cooccurrenceMap = new Map<string, Map<string, number>>();

  documents.forEach(doc => {
    const keywords = extractKeywords(doc, 20);

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
  

  

  // Convert to final format
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

logger.info('✅ Keyword extractor loaded (enhanced)');