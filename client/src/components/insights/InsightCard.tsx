import { Lightbulb, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import Card from '../ui/Card';
import InsightTypeBadge from './InsightTypeBadge';
import type { Insight } from '../../types/index';
import { formatRelativeDate } from '../../utils/formatDate';

interface InsightCardProps {
  insight: Insight;
  index?: number;
  featured?: boolean;
  onCardClick?: (id: string) => void; // NEW
}

export default function InsightCard({
  insight,
  index = 0,
  featured = false,
  onCardClick, // NEW
}: InsightCardProps) {
  const staggerClass = ['stagger-1','stagger-2','stagger-3','stagger-4','stagger-5'][index % 5];

   // NEW: Handle card click to open panel
  function handleCardClick() {
    onCardClick?.(insight._id);
  }

  
  return (
    <Card
      hoverable
      onClick={handleCardClick} // NEW
      className={clsx(
        'animate-card-enter opacity-0 relative overflow-hidden group',
        staggerClass,
        'transition-all duration-normal',
        featured
          ? 'border-yellow/30 shadow-glow-yellow bg-yellow/5 hover:shadow-[0_0_0_1px_var(--color-yellow),0_12px_40px_rgba(255,229,0,0.2)]'
          : 'hover:shadow-[0_0_0_1px_var(--color-border-loud),0_12px_40px_rgba(0,0,0,0.5)]',
        'hover:-translate-y-1'
      )}
    >
      {/* Featured glow effect */}
      {featured && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow/30 via-transparent to-transparent" />
        </div>
      )}

      <div className="flex flex-col gap-3 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <InsightTypeBadge type={insight.type} />
          {featured && (
            <div className="flex items-center gap-1 font-mono text-[9px] text-yellow tracking-widest uppercase animate-pulse">
              <Lightbulb size={10} fill="currentColor" />
              Featured
            </div>
          )}
          <span className="font-mono text-[9px] text-muted ml-auto">
            {formatRelativeDate(insight.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3
          className={clsx(
            'font-ui font-bold leading-snug text-primary',
            'transition-colors duration-fast group-hover:text-yellow',
            featured ? 'text-lg' : 'text-sm'
          )}
        >
          {insight.title}
        </h3>

        {/* Body */}
        <p className="font-mono text-xs text-secondary leading-relaxed transition-colors duration-fast group-hover:text-primary/80">
          {insight.body}
        </p>

        {/* Footer */}
        <div className="pt-2 border-t border-border flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] text-muted tracking-widest uppercase">
              Tone:
            </span>
            <span className="font-mono text-[9px] text-secondary capitalize">
              {insight.tone}
            </span>
          </div>

          {insight.relatedTrends.length > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <TrendingUp size={10} className="text-muted" />
              <span className="font-mono text-[9px] text-muted">
                {insight.relatedTrends.length} {insight.relatedTrends.length === 1 ? 'trend' : 'trends'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/*import clsx from 'clsx';
import Card from '../ui/Card';
import InsightTypeBadge from './InsightTypeBadge';
import type { Insight } from '../../types/index';
import { formatRelativeDate } from '../../utils/formatDate';

interface InsightCardProps {
  insight: Insight;
  index?: number;
  featured?: boolean;
}

/**
 * Featured insights get a larger, more dramatic treatment
 * with a yellow glow border. Standard insights are compact.
 
export default function InsightCard({
  insight,
  index = 0,
  featured = false,
}: InsightCardProps) {
  const staggerClass = ['stagger-1','stagger-2','stagger-3','stagger-4','stagger-5'][index % 5];

  return (
    <Card
      className={clsx(
        'animate-card-enter opacity-0',
        staggerClass,
        featured && 'border-yellow/30 shadow-glow-yellow bg-yellow/5'
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Header *
        <div className="flex items-center gap-2 flex-wrap">
          <InsightTypeBadge type={insight.type} />
          {featured && (
            <span className="font-mono text-[9px] text-yellow tracking-widest uppercase">
              ★ Featured
            </span>
          )}
          <span className="font-mono text-[9px] text-muted ml-auto">
            {formatRelativeDate(insight.createdAt)}
          </span>
        </div>

        {/* Title *
        <h3
          className={clsx(
            'font-ui font-bold leading-snug text-primary',
            featured ? 'text-lg' : 'text-sm'
          )}
        >
          {insight.title}
        </h3>

        {/* Body *
        <p className="font-mono text-xs text-secondary leading-relaxed">
          {insight.body}
        </p>

        {/* Tone indicator *
        <div className="pt-1 border-t border-border flex items-center gap-2">
          <span className="font-mono text-[9px] text-muted tracking-widest uppercase">
            Tone:
          </span>
          <span className="font-mono text-[9px] text-muted capitalize">
            {insight.tone}
          </span>
        </div>
      </div>
    </Card>
  );
}*/