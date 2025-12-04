"use client"

import { ColumnDef, createColumnHelper, Column, Row } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/features/shadcn/components/ui/button"
import { Checkbox } from "@/features/shadcn/components/ui/checkbox"

// ==========================================
// Types
// ==========================================

export type SortableHeaderConfig<TData> = {
    label: string
    column: Column<TData, unknown>
}

export type ColumnConfig<TData, TValue = unknown> = {
    /** Accessor key for the column */
    accessorKey: keyof TData & string
    /** Header label */
    header: string
    /** Enable sorting (default: true) */
    sortable?: boolean
    /** Custom cell renderer */
    cell?: (value: TValue, row: Row<TData>) => React.ReactNode
    /** Hide this column on mobile */
    hideOnMobile?: boolean
}

export type DisplayColumnConfig<TData> = {
    id: string
    header?: string
    cell: (row: Row<TData>) => React.ReactNode
}

// ==========================================
// Header Components
// ==========================================

/**
 * Reusable sortable header component
 */
export function SortableHeader<TData>({ label, column }: SortableHeaderConfig<TData>) {
    return (
        <div className="flex items-center gap-2">
            {label}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <ArrowUpDown className="size-4" />
            </Button>
        </div>
    )
}

// ==========================================
// Column Factory Functions
// ==========================================

/**
 * Creates a type-safe column helper with common patterns
 */
export function createTypedColumnHelper<TData>() {
    const helper = createColumnHelper<TData>()

    return {
        ...helper,

        /**
         * Creates a simple accessor column with optional sorting
         */
        simpleColumn: <TValue,>(config: ColumnConfig<TData, TValue>): ColumnDef<TData, TValue> => {
            const { accessorKey, header, sortable = true, cell } = config

            return {
                accessorKey,
                header: sortable
                    ? ({ column }) => <SortableHeader label={header} column={column} />
                    : header,
                cell: cell
                    ? ({ row }) => cell(row.getValue(accessorKey) as TValue, row)
                    : undefined,
            } as ColumnDef<TData, TValue>
        },

        /**
         * Creates a selection checkbox column
         */
        selectColumn: (): ColumnDef<TData> => ({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    onChange={(checked) => table.toggleAllPageRowsSelected(checked)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    value={row.getIsSelected() ? "true" : "false"}
                    onChange={(checked) => row.toggleSelected(checked)}
                    aria-label="Select row"
                />
            ),
        }),

        /**
         * Creates a display-only column (no data accessor)
         */
        displayColumn: (config: DisplayColumnConfig<TData>): ColumnDef<TData> => ({
            id: config.id,
            header: config.header,
            cell: ({ row }) => config.cell(row),
        }),
    }
}

/**
 * Builds column definitions from a simple config array
 * Great for quick table setup with common patterns
 */
export function buildColumns<TData>(
    configs: (ColumnConfig<TData> | DisplayColumnConfig<TData>)[],
    options?: {
        includeSelect?: boolean
        isMobile?: boolean
    }
): ColumnDef<TData>[] {
    const helper = createTypedColumnHelper<TData>()
    const columns: ColumnDef<TData>[] = []

    // Add selection column if requested
    if (options?.includeSelect) {
        columns.push(helper.selectColumn())
    }

    for (const config of configs) {
        // Skip mobile-hidden columns when on mobile
        if (options?.isMobile && "hideOnMobile" in config && config.hideOnMobile) {
            continue
        }

        if ("accessorKey" in config) {
            columns.push(helper.simpleColumn(config as ColumnConfig<TData>))
        } else {
            columns.push(helper.displayColumn(config as DisplayColumnConfig<TData>))
        }
    }

    return columns
}

// ==========================================
// Common Cell Formatters
// ==========================================

export const formatters = {
    /**
     * Format as currency (ARS by default)
     */
    currency: (value: number, locale = "es-AR", currency = "ARS"): string => {
        return Intl.NumberFormat(locale, { style: "currency", currency }).format(value)
    },

    /**
     * Format date
     */
    date: (value: Date | string, locale = "es-AR"): string => {
        const date = typeof value === "string" ? new Date(value) : value
        return date.toLocaleDateString(locale)
    },

    /**
     * Format boolean as Yes/No
     */
    boolean: (value: boolean, yes = "Sí", no = "No"): string => {
        return value ? yes : no
    },
}

// ==========================================
// Stock Color Helper
// ==========================================

export function getStockColorClass(stock: number): string {
    if (stock < 10) return "text-red-500"
    if (stock < 25) return "text-yellow-500"
    return "text-green-500"
}

