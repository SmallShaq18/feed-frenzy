/*import TrendCloud from '../components/trends/TrendCloud';
import TrendFeed from '../components/trends/TrendFeed';

export default function TrendsPage() {
  const sections = [
    { title: 'Rising', icon: '↑', color: 'text-emerald-500', status: 'rising' },
    { title: 'Peak', icon: '●', color: 'text-violet-500', status: 'peak' },
    { title: 'Fading', icon: '↓', color: 'text-coral', status: 'declining' },
  ];

  return (
    <div className="flex flex-col gap-12">
      <header className="border-b border-border pb-8">
        <h1 className="font-display text-6xl tracking-tighter uppercase italic leading-none">
          MACRO <span className="text-transparent border-v-stroke">TRENDS</span>
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground mt-4 uppercase tracking-[0.3em]">
          Real-time keyword velocity analysis // 7-Day Window
        </p>
      </header>

      <section className="bg-muted/10 border border-border p-8 backdrop-blur-sm">
        <h2 className="font-mono text-[10px] font-bold text-muted-foreground tracking-[0.4em] uppercase mb-8 flex items-center gap-4">
          Visual Heatmap <div className="h-px flex-1 bg-border" />
        </h2>
        <TrendCloud />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
        {sections.map((s) => (
          <section key={s.title} className="bg-background p-6">
            <h2 className={`font-display text-2xl tracking-tighter mb-6 flex items-center justify-between uppercase italic ${s.color}`}>
              {s.title} <span className="text-xs font-mono opacity-50">{s.icon}</span>
            </h2>
            <TrendFeed status="declining" />
          </section>
        ))}
      </div>
    </div>
  );
}*/

import TrendCloud from '../components/trends/TrendCloud';
import TrendFeed  from '../components/trends/TrendFeed';

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