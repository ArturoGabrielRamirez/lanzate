"use client"

import { Employee } from "@/features/employees/types"
import { DataTable } from "@/features/global/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import CreateEmployeeButton from "@/features/employees/components/create-employee-button"
import CreateContractButton from "@/features/employees/components/create-contract-button"
import DeleteEmployeeButton from "@/features/employees/components/delete-employee-button"
import EditEmployeeButton from "@/features/employees/components/edit-employee-button"
import { EmployeesTableProps } from "@/features/employees/types"
import { MoreHorizontal, Eye, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/features/shadcn/components/ui/dropdown-menu"
import { Button } from "@/features/shadcn/components/ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { cn } from "@/lib/utils"

export default function EmployeesTable({ data, userId, slug, storeId, employeePermissions }: EmployeesTableProps) {

    const t = useTranslations("store.employees-table")

    // Check if user can manage employees
    const canManageEmployees = employeePermissions.isAdmin || employeePermissions.permissions?.can_manage_employees

    const columns: ColumnDef<Employee>[] = [
        {
            header: t("headers.id"),
            accessorKey: "id",
        },
        {
            accessorKey: "user",
            cell: ({ row }) => row.original.user?.email || row.original.user_id,
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.user")}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <ArrowUpDown className="size-4" />
                        </Button>
                    </div>
                )
            },
        },
        {
            //header: t("headers.role"),
            accessorKey: "role",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.role")}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <ArrowUpDown className="size-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const role = row.original.role
                return (
                    <Badge variant="outline" className={cn(role === "EMPLOYEE" && "border-blue-500 text-blue-500", role === "ADMIN" && "border-red-500 text-red-500")}>{role}</Badge>
                )
            }
        },
        {
            //header: t("headers.active"),
            accessorKey: "is_active",
            cell: ({ row }) => row.original.is_active ? t("yes") : t("no"),
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.active")}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <ArrowUpDown className="size-4" />
                        </Button>
                    </div>
                )
            },
        },
        {
            //header: t("headers.hired"),   
            accessorKey: "hired_at",
            cell: ({ row }) => row.original.hired_at ? new Date(row.original.hired_at).toLocaleDateString() : t("no-hired-date"),
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.hired")}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <ArrowUpDown className="size-4" />
                        </Button>
                    </div>
                )
            },
        },
        {
            //header: t("headers.department"),  
            accessorKey: "department",
            cell: ({ row }) => row.original.department || t("no-department"),
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.department")}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <ArrowUpDown className="size-4" />
                        </Button>
                    </div>
                )
            },
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
                            {canManageEmployees && (
                                <>
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
                                </>
                            )}
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
            topActions={
                canManageEmployees ? (
                    <div className="flex gap-2">
                        <CreateEmployeeButton storeId={storeId} userId={userId} />
                        <CreateContractButton storeId={storeId} userId={userId} />
                    </div>
                ) : undefined
            }
        />
    )
} 