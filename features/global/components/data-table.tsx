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
    RowModel,
    Row
} from "@tanstack/react-table"
import { ChevronDown, ChevronLeft } from "lucide-react"
import { ChevronRight, Filter, Search } from "lucide-react"
import { useState, useCallback, Fragment } from "react"

import { InputField } from "@/features/global/components/form/input-field"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Button } from "@/features/shadcn/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/features/shadcn/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/features/shadcn/components/ui/table"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterKey: string
    topActions?: React.ReactNode | ((table: RowModel<TData>) => React.ReactNode)
    headerActions?: React.ReactNode
    /** Render function for expandable row content. If provided, rows become expandable. */
    renderExpandedRow?: (row: Row<TData>) => React.ReactNode
    /** Function to get a unique ID from each row for expansion tracking */
    getRowId?: (row: TData) => string
    /** Initially expanded row IDs */
    defaultExpandedIds?: string[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterKey,
    topActions,
    headerActions,
    renderExpandedRow,
    getRowId,
    defaultExpandedIds = []
}: DataTableProps<TData, TValue>) {

    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds))

    const toggleRowExpanded = useCallback((id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }, [])

    const isRowExpanded = useCallback((id: string) => expandedIds.has(id), [expandedIds])

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
        <div className="flex flex-col grow gap-4">
            {/* ✅ Header con filtro y acciones */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">

                    <InputField
                        label="Filter"
                        type="search"
                        inputMode="search"
                        tooltip="Filter the table by the column name"
                        hideLabel
                        placeholder="Filter..."
                        name={filterKey}
                        onChange={(event) =>
                            table.getColumn(filterKey)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                        startIcon={<Search />}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <IconButton
                                icon={Filter}
                                size="md"
                            />
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
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <div className={cn("text-muted-foreground flex-1 text-sm", table.getFilteredSelectedRowModel().rows.length === 0 && "text-muted-foreground/50")}>
                            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected.
                        </div>
                    )}
                </div>

                {/* ✅ Acciones del header (botón crear + topActions) */}
                <div className="flex items-center gap-2">
                    {headerActions}
                    {typeof topActions === "function" ? topActions(table.getFilteredSelectedRowModel()) : topActions}
                </div>
            </div>

            {/* Tabla */}
            <div className="rounded-md border bg-card grow">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {/* Expand column header (only if expandable) */}
                                {renderExpandedRow && <TableHead className="w-10" />}
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
                            table.getRowModel().rows.map((row) => {
                                const rowId = getRowId ? getRowId(row.original) : row.id
                                const isExpanded = isRowExpanded(rowId)
                                const hasExpandableContent = !!renderExpandedRow

                                return (
                                    <Fragment key={row.id}>
                                        <TableRow
                                            data-state={row.getIsSelected() && "selected"}
                                            className={cn(hasExpandableContent && "cursor-pointer")}
                                            onClick={hasExpandableContent ? () => toggleRowExpanded(rowId) : undefined}
                                        >
                                            {/* Expand toggle column (only if expandable) */}
                                            {hasExpandableContent && (
                                                <TableCell className="w-10 p-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleRowExpanded(rowId)
                                                        }}
                                                    >
                                                        <ChevronDown
                                                            className={cn(
                                                                "h-4 w-4 transition-transform duration-200",
                                                                isExpanded && "rotate-180"
                                                            )}
                                                        />
                                                    </Button>
                                                </TableCell>
                                            )}
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        {/* Expandable content row */}
                                        {hasExpandableContent && (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell
                                                    colSpan={columns.length + 1}
                                                    className="p-0"
                                                >
                                                    <div
                                                        className={cn(
                                                            "overflow-hidden transition-all duration-300 ease-in-out",
                                                            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                                        )}
                                                    >
                                                        <div className="border-t border-border bg-muted/30 p-4">
                                                            {renderExpandedRow(row)}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + (renderExpandedRow ? 1 : 0)} className="h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-center gap-2 mt-auto">
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
        </div>
    )
}