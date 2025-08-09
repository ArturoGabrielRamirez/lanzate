"use client"

import {
    ColumnDef,
    flexRender,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    PaginationState,
    ColumnFiltersState,
    getFilteredRowModel,
    getSortedRowModel,
    RowModel
} from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronRight, Filter, Search } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterKey: string
    topActions?: React.ReactNode | ((table: RowModel<TData>) => React.ReactNode)
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    topActions
}: DataTableProps<TData, TValue>) {

    const [rowSelection, setRowSelection] = useState({})

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const [sorting, setSorting] = useState<SortingState>([])

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            pagination,
            columnFilters,
            sorting,
            columnVisibility,
            rowSelection,
        },
    })

    const handlePreviousPage = () => {
        table.previousPage()
    }

    const handleNextPage = () => {
        table.nextPage()
    }

    const handlePageSizeChange = (value: string) => {
        setPagination({
            ...pagination,
            pageSize: parseInt(value),
        })
    }

    return (
        <>
            <div className="flex items-center py-4 justify-between gap-2">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg">
                                <Filter />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) => column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                        placeholder="Filter..."
                        value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterKey)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm grow"
                        startContent={<Search />}
                    />
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <>
                            <div className={cn("text-muted-foreground flex-1 text-sm", table.getFilteredSelectedRowModel().rows.length === 0 && "text-muted-foreground/50")}>
                                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected.
                            </div>
                        </>
                    )}
                </div>
                {typeof topActions === "function" ? topActions(table.getFilteredSelectedRowModel()) : topActions}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center  justify-center gap-2 mt-auto">
                <Button variant="outline" onClick={handlePreviousPage} disabled={!table.getCanPreviousPage()}>
                    <ChevronLeft />
                </Button>
                <Select value={pagination.pageSize.toString()} onValueChange={handlePageSizeChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a page size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="40">40</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleNextPage} disabled={!table.getCanNextPage()}>
                    <ChevronRight />
                </Button>
            </div>
        </>
    )
}