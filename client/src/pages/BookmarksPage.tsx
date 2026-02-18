import { Trash2 } from 'lucide-react';
import { useBookmarkStore } from '../store/useBookmarkStore';
import HeadlineCard from '../components/headlines/HeadlineCard';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

export default function BookmarksPage() {
  const { bookmarks, clear } = useBookmarkStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <h1 className="font-display text-5xl tracking-widest text-primary leading-none">
            BOOKMARKS
          </h1>
          <p className="font-mono text-xs text-muted mt-1">
            {bookmarks.length} saved {bookmarks.length === 1 ? 'article' : 'articles'}
          </p>
        </div>

        {bookmarks.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="text-coral gap-1.5">
            <Trash2 size={13} />
            Clear all
          </Button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="Nothing saved yet"
          description="Bookmark articles from the feed by clicking the bookmark icon on any card."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {bookmarks.map((headline, i) => (
            <HeadlineCard key={headline._id} headline={headline} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}