"use client";

// ** import components
import { DataTableExpandedContent } from "@/features/global/components/table/data-table-expanded-content";
import { ExpandIcon } from "@/features/global/components/table/expand-icon";
// ** import types
import type { DataTableRowProps } from "@/features/global/types/data-table-row";
// ** import ui components
import { TableRow, TableCell } from "@/features/shadcn/components/ui/table";
// ** import utils
import { cn } from "@/features/shadcn/utils/cn";

export function DataTableRow<T>({ 
  row, 
  columns, 
  subRowsField = "subRows",
  /* onRowExpand, */
  subRowsConfig
}: DataTableRowProps<T>) {
  
  /* const handleRowExpand = (expanded: boolean) => {
    if (onRowExpand) {
      onRowExpand(row.original, expanded);
    }
  }; */

  return (
    <>
      <TableRow>
        {columns.map((column) => {
          const value = column.accessor(row.original);
          
          // Check if this is the first column and row can be expanded
          const isFirstColumn = columns[0].id === column.id;
          const canExpand = row.getCanExpand();
          
          return (
            <TableCell 
              key={column.id}
              className={cn(column.className)}
              style={{ width: column.width }}
            >
              <div className="flex items-center gap-2">
                {/* Expand icon for first column if row can be expanded */}
                {isFirstColumn && canExpand && (
                  <ExpandIcon 
                    row={row} 
                  />
                )}
                
                {/* Cell content */}
                {column.cell ? (
                  column.cell(value, row.original)
                ) : (
                  <span>{value ?? ""}</span>
                )}
              </div>
            </TableCell>
          );
        })}
      </TableRow>
      
      {/* Expanded content */}
      {row.getIsExpanded() && (
        <DataTableExpandedContent
          row={row.original}
          columns={columns}
          subRowsField={subRowsField}
          subRowsConfig={subRowsConfig}
        />
      )}
    </>
  );
}