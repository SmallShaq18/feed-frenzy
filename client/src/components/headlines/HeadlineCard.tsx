import { ExternalLink, Bookmark, BookmarkCheck, Zap } from 'lucide-react';
import clsx from 'clsx';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import type { Headline } from '../../types/index';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { formatRelativeDate } from '../../utils/formatDate';
import { getCategoryColor, getSentimentColor, isFreshArticle } from '../../utils/categoryColors';
//import { getSourceColor, isFreshArticle } from '../../utils/sourceColors';
import { truncateText } from '../../utils/truncateText';
import { useState } from 'react';

interface HeadlineCardProps {
  headline: Headline;
  index?: number;
  onCardClick?: (id: string) => void; // NEW
}

export default function HeadlineCard({
  headline,
  index = 0,
  onCardClick, // NEW
}: HeadlineCardProps) {
  const { add, remove, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(headline._id);
  const [imageError, setImageError] = useState(false);

  const staggerClass = [
    'stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5',
  ][index % 5];

  const sourceColor = getCategoryColor(headline.source);
  const isFresh = isFreshArticle(headline.publishedAt);

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    bookmarked ? remove(headline._id) : add(headline);
  }

  // NEW: Handle card click to open panel
  function handleCardClick() {
    onCardClick?.(headline._id);
  }

  return (
    <Card
      hoverable
      onClick={handleCardClick} // NEW
      className={clsx(
        'group animate-card-enter opacity-0 relative overflow-hidden',
        staggerClass,
        'transition-all duration-normal',
        'hover:shadow-[0_0_0_1px_var(--color-border-loud),0_12px_40px_rgba(0,0,0,0.5)]',
        'hover:-translate-y-1'
      )}
      style={{
        borderLeftWidth: sourceColor ? '3px' : undefined,
        borderLeftColor: sourceColor,
      }}
    >
      {/* Fresh article indicator */}
      {isFresh && (
        <div className="absolute top-2 right-2 z-10">
          <div className="relative flex items-center gap-1 bg-yellow/10 border border-yellow/30 backdrop-blur-sm rounded-sm px-1.5 py-0.5">
            <Zap size={10} className="text-yellow animate-pulse" fill="currentColor" />
            <span className="font-mono text-[8px] text-yellow tracking-widest uppercase font-bold">
              Fresh
            </span>
          </div>
        </div>
      )}

      <article className="flex gap-4">
        {/* Article image */}
        {headline.imageUrl && !imageError && (
          <div className="flex-shrink-0 w-24 h-24 rounded-sm overflow-hidden bg-surface-2 relative group/image">
            <img
              src={headline.imageUrl}
              alt=""
              className="w-full h-full object-cover transition-all duration-slow group-hover/image:scale-110 group-hover/image:brightness-110"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-normal" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-mono text-[10px] tracking-wider uppercase font-semibold transition-colors duration-fast"
              style={{ color: sourceColor ?? 'var(--color-text-muted)' }}
            >
              {headline.source}
            </span>

            {headline.category && (
              <Badge
                label={headline.category}
                color={getCategoryColor(headline.category)}
                variant="subtle"
              />
            )}

            {headline.sentiment && (
              <Badge
                label={headline.sentiment}
                color={getSentimentColor(headline.sentiment)}
                variant="subtle"
              />
            )}
          </div>

          {/* Title - UPDATED: removed link, card is clickable */}
          <div className="group/link flex items-start gap-1.5">
            <h3 className="font-ui font-semibold text-sm text-primary leading-snug group-hover:text-yellow transition-all duration-fast">
              {truncateText(headline.title, 120)}
            </h3>
            <ExternalLink
              size={12}
              className="flex-shrink-0 mt-0.5 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-fast"
            />
          </div>

          {/* Summary */}
          {headline.summary && (
            <p className="text-xs text-secondary leading-relaxed line-clamp-2 transition-colors duration-fast group-hover:text-primary/80">
              {headline.summary}
            </p>
          )}

          {/* Bottom row */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <time
                dateTime={headline.publishedAt}
                className={clsx(
                  'font-mono text-[10px] transition-all duration-fast',
                  isFresh
                    ? 'text-yellow font-semibold'
                    : 'text-muted group-hover:text-secondary'
                )}
              >
                {formatRelativeDate(headline.publishedAt)}
              </time>

              {headline.keywords.slice(0, 3).map((keyword, i) => (
                <span
                  key={keyword}
                  className={clsx(
                    'font-mono text-[9px] bg-surface-2 px-1.5 py-0.5 rounded-sm',
                    'transition-all duration-fast',
                    'opacity-60 group-hover:opacity-100',
                    'text-muted group-hover:text-secondary group-hover:bg-border'
                  )}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
              className={clsx(
                'p-1.5 rounded-sm transition-all duration-fast flex-shrink-0',
                'hover:scale-110 active:scale-95',
                bookmarked
                  ? 'text-yellow bg-yellow/10 opacity-100'
                  : 'text-muted hover:text-primary hover:bg-surface-2 opacity-0 group-hover:opacity-100'
              )}
            >
              {bookmarked ? (
                <BookmarkCheck size={14} className="animate-pulse-glow" />
              ) : (
                <Bookmark size={14} />
              )}
            </button>
          </div>
        </div>
      </article>
    </Card>
  );
}

/*import { ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import clsx from 'clsx';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import type { Headline } from '../../types/index';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { formatRelativeDate } from '../../utils/formatDate';
import { getCategoryColor, getSentimentColor } from '../../utils/categoryColors';
import { truncateText } from '../../utils/truncateText';

interface HeadlineCardProps {
  headline: Headline;
  index?: number; // For stagger animation
}

export default function HeadlineCard({ headline, index = 0 }: HeadlineCardProps) {
  const { add, remove, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(headline._id);

  const staggerClass = [
    'stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5',
  ][index % 5];

  function handleBookmark(e: React.MouseEvent) {
    // Stop propagation so clicking bookmark doesn't open the article
    e.preventDefault();
    e.stopPropagation();
    bookmarked ? remove(headline._id) : add(headline);
  }

  return (
    <Card
      hoverable
      className={clsx('group animate-card-enter opacity-0', staggerClass)}
    >
      <article className="flex gap-4">
        {/* Article image — only rendered if imageUrl exists *
        {headline.imageUrl && (
          <div className="flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden bg-surface-2">
            <img
              src={headline.imageUrl}
              alt=""
              className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
              loading="lazy"
              onError={e => {
                // Hide broken images cleanly
                (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content *
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Meta row: source + category + sentiment *
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] text-muted tracking-wider uppercase">
              {headline.source}
            </span>

            {headline.category && (
              <Badge
                label={headline.category}
                color={getCategoryColor(headline.category)}
                variant="subtle"
              />
            )}

            {headline.sentiment && (
              <Badge
                label={headline.sentiment}
                color={getSentimentColor(headline.sentiment)}
                variant="subtle"
              />
            )}
          </div>

          {/* Title *
          
          <a href={headline.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link flex items-start gap-1" >
            <h3 className="font-ui font-semibold text-sm text-primary leading-snug group-hover/link:text-yellow transition-colors duration-fast">
              {truncateText(headline.title, 120)}
            </h3>
            <ExternalLink
              size={11}
              className="flex-shrink-0 mt-0.5 text-muted opacity-0 group-hover/link:opacity-100 transition-opacity"
            />
          </a>

          {/* Summary *
          {headline.summary && (
            <p className="text-xs text-secondary leading-relaxed line-clamp-2">
              {headline.summary}
            </p>
          )}

          {/* Bottom row: date + keywords + bookmark *
          <div className="flex items-center justify-between gap-2 mt-auto pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Timestamp *
              <time
                dateTime={headline.publishedAt}
                className="font-mono text-[10px] text-muted"
              >
                {formatRelativeDate(headline.publishedAt)}
              </time>

              {/* Top keywords *
              {headline.keywords.slice(0, 3).map(keyword => (
                <span
                  key={keyword}
                  className="font-mono text-[9px] text-muted bg-surface-2 px-1.5 py-0.5 rounded-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Bookmark toggle *
            <button
              onClick={handleBookmark}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
              className={clsx(
                'p-1 rounded-sm transition-all duration-fast flex-shrink-0',
                bookmarked
                  ? 'text-yellow'
                  : 'text-muted hover:text-primary opacity-0 group-hover:opacity-100'
              )}
            >
              {bookmarked
                ? <BookmarkCheck size={14} />
                : <Bookmark size={14} />
              }
            </button>
          </div>
        </div>
      </article>
    </Card>
  );
}*/