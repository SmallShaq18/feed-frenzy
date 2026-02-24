/*import { Calendar, } from 'lucide-react';
import { useFeaturedInsights } from '../hooks/useInsights';
import { useTrends } from '../hooks/useTrends';
import { useHeadlines } from '../hooks/useHeadlines';
import InsightCard from '../components/insights/InsightCard';
import TrendCard from '../components/trends/TrendCard';
import HeadlineCard from '../components/headlines/HeadlineCard';
import Spinner from '../components/ui/Spinner';
import { useState } from 'react';
import ArticleDetailPanel from '../components/headlines/ArticleDetailPanel';
import InsightDetailPanel from '../components/insights/InsightDetailPanel';

export default function RecapPage() {
  const [selectedHeadlineId, setSelectedHeadlineId] = useState<string | null>(null);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);

  const { data: insights = [], isLoading: insightsLoading } = useFeaturedInsights(5);
  const { data: trends = [], isLoading: trendsLoading } = useTrends('rising');
  const { data: headlinesData, isLoading: headlinesLoading } = useHeadlines({
    limit: 10,
    sortBy: 'trending',
  });

  const isLoading = insightsLoading || trendsLoading || headlinesLoading;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const dateRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <>
      <div className="flex flex-col gap-12 max-w-7xl mx-auto">
        <header className="border-l-4 border-purple-500 pl-8 py-4">
          <div className="flex items-center gap-3 mb-3 font-mono text-[10px] text-violet-500 font-bold uppercase tracking-[0.3em]">
            <Calendar size={14} /> {dateRange}
          </div>
          <h1 className="font-display text-7xl tracking-tighter uppercase italic leading-[0.8]">
            WEEKLY <span className="text-transparent border-v-stroke">RECAP</span>
          </h1>
        </header>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center gap-4">
            <Spinner size="lg" className="text-violet-600" />
            <p className="font-mono text-[10px] uppercase tracking-widest animate-pulse">Compiling Report...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-3 space-y-1">
              <div className="bg-muted/10 border border-border p-6 text-center lg:text-left">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest block mb-1">Headlines</span>
                <span className="font-display text-5xl">{headlinesData?.pagination.total || 0}</span>
              </div>
              <div className="bg-muted/10 border border-border p-6 text-center lg:text-left">
                <span className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest block mb-1">Rising Trends</span>
                <span className="font-display text-5xl text-emerald-500">{trends.length}</span>
              </div>
              <div className="bg-muted/10 border border-border p-6 text-center lg:text-left">
                <span className="font-mono text-[9px] text-violet-500 uppercase tracking-widest block mb-1">Signals</span>
                <span className="font-display text-5xl text-violet-500">{insights.length}</span>
              </div>
            </aside>

            <div className="lg:col-span-9 space-y-16">
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-mono text-[10px] font-bold text-muted-foreground tracking-[0.4em] uppercase">Critical Insights</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-4">
                  {insights.map((insight, i) => (
                    <InsightCard key={insight._id} insight={insight} index={i} featured onCardClick={setSelectedInsightId} />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-mono text-[10px] font-bold text-muted-foreground tracking-[0.4em] uppercase">Keyword Velocity</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trends.slice(0, 6).map((trend, i) => (
                      <TrendCard key={trend._id} trend={trend} index={i} />
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-mono text-[10px] font-bold text-muted-foreground tracking-[0.4em] uppercase">Essential Reading</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="flex flex-col border border-border divide-y divide-border">
                  {headlinesData?.headlines.slice(0, 10).map((headline, i) => (
                    <HeadlineCard key={headline._id} headline={headline} index={i} onCardClick={setSelectedHeadlineId} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      <ArticleDetailPanel headlineId={selectedHeadlineId} onClose={() => setSelectedHeadlineId(null)} />
      <InsightDetailPanel insightId={selectedInsightId} onClose={() => setSelectedInsightId(null)} />
    </>
  );
}*/

import { Calendar, TrendingUp, Lightbulb, Newspaper } from 'lucide-react';
import { useInsights, useFeaturedInsights } from '../hooks/useInsights';
import { useTrends } from '../hooks/useTrends';
import { useHeadlines } from '../hooks/useHeadlines';
import InsightCard from '../components/insights/InsightCard';
import TrendCard from '../components/trends/TrendCard';
import HeadlineCard from '../components/headlines/HeadlineCard';
import Spinner from '../components/ui/Spinner';
import { useState } from 'react';
import ArticleDetailPanel from '../components/headlines/ArticleDetailPanel';
import InsightDetailPanel from '../components/insights/InsightDetailPanel';

export default function RecapPage() {
  const [selectedHeadlineId, setSelectedHeadlineId] = useState<string | null>(null);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);

  // Get this week's data
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: insights = [], isLoading: insightsLoading } = useFeaturedInsights(5);
  const { data: trends = [], isLoading: trendsLoading } = useTrends('rising');
  const { data: headlinesData, isLoading: headlinesLoading } = useHeadlines({
    limit: 10,
    sortBy: 'trending',
  });

  const isLoading = insightsLoading || trendsLoading || headlinesLoading;

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekEnd = new Date();

  const dateRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Header */}

        <header className="border-l-4 border-purple-500 pl-8 py-4">
          <div className="flex items-center gap-3 mb-3 font-mono text-[10px] text-violet-500 font-bold uppercase tracking-[0.3em]">
            <Calendar size={14} /> {dateRange}
          </div>
          <h1 className="font-display text-7xl tracking-tighter uppercase italic leading-[0.8]">
            WEEKLY <span className="text-transparent border-v-stroke">RECAP</span>
          </h1>
          <p className="font-mono text-xs text-muted mt-1">
            This week's biggest stories, trends, and insights — all in one place.
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-surface border border-border rounded-md p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Newspaper size={16} />
                  <p className="font-mono text-[10px] text-muted tracking-widest uppercase">
                    Headlines
                  </p>
                </div>
                <p className="font-display text-4xl">
                  {headlinesData?.pagination.total || 0}
                </p>
              </div>

              <div className="bg-surface border border-border rounded-md p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-green" />
                  <p className="font-mono text-[10px] text-muted tracking-widest uppercase">
                    Rising Trends
                  </p>
                </div>
                <p className="font-display text-4xl text-green">
                  {trends.length}
                </p>
              </div>

              <div className="bg-surface border border-border rounded-md p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lightbulb size={16} className="text-purple-500" />
                  <p className="font-mono text-[10px] text-muted tracking-widest uppercase">
                    Insights
                  </p>
                </div>
                <p className="font-display text-4xl text-purple-500">
                  {insights.length}
                </p>
              </div>
            </div>

            {/* Top Insights */}
            {insights.length > 0 && (
              <section>
                <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3 flex items-center gap-1.5">
                  <Lightbulb size={12} />
                  Top Insights This Week
                </h2>
                <div className="flex flex-col gap-3">
                  {insights.map((insight, i) => (
                    <InsightCard
                      key={insight._id}
                      insight={insight}
                      index={i}
                      featured
                      onCardClick={setSelectedInsightId}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Trending Keywords */}
            {trends.length > 0 && (
              <section>
                <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3 flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  What's Trending
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {trends.slice(0, 6).map((trend, i) => (
                    <TrendCard key={trend._id} trend={trend} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Must-Read Headlines */}
            {headlinesData && headlinesData.headlines.length > 0 && (
              <section>
                <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3 flex items-center gap-1.5">
                  <Newspaper size={12} />
                  Must-Read Headlines
                </h2>
                <div className="flex flex-col gap-3">
                  {headlinesData.headlines.slice(0, 10).map((headline, i) => (
                    <HeadlineCard
                      key={headline._id}
                      headline={headline}
                      index={i}
                      onCardClick={setSelectedHeadlineId}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <ArticleDetailPanel
        headlineId={selectedHeadlineId}
        onClose={() => setSelectedHeadlineId(null)}
      />
      <InsightDetailPanel
        insightId={selectedInsightId}
        onClose={() => setSelectedInsightId(null)}
      />
    </>
  );
}