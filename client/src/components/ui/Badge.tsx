import clsx from 'clsx';

/**
 * Small label badges for categories, sentiments, trend status etc.
 * color prop accepts any CSS color value or a CSS variable string.
 */

type BadgeVariant = 'solid' | 'outline' | 'subtle';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: string;       // e.g. 'var(--color-cyan)' or '#FF4D4D'
  className?: string;
  dot?: boolean;        // Show a pulsing dot (for "rising" trends)
}

export default function Badge({
  label,
  variant = 'subtle',
  color,
  className,
  dot = false,
}: BadgeProps) {
  const style = color
    ? ({
        '--badge-color': color,
      } as React.CSSProperties)
    : undefined;

  return (
    <span
      style={style}
      className={clsx(
        'inline-flex items-center gap-1.5',
        'font-mono text-[10px] font-semibold tracking-widest uppercase',
        'rounded-sm px-2 py-0.5 leading-none',
        // Use CSS variable for color if provided, otherwise default
        color && variant === 'subtle' &&
          'bg-[color-mix(in_srgb,var(--badge-color)_12%,transparent)] text-[var(--badge-color)]',
        color && variant === 'outline' &&
          'border border-[var(--badge-color)] text-[var(--badge-color)]',
        color && variant === 'solid' &&
          'bg-[var(--badge-color)] text-bg',
        // Fallbacks when no color provided
        !color && variant === 'subtle' && 'bg-surface-2 text-secondary',
        !color && variant === 'outline' && 'border border-border-loud text-secondary',
        !color && variant === 'solid' && 'bg-surface-2 text-primary',
        className
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ backgroundColor: color ?? 'currentColor' }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: color ?? 'currentColor' }}
          />
        </span>
      )}
      {label}
    </span>
  );
}