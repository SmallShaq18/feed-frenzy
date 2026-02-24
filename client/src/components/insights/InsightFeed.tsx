import { useState } from 'react';
import { useInsights } from '../../hooks/useInsights';
import InsightCard from './InsightCard';
import InsightDetailPanel from './InsightDetailPanel';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
//import type { Insight } from '../../types/index';

export default function InsightFeed({ featured, limit }: { featured?: boolean; limit?: number }) {
  const { data: insights = [], isLoading, isError, refetch } = useInsights({ featured, limit });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-surface border border-border rounded-sm animate-pulse flex flex-col p-4 gap-3">
            <div className="h-4 w-24 bg-surface-2" />
            <div className="h-6 w-full bg-surface-2" />
            <div className="h-10 w-4/5 bg-surface-2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState onRetry={refetch} />;
  if (insights.length === 0) return <EmptyState icon="⚡" title="Awaiting Neural Input" />;

  return (
    <>
      <div className="flex flex-col gap-4">
        {insights.map((item, i) => (
          <InsightCard 
            key={item._id} 
            insight={item} 
            index={i} 
            featured={item.featured} 
            onCardClick={setSelectedId} 
          />
        ))}
      </div>
      <InsightDetailPanel insightId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}


/*import { useState } from 'react'; // NEW
import { useInsights } from '../../hooks/useInsights';
import InsightCard from './InsightCard';
import InsightDetailPanel from './InsightDetailPanel'; // NEW
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import type { Insight } from '../../types/index';

interface InsightFeedProps {
  featured?: boolean;
  limit?: number;
}

export default function InsightFeed({ featured, limit }: InsightFeedProps) {
  const { data: insights = [], isLoading, isError, refetch } = useInsights({ featured, limit });
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null); // NEW

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
    <>
      <div className="flex flex-col gap-3">
        {insights.map((insight: Insight, i) => (
          <InsightCard
            key={insight._id}
            insight={insight}
            index={i}
            featured={insight.featured}
            onCardClick={setSelectedInsightId} // NEW
          />
        ))}
      </div>

      {/* Insight Detail Panel *
      <InsightDetailPanel
        insightId={selectedInsightId}
        onClose={() => setSelectedInsightId(null)}
      />
    </>
  );
}*/