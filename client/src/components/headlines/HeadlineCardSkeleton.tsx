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

