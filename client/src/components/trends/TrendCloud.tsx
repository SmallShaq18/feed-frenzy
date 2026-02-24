/*import { TrendingUp } from 'lucide-react';
import { useTrendingKeywords } from '../../hooks/useTrends';
import { useFilterStore } from '../../store/useFilterStore';
import Spinner from '../ui/Spinner';
import clsx from 'clsx';

export default function TrendCloud() {
  const { data: keywords = [], isLoading } = useTrendingKeywords(10);
  const setFilter = useFilterStore(s => s.setFilter);

  if (isLoading) return <div className="py-12 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="relative p-10 bg-surface/50 border border-border rounded-sm overflow-hidden group">
      {/* Decorative Grid Overlay *
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Subtle Background Radial Glow *
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 bg-[radial-gradient(circle_at_center,var(--color-yellow),transparent_70%)]" />

      <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-4 items-center justify-center max-w-3xl mx-auto">
        {keywords.map((keyword, i) => {
          // Dynamic scaling based on rank
          const sizeRem = Math.max(0.75, 2.5 - i * 0.18);
          const opacity = Math.max(0.4, 1 - i * 0.07);

          return (
            <button
              key={keyword}
              onClick={() => setFilter('searchQuery', keyword)}
              className={clsx(
                'font-display uppercase leading-none transition-all duration-300',
                'hover:text-yellow hover:scale-110 active:scale-95',
                'animate-in fade-in zoom-in-95 duration-700'
              )}
              style={{
                fontSize: `${sizeRem}rem`,
                opacity,
                animationDelay: `${i * 40}ms`,
                letterSpacing: i < 3 ? '-0.02em' : '0.05em'
              }}
            >
              {keyword}
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-2 right-3 flex items-center gap-2 opacity-20 group-hover:opacity-50 transition-opacity">
        <span className="font-mono text-[8px] uppercase tracking-[0.2em]">Live Signal Stream</span>
        <TrendingUp size={12} className="text-yellow" />
      </div>
    </div>
  );
}*/

import { TrendingUp } from 'lucide-react';
import { useTrendingKeywords } from '../../hooks/useTrends';
import { useFilterStore } from '../../store/useFilterStore';
import Spinner from '../ui/Spinner';
import clsx from 'clsx';

export default function TrendCloud() {
  const { data: keywords = [], isLoading } = useTrendingKeywords(7);
  const setFilter = useFilterStore(s => s.setFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative p-8 bg-surface rounded-md border border-border overflow-hidden group">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-slow">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow/20 via-transparent to-cyan/20 animate-spin-slow" />
      </div>

      {/* Icon decoration */}
      <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity duration-slow">
        <TrendingUp size={32} className="text-yellow" />
      </div>

      <div className="relative z-10 flex flex-wrap gap-3 items-center justify-center">
        {keywords.map((keyword, i) => {
          const sizeRem = Math.max(0.8, 2.2 - i * 0.12);
          const opacity = Math.max(0.5, 1 - i * 0.05);

          return (
            <button
              key={keyword}
              onClick={() => setFilter('searchQuery', keyword)}
              className={clsx(
                'font-display tracking-wider text-primary leading-none',
                'transition-all duration-fast',
                'hover:text-yellow hover:scale-110',
                'active:scale-95',
                'animate-fade-in'
              )}
              style={{
                fontSize: `${sizeRem}rem`,
                opacity,
                animationDelay: `${i * 50}ms`,
              }}
            >
              {keyword.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

