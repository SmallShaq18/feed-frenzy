import { TrendingUp, Activity, Clock, Sparkles } from 'lucide-react';
import Card from '../ui/Card';
import TrendBadge from './TrendBadge';
import type { Trend } from '../../types/index';
import { formatRelativeDate } from '../../utils/formatDate';
import { useFilterStore } from '../../store/useFilterStore';
import { getTrendStatusColor } from '../../utils/categoryColors';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';


interface TrendCardProps {
  trend: Trend;
  index?: number;
  onKeywordClick?: (keyword: string) => void;
}

export default function TrendCard({ trend, index = 0, onKeywordClick }: TrendCardProps) {
  const setFilter = useFilterStore(s => s.setFilter);

  const staggerClass = ['stagger-1','stagger-2','stagger-3','stagger-4','stagger-5'][index % 5];
  const statusColor = getTrendStatusColor(trend.status);
  const navigate = useNavigate();


  function handleKeywordClick() {
    setFilter('searchQuery', trend.keyword);
    onKeywordClick?.(trend.keyword);
    navigate('/');
  }

  // Calculate trend strength (0-100)
  const trendStrength = Math.min(100, (trend.velocity / 10) * 100);

  return (
    <Card
      className={clsx(
        'animate-card-enter opacity-0 relative overflow-hidden group',
        staggerClass,
        'transition-all duration-normal',
        'hover:shadow-[0_0_0_1px_var(--color-border-loud),0_12px_40px_rgba(0,0,0,0.5)]',
        'hover:-translate-y-1',
        'border-l-2'
      )}
      style={{
        borderLeftColor: statusColor,
      }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-slow pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${statusColor}, transparent 70%)`,
        }}
      />

      {/* Decorative corner sparkle */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-slow">
        <Sparkles size={14} className="text-yellow animate-pulse" />
      </div>

      <div className="flex flex-col gap-5 relative z-10">
        {/* Header with keyword */}
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={handleKeywordClick}
            className="group/btn flex-1 min-w-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: statusColor }}
              />
              <span className="font-mono text-[10px] tracking-widest uppercase">
                Keyword
              </span>
            </div>
            <h3 className="font-display text-3xl tracking-wide text-primary hover:text-purple-500 transition-all duration-fast text-left leading-none group-hover/btn:tracking-wider">
              {trend.keyword.toUpperCase()}
            </h3>
          </button>
          <TrendBadge status={trend.status} />
        </div>

        {/* Visual strength indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-wider uppercase">
              Trend Strength
            </span>
            <span className="font-mono text-[9px] text-secondary font-semibold">
              {trendStrength.toFixed(0)}%
            </span>
          </div>
          <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-slow ease-out"
              style={{
                width: `${trendStrength}%`,
                backgroundColor: statusColor,
                boxShadow: `0 0 8px ${statusColor}50`,
              }}
            />
          </div>
        </div>

        {/* Stats grid - modernized */}
        <div className="grid grid-cols-3 gap-3">
          {/* Mentions */}
          <div className="relative group/stat">
            <div className="absolute inset-0 bg-surface-2 rounded-md opacity-0 group-hover/stat:opacity-100 transition-opacity duration-fast" />
            <div className="relative p-3 rounded-md border border-transparent group-hover/stat:border-border transition-all duration-fast">
              <div className="flex items-center gap-1.5 mb-2">
                <Activity size={12} className="text-cyan" />
                <p className="font-mono text-[9px] tracking-wider uppercase">
                  Mentions
                </p>
              </div>
              <p className="font-mono text-2xl font-bold text-center text-primary tabular-nums">
                {trend.count}
              </p>
            </div>
          </div>

          {/* Velocity */}
          <div className="relative group/stat">
            <div className="absolute inset-0 bg-yellow/5 rounded-md opacity-0 group-hover/stat:opacity-100 transition-opacity duration-fast" />
            <div className="relative p-3 rounded-md border border-transparent group-hover/stat:border-yellow/30 transition-all duration-fast">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={15} className="text-purple-500" />
                <p className="font-mono text-[9px]  tracking-wider uppercase">
                  Velocity
                </p>
              </div>
              <p className="font-mono text-1xl font-bold text-purple-500 tabular-nums">
                {trend.velocity.toFixed(1)}
                <span className="text-xs text-muted font-normal ml-1">/day</span>
              </p>
            </div>
          </div>

          {/* First Seen */}
          <div className="relative group/stat">
            
            <div className="relative p-3 rounded-md border border-transparent group-hover/stat:border-border transition-all duration-fast">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={12} className="text-green" />
                <p className="font-mono text-[9px] tracking-wider uppercase">
                  First Seen
                </p>
              </div>
              <p className="font-mono text-xs text-secondary leading-tight">
                {formatRelativeDate(trend.firstSeen)}
              </p>
            </div>
          </div>
        </div>

        {/* Related keywords - modernized */}
        {trend.relatedKeywords.length > 0 && (
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              <span className="font-mono text-[9px] text-muted tracking-widest uppercase">
                Related Keywords
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {trend.relatedKeywords.slice(0, 5).map((kw, i) => (
                <button
                  key={kw}
                  onClick={() => setFilter('searchQuery', kw)}
                  className={clsx(
                    'font-mono text-[10px] bg-surface-2 hover:bg-yellow/10 px-2.5 py-1',
                    'rounded-sm border border-border hover:border-yellow/50',
                    'transition-all duration-fast',
                    'hover:text-yellow hover:scale-105',
                    'opacity-60 hover:opacity-100'
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
