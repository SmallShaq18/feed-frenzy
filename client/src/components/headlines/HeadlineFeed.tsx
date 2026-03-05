import { useEffect, useState } from 'react';
import { useInView as useIntersection } from 'react-intersection-observer';
import { useInfiniteHeadlines } from '../../hooks/useHeadlines';
import { useFilterStore } from '../../store/useFilterStore';
import HeadlineCard from './HeadlineCard';
import HeadlineCardSkeleton from './HeadlineCardSkeleton';
import HeadlineFilters from './HeadlineFilters';
import HeadlineSearch from './HeadlineSearch';
import ArticleDetailPanel from './ArticleDetailPanel'; // NEW
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import Spinner from '../ui/Spinner';
import AdvancedFilters from './AdvancedFilters';

export default function HeadlineFeed() {
  const { source, category, sentiment, searchQuery, sortBy,
    dateRange,
    minViews,
    hasImage, } = useFilterStore();
  const [selectedHeadlineId, setSelectedHeadlineId] = useState<string | null>(null); // NEW

  // DEBUG: Log filters whenever they change
  useEffect(() => {
    console.log('🔍 Active Filters:', {
      source,
      category,
      sentiment,
      search: searchQuery,
      sortBy,
      dateRange,
      minViews,
      hasImage,
    });
  }, [source, category, sentiment, searchQuery, sortBy, dateRange, minViews, hasImage]);
  
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteHeadlines({ source, category, sentiment: sentiment || undefined, search: searchQuery, sortBy,
    dateRange,
    minViews,
    hasImage });

  const { ref: sentinelRef } = useIntersection({
    threshold: 0.1,
    onChange: inView => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const headlines = data?.pages.flatMap(page => page.headlines) ?? [];

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <HeadlineSearch />
          <div className="block sm:flex items-center gap-2">
            <HeadlineFilters />
            <AdvancedFilters />
          </div>
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
              <HeadlineCard
                key={headline._id}
                headline={headline}
                index={i}
                onCardClick={setSelectedHeadlineId} // NEW
              />
            ))}

            <div ref={sentinelRef} className="h-4" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
              </div>
            )}

            {!hasNextPage && headlines.length > 0 && (
              <p className="text-center font-mono text-[10px] text-muted py-6 tracking-widest">
                ── you've reached the end ──
              </p>
            )}
          </div>
        )}
      </div>

      {/* Article Detail Panel */}
      <ArticleDetailPanel
        headlineId={selectedHeadlineId}
        onClose={() => setSelectedHeadlineId(null)}
      />
    </>
  );
}
