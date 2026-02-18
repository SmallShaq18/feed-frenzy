import { useInsights } from '../../hooks/useInsights';
import InsightCard from './InsightCard';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import type { Insight } from '../../types/index';

interface InsightFeedProps {
  featured?: boolean;
  limit?: number;
}

export default function InsightFeed({ featured, limit }: InsightFeedProps) {
  const { data: insights = [], isLoading, isError, refetch } = useInsights({ featured, limit });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 bg-surface border border-border rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Insights went dark 🕳️"
        description="Couldn't load insights. Try again."
        onRetry={refetch}
      />
    );
  }

  if (insights.length === 0) {
    return (
      <EmptyState
        icon="💡"
        title="No insights yet"
        description="Insights generate automatically after trends are detected. Check back soon."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {insights.map((insight: Insight, i) => (
        <InsightCard
          key={insight._id}
          insight={insight}
          index={i}
          featured={insight.featured}
        />
      ))}
    </div>
  );
}