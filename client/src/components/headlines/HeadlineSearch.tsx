import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import Input from '../ui/Input';

export default function HeadlineSearch() {
  const { value, onChange, clear } = useSearch();

  return (
    <div className="w-full max-w-md">
      <div className="relative group">
        <Input
          placeholder="Search headlines, keywords, sources…"
          value={value}
          onChange={e => onChange(e.target.value)}
          icon={<Search size={14} className="transition-colors duration-fast group-focus-within:text-purple-500" />}
          trailing={
            value ? (
              <button
                onClick={clear}
                aria-label="Clear search"
                className="text-muted hover:text-primary transition-all duration-fast hover:rotate-90"
              >
                <X size={14} />
              </button>
            ) : null
          }
          className="transition-all duration-fast"
        />
        {/* Search icon pulse when typing */}
        {value && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-purple-500/20 rounded-full animate-ping pointer-events-none" />
        )}
      </div>
    </div>
  );
}
