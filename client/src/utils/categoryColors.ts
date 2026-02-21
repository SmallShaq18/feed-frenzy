/**
 * Maps category strings to CSS variable colors.
 * Used by Badge and filter components.
 * Add new categories here — components pick it up automatically.
 */

export const CATEGORY_COLORS: Record<string, string> = {
  tech:     'var(--color-cat-tech)',
  ai:       'var(--color-cat-ai)',
  crypto:   'var(--color-cat-crypto)',
  startups: 'var(--color-cat-startups)',
  movies:  'var(--color-cat-movies)',
  anime:   'var(--color-cat-anime)',
};

export const TREND_STATUS_COLORS: Record<string, string> = {
  rising:   'var(--color-trend-rising)',
  peak:     'var(--color-trend-peak)',
  declining:'var(--color-trend-declining)',
};

export const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'var(--color-sentiment-positive)',
  neutral:  'var(--color-sentiment-neutral)',
  negative: 'var(--color-sentiment-negative)',
};

export function getCategoryColor(category?: string): string {
  return category ? CATEGORY_COLORS[category.toLowerCase()] ?? 'var(--color-text-muted)' : 'var(--color-text-muted)';
}

export function getTrendStatusColor(status: string): string {
  return TREND_STATUS_COLORS[status] ?? 'var(--color-text-muted)';
}

export function getSentimentColor(sentiment?: string): string {
  return sentiment ? SENTIMENT_COLORS[sentiment] ?? 'var(--color-text-muted)' : 'var(--color-text-muted)';
}

export function isFreshArticle(publishedAt: string): boolean {
  const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
  return new Date(publishedAt).getTime() > twoHoursAgo;
}