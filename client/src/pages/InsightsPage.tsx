import InsightFeed from '../components/insights/InsightFeed';

export default function InsightsPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-12">
      <header className="relative py-6 border-y-4 border-double border-border">
        <div className="absolute top-[-10px] left-4 bg-background px-2 font-mono text-[9px] text-violet-600 font-bold uppercase tracking-[0.4em]">
          Automated Analysis Report
        </div>
        <h1 className="font-display text-7xl tracking-tighter uppercase leading-none italic text-center">
          SIGNAL <span className="text-transparent border-v-stroke">&</span> NOISE
        </h1>
        <p className="font-mono text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed">
          Heuristics applied to current news cycle. Anomalies prioritized by velocity.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="font-mono text-xs font-black tracking-widest text-foreground uppercase italic">Generated Insights</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
        <div className="bg-card/30 backdrop-blur-sm p-4 border border-border">
          <InsightFeed />
        </div>
      </section>
    </div>
  );
}

/*export default function InsightsPage() {
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

      {/* Single feed showing all insights *
      <section>
        <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
          All Insights
        </h2>
        <InsightFeed />
      </section>
    </div>
  );
}*/