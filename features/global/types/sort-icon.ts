/**
 * Props for SortIcon component
 *
 * @property direction - Current sort direction
 * @property className - Additional CSS classes
 */
export type SortIconProps = {
  direction: "asc" | "desc" | null;
  className?: string;
};