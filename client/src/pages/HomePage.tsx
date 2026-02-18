import { Zap } from 'lucide-react';
import HeadlineFeed from '../components/headlines/HeadlineFeed';
import InsightFeed from '../components/insights/InsightFeed';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="flex flex-col gap-1 border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow" fill="currentColor" />
          <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
            Live feed
          </span>
        </div>
        <h1 className="font-display text-5xl tracking-widest text-primary leading-none">
          WHAT'S HAPPENING
        </h1>
        <p className="font-mono text-xs text-muted mt-1">
          Scraped, sorted, and slightly judged. Refreshes every 4 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main feed — takes up 2/3 */}
        <div className="xl:col-span-2">
          <HeadlineFeed />
        </div>

        {/* Sidebar: featured insights */}
        <aside className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-xl tracking-widest text-primary mb-1">
              INSIGHTS
            </h2>
            <p className="font-mono text-[10px] text-muted">
              What the data is screaming at us
            </p>
          </div>
          <InsightFeed featured limit={5} />
        </aside>
      </div>
    </div>
  );
}