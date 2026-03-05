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

