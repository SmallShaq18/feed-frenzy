/**
 * Loading skeleton that mirrors HeadlineCard's layout.
 * Shown while TanStack Query is fetching.
 */
export default function HeadlineCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-md p-4 animate-pulse">
      <div className="flex gap-4">
        {/* Fake image */}
        <div className="flex-shrink-0 w-20 h-20 rounded-sm bg-surface-2" />

        <div className="flex-1 flex flex-col gap-2.5">
          {/* Meta row */}
          <div className="flex gap-2">
            <div className="h-3 w-16 bg-surface-2 rounded-sm" />
            <div className="h-3 w-12 bg-surface-2 rounded-sm" />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <div className="h-3.5 w-full bg-surface-2 rounded-sm" />
            <div className="h-3.5 w-4/5 bg-surface-2 rounded-sm" />
          </div>

          {/* Summary */}
          <div className="space-y-1">
            <div className="h-2.5 w-full bg-surface-2 rounded-sm" />
            <div className="h-2.5 w-3/4 bg-surface-2 rounded-sm" />
          </div>

          {/* Bottom row */}
          <div className="flex gap-2 mt-1">
            <div className="h-2.5 w-12 bg-surface-2 rounded-sm" />
            <div className="h-2.5 w-10 bg-surface-2 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}