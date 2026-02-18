//import { useRef, useCallback } from 'react';
import { useInView as useIntersection} from 'react-intersection-observer';
import { useInfiniteHeadlines } from '../../hooks/useHeadlines';
import { useFilterStore } from '../../store/useFilterStore';
import HeadlineCard from './HeadlineCard';
import HeadlineCardSkeleton from './HeadlineCardSkeleton';
import HeadlineFilters from './HeadlineFilters';
import HeadlineSearch from './HeadlineSearch';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import Spinner from '../ui/Spinner';

export default function HeadlineFeed() {
  const { source, category, sentiment, searchQuery } = useFilterStore();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteHeadlines({ source, category, sentiment, search: searchQuery });

  // Intersection observer — fires fetchNextPage when sentinel div enters viewport
  const { ref: sentinelRef } = useIntersection({
    threshold: 0.1,
    onChange: inView => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  // Flatten pages into a single array
  const headlines = data?.pages.flatMap(page => page.headlines) ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <HeadlineSearch />
        <HeadlineFilters />
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <HeadlineCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Feed went haywire 🌪️"
          description="Couldn't load headlines. The servers might be having a moment."
          onRetry={refetch}
        />
      ) : headlines.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Nothing here"
          description="No headlines match your filters. Try loosening them up a bit."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {headlines.map((headline, i) => (
            <HeadlineCard key={headline._id} headline={headline} index={i} />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          )}

          {/* End of feed message */}
          {!hasNextPage && headlines.length > 0 && (
            <p className="text-center font-mono text-[10px] text-muted py-6 tracking-widest">
              ── you've reached the end ──
            </p>
          )}
        </div>
      )}
    </div>
  );
}