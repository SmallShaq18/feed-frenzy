import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;   // Leading icon
  trailing?: React.ReactNode; // Trailing element (clear button, etc.)
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, trailing, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono text-xs text-secondary tracking-widest uppercase mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-muted pointer-events-none">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-surface border border-border rounded-sm',
              'text-sm text-primary placeholder:text-muted',
              'font-ui px-3 py-2',
              'transition-all duration-fast',
              'focus:outline-none focus:border-violet-600 focus:shadow-glow-violet',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              icon && 'pl-9',
              trailing && 'pr-9',
              error && 'border-coral focus:border-coral focus:shadow-none',
              className
            )}
            {...props}
          />

          {trailing && (
            <span className="absolute right-3 text-muted">{trailing}</span>
          )}
        </div>

        {error && (
          <p className="mt-1 font-mono text-[11px] text-coral">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;