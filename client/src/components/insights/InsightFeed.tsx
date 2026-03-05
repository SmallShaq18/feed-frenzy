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
