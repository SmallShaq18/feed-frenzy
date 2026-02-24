import { TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import Card from '../ui/Card';
import InsightTypeBadge from './InsightTypeBadge';
import type { Insight } from '../../types/index';
import { formatRelativeDate } from '../../utils/formatDate';

interface InsightCardProps {
  insight: Insight;
  index?: number;
  featured?: boolean;
  onCardClick?: (id: string) => void;
}

export default function InsightCard({ insight, index = 0, featured = false, onCardClick }: InsightCardProps) {
  const staggerClass = `animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`;

  return (
    <Card
      hoverable
      onClick={() => onCardClick?.(insight._id)}
      className={clsx(
        staggerClass,
        'group relative overflow-hidden border-l-2',
        featured 
          ? 'border-l-purple-500  shadow-glow-purple' 
          : 'border-l-border-loud bg-surface'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Decorative "Data Grid" Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <InsightTypeBadge type={insight.type} />
          <span className="font-mono text-[10px] text-muted tabular-nums">
            {formatRelativeDate(insight.createdAt)}
          </span>
        </div>

        <h3 className={clsx(
          "font-display font-bold leading-tight group-hover:text-purple-500 transition-colors",
          featured ? "text-lg" : "text-base"
        )}>
          {insight.title}
        </h3>

        <p className="font-mono text-xs text-secondary line-clamp-2 leading-relaxed">
          {insight.body}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-muted uppercase tracking-widest">Tone:</span>
            <span className="font-mono text-[9px] text-primary bg-surface-2 px-1.5 py-0.5 rounded-sm">
              {insight.tone}
            </span>
          </div>

          {insight.relatedTrends.length > 0 && (
            <div className="flex items-center gap-1.5 text-muted group-hover:text-yellow transition-colors">
              <TrendingUp size={10} />
              <span className="font-mono text-[9px] uppercase tracking-tighter">
                {insight.relatedTrends.length} Related Signals
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}


/*import { Lightbulb, TrendingUp } from 'lucide-react';
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
      {/* Featured glow effect *
      {featured && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow/30 via-transparent to-transparent" />
        </div>
      )}

      <div className="flex flex-col gap-3 relative z-10">
        {/* Header *
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

        {/* Title *
        <h3
          className={clsx(
            'font-ui font-bold leading-snug text-primary',
            'transition-colors duration-fast group-hover:text-yellow',
            featured ? 'text-lg' : 'text-sm'
          )}
        >
          {insight.title}
        </h3>

        {/* Body *
        <p className="font-mono text-xs text-secondary leading-relaxed transition-colors duration-fast group-hover:text-primary/80">
          {insight.body}
        </p>

        {/* Footer *
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
*/
