"use client";

/**
 * Reusable FilterButtons component
 *
 * Renders a group of filter buttons for selecting filter options.
 * Integrates with nuqs for URL-based filter state management.
 *
 * Features:
 * - Single-select mode (radio-like behavior)
 * - Multi-select mode (checkbox-like behavior)
 * - "All" option to clear filter (value = "")
 * - Active state styling for selected options
 * - URL state synchronization via props
 * - shadcn/ui Button components
 */

// ** import types
import type { FilterButtonsProps } from "@/features/global/types/filter-buttons";
// ** import components
import { Button } from "@/features/shadcn/components/ui/button";
// ** import utils
import { cn } from "@/features/shadcn/utils/cn";

export function FilterButtons({
  options,
  paramName,
  value,
  mode = "single",
  onChange,
  className,
}: FilterButtonsProps) {
  /**
   * Check if an option is currently active
   * For single mode: compare string values
   * For multi mode: check if value exists in array
   */
  const isActive = (optionValue: string): boolean => {
    if (mode === "multi" && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  /**
   * Handle button click
   * Single mode: set value directly
   * Multi mode: toggle value in array
   */
  const handleClick = (optionValue: string) => {
    if (!onChange) return;

    if (mode === "single") {
      onChange(optionValue);
    } else {
      // Multi-select mode
      const currentValues = Array.isArray(value) ? value : [];

      if (optionValue === "") {
        // "All" option clears the filter
        onChange([]);
      } else if (currentValues.includes(optionValue)) {
        // Remove value if already selected
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        // Add value if not selected
        onChange([...currentValues, optionValue]);
      }
    }
  };

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="group"
      aria-label={`Filter by ${paramName}`}
    >
      {options.map((option) => {
        const active = isActive(option.value);

        return (
          <Button
            key={option.value || "all"}
            type="button"
            variant={active ? "default" : "outline"}
            size="sm"
            onClick={() => handleClick(option.value)}
            aria-pressed={active}
            data-state={active ? "active" : "inactive"}
            className={cn(
              "transition-colors",
              active && "bg-primary text-primary-foreground"
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
