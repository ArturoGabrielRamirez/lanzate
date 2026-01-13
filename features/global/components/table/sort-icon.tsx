"use client";

// ** import core packages
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

// ** import types
import type { SortIconProps } from "@/features/global/types/sort-icon";
// ** import utils
import { cn } from "@/features/shadcn/utils/cn";

export function SortIcon({ direction, className }: SortIconProps) {
  if (!direction) {
    return <ArrowUpDown className={cn("h-4 w-4", className)} />;
  }

  if (direction === "asc") {
    return <ArrowUp className={cn("h-4 w-4", className)} />;
  }

  if (direction === "desc") {
    return <ArrowDown className={cn("h-4 w-4", className)} />;
  }

  return null;
}