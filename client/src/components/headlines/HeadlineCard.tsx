import { ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
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
        {/* Article image — only rendered if imageUrl exists */}
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

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Meta row: source + category + sentiment */}
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

          {/* Title */}
          
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

          {/* Summary */}
          {headline.summary && (
            <p className="text-xs text-secondary leading-relaxed line-clamp-2">
              {headline.summary}
            </p>
          )}

          {/* Bottom row: date + keywords + bookmark */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Timestamp */}
              <time
                dateTime={headline.publishedAt}
                className="font-mono text-[10px] text-muted"
              >
                {formatRelativeDate(headline.publishedAt)}
              </time>

              {/* Top keywords */}
              {headline.keywords.slice(0, 3).map(keyword => (
                <span
                  key={keyword}
                  className="font-mono text-[9px] text-muted bg-surface-2 px-1.5 py-0.5 rounded-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Bookmark toggle */}
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
}