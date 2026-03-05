import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';
import { getCategoryColor } from '../../utils/categoryColors';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
//import { useEffect } from 'react';

const CATEGORIES = [
  { value: 'tech',     label: 'TECHNOLOGY' },
  { value: 'ai',       label: 'AI_SYSTEMS' },
  { value: 'crypto',   label: 'CRYPTO_WEB3' },
  { value: 'startups', label: 'STARTUPS' },
  { value: 'movies',   label: 'CINEMA' },
  { value: 'anime',    label: 'ANIME' },
];

const SENTIMENTS = [
  { value: 'positive', label: '↑ Positive', color: 'var(--color-sentiment-positive)' },
  { value: 'neutral',  label: '→ Neutral',  color: 'var(--color-sentiment-neutral)'  },
  { value: 'negative', label: '↓ Negative', color: 'var(--color-sentiment-negative)' },
];

export default function Sidebar() {
  const sidebarOpen = useUIStore(s => s.sidebarOpen);
  const setSidebarOpen = useUIStore(s => s.setSidebarOpen);
  const { category, sentiment, setFilter, clearFilters, hasActiveFilters } = useFilterStore();
  const navigate = useNavigate();



  // Auto-close on mobile when any filter is clicked
  const handleFilterClick = (filterType: 'category' | 'sentiment', value: string) => {
    const isActive = filterType === 'category' ? category === value : sentiment === value;
    setFilter(filterType, isActive ? '' : value);
    navigate('/');
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) { // lg breakpoint
      setTimeout(() => setSidebarOpen(false), 300); // Small delay for UX
      navigate('/'); // Ensure we navigate to the feed after setting filter
    }
  };

  // Close sidebar when clicking quick links on mobile
  const handleQuickLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
      navigate('/');
    }
  };

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed top-14 left-0 bottom-0 w-60 z-30 bg-bg border-r border-border overflow-y-auto scroll-hidden">
      <div className="p-4 flex flex-col gap-6">

        <section>
          <nav className="flex flex-col gap-0.5">
            {[
              { to: '/',           label: 'FEED' },
              { to: '/trends',     label: 'TRENDS' },
              { to: '/insights',   label: 'INSIGHTS' },
              { to: '/newsletter', label: 'NEWSLETTER' },
              { to: '/recap',      label: 'RECAP' },
            ].map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleQuickLinkClick}
                className={({ isActive }) =>
                  clsx(
                    'px-2 py-1.5 rounded-sm font-mono text-xs',
                    'transition-all duration-fast',
                    isActive
                      ? 'text-purple-500 bg-purple-500/10'
                      : 'text-secondary hover:text-primary hover:bg-surface-2'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </section>

        {/* Active filter clear */}
        {hasActiveFilters() && (
          <button
            onClick={() => {
              clearFilters();
              if (window.innerWidth < 1024) {
                setTimeout(() => setSidebarOpen(false), 300);
              }
            }}
            className="w-full text-left font-mono text-[10px] text-coral tracking-widest uppercase hover:underline"
          >
            ✕ Clear filters
          </button>
        )}

        {/* Categories */}
        <section>
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
            Category
          </p>
          <ul className="flex flex-col gap-0.5">
            {CATEGORIES.map(cat => {
              const isActive = category === cat.value;
              const color = getCategoryColor(cat.value);

              return (
                <li key={cat.value}>
                  <button
                    onClick={() => handleFilterClick('category', cat.value)}
                    className={clsx(
                      'w-full text-left flex items-center gap-2.5',
                      'px-2 py-1.5 rounded-sm text-sm',
                      'transition-all duration-fast',
                      isActive
                        ? 'bg-surface-2 text-primary'
                        : 'text-secondary hover:text-primary hover:bg-surface-2'
                    )}
                  >
                    {/* Color dot */}
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform"
                      style={{
                        backgroundColor: isActive ? color : 'var(--color-border-loud)',
                        transform: isActive ? 'scale(1.4)' : 'scale(1)',
                      }}
                    />
                    <span className="font-mono text-xs">{cat.label}</span>

                    {/* Active checkmark */}
                    {isActive && (
                      <span className="ml-auto text-[10px]" style={{ color }}>
                        ●
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Sentiment */}
        <section>
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
            Sentiment
          </p>
          <ul className="flex flex-col gap-0.5">
            {SENTIMENTS.map(s => {
              const isActive = sentiment === s.value;
              return (
                <li key={s.value}>
                  <button
                    onClick={() => handleFilterClick('sentiment', s.value as any)}
                    className={clsx(
                      'w-full text-left px-2 py-1.5 rounded-sm',
                      'font-mono text-xs transition-all duration-fast',
                      isActive
                        ? 'bg-surface-2'
                        : 'text-secondary hover:text-primary hover:bg-surface-2'
                    )}
                    style={{ color: isActive ? s.color : undefined }}
                  >
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Quick links */}
        <section>
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase mb-3">
            Quick Links
          </p>
          <nav className="flex flex-col gap-0.5">
            {[
              { to: '/bookmarks',  label: '🔖 Bookmarks'  },
              { to: '/admin',      label: '⚙️ Admin'       },
            ].map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleQuickLinkClick}
                className={({ isActive }) =>
                  clsx(
                    'px-2 py-1.5 rounded-sm font-mono text-xs',
                    'transition-all duration-fast',
                    isActive
                      ? 'text-purple-500 bg-purple-500/10'
                      : 'text-secondary hover:text-primary hover:bg-surface-2'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </section>

      </div>
    </aside>
  );
}



