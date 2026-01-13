"use client";

// ** import core packages
import { ChevronRight } from "lucide-react";

// ** import types
import type { ExpandIconProps } from "@/features/global/types/expand-icon";
// ** import ui components
import { Button } from "@/features/shadcn/components/ui/button";
import { cn } from "@/features/shadcn/utils/cn";

export function ExpandIcon<TData>({
  row,
  className,
  hideWhenSingle = false
}: ExpandIconProps<TData>) {
  // Check if row can be expanded
  if (!row.getCanExpand()) {
    return <div className="w-4" />; // Spacer for alignment
  }

  // Hide icon if only 1 subrow and hideWhenSingle is true
  if (hideWhenSingle && row.subRows && row.subRows.length === 1) {
    return <div className="w-4" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={row.getToggleExpandedHandler()}
      className={cn("h-6 w-6", className)}
      aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
      aria-expanded={row.getIsExpanded()}
    >
      <ChevronRight
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          row.getIsExpanded() && "rotate-90"
        )}
      />
    </Button>
  );
}