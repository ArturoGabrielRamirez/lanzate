"use client"

import { Employee } from "@/features/employees/types"
import { DataTable } from "@/features/layout/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import CreateEmployeeButton from "@/features/employees/components/create-employee-button"
import DeleteEmployeeButton from "@/features/employees/components/delete-employee-button"
import EditEmployeeButton from "@/features/employees/components/edit-employee-button"
import { EmployeesTableProps } from "@/features/employees/types"
import { MoreHorizontal, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function EmployeesTable({ data, userId, slug, storeId }: EmployeesTableProps) {
    
    const t = useTranslations("store.employees-table")
    
    const columns: ColumnDef<Employee>[] = [
        {
            header: t("headers.id"),
            accessorKey: "id",
        },
        {
            header: t("headers.user"),
            accessorKey: "user",
            cell: ({ row }) => row.original.user?.email || row.original.user_id,
        },
        {
            header: t("headers.role"),
            accessorKey: "role",
        },
        {
            header: t("headers.active"),
            accessorKey: "is_active",
            cell: ({ row }) => row.original.is_active ? t("yes") : t("no"),
        },
        {
            header: t("headers.hired"),
            accessorKey: "hired_at",
            cell: ({ row }) => row.original.hired_at ? new Date(row.original.hired_at).toLocaleDateString() : t("no-hired-date"),
        },
        {
            header: t("headers.department"),
            accessorKey: "department",
            cell: ({ row }) => row.original.department || t("no-department"),
        },
        {
            header: t("headers.actions"),
            accessorKey: "actions",
            cell: ({ row }) => {
                const employee = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">{t("dropdown.open-menu")}</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">{t("dropdown.actions")}</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/stores/${slug}/employees/${employee.id}`} className="flex items-center gap-2 w-full">
                                    <Eye className="w-4 h-4" />
                                    {t("dropdown.view-details")}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <EditEmployeeButton
                                    employee={employee}
                                    slug={slug}
                                    userId={userId}
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <DeleteEmployeeButton
                                    employeeId={employee.id}
                                    slug={slug}
                                    userId={userId}
                                />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]

    return (
        <DataTable
            columns={columns}
            data={data}
            filterKey="user"
            topActions={<CreateEmployeeButton storeId={storeId} userId={userId} />}
        />
    )
} 