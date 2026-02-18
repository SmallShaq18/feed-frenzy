import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

/**
 * "2 hours ago", "Yesterday", "Feb 16"
 * Used on article cards and timestamps throughout the app.
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  // Within the last 7 days
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 7) {
    return format(date, 'EEEE'); // "Monday"
  }

  return format(date, 'MMM d'); // "Feb 16"
}

/**
 * Full datetime for tooltips: "February 16, 2024 at 3:45 PM"
 */
export function formatFullDate(dateString: string): string {
  return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
}

/**
 * Compact for dense UI: "Feb 16, 3:45 PM"
 */
export function formatCompactDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, h:mm a');
}