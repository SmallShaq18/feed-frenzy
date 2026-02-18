import clsx from 'clsx';

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
}