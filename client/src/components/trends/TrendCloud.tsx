import { useTrendingKeywords } from '../../hooks/useTrends';
import { useFilterStore } from '../../store/useFilterStore';
import Spinner from '../ui/Spinner';

/**
 * Visual keyword cloud.
 * Font size scales with index (top keywords are biggest).
 * Clicking a keyword filters the feed.
 */
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
}