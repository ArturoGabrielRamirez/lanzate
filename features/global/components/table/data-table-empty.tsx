"use client";

// ** import core packages
import { FileX } from "lucide-react";

// ** import types
import type { DataTableEmptyProps } from "@/features/global/types/data-table-empty";
// ** import ui components
import { TableBody, TableRow, TableCell } from "@/features/shadcn/components/ui/table";
// ** import utils
import { cn } from "@/features/shadcn/utils/cn";

export function DataTableEmpty({
  message = "No results.",
  columns,
  showIcon = true,
  action
}: DataTableEmptyProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={columns}
          className={cn(
            "h-24 text-center",
            "text-muted-foreground"
          )}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            {showIcon && (
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50">
                <FileX className="h-6 w-6 text-muted-foreground/70" />
              </div>
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium">{message}</p>
              {action && (
                <div className="mt-2">
                  {action}
                </div>
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}