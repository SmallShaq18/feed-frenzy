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
