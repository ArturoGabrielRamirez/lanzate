"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  type ColumnDef as TanStackColumnDef,
} from "@tanstack/react-table";

// ** import components
import { DataTableEmpty } from "@/features/global/components/table/data-table-empty";
import { DataTableHeader } from "@/features/global/components/table/data-table-header";
import { DataTableLoading } from "@/features/global/components/table/data-table-loading";
import { DataTableRow } from "@/features/global/components/table/data-table-row";
// ** import types
import type { DataTableProps } from "@/features/global/types/data-table";
// ** import ui components
import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
} from "@/features/shadcn/components/ui/table";

export function DataTable<T>({
  data,
  columns,
  /* totalItems,
  queryParams, */
  subRowsConfig,
  onSort,
  sortConfig,
  onRowExpand,
  isLoading = false,
  emptyMessage = "No results.",
  className,
}: DataTableProps<T>) {
  // Transform our ColumnDef to TanStack ColumnDef
  const tanstackColumns: TanStackColumnDef<T>[] = columns.map(
    (col): TanStackColumnDef<T> => ({
      id: col.id,
      header: col.header,
      accessorFn: col.accessor,
      cell: col.cell
        ? ({ getValue, row }) => {
            const value = getValue() as ReturnType<typeof col.accessor>;
            return col.cell!(value, row.original);
          }
        : ({ getValue }) => getValue(),
      sortingFn: "alphanumeric",
      enableSorting: col.sortable ?? false,
    })
  );

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualSorting: true,
    manualExpanding: true,
    state: {
      sorting: sortConfig?.column && sortConfig?.direction
        ? [{ id: sortConfig.column, desc: sortConfig.direction === 'desc' }]
        : [],
    },
    getRowCanExpand: subRowsConfig?.enabled
      ? (row) => {
          const subRows = row.original[
            (subRowsConfig?.subRowsField ?? "subRows") as keyof T
          ] as T[];
          return subRows && Array.isArray(subRows) && subRows.length > 0;
        }
      : () => false,
  });

  // Show loading state
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnDef = columns.find((col) => col.id === header.id);
                return (
                  <DataTableHeader
                    key={header.id}
                    column={columnDef!}
                    onSort={onSort}
                    sortConfig={sortConfig}
                  />
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <DataTableLoading columns={columns.length} />
      </Table>
    );
  }

  // Show empty state
  if (data.length === 0) {
    return (
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnDef = columns.find((col) => col.id === header.id);
                return (
                  <DataTableHeader
                    key={header.id}
                    column={columnDef!}
                    onSort={onSort}
                    sortConfig={sortConfig}
                  />
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <DataTableEmpty
          message={emptyMessage}
          columns={columns.length}
        />
      </Table>
    );
  }

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnDef = columns.find((col) => col.id === header.id);
                return (
                  <DataTableHeader
                    key={header.id}
                    column={columnDef!}
                    onSort={onSort}
                    sortConfig={sortConfig}
                  />
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <DataTableRow<T>
              key={row.id}
              row={row}
              columns={columns}
              subRowsField={subRowsConfig?.subRowsField}
              onRowExpand={onRowExpand}
              subRowsConfig={subRowsConfig}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}