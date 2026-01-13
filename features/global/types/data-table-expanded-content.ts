/**
 * Props for DataTableExpandedContent component
 *
 * @template T - The type of row data
 * @property row - The expanded row data
 * @property columns - Array of column definitions
 * @property subRowsField - Field name containing subrows (default: 'subRows')
 * @property subRowsConfig - Configuration for how to render subrows
 */
export type DataTableExpandedContentProps<T> = {
  row: T;
  columns: import("./data-table").ColumnDef<T>[];
  subRowsField?: string;
  subRowsConfig?: import("./data-table").SubRowsConfig<T>;
};