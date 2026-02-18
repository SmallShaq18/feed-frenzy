import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import Input from '../ui/Input';

export default function HeadlineSearch() {
  const { value, onChange, clear } = useSearch();

  return (
    <div className="w-full max-w-md">
      <Input
        placeholder="Search headlines, keywords, sources…"
        value={value}
        onChange={e => onChange(e.target.value)}
        icon={<Search size={14} />}
        trailing={
          value ? (
            <button
              onClick={clear}
              aria-label="Clear search"
              className="text-muted hover:text-primary transition-colors"
            >
              <X size={14} />
            </button>
          ) : null
        }
      />
    </div>
  );
}