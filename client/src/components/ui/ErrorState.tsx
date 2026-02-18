import clsx from 'clsx';
import Button from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = 'Something exploded 💥',
  description = 'The feed took an L. Try again in a sec.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3',
        'py-16 px-6 text-center',
        className
      )}
    >
      <span className="text-4xl select-none">💥</span>
      <h3 className="font-display text-2xl text-coral tracking-wide">
        {title}
      </h3>
      <p className="font-mono text-xs text-muted max-w-xs leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}