/*import { useTrends } from '../../hooks/useTrends';
import TrendCard from './TrendCard';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import type { Trend } from '../../types/index';

export default function TrendFeed({ status }: { status?: 'rising' | 'peak' | 'declining' }) {
  const { data: trends = [], isLoading, isError, refetch } = useTrends(status);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 w-full bg-surface border border-border animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorState title="Telemetry Error" onRetry={refetch} />;
  
  if (trends.length === 0) {
    return <EmptyState icon="📡" title="Zero Frequency" description="No active trends matching current parameters." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {trends.map((trend: Trend, i) => (
        <TrendCard key={trend._id} trend={trend} index={i} />
      ))}
    </div>
  );
}*/

import { useTrends } from '../../hooks/useTrends';
import TrendCard from './TrendCard';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import type { Trend } from '../../types/index';

interface TrendFeedProps {
  status?: 'rising' | 'peak' | 'declining';
}

export default function TrendFeed({ status }: TrendFeedProps) {
  const { data: trends = [], isLoading, isError, refetch } = useTrends(status);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 bg-surface border border-border rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Trends took a nap 💤"
        description="Couldn't load trends right now."
        onRetry={refetch}
      />
    );
  }

  if (trends.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No trends yet"
        description="Run the scraper first to populate trend data."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {trends.map((trend: Trend, i) => (
        <TrendCard key={trend._id} trend={trend} index={i} />
      ))}
    </div>
  );
}