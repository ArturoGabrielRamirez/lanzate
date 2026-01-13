/**
 * Props for DataTableLoading component
 *
 * @property columns - Number of columns in the table
 * @property rows - Number of loading skeleton rows to show (default: 5)
 * @property showHeader - Whether to show header skeleton (default: true)
 */
export type DataTableLoadingProps = {
  columns: number;
  rows?: number;
  showHeader?: boolean;
};