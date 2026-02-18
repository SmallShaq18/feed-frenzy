import clsx from 'clsx';
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
 */
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
        {/* Header */}
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

        {/* Title */}
        <h3
          className={clsx(
            'font-ui font-bold leading-snug text-primary',
            featured ? 'text-lg' : 'text-sm'
          )}
        >
          {insight.title}
        </h3>

        {/* Body */}
        <p className="font-mono text-xs text-secondary leading-relaxed">
          {insight.body}
        </p>

        {/* Tone indicator */}
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
}