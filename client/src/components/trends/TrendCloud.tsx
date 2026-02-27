
import { TrendingUp } from 'lucide-react';
import { useTrendingKeywords } from '../../hooks/useTrends';
import { useFilterStore } from '../../store/useFilterStore';
import Spinner from '../ui/Spinner';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function TrendCloud() {
  const { data: keywords = [], isLoading } = useTrendingKeywords(7);
  const setFilter = useFilterStore(s => s.setFilter);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const redirect = (keyword: string) => {
    setFilter('searchQuery', keyword);
    navigate('/');
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
              onClick={() => redirect(keyword)}
              className={clsx(
                'font-display tracking-wider text-primary leading-none',
                'transition-all duration-fast',
                'hover:text-purple-500 hover:scale-110',
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

