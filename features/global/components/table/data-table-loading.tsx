"use client";

// ** import types
import type { DataTableLoadingProps } from "@/features/global/types/data-table-loading";
// ** import ui components
import { Skeleton } from "@/features/shadcn/components/ui/skeleton";
import { TableBody, TableRow, TableCell } from "@/features/shadcn/components/ui/table";

export function DataTableLoading({
  columns,
  rows = 5,
  showHeader = true
}: DataTableLoadingProps) {

  return (
    <TableBody>
      {/* Loading header skeleton */}
      {showHeader && (
        <TableRow>
          {Array.from({ length: columns }).map((_, index) => (
            <TableCell key={`header-${index}`} className="h-10">
              <Skeleton className="h-4 w-20" />
            </TableCell>
          ))}
        </TableRow>
      )}

      {/* Loading body skeleton rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, index) => (
            <TableCell key={`cell-${rowIndex}-${index}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}