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

/*import { useTrendingKeywords } from '../../hooks/useTrends';
import { useFilterStore } from '../../store/useFilterStore';
import Spinner from '../ui/Spinner';

/**
 * Visual keyword cloud.
 * Font size scales with index (top keywords are biggest).
 * Clicking a keyword filters the feed.
 *
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
    <div className="flex flex-wrap gap-2 items-center p-6 bg-surface rounded-md border border-border">
      {keywords.map((keyword, i) => {
        // Size inversely proportional to rank
        const sizeRem = Math.max(0.75, 2 - i * 0.1);
        const opacity = Math.max(0.4, 1 - i * 0.05);

        return (
          <button
            key={keyword}
            onClick={() => setFilter('searchQuery', keyword)}
            className="font-display tracking-wider text-primary hover:text-yellow transition-colors duration-fast leading-none"
            style={{ fontSize: `${sizeRem}rem`, opacity }}
          >
            {keyword.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}*/