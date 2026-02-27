/*import { ExternalLink, Bookmark, BookmarkCheck, Zap } from 'lucide-react';
import clsx from 'clsx';
import Badge from '../ui/Badge';
import type { Headline } from '../../types/index';
import { useBookmarkStore } from '../../store/useBookmarkStore';
import { formatRelativeDate } from '../../utils/formatDate';
import { getCategoryColor, getSentimentColor, isFreshArticle } from '../../utils/categoryColors';
import { truncateText } from '../../utils/truncateText';

export default function HeadlineCard({ headline, index = 0, onCardClick }: { headline: Headline; index?: number; onCardClick?: (id: string) => void }) {
  const { add, remove, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(headline._id);
  const isFresh = isFreshArticle(headline.publishedAt);
  const accentColor = getCategoryColor(headline.source);

  return (
    <div 
      onClick={() => onCardClick?.(headline._id)}
      className={clsx(
        "group relative flex flex-col md:flex-row gap-6 p-6 border-b border-border bg-surface transition-all cursor-pointer",
        "hover:bg-primary/[0.02] hover:pl-8"
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-all" style={{ backgroundColor: accentColor }} />
      
      {headline.imageUrl && (
        <div className="w-full md:w-32 h-32 md:h-24 overflow-hidden border border-border bg-bg flex-shrink-0">
          <img src={headline.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" alt="" />
        </div>
      )}

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary" style={{ color: accentColor }}>
            {headline.source}
          </span>
          <div className="h-3 w-px bg-border" />
          <span className="font-mono text-[10px] text-muted uppercase">{formatRelativeDate(headline.publishedAt)}</span>
          {isFresh && <Zap size={10} className="text-yellow fill-yellow" />}
        </div>

        <h3 className="font-display text-xl uppercase italic tracking-tight group-hover:text-primary transition-colors">
          {truncateText(headline.title, 100)}
        </h3>

        <div className="flex items-center gap-4 pt-2">
          {headline.category && <Badge label={headline.category} variant="subtle" size="sm" />}
          <div className="flex gap-2">
            {headline.keywords.slice(0, 2).map(kw => (
              <span key={kw} className="font-mono text-[9px] text-muted uppercase tracking-tighter">#{kw}</span>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); bookmarked ? remove(headline._id) : add(headline); }}
        className={clsx("self-start p-2 transition-all", bookmarked ? "text-yellow" : "text-muted hover:text-primary")}
      >
        {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
    </div>
  );
}*/

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
            <Zap size={10} className="text-purple-500 animate-pulse" fill="currentColor" />
            <span className="font-mono text-[8px] text-purple-500 tracking-widest uppercase font-bold">
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
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            {headline.source}
          </span>
          <div className="h-3 w-px bg-border" />
          <span className="font-mono text-[10px] text-muted uppercase">{formatRelativeDate(headline.publishedAt)}</span>
          {isFresh && <Zap size={10} className="text-purple-500 fill-purple-500" />}

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
            <h3 className="font-display text-xl uppercase italic tracking-tight group-hover:text-primary transition-colors">
          {truncateText(headline.title, 100)}
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
              

              {headline.keywords.slice(0, 2).map(kw => (
              <span key={kw} className="font-mono text-[9px] text-muted uppercase tracking-tighter">#{kw}</span>
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
                  ? 'text-purple-500 bg-yellow/10 opacity-100'
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

