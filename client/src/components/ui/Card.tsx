import { type HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
  accent?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, padded = true, accent = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-surface rounded-md border border-border',
          'transition-all duration-normal',
          padded && 'p-4',
          accent && 'border-l-2 border-l-yellow',
          hoverable && [
            'cursor-pointer',
            'hover:border-border-loud hover:bg-surface-2',
            // Subtle elevation with smooth shadow transition
            'shadow-[0_0_0_1px_var(--color-border)]',
            'hover:shadow-[0_0_0_1px_var(--color-border-loud),0_8px_32px_rgba(0,0,0,0.4)]',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
