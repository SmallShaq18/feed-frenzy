import { RefreshCw, BarChart2, Users } from 'lucide-react';
import { useScrapingStats, useTriggerScrape } from '../hooks/useScraperStats';
import { useSubscribers } from '../hooks/useSubscribers';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { formatRelativeDate } from '../utils/formatDate';

export default function AdminPage() {
  const { data: stats, isLoading } = useScrapingStats();
  const { data: subscribers } = useSubscribers();
  const { mutate: triggerScrape, isPending: isScraping } = useTriggerScrape();

  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-border pb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-5xl tracking-widest text-primary leading-none">
            ADMIN
          </h1>
          <p className="font-mono text-xs text-muted mt-1">
            Scraper controls and system stats
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => triggerScrape()}
          loading={isScraping}
          className="gap-2"
        >
          <RefreshCw size={14} />
          Run scraper now
        </Button>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accent>
            <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2">
              Total headlines
            </p>
            <p className="font-display text-4xl text-yellow">
              {stats.totalHeadlines.toLocaleString()}
            </p>
          </Card>

          <Card>
            <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2">
              Sources active
            </p>
            <p className="font-display text-4xl text-primary">
              {stats.headlinesBySource.length}
            </p>
          </Card>

          <Card>
            <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2">
              Last scraped
            </p>
            <p className="font-mono text-sm text-secondary">
              {stats.lastScrapedAt
                ? formatRelativeDate(stats.lastScrapedAt)
                : 'Never'}
            </p>
          </Card>
        </div>
      ) : null}

      {/* Sources breakdown */}
      {stats && stats.headlinesBySource.length > 0 && (
        <section>
          <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
            Articles by source
          </h2>
          <div className="flex flex-col gap-2">
            {stats.headlinesBySource.map(({ source, count }) => {
              const max = stats.headlinesBySource[0].count;
              const pct = (count / max) * 100;

              return (
                <div key={source} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-secondary w-36 truncate flex-shrink-0">
                    {source}
                  </span>
                  <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow rounded-full transition-all duration-slow"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted w-8 text-right flex-shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {subscribers && (
  <section>
    <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
      Newsletter Subscribers
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2">
          Total
        </p>
        <p className="font-display text-3xl text-primary">
          {subscribers.total}
        </p>
      </Card>
      <Card accent>
        <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2">
          Active
        </p>
        <p className="font-display text-3xl text-green">
          {subscribers.active}
        </p>
      </Card>
      <Card>
        <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2">
          Unsubscribed
        </p>
        <p className="font-display text-3xl text-coral">
          {subscribers.unsubscribed}
        </p>
      </Card>
    </div>
  </section>
)}
    </div>
  );
}