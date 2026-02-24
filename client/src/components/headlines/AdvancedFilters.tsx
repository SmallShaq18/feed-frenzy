import { SlidersHorizontal, X, Check } from 'lucide-react';
import { useState } from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import clsx from 'clsx';

export default function AdvancedFilters() {
  const [open, setOpen] = useState(false);
  const { sortBy, dateRange, minViews, hasImage, setFilter, clearFilters, hasActiveFilters } = useFilterStore();

  const isAdvancedActive = sortBy !== 'recent' || dateRange !== 'all' || minViews > 0 || hasImage;

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className={clsx('gap-2 border-dashed', isAdvancedActive && 'border-yellow text-yellow')}
      >
        <SlidersHorizontal size={14} />
        <span className="font-mono text-[10px] uppercase tracking-wider">Parameters</span>
        {isAdvancedActive && <span className="w-1.5 h-1.5 rounded-full bg-yellow" />}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="System Filters" size="md">
        <div className="space-y-8 py-4">
          <FilterSection label="Sort Logic">
            <div className="grid grid-cols-3 gap-2">
              {['recent', 'trending', 'relevant'].map((opt) => (
                <FilterBtn 
                  key={opt} 
                  active={sortBy === opt} 
                  onClick={() => setFilter('sortBy', opt as any)}
                  label={opt}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection label="Temporal Range">
            <div className="grid grid-cols-4 gap-2">
              {['today', 'week', 'month', 'all'].map((opt) => (
                <FilterBtn 
                  key={opt} 
                  active={dateRange === opt} 
                  onClick={() => setFilter('dateRange', opt as any)}
                  label={opt}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection label={`Engagement Floor: ${minViews}+`}>
            <input
              type="range"
              min="0" max="100" step="5"
              value={minViews}
              onChange={e => setFilter('minViews', parseInt(e.target.value))}
              className="w-full h-1 bg-border appearance-none cursor-pointer accent-primary"
            />
          </FilterSection>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={clsx(
              "w-4 h-4 border flex items-center justify-center transition-colors",
              hasImage ? "bg-primary border-primary" : "border-border group-hover:border-primary"
            )}>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={hasImage} 
                onChange={e => setFilter('hasImage', e.target.checked)} 
              />
              {hasImage && <Check size={10} className="text-bg" />}
            </div>
            <span className="font-mono text-[10px] uppercase text-secondary">Show Articles with Images Only</span>
          </label>

          <div className="flex gap-3 pt-6 border-t border-border">
            {hasActiveFilters() && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-coral">
                <X size={14} /> Reset
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={() => setOpen(false)} className="ml-auto">
              Apply Configuration
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

const FilterSection = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <label className="font-mono text-[9px] text-muted tracking-[0.2em] uppercase mb-3 block italic">{label}</label>
    {children}
  </div>
);

const FilterBtn = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={clsx(
      'px-2 py-2 font-mono text-[10px] uppercase border transition-all',
      active ? 'bg-primary text-bg border-primary' : 'border-border text-muted hover:border-primary/50 hover:text-primary'
    )}
  >
    {label}
  </button>
);



/*import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { useFilterStore } from '../../store/useFilterStore';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import clsx from 'clsx';

export default function AdvancedFilters() {
  const [open, setOpen] = useState(false);
  const {
    sortBy,
    dateRange,
    minViews,
    hasImage,
    setFilter,
    clearFilters,
    hasActiveFilters,
  } = useFilterStore();

  const advancedFiltersActive =
    sortBy !== 'recent' ||
    dateRange !== 'all' ||
    minViews > 0 ||
    hasImage;

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className={clsx(
          'gap-1.5',
          advancedFiltersActive && 'border-yellow text-yellow'
        )}
      >
        <SlidersHorizontal size={14} />
        Advanced
        {advancedFiltersActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
        )}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Advanced Filters"
        size="md"
      >
        <div className="flex flex-col gap-6">
          {/* Sort By *
          <div>
            <label className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2 block">
              Sort By
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['recent', 'trending', 'relevant'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => setFilter('sortBy', option)}
                  className={clsx(
                    'px-3 py-2 rounded-sm font-mono text-xs border transition-all duration-fast',
                    sortBy === option
                      ? 'border-yellow text-yellow bg-yellow/10'
                      : 'border-border text-secondary hover:border-border-loud hover:text-primary'
                  )}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range *
          <div>
            <label className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2 block">
              Date Range
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['today', 'week', 'month', 'all'] as const).map(option => (
                <button
                  key={option}
                  onClick={() => setFilter('dateRange', option)}
                  className={clsx(
                    'px-3 py-2 rounded-sm font-mono text-xs border transition-all duration-fast',
                    dateRange === option
                      ? 'border-yellow text-yellow bg-yellow/10'
                      : 'border-border text-secondary hover:border-border-loud hover:text-primary'
                  )}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Min Views *
          <div>
            <label className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2 block">
              Minimum Views: {minViews}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minViews}
              onChange={e => setFilter('minViews', parseInt(e.target.value))}
              className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-yellow"
            />
            <div className="flex justify-between font-mono text-[10px] text-muted mt-1">
              <span>0</span>
              <span>50</span>
              <span>100+</span>
            </div>
          </div>

          {/* Has Image *
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasImage}
                onChange={e => setFilter('hasImage', e.target.checked)}
                className="w-4 h-4 rounded border-border-loud bg-surface accent-yellow cursor-pointer"
              />
              <span className="font-mono text-xs text-secondary">
                Only show articles with images
              </span>
            </label>
          </div>

          {/* Actions *
          <div className="flex gap-2 pt-4 border-t border-border">
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearFilters();
                  setOpen(false);
                }}
                className="gap-1.5"
              >
                <X size={14} />
                Clear All
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setOpen(false)}
              className="ml-auto gap-1.5"
            >
              <Filter size={14} />
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}*/