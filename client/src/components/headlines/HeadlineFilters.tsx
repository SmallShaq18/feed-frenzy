import clsx from 'clsx';
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
              'font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm border transition-all duration-fast',
              isActive
                ? 'border-current bg-current/10'
                : 'border-border text-muted hover:border-border-loud hover:text-secondary'
            )}
            style={
              isActive && color
                ? { borderColor: color, color, backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)` }
                : undefined
            }
          >
            {opt.label}
          </button>
        );
      })}

      {hasActiveFilters() && (
        <button
          onClick={clearFilters}
          className="font-mono text-[10px] text-coral hover:underline ml-1 tracking-wider"
        >
          Clear all
        </button>
      )}
    </div>
  );
}