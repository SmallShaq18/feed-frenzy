export default function HeadlineCardSkeleton() {
  return (
    <div className="relative overflow-hidden bg-surface border-b border-border p-6">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumb Placeholder */}
        <div className="w-full md:w-32 h-32 md:h-24 bg-surface-2 border border-border/50 animate-pulse flex-shrink-0" />

        <div className="flex-1 space-y-4">
          {/* Meta Line */}
          <div className="flex items-center gap-3">
            <div className="h-2 w-20 bg-surface-2 animate-pulse" />
            <div className="h-2 w-16 bg-surface-2 animate-pulse" />
          </div>

          {/* Title Lines */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-surface-2 animate-pulse" />
            <div className="h-5 w-2/3 bg-surface-2 animate-pulse" />
          </div>

          {/* Tags */}
          <div className="flex gap-2 pt-2">
            <div className="h-3 w-12 bg-surface-2 animate-pulse" />
            <div className="h-3 w-12 bg-surface-2 animate-pulse" />
            <div className="h-3 w-12 bg-surface-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Shimmer loading skeleton for headline cards
 */
/*export default function HeadlineCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-md p-4 overflow-hidden relative">
      {/* Shimmer overlay *
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="flex gap-4">
        {/* Fake image *
        <div className="flex-shrink-0 w-24 h-24 rounded-sm bg-surface-2 animate-pulse" />

        <div className="flex-1 flex flex-col gap-2.5">
          {/* Meta row *
          <div className="flex gap-2">
            <div className="h-3 w-20 bg-surface-2 rounded-sm animate-pulse" />
            <div className="h-3 w-14 bg-surface-2 rounded-sm animate-pulse" />
          </div>

          {/* Title *
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-surface-2 rounded-sm animate-pulse" />
            <div className="h-4 w-4/5 bg-surface-2 rounded-sm animate-pulse" />
          </div>

          {/* Summary *
          <div className="space-y-1">
            <div className="h-2.5 w-full bg-surface-2 rounded-sm animate-pulse" />
            <div className="h-2.5 w-3/4 bg-surface-2 rounded-sm animate-pulse" />
          </div>

          {/* Bottom row *
          <div className="flex gap-2 mt-auto">
            <div className="h-2.5 w-16 bg-surface-2 rounded-sm animate-pulse" />
            <div className="h-2.5 w-12 bg-surface-2 rounded-sm animate-pulse" />
            <div className="h-2.5 w-14 bg-surface-2 rounded-sm animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}*/

/**
 * Loading skeleton that mirrors HeadlineCard's layout.
 * Shown while TanStack Query is fetching.
 */
/*export default function HeadlineCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-md p-4 animate-pulse">
      <div className="flex gap-4">
        {/* Fake image *
        <div className="flex-shrink-0 w-20 h-20 rounded-sm bg-surface-2" />

        <div className="flex-1 flex flex-col gap-2.5">
          {/* Meta row *
          <div className="flex gap-2">
            <div className="h-3 w-16 bg-surface-2 rounded-sm" />
            <div className="h-3 w-12 bg-surface-2 rounded-sm" />
          </div>

          {/* Title *
          <div className="space-y-1.5">
            <div className="h-3.5 w-full bg-surface-2 rounded-sm" />
            <div className="h-3.5 w-4/5 bg-surface-2 rounded-sm" />
          </div>

          {/* Summary *
          <div className="space-y-1">
            <div className="h-2.5 w-full bg-surface-2 rounded-sm" />
            <div className="h-2.5 w-3/4 bg-surface-2 rounded-sm" />
          </div>

          {/* Bottom row *
          <div className="flex gap-2 mt-1">
            <div className="h-2.5 w-12 bg-surface-2 rounded-sm" />
            <div className="h-2.5 w-10 bg-surface-2 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}*/