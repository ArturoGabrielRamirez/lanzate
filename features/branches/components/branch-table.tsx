"use client"

import { Branch } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye, Trash2, Crown, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import CreateBranchButton from "@/features/branches/components/create-branch-button"
import DeleteBranchButton from "@/features/branches/components/delete-branch-button"
import EditBranchButton from "@/features/branches/components/edit-branch-button"
import { BranchTableProps } from "@/features/branches/types"
import { DataTable } from "@/features/global/components/data-table"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/features/shadcn/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"


function BranchTable({ branches, storeId, userId, slug, employeePermissions }: BranchTableProps) {

    const t = useTranslations("store.branch-table")

    // Check if user can manage store
    const canManageStore = employeePermissions.isAdmin || employeePermissions.permissions?.can_manage_store

    const columns: ColumnDef<Branch>[] = [
        {
            //header: t("headers.name"),
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.name")}
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
                const branch = row.original
                return (
                    <div className="flex items-center gap-2">
                        <span>{branch.name}</span>
                        {branch.is_main && (
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                <Crown className="w-3 h-3" />
                                {t("main-badge")}
                            </Badge>
                        )}
                    </div>
                )
            }
        },
        {
            //header: t("headers.address"), 
            accessorKey: "address",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.address")}
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
                const address = row.original.address
                return <span className={cn(!address && "text-muted-foreground/50")}>{address ? address : t("no-address")}</span>
            }
        },
        {
            //header: t("headers.phone"),
            accessorKey: "phone",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.phone")}
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
                const phone = row.original.phone
                return <span className={cn(!phone && "text-muted-foreground/50")}>{phone ? phone : t("no-phone")}</span>
            }
        },
        {
            //header: t("headers.email"),   
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <div className="flex items-center gap-2">
                        {t("headers.email")}
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
                const email = row.original.email
                return <span className={cn(email ? "text-blue-500" : "text-muted-foreground/50")}>{email ? email : t("no-email")}</span>
            }
        },
        {
            header: t("headers.actions"),
            accessorKey: "actions",
            cell: ({ row }) => {
                const branch = row.original
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
                                <Link href={`/stores/${slug}/branches/${branch.id}`} className="flex items-center gap-2 w-full">
                                    <Eye className="w-4 h-4" />
                                    {t("dropdown.view-details")}
                                </Link>
                            </DropdownMenuItem>
                            {canManageStore && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <EditBranchButton
                                            branch={branch}
                                            slug={slug}
                                            userId={userId}
                                        />
                                    </DropdownMenuItem>
                                    {!branch.is_main && (
                                        <DropdownMenuItem asChild>
                                            <DeleteBranchButton
                                                branchId={branch.id}
                                                slug={slug}
                                                userId={userId}
                                            />
                                        </DropdownMenuItem>
                                    )}
                                    {branch.is_main && (
                                        <DropdownMenuItem disabled className="opacity-50">
                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                            {t("dropdown.cannot-delete-main")}
                                        </DropdownMenuItem>
                                    )}
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
            data={branches}
            filterKey="name"
            topActions={
                canManageStore ? (
                    <CreateBranchButton storeId={storeId} userId={userId} />
                ) : undefined
            }
        />
    )
}

export { BranchTable }