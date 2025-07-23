"use client"

import { Employee } from "@/features/employees/types"
import { DataTable } from "@/features/layout/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import CreateEmployeeButton from "@/features/employees/components/create-employee-button"
import { EmployeesTableProps } from "@/features/employees/types"

const columns: ColumnDef<Employee>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Usuario",
        accessorKey: "user",
        cell: ({ row }) => row.original.user?.email || row.original.user_id,
    },
    {
        header: "Rol",
        accessorKey: "role",
    },
    {
        header: "Activo",
        accessorKey: "is_active",
        cell: ({ row }) => row.original.is_active ? "Sí" : "No",
    },
    {
        header: "Contratado",
        accessorKey: "hired_at",
        cell: ({ row }) => row.original.hired_at ? new Date(row.original.hired_at).toLocaleDateString() : "-",
    },
    {
        header: "Departamento",
        accessorKey: "department",
        cell: ({ row }) => row.original.department || "-",
    },
    {
        header: "Acciones",
        accessorKey: "actions",
        cell: () => null // Placeholder para acciones futuras
    }
]

export default function EmployeesTable({ data, userId, slug, storeId }: EmployeesTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            filterKey="user"
            topActions={<CreateEmployeeButton storeId={storeId} userId={userId} />}
        />
    )
} 