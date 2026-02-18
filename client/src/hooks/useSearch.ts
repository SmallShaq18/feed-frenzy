import { useState, useEffect } from 'react';
import { useFilterStore } from '../store/useFilterStore';

/**
 * Debounced search hook.
 * Typing triggers local state immediately (so the input feels responsive).
 * After 400ms of inactivity, the global filter store is updated,
 * which triggers a new TanStack Query fetch.
 */
export function useSearch() {
  const { searchQuery, setFilter } = useFilterStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('searchQuery', localValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [localValue, setFilter]);

  // Sync if external clear happens (e.g. "Clear all filters" button)
  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  return {
    value: localValue,
    onChange: (val: string) => setLocalValue(val),
    clear: () => setLocalValue(''),
  };
}