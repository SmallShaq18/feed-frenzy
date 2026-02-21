import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { useFilterStore } from '../../store/useFilterStore';
import { getCategoryColor } from '../../utils/categoryColors';
import clsx from 'clsx';

const CATEGORIES = [
  { value: 'tech',     label: 'Technology' },
  { value: 'ai',       label: 'Artificial Intelligence' },
  { value: 'crypto',   label: 'Crypto & Web3' },
  { value: 'startups', label: 'Startups' },
  { value: 'movies',   label: 'Movies' },
  { value: 'anime',    label: 'Anime' },
];

const SENTIMENTS = [
  { value: 'positive', label: '↑ Positive', color: 'var(--color-sentiment-positive)' },
  { value: 'neutral',  label: '→ Neutral',  color: 'var(--color-sentiment-neutral)'  },
  { value: 'negative', label: '↓ Negative', color: 'var(--color-sentiment-negative)' },
];

export default function Sidebar() {
  const sidebarOpen = useUIStore(s => s.sidebarOpen);
  const { category, sentiment, setFilter, clearFilters, hasActiveFilters } =
    useFilterStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed top-14 left-0 bottom-0 w-60 z-30 bg-bg border-r border-border overflow-y-auto scroll-hidden">
      <div className="p-4 flex flex-col gap-6">

        {/* Active filter clear */}
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
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
                    onClick={() =>
                      setFilter('category', isActive ? '' : cat.value)
                    }
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
                    onClick={() =>
                      setFilter('sentiment', isActive ? '' : (s.value as any))
                    }
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
                className={({ isActive }) =>
                  clsx(
                    'px-2 py-1.5 rounded-sm font-mono text-xs',
                    'transition-all duration-fast',
                    isActive
                      ? 'text-yellow bg-yellow/10'
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