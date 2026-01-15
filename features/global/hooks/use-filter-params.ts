/**
 * Hook for managing filter state via nuqs
 *
 * Provides URL-synchronized filter state management for FilterButtons
 * and other filter-based components.
 *
 * Features:
 * - Automatic URL parameter management
 * - Default value support
 * - Type-safe filter values
 * - Single and multi-select mode support
 */

import { useQueryState, parseAsString, parseAsArrayOf } from "nuqs";

import { MultiFilterState, SingleFilterState } from "@/features/global/types/filter-buttons";

/**
 * Hook for single-select filter state via URL
 *
 * @param paramName - URL parameter name for the filter
 * @param defaultValue - Default value when parameter is not present (defaults to empty string)
 * @returns Object containing current value and setter function
 *
 * @example
 * ```tsx
 * const { value, setValue } = useFilterParams("status", "all");
 *
 * <FilterButtons
 *   paramName="status"
 *   value={value}
 *   onChange={(newValue) => setValue(newValue as string)}
 *   options={[
 *     { label: "All", value: "" },
 *     { label: "Active", value: "active" },
 *   ]}
 * />
 * ```
 */
export function useFilterParams(
  paramName: string,
  defaultValue = ""
): SingleFilterState {
  const [value, setValueInternal] = useQueryState(
    paramName,
    parseAsString.withDefault(defaultValue)
  );

  const setValue = (newValue: string | null) => {
    // Clear the parameter if value is null or empty string (to use default)
    if (newValue === null || newValue === "") {
      setValueInternal(null);
    } else {
      setValueInternal(newValue);
    }
  };

  return {
    value,
    setValue,
  };
}

/**
 * Hook for multi-select filter state via URL
 *
 * Stores multiple selected values as a comma-separated list in the URL.
 *
 * @param paramName - URL parameter name for the filter
 * @param defaultValue - Default values when parameter is not present (defaults to empty array)
 * @returns Object containing current values array and setter function
 *
 * @example
 * ```tsx
 * const { value, setValue } = useMultiFilterParams("status", []);
 *
 * <FilterButtons
 *   paramName="status"
 *   value={value}
 *   mode="multi"
 *   onChange={(newValue) => setValue(newValue as string[])}
 *   options={[
 *     { label: "All", value: "" },
 *     { label: "Active", value: "active" },
 *     { label: "Pending", value: "pending" },
 *   ]}
 * />
 * ```
 */
export function useMultiFilterParams(
  paramName: string,
  defaultValue: string[] = []
): MultiFilterState {
  const [value, setValueInternal] = useQueryState(
    paramName,
    parseAsArrayOf(parseAsString).withDefault(defaultValue)
  );

  const setValue = (newValue: string[] | null) => {
    // Clear the parameter if value is null or empty array
    if (newValue === null || newValue.length === 0) {
      setValueInternal(null);
    } else {
      setValueInternal(newValue);
    }
  };

  return {
    value,
    setValue,
  };
}
