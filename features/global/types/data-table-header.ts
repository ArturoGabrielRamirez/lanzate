/**
 * Props for DataTableHeader component
 *
 * @template T - The type of row data
 * @property column - Column definition
 * @property onSort - Callback when a sortable column header is clicked
 * @property sortConfig - Current sort state
 */
export type DataTableHeaderProps<T> = {
  column: import("./data-table").ColumnDef<T>;
  onSort?: (sortConfig: import("./data-table").SortConfig) => void;
  sortConfig?: import("./data-table").SortConfig;
};