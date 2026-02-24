import { TrendingUp, Activity, Radio } from 'lucide-react';
import HeadlineFeed from '../components/headlines/HeadlineFeed';
//import InsightFeed from '../components/insights/InsightFeed';
import { useTrends } from '../hooks/useTrends';
import { useFilterStore } from '../store/useFilterStore';

export default function HomePage() {
  const { data: risingTrends = [] } = useTrends('rising');
  const setFilter = useFilterStore(s => s.setFilter);

  return (
    <div className="flex flex-col gap-10 max-w-[1600px] mx-auto px-4 py-8 bg-background text-foreground transition-colors duration-300">
      
      {/* 01. HERO SECTION: The Intelligence Header */}
      <header className="relative flex flex-col gap-4 border-l-4 border-violet-600 pl-6 py-2">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-600"></span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase font-bold">
            Live Intelligence System // Refreshed 4h ago
          </span>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-[0.8] uppercase italic drop-shadow-sm">
              FEED <span className="text-transparent border-v-stroke">FRENZY</span>
            </h1>
            <p className="font-mono text-xs text-muted-foreground max-w-xl leading-relaxed uppercase tracking-tight">
              Scraped from 17+ sources. The internet is talking — <span className="text-foreground font-bold">we're just keeping score.</span>
            </p>
          </div>

          {/* Rapid Stats Integrated into Header */}
          <div className="flex gap-8 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-8">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Velocity</span>
              <span className="font-display text-3xl text-violet-600">
                {risingTrends.length > 0 ? Math.max(...risingTrends.map(t => t.velocity)).toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Active Nodes</span>
              <span className="font-display text-3xl text-foreground">{risingTrends.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Status</span>
              <span className="font-mono text-[10px] mt-3 text-emerald-500 font-bold flex items-center gap-1">
                <Radio size={10} /> OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 02. TRENDING TICKER: Keyword Cloud */}
      {risingTrends.length > 0 && (
        <section className="bg-muted/30 border-y border-border py-3 overflow-hidden">
          <div className="flex items-center gap-4 px-2">
            <div className="flex items-center gap-2 whitespace-nowrap border-r border-border pr-4">
              <TrendingUp size={14} className="text-violet-500" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Trending Now:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {risingTrends.slice(0, 10).map((trend) => (
                <button
                  key={trend._id}
                  onClick={() => setFilter('searchQuery', trend.keyword)}
                  className="font-mono text-[11px] hover:text-violet-500 transition-colors uppercase tracking-tight flex gap-1 items-center group"
                >
                  <span className="text-muted-foreground group-hover:text-violet-400">#</span>
                  {trend.keyword}
                  <span className="text-[9px] opacity-50">[{trend.count}]</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 03. MAIN DASHBOARD GRID */}
      <main className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left: Headline Feed (8/12) */}
        <section className="xl:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-mono text-xs font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <Activity size={14} /> // Primary Pulse
            </h2>
            <div className="h-px flex-grow mx-4 bg-gradient-to-r from-border to-transparent"></div>
          </div>
          
          <div className="min-h-screen">
            <HeadlineFeed />
          </div>
        </section>

        {/* Right: Insights Sidebar (4/12) */}
        <aside className="xl:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-6">
            
            {/* Insights Module */}
            <div className="bg-card border border-border p-6 shadow-sm relative overflow-hidden group">
              {/*<div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                <Zap size={32} className="text-violet-600" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-2xl tracking-tight uppercase italic">
                    Signal Extraction
                  </h2>
                  <ArrowUpRight size={18} className="text-violet-500" />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mb-6 leading-relaxed uppercase">
                  Pattern analysis from detected anomalies
                </p>
                
                <div className="space-y-4">
                  <InsightFeed limit={5} />
                </div>
              </div>*/}

              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
            </div>

            {/* Newsletter CTA */}
            <div className="p-6 border border-dashed border-border bg-muted/20 text-center space-y-4">
              <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                Get the weekly digest
              </p>
              <a
                href="/newsletter"
                className="block w-full py-3 bg-foreground text-background font-mono text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-violet-600 hover:text-white transition-all"
              >
                Subscribe
              </a>
            </div>

            {/* System Metadata */}
            <div className="px-2">
              <p className="font-mono text-[9px] text-muted-foreground leading-tight uppercase opacity-60">
                ⚡ Data refresh: 4h intervals<br />
                📊 Pattern sync: 02:00 UTC<br />
                🤖 Analysis: Algorithmic bias possible.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}