/**
 * Types for FilterButtons component
 *
 * Defines props and types for the reusable filter buttons component
 * that integrates with nuqs for URL-based state management.
 *
 * Features supported:
 * - Single-select mode (radio-like behavior)
 * - Multi-select mode (checkbox-like behavior)
 * - URL state synchronization via nuqs
 * - Active state styling for selected options
 */

/**
 * Represents a single filter option
 */
export type FilterOption = {
  /** Display label for the option */
  label: string;
  /** Value to be stored in URL state (empty string for "All"/clear option) */
  value: string;
};

/**
 * Selection mode for the filter buttons
 * - single: Only one option can be selected at a time (radio-like)
 * - multi: Multiple options can be selected simultaneously (checkbox-like)
 */
export type FilterMode = "single" | "multi";

/**
 * Props for the FilterButtons component
 */
export type FilterButtonsProps = {
  /** Array of filter options to display */
  options: FilterOption[];
  /** URL parameter name for nuqs state management */
  paramName: string;
  /** Current selected value (single mode) or values (multi mode) */
  value: string | string[];
  /** Default value when no filter is applied */
  defaultValue?: string;
  /** Selection mode - single or multi select */
  mode?: FilterMode;
  /** Callback when filter value changes */
  onChange?: (value: string | string[]) => void;
  /** Additional CSS classes */
  className?: string;
};
