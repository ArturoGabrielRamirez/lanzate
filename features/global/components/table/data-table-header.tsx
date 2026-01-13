"use client";

import { SortIcon } from "@/features/global/components/table/sort-icon";
import type { DataTableHeaderProps } from "@/features/global/types/data-table-header";
import { TableHead } from "@/features/shadcn/components/ui/table";
import { cn } from "@/features/shadcn/utils/cn";

export function DataTableHeader<T>({ 
  column, 
  onSort, 
  sortConfig 
}: DataTableHeaderProps<T>) {
  const isSortable = column.sortable;
  const isCurrentlySorted = sortConfig?.column === column.id;
  const sortDirection = sortConfig?.direction;

  if (!isSortable) {
    return (
      <TableHead 
        className={cn(column.className)}
        style={{ width: column.width }}
      >
        {column.header}
      </TableHead>
    );
  }

  const handleSort = () => {
    if (!onSort) return;

    let newDirection: "asc" | "desc" | null = "asc";
    
    if (isCurrentlySorted && sortDirection === "asc") {
      newDirection = "desc";
    } else if (isCurrentlySorted && sortDirection === "desc") {
      newDirection = null;
    }

    onSort({
      column: column.id,
      direction: newDirection
    });
  };

  return (
    <TableHead 
      className={cn(
        "cursor-pointer select-none hover:bg-muted/50 transition-colors",
        column.className
      )}
      style={{ width: column.width }}
      onClick={handleSort}
    >
      <div className="flex items-center gap-2">
        <span>{column.header}</span>
        <SortIcon direction={sortDirection ?? null} />
      </div>
    </TableHead>
  );
}