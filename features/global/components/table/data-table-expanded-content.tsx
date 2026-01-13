"use client";

// ** import types
import type { ColumnDef } from "@/features/global/types/data-table";
import type { DataTableExpandedContentProps } from "@/features/global/types/data-table-expanded-content";
// ** import ui components
import { TableRow, TableCell } from "@/features/shadcn/components/ui/table";
// ** import utils
import { cn } from "@/features/shadcn/utils/cn";

export function DataTableExpandedContent<T>({
  row,
  columns,
  subRowsField = "subRows",
  subRowsConfig,
}: DataTableExpandedContentProps<T>) {
  const subRows = row[subRowsField as keyof T] as T[];

  if (!subRows || !Array.isArray(subRows) || subRows.length === 0) {
    return null;
  }

  // Different rendering modes based on subRowsConfig
  if (subRowsConfig?.mode === 'custom-component' && subRowsConfig.customComponent) {
    const CustomComponent = subRowsConfig.customComponent;
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="p-0">
          <div
            className={cn(
              "border-l-4 border-primary",
              subRowsConfig.indentSize && `pl-${subRowsConfig.indentSize}`
            )}
            style={{ paddingLeft: subRowsConfig.indentSize ? `${subRowsConfig.indentSize}px` : undefined }}
          >
            <CustomComponent row={row} data={row} />
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (subRowsConfig?.mode === 'custom-columns' && subRowsConfig.subRowColumns) {
    return (
      <>
        {subRows.map((subRow, index) => (
          <TableRow key={index} className="bg-muted/30">
            {subRowsConfig.subRowColumns?.map((column: ColumnDef<T>) => {
              const value = column.accessor(subRow);
              return (
                <TableCell
                  key={column.id}
                  className={cn(column.className)}
                  style={{
                    width: column.width,
                    paddingLeft: subRowsConfig.indentSize ? `${subRowsConfig.indentSize}px` : undefined
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.cell ? (
                      column.cell(value, subRow)
                    ) : (
                      <span>{value ?? ""}</span>
                    )}
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </>
    );
  }

  // Default mode: 'same-columns' or fallback
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="p-0">
        <div className="p-4 bg-muted/30 border-l-4 border-primary">
          <div className="text-sm font-medium mb-2">Expanded Content</div>
          <div className="text-xs text-muted-foreground">
            {JSON.stringify(subRows, null, 2)}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}