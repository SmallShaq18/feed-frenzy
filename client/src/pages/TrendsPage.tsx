import { useState, useRef, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import TrendCloud from '../components/trends/TrendCloud';
import TrendFeed from '../components/trends/TrendFeed';
import clsx from 'clsx';

const TREND_TABS = [
  { status: 'rising', label: 'RISING', icon: '↑', color: 'text-green', borderColor: 'border-green' },
  { status: 'peak', label: 'PEAK', icon: '●', color: 'text-yellow', borderColor: 'border-yellow' },
  { status: 'declining', label: 'FADING', icon: '↓', color: 'text-coral', borderColor: 'border-coral' },
] as const;

export default function TrendsPage() {
  const [activeTab, setActiveTab] = useState<'rising' | 'peak' | 'declining'>('rising');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);

  // Scroll to active section when tab is clicked
  useEffect(() => {
    if (!scrollContainerRef.current || window.innerWidth >= 768) return;

    const activeIndex = TREND_TABS.findIndex(tab => tab.status === activeTab);
    const scrollPosition = activeIndex * scrollContainerRef.current.offsetWidth;

    // Set flag before scrolling
    isScrollingProgrammatically.current = true;

    scrollContainerRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    // Clear flag after scroll animation completes
    const timer = setTimeout(() => {
      isScrollingProgrammatically.current = false;
    }, 200); // Match scroll animation duration

    return () => clearTimeout(timer);

  }, [activeTab]);

  // Handle manual swipe (finger drag)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Ignore scroll events triggered by tab clicks
    if (isScrollingProgrammatically.current) return;

    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.offsetWidth;
    const index = Math.round(scrollLeft / width);

    if (TREND_TABS[index]) {
      setActiveTab(TREND_TABS[index].status);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Header */}
      <div className="border-b border-border pb-4 md:pb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-yellow" />
          <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
            Tracking What's Hot
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-widest text-primary leading-none">
          TRENDS
        </h1>
        <p className="font-mono text-[10px] md:text-xs text-muted mt-1">
          Updated daily at 2 AM UTC
        </p>
      </div>

      {/* Keyword Cloud */}
      <section>
        <h2 className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
          Trending Keywords
        </h2>
        <TrendCloud />
      </section>

      {/* Mobile: Tab Navigation */}
      <div className="md:hidden">
        <div className="flex items-center border-b border-border relative">
          {TREND_TABS.map(tab => (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={clsx(
                'flex-1 font-display text-sm tracking-wider py-3 border-b-2 transition-all duration-fast',
                'flex items-center justify-center gap-1.5',
                activeTab === tab.status
                  ? `${tab.borderColor} ${tab.color}`
                  : 'border-transparent text-muted'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Swipeable container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide mt-6"
          onScroll={handleScroll}
        >
          {TREND_TABS.map(tab => (
            <div key={tab.status} className="w-full flex-shrink-0 snap-center px-1">
              <TrendFeed status={tab.status} />
            </div>
          ))}
        </div>

        {/* Swipe indicator dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {TREND_TABS.map(tab => (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={clsx(
                'w-2 h-2 rounded-full transition-all duration-fast',
                activeTab === tab.status
                  ? `${tab.color} bg-current`
                  : 'bg-border'
              )}
              aria-label={`View ${tab.label} trends`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: 3-Column Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {TREND_TABS.map(tab => (
          <section key={tab.status}>
            <h2 className={clsx('font-display text-xl tracking-widest mb-3 flex items-center gap-2', tab.color)}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </h2>
            <TrendFeed status={tab.status} />
          </section>
        ))}
      </div>
    </div>
  );
}