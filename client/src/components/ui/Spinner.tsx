import clsx from 'clsx';

type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'w-3 h-3 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-8 h-8 border-[2px]',
};

export default function Spinner({ size = 'md', className }: { size?: SpinnerSize; className?: string }) {
  return (
    <div className={clsx("relative flex items-center justify-center", sizeMap[size], className)}>
      <span
        role="status"
        aria-label="Processing"
        className={clsx(
          'absolute inset-0 rounded-full border-muted/20 border-t-yellow animate-spin',
          sizeMap[size]
        )}
      />
      {/* Central blinking dot for the LG size to look like a scanner */}
      {size === 'lg' && (
        <span className="w-1 h-1 bg-yellow rounded-full animate-pulse" />
      )}
    </div>
  );
}

/*import clsx from 'clsx';

type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={clsx(
        'inline-block rounded-full border-border-loud border-t-yellow animate-spin',
        sizeMap[size],
        className
      )}
    />
  );
}*/