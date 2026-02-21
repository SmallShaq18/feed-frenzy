import { TrendingUp, Activity, Clock } from 'lucide-react';
import Card from '../ui/Card';
import TrendBadge from './TrendBadge';
import type { Trend } from '../../types/index';
import { formatRelativeDate } from '../../utils/formatDate';
import { useFilterStore } from '../../store/useFilterStore';
import { getTrendStatusColor } from '../../utils/categoryColors';
import clsx from 'clsx';

interface TrendCardProps {
  trend: Trend;
  index?: number;
  onKeywordClick?: (keyword: string) => void;
}

export default function TrendCard({ trend, index = 0, onKeywordClick }: TrendCardProps) {
  const setFilter = useFilterStore(s => s.setFilter);

  const staggerClass = ['stagger-1','stagger-2','stagger-3','stagger-4','stagger-5'][index % 5];
  const statusColor = getTrendStatusColor(trend.status);

  function handleKeywordClick() {
    setFilter('searchQuery', trend.keyword);
    onKeywordClick?.(trend.keyword);
  }

  return (
    <Card
      accent
      className={clsx(
        'animate-card-enter opacity-0 relative overflow-hidden group',
        staggerClass,
        'transition-all duration-normal',
        'hover:shadow-[0_0_0_1px_var(--color-border-loud),0_12px_40px_rgba(0,0,0,0.5)]',
        'hover:-translate-y-1'
      )}
      style={{
        borderLeftColor: statusColor,
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-slow pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${statusColor}, transparent 70%)`,
        }}
      />

      <div className="flex flex-col gap-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={handleKeywordClick}
            className="font-display text-2xl tracking-wider text-primary hover:text-yellow transition-all duration-fast text-left leading-none group/btn"
          >
            <span className="group-hover/btn:tracking-widest transition-all duration-fast">
              {trend.keyword.toUpperCase()}
            </span>
          </button>
          <TrendBadge status={trend.status} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Activity size={11} className="text-muted" />
              <p className="font-mono text-[9px] text-muted tracking-wider uppercase">Mentions</p>
            </div>
            <p className="font-mono text-xl font-semibold text-primary tabular-nums">
              {trend.count}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={11} className="text-yellow" />
              <p className="font-mono text-[9px] text-muted tracking-wider uppercase">Velocity</p>
            </div>
            <p className="font-mono text-xl font-semibold text-yellow tabular-nums">
              {trend.velocity.toFixed(1)}
              <span className="text-xs text-muted ml-0.5">/day</span>
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-muted" />
              <p className="font-mono text-[9px] text-muted tracking-wider uppercase">First Seen</p>
            </div>
            <p className="font-mono text-xs text-secondary">
              {formatRelativeDate(trend.firstSeen)}
            </p>
          </div>
        </div>

        {/* Related keywords */}
        {trend.relatedKeywords.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border">
            <span className="font-mono text-[9px] text-muted tracking-widest uppercase">Related:</span>
            {trend.relatedKeywords.slice(0, 5).map((kw, i) => (
              <span
                key={kw}
                className={clsx(
                  'font-mono text-[9px] bg-surface-2 px-1.5 py-0.5 rounded-sm',
                  'transition-all duration-fast',
                  'opacity-60 group-hover:opacity-100 group-hover:bg-border group-hover:text-secondary',
                  'cursor-default'
                )}
                style={{ transitionDelay: `${i * 40}ms` }}
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

/*import Card from '../ui/Card';
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
        {/* Header *
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={handleKeywordClick}
            className="font-display text-2xl tracking-wider text-primary hover:text-yellow transition-colors duration-fast text-left leading-none"
          >
            {trend.keyword.toUpperCase()}
          </button>
          <TrendBadge status={trend.status} />
        </div>

        {/* Stats row *
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

        {/* Related keywords *
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
}*/