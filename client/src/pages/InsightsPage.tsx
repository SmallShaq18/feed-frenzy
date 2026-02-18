import InsightFeed from '../components/insights/InsightFeed';

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-5xl tracking-widest text-primary leading-none">
          INSIGHTS
        </h1>
        <p className="font-mono text-xs text-muted mt-1">
          Patterns, anomalies, and predictions. Auto-generated from the data.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section>
          <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
            Featured
          </h2>
          <InsightFeed featured />
        </section>

        <section>
          <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
            All insights
          </h2>
          <InsightFeed />
        </section>
      </div>
    </div>
  );
}