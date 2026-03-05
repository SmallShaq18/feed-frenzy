import { TrendingUp, Activity, Radio } from 'lucide-react';
import HeadlineFeed from '../components/headlines/HeadlineFeed';
import { useTrends } from '../hooks/useTrends';
import { useFilterStore } from '../store/useFilterStore';
import { useUIStore } from '../store/useUIStore';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: risingTrends = [] } = useTrends('rising');
  const setFilter = useFilterStore(s => s.setFilter);
  //const sidebarOpen = useUIStore(s => s.sidebarOpen);
  const setSidebarOpen = useUIStore(s => s.setSidebarOpen);

  // Close sidebar on mobile when component mounts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setSidebarOpen(false);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="flex flex-col gap-6 md:gap-10 max-w-[1600px] mx-auto px-3 sm:px-4 py-4 sm:py-8 bg-background text-foreground transition-colors duration-300">
      
      {/* 01. HERO SECTION: Responsive Header */}
      <header className="relative flex flex-col gap-3 md:gap-4 border-l-2 md:border-l-4 border-violet-600 pl-3 md:pl-6 py-2">
        {/* Status indicator */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex h-2 w-2 md:h-3 md:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-violet-600"></span>
          </div>
          <span className="font-mono text-[8px] sm:text-[10px] text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] uppercase font-bold">
            Live Intelligence // <span className="hidden sm:inline">Refreshed </span>4h ago
          </span>
        </div>
        
        {/* Title and stats */}
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.8] uppercase italic drop-shadow-sm">
              FEED <span className="text-transparent border-v-stroke">FRENZY</span>
            </h1>
            <p className="font-mono text-[10px] sm:text-xs text-muted-foreground max-w-xl leading-relaxed uppercase tracking-tight">
              Scraped from 17+ sources. <br className="sm:hidden" />
              The internet is talking — <span className="text-foreground font-bold">we're keeping score.</span>
            </p>
          </div>

          {/* Stats - Responsive grid */}
          <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-6 lg:gap-8 border-t border-border pt-3 md:pt-4">
            <div className="flex flex-col">
              <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest">
                Velocity
              </span>
              <span className="font-display text-xl sm:text-2xl md:text-3xl text-violet-600">
                {risingTrends.length > 0 ? Math.max(...risingTrends.map(t => t.velocity)).toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest">
                <span className="hidden sm:inline">Active </span>Nodes
              </span>
              <span className="font-display text-xl sm:text-2xl md:text-3xl text-foreground">
                {risingTrends.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest">
                Status
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] mt-2 sm:mt-3 text-emerald-500 font-bold flex items-center gap-1">
                <Radio size={8} className="sm:w-[10px] sm:h-[10px]" /> 
                <span className="hidden sm:inline">OPERATIONAL</span>
                <span className="sm:hidden">LIVE</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 02. TRENDING TICKER: Horizontal scroll on mobile */}
      {risingTrends.length > 0 && (
        <section className="bg-muted/30 border-y border-border py-2 sm:py-3 -mx-3 sm:-mx-4 px-3 sm:px-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            {/* Label */}
            <div className="flex items-center gap-2 whitespace-nowrap border-r border-border pr-3 sm:pr-4 flex-shrink-0">
              <TrendingUp size={12} className="text-violet-500 sm:w-[14px] sm:h-[14px]" />
              <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                <span className="hidden sm:inline">Trending</span>
                <span className="sm:hidden">Hot</span>
              </span>
            </div>
            
            {/* Scrollable keyword list */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide flex-nowrap sm:flex-wrap">
              {risingTrends.slice(0, 10).map((trend) => (
                <button
                  key={trend._id}
                  onClick={() => setFilter('searchQuery', trend.keyword)}
                  className="font-mono text-[10px] sm:text-[11px] hover:text-violet-500 transition-colors uppercase tracking-tight flex gap-1 items-center group whitespace-nowrap flex-shrink-0"
                >
                  <span className="text-muted-foreground group-hover:text-violet-400">#</span>
                  {trend.keyword}
                  <span className="text-[8px] sm:text-[9px] opacity-50">[{trend.count}]</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 03. MAIN DASHBOARD GRID: Responsive layout */}
      <main className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
        
        {/* Left: Headline Feed (full width on mobile, 8/12 on desktop) */}
        <section className="xl:col-span-8 flex flex-col gap-4 md:gap-6">
          {/* Section header */}
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="font-mono text-[10px] sm:text-xs font-black tracking-widest text-muted-foreground uppercase flex items-center gap-2">
              <Activity size={12} className="sm:w-[14px] sm:h-[14px]" /> 
              <span className="hidden sm:inline">// Primary Pulse</span>
              <span className="sm:hidden">// Feed</span>
            </h2>
            <div className="h-px flex-grow mx-2 sm:mx-4 bg-gradient-to-r from-border to-transparent"></div>
          </div>
          
          {/* Headlines */}
          <div className="min-h-screen">
            <HeadlineFeed />
          </div>
        </section>

        {/* Right: Sidebar (hidden on mobile, visible on xl+) */}
        <aside className="xl:col-span-4 space-y-6 md:space-y-8 hidden xl:block">
          <div className="sticky top-24 space-y-6">
            
            {/* Insights Module (placeholder) */}
            <div className="bg-card border border-border p-6 shadow-sm relative overflow-hidden group">
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

      {/* Mobile Newsletter CTA (only on small screens) */}
      <div className="xl:hidden p-4 sm:p-6 border border-dashed border-border bg-muted/20 text-center space-y-3 sm:space-y-4">
        <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-widest">
          Get the weekly digest
        </p>
        <a
          href="/newsletter"
          className="block w-full py-2.5 sm:py-3 bg-foreground text-background font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-violet-600 hover:text-white transition-all"
        >
          Subscribe to Newsletter
        </a>
      </div>
    </div>
  );
}
