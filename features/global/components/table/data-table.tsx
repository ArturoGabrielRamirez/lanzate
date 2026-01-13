"use client"

import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table'
import { useState } from 'react'

interface DataTableProps<TData> {
    data: TData[]
    columns?: ColumnDef<Partial<TData>>[]
}

export function DataTable<TData>({
    data,
    columns
}: DataTableProps<TData>) {

    const [initialData] = useState(() => [...data])

    const table = useReactTable({
        data: initialData,
        columns: columns as ColumnDef<TData>[],
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <div>
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}