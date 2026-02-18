import clsx from 'clsx';

interface EmptyStateProps {
  icon?: string;          // Emoji or icon element
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon = '🫙',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3',
        'py-16 px-6 text-center',
        className
      )}
    >
      <span className="text-4xl select-none">{icon}</span>
      <h3 className="font-display text-2xl text-primary tracking-wide">
        {title}
      </h3>
      {description && (
        <p className="font-mono text-xs text-muted max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}