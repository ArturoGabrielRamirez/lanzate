/**
 * Type definitions for the DataTable component
 *
 * These types define the generic, reusable interface for the DataTable component
 * which supports sortable columns, custom cell renderers, expandable rows,
 * filtering, and loading/empty states.
 */

import { Row } from "@tanstack/react-table";
import { ReactNode } from "react";

/**
 * Configuration for a single column in the DataTable
 *
 * @template T - The type of the row data
 * @property id - Unique identifier for the column, used for sorting
 * @property header - Display text for the column header
 * @property accessor - Function to extract the cell value from a row
 * @property sortable - Whether the column can be sorted
 * @property filterable - Whether the column can be filtered
 * @property cell - Optional custom renderer for the cell content
 * @property width - Optional width for the column
 * @property className - Optional CSS class for the column cells
 */
export type ColumnDef<T> = {
  id: string;
  header: string;
  accessor: (row: T) => string | number | boolean | null | undefined | ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  cell?: (
    value: ReturnType<ColumnDef<T>["accessor"]>,
    row: T
  ) => ReactNode;
  width?: string | number;
  className?: string;
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
 * Configuration for expandable rows
 *
 * @template T - The type of the row data
 * @property enabled - Whether row expansion is enabled
 * @property mode - How to render expanded subrows
 * @property subRowsField - Field name containing subrows (default: 'subRows')
 * @property subRowColumns - Custom columns for subrows (used in 'custom-columns' mode)
 * @property customComponent - Custom component for subrows (used in 'custom-component' mode)
 * @property indentSize - Indentation size for nested rows (default: 24)
 * @property autoExpandSingle - Whether to auto-expand rows with only one subrow
 * @property hideExpandIconWhenSingle - Hide expand icon when row has only one subrow
 */
export type SubRowsConfig<T> = {
  enabled: boolean;
  mode: 'same-columns' | 'custom-columns' | 'custom-component';
  subRowsField?: string;
  subRowColumns?: ColumnDef<T>[];
  customComponent?: React.ComponentType<{ row: Row<T>; data: T }>;
  indentSize?: number;
  autoExpandSingle?: boolean;
  hideExpandIconWhenSingle?: boolean;
};

/**
 * Table query parameters from URL (via nuqs)
 *
 * @property page - Current page number
 * @property pageSize - Number of items per page
 * @property sortBy - Field to sort by
 * @property sortOrder - Sort direction
 * @property filters - Filter values for different fields
 */
export type TableQueryParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean | string[] | undefined>;
};

/**
 * Props for the DataTable component
 *
 * @template T - The type of the row data
 * @property data - Array of row data to display
 * @property columns - Array of column definitions
 * @property totalItems - Total number of items (for pagination)
 * @property queryParams - Current query parameters from URL
 * @property subRowsConfig - Configuration for expandable rows
 * @property onSort - Callback when a sortable column header is clicked
 * @property sortConfig - Current sort state
 * @property onRowExpand - Callback when a row is expanded/collapsed
 * @property isLoading - Whether to show loading skeleton state
 * @property emptyMessage - Custom message to show when data is empty
 * @property className - Additional CSS classes for the table container
 */
export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  totalItems?: number;
  queryParams?: TableQueryParams;
  subRowsConfig?: SubRowsConfig<T>;
  onSort?: (sortConfig: SortConfig) => void;
  sortConfig?: SortConfig;
  onRowExpand?: (row: T, expanded: boolean) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
};
