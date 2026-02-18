import Card from '../ui/Card';
import TrendBadge from './TrendBadge';
import type { Trend } from '../../types/index';
import { formatRelativeDate } from '../../utils/formatDate';
import { useFilterStore } from '../../store/useFilterStore';
import clsx from 'clsx';

interface TrendCardProps {
  trend: Trend;
  index?: number;
  onKeywordClick?: (keyword: string) => void;
}

export default function TrendCard({ trend, index = 0, onKeywordClick }: TrendCardProps) {
  const setFilter = useFilterStore(s => s.setFilter);

  const staggerClass = ['stagger-1','stagger-2','stagger-3','stagger-4','stagger-5'][index % 5];

  function handleKeywordClick() {
    setFilter('searchQuery', trend.keyword);
    onKeywordClick?.(trend.keyword);
  }

  return (
    <Card
      hoverable
      accent
      className={clsx('animate-card-enter opacity-0', staggerClass)}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={handleKeywordClick}
            className="font-display text-2xl tracking-wider text-primary hover:text-yellow transition-colors duration-fast text-left leading-none"
          >
            {trend.keyword.toUpperCase()}
          </button>
          <TrendBadge status={trend.status} />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          <div>
            <p className="font-mono text-[10px] text-muted tracking-wider uppercase">Mentions</p>
            <p className="font-mono text-lg font-semibold text-primary">{trend.count}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="font-mono text-[10px] text-muted tracking-wider uppercase">Velocity</p>
            <p className="font-mono text-lg font-semibold text-yellow">
              {trend.velocity.toFixed(1)}<span className="text-xs text-muted">/day</span>
            </p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="font-mono text-[10px] text-muted tracking-wider uppercase">First seen</p>
            <p className="font-mono text-xs text-secondary">
              {formatRelativeDate(trend.firstSeen)}
            </p>
          </div>
        </div>

        {/* Related keywords */}
        {trend.relatedKeywords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[9px] text-muted tracking-widest uppercase">Related:</span>
            {trend.relatedKeywords.slice(0, 5).map(kw => (
              <span
                key={kw}
                className="font-mono text-[9px] text-muted bg-surface-2 px-1.5 py-0.5 rounded-sm"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}