import { Calendar, TrendingUp, Lightbulb, Newspaper } from 'lucide-react';
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