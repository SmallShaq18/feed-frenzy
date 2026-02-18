import TrendCloud from '../components/trends/TrendCloud';
import TrendFeed from '../components/trends/TrendFeed';

export default function TrendsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-5xl tracking-widest text-primary leading-none">
          TRENDING
        </h1>
        <p className="font-mono text-xs text-muted mt-1">
          Keywords dominating the feed right now. Click any to filter.
        </p>
      </div>

      {/* Keyword cloud */}
      <section>
        <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
          Keyword cloud · last 7 days
        </h2>
        <TrendCloud />
      </section>

      {/* Trend columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section>
          <h2 className="font-display text-xl tracking-widest text-green mb-3">
            RISING ↑
          </h2>
          <TrendFeed status="rising" />
        </section>

        <section>
          <h2 className="font-display text-xl tracking-widest text-yellow mb-3">
            PEAK ●
          </h2>
          <TrendFeed status="peak" />
        </section>

        <section>
          <h2 className="font-display text-xl tracking-widest text-coral mb-3">
            FADING ↓
          </h2>
          <TrendFeed status="declining" />
        </section>
      </div>
    </div>
  );
}