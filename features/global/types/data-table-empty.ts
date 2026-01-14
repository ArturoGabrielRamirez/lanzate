import type { ReactNode } from "react";

/**
 * Props for DataTableEmpty component
 *
 * @property message - Custom message to display when no data (default: "No results.")
 * @property columns - Number of columns in the table
 * @property showIcon - Whether to show the empty state icon (default: true)
 * @property action - Optional action component to display
 */
export type DataTableEmptyProps = {
  message?: string;
  columns: number;
  showIcon?: boolean;
  action?: ReactNode;
};
