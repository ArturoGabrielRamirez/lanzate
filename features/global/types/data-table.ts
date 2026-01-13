/**
 * Type definitions for the DataTable component
 *
 * These types define the generic, reusable interface for the DataTable component
 * which supports sortable columns, custom cell renderers, and loading/empty states.
 */

import { ReactNode } from "react";

/**
 * Configuration for a single column in the DataTable
 *
 * @template T - The type of the row data
 * @property id - Unique identifier for the column, used for sorting
 * @property header - Display text for the column header
 * @property accessor - Function to extract the cell value from a row
 * @property sortable - Whether the column can be sorted
 * @property cell - Optional custom renderer for the cell content
 */
export type ColumnDef<T> = {
  id: string;
  header: string;
  accessor: (row: T) => string | number | boolean | null | undefined;
  sortable: boolean;
  cell?: (
    value: ReturnType<ColumnDef<T>["accessor"]>,
    row: T
  ) => ReactNode;
};

/**
 * Configuration for the current sort state
 *
 * @property column - The id of the column being sorted, null if no sort active
 * @property direction - The sort direction, null if no sort active
 */
export type SortConfig = {
  column: string | null;
  direction: "asc" | "desc" | null;
};

/**
 * Props for the DataTable component
 *
 * @template T - The type of the row data
 * @property data - Array of row data to display
 * @property columns - Array of column definitions
 * @property onSort - Callback when a sortable column header is clicked
 * @property sortConfig - Current sort state
 * @property isLoading - Whether to show loading skeleton state
 * @property emptyMessage - Custom message to show when data is empty
 */
export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  onSort?: (sortConfig: SortConfig) => void;
  sortConfig?: SortConfig;
  isLoading?: boolean;
  emptyMessage?: string;
};
