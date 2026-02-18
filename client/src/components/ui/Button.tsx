import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

/**
 * Button variants:
 * - primary: yellow fill, black text — main CTAs
 * - secondary: transparent with border — secondary actions
 * - ghost: no border, subtle hover — tertiary / icon buttons
 * - danger: coral fill — destructive actions
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-yellow text-bg font-bold hover:bg-yellow/90 active:scale-[0.97] shadow-glow-yellow',
  secondary:
    'bg-transparent text-primary border border-border-loud hover:border-yellow hover:text-yellow',
  ghost:
    'bg-transparent text-secondary hover:text-primary hover:bg-surface-2',
  danger:
    'bg-coral text-white font-bold hover:bg-coral/90 active:scale-[0.97]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          // Base styles shared by all variants
          'inline-flex items-center justify-center gap-2',
          'rounded-sm font-ui font-semibold tracking-wide',
          'transition-all duration-fast',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            {/* Inline spinner — no extra import needed */}
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;