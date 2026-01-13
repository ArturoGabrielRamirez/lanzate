/**
 * Props for DataTableRow component
 *
 * @template T - The type of row data
 * @property row - TanStack Table row instance
 * @property columns - Array of column definitions
 * @property subRowsField - Field name containing subrows (default: 'subRows')
 * @property onRowExpand - Callback when a row is expanded/collapsed
 * @property subRowsConfig - Configuration for expandable rows
 */
export type DataTableRowProps<T> = {
  row: import("@tanstack/react-table").Row<T>;
  columns: import("./data-table").ColumnDef<T>[];
  subRowsField?: string;
  onRowExpand?: (row: T, expanded: boolean) => void;
  subRowsConfig?: import("./data-table").SubRowsConfig<T>;
};