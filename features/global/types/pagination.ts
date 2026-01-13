/**
 * Types for Pagination component
 * 
 * Defines props and state types for the reusable pagination component
 * that integrates with nuqs for URL-based state management.
 * 
 * Features supported:
 * - Advanced page navigation with ellipsis
 * - Page size selector with configurable options
 * - Optional range display ("Showing X-Y of Z")
 * - URL state synchronization
 */

export type PaginationProps = {
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Available page size options for the selector */
  pageSizeOptions?: number[];
  /** Whether to show the item range display */
  showRange?: boolean;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when page size changes */
  onPageSizeChange?: (pageSize: number) => void;
  /** Additional CSS classes */
  className?: string;
};

export type PaginationState = {
  /** Current page number */
  page: number;
  /** Number of items per page */
  pageSize: number;
};