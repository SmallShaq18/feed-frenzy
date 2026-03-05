import { Trash2 } from 'lucide-react';
import { useBookmarkStore } from '../store/useBookmarkStore';
import HeadlineCard from '../components/headlines/HeadlineCard';
//import EmptyState from '../components/ui/EmptyState';
//import Button from '../components/ui/Button';

export default function BookmarksPage() {
  const { bookmarks, clear } = useBookmarkStore();
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <header className="border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-6xl tracking-tighter uppercase italic leading-[0.8]">
            SAVED <span className="text-transparent border-v-stroke">VECTORS</span>
          </h1>
          <p className="font-mono text-[10px] text-muted-foreground mt-3 uppercase tracking-widest">
            {bookmarks.length} points of interest stored in local cache
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button onClick={clear} className="font-mono text-[10px] uppercase tracking-tighter text-red-500 hover:text-red-400 flex items-center gap-2 border border-red-500/20 px-3 py-1.5 hover:bg-red-500/5 transition-all">
            <Trash2 size={12} /> Purge All Data
          </button>
        )}
      </header>

      {bookmarks.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-border flex flex-col items-center gap-4 grayscale opacity-50">
          <span className="text-4xl">🔖</span>
          <p className="font-mono text-xs uppercase tracking-widest text-center">No Data Points Captured</p>
        </div>
      ) : (
        <div className="flex flex-col border-l border-border ml-2">
          {bookmarks.map((headline, i) => (
            <div key={headline._id} className="relative pl-8 pb-10 group">
              {/* Vertical timeline dot */}
              <div className="absolute left-[-5px] top-2 h-2 w-2 rounded-full bg-border group-hover:bg-violet-600 transition-colors" />
              <HeadlineCard headline={headline} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}