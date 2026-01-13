/**
 * Hook for managing pagination state via nuqs
 * 
 * Provides page and pageSize state with URL synchronization
 * and calculated start/end item indices for display.
 * 
 * Features:
 * - Automatic URL parameter management
 * - Default values support
 * - Start/end item calculation
 * - Type-safe state management
 */

import { useQueryState, parseAsInteger } from 'nuqs';

import type { PaginationState } from '@/features/global/types/pagination';

export const usePaginationParams = (defaultPageSize = 10, totalItems = 0): PaginationState & {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  startItem: number;
  endItem: number;
  totalPages: number;
} => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(defaultPageSize));
  
  // Calculate page boundaries
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = Math.max(1, (page - 1) * pageSize + 1);
  const endItem = totalItems > 0 ? Math.min(page * pageSize, totalItems) : 0;
  
  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    startItem,
    endItem,
    totalPages,
  };
};