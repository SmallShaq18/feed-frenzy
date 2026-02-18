import {  forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

/**
 * Base card container.
 * All feature cards (HeadlineCard, TrendCard, InsightCard) wrap this.
 * Keeps border/background/hover treatment consistent across the app.
 */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
  accent?: boolean;   // Yellow left border accent
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
            'hover:-translate-y-0.5 hover:shadow-card-hover',
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