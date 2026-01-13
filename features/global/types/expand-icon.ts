/**
 * Props for ExpandIcon component
 *
 * @template TData - The type of row data
 * @property row - TanStack Table row instance
 * @property className - Additional CSS classes
 * @property hideWhenSingle - Hide icon when row has only one subrow
 */
export type ExpandIconProps<TData> = {
  row: import("@tanstack/react-table").Row<TData>;
  className?: string;
  hideWhenSingle?: boolean;
};