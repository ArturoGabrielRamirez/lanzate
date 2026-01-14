"use client";

/**
 * Reusable Pagination component with advanced features
 *
 * Features Previous/Next buttons, page numbers with ellipsis,
 * page size selector, and optional range display.
 *
 * Features:
 * - Advanced page number display with ellipsis
 * - Page size selector [5, 10, 25, 50, 100]
 * - Previous/Next navigation buttons
 * - Optional item range display
 * - URL state integration via props
 * - Disabled states at boundaries
 * - shadcn/ui components
 */

import { ChevronLeft, ChevronRight } from "lucide-react";

// ** import components
import { Button } from "@/features/shadcn/components/ui/button";
// ** import types
import type { PaginationProps } from "@/features/global/types/pagination";
// ** import utils
import { cn } from "@/features/shadcn/utils/cn";

/**
 * Simple native select wrapper styled to match shadcn/ui
 * TODO: Replace with shadcn/ui Select when available
 */
function NativeSelect({
  value,
  onValueChange,
  options,
  className
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "border border-input bg-background text-foreground px-3 py-2 text-sm rounded-md",
        className
      )}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function Pagination({
  currentPage,
  pageSize,
  totalItems,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showRange = false,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Calculate page numbers to display with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [];

    // Always show first page
    pages.push(1);

    // Calculate middle pages
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      // Near beginning: 1 2 3 ... last
      const end = Math.min(3, totalPages - 1);
      for (let i = 2; i <= end; i++) {
        pages.push(i);
      }
      if (totalPages > 3) pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near end: 1 ... last-2 last-1 last
      const start = Math.max(2, totalPages - 2);
      if (totalPages > 3) pages.push('...');
      for (let i = start; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Middle: 1 ... cur-1 cur cur+1 ... last
      pages.push('...');
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSelect = (page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize, 10);
    if (!isNaN(size) && onPageSizeChange) {
      onPageSizeChange(size);
    }
  };

  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Optional range display */}
      {showRange && totalItems > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalItems}
        </div>
      )}

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Items per page:</span>
        <NativeSelect
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
          options={pageSizeOptions.map(String)}
        />
      </div>

      {/* Navigation controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageSelect(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            )
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
