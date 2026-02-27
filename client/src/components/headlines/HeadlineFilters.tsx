import clsx from 'clsx';
import { useFilterStore } from '../../store/useFilterStore';
import { getSentimentColor } from '../../utils/categoryColors';

const OPTIONS = [
  { value: '', label: 'All' },
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'negative', label: 'Negative' },
] as const;

export default function HeadlineFilters() {
  const { sentiment, setFilter, hasActiveFilters, clearFilters } = useFilterStore();

  return (
    <div className="flex items-center gap-1 bg-surface-2 p-1 border border-border rounded-sm">
      {OPTIONS.map(opt => {
        const active = sentiment === opt.value;
        const color = opt.value ? getSentimentColor(opt.value) : 'var(--color-primary)';

        return (
          <button
            key={opt.value}
            onClick={() => setFilter('sentiment', opt.value)}
            className={clsx(
              "px-3 py-1 font-mono text-[9px] uppercase tracking-tighter transition-all",
              active ? "bg-surface text-primary shadow-sm" : " hover:text-secondary"
            )}
            style={active ? { borderLeft: `2px solid ${color}` } : {}}
          >
            {opt.label}
          </button>
        );
      })}
      
      {hasActiveFilters() && (
        <button 
          onClick={clearFilters}
          className="px-2 text-coral hover:text-coral/80 transition-colors"
          title="Reset All"
        >
          <span className="font-mono text-[9px] uppercase">× Reset</span>
        </button>
      )}
    </div>
  );
}

/*import clsx from 'clsx';
import { useFilterStore } from '../../store/useFilterStore';
import { getSentimentColor } from '../../utils/categoryColors';

const SENTIMENT_OPTIONS = [
  { value: '',         label: 'All'      },
  { value: 'positive', label: '↑ Pos'   },
  { value: 'neutral',  label: '→ Neutral'},
  { value: 'negative', label: '↓ Neg'   },
] as const;

export default function HeadlineFilters() {
  const { sentiment, setFilter, hasActiveFilters, clearFilters } = useFilterStore();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-mono text-[10px] text-muted tracking-widest uppercase">
        Vibe:
      </span>

      {SENTIMENT_OPTIONS.map(opt => {
        const isActive = sentiment === opt.value;
        const color = opt.value ? getSentimentColor(opt.value) : undefined;

        return (
          <button
            key={opt.value}
            onClick={() => setFilter('sentiment', opt.value)}
            className={clsx(
              'font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm border',
              'transition-all duration-fast',
              'hover:scale-105 active:scale-95',
              isActive
                ? 'shadow-glow-yellow'
                : 'hover:border-border-loud hover:shadow-card'
            )}
            style={
              isActive && color
                ? {
                    borderColor: color,
                    color,
                    backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
                  }
                : {
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }
            }
          >
            {opt.label}
          </button>
        );
      })}

      {hasActiveFilters() && (
        <button
          onClick={clearFilters}
          className="font-mono text-[10px] text-coral hover:underline hover:text-coral/80 ml-1 tracking-wider transition-all duration-fast"
        >
          Clear all
        </button>
      )}
    </div>
  );
}*/