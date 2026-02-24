/**
 * Mirrors the ApiResponse wrapper the backend sends for every endpoint.
 * Generic T means each API file gets full type safety on its data field.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Every paginated endpoint returns this shape inside data.
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Sort and filter types
 */
export type SortBy = 'recent' | 'trending' | 'relevant';
export type DateRange = 'today' | 'week' | 'month' | 'all';


/**
 * Reusable filter shape passed to headlines queries.
 */
export interface HeadlineFilters {
  page?: number;
  limit?: number;
  source?: string;
  category?: string;
  keyword?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  search?: string;
  sortBy?: SortBy;
  dateRange?: DateRange; 
  minViews?: number;  
  hasImage?: boolean; 
}