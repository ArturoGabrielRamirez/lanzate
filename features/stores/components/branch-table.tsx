"use client"

import CreateBranchButton from "@/features/branches/components/create-branch-button"
import EditBranchButton from "@/features/branches/components/edit-branch-button"
import DeleteBranchButton from "@/features/branches/components/delete-branch-button"
import { DataTable } from "@/features/layout/components/data-table"
import { Branch } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye, Edit, Trash2, Crown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Props = {
    branches: Branch[]
    storeId: number
    userId: number
    slug: string
}

function BranchTable({ branches, storeId, userId, slug }: Props) {

    const columns: ColumnDef<Branch>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: ({ row }) => {
                const branch = row.original
                return (
                    <div className="flex items-center gap-2">
                        <span>{branch.name}</span>
                        {branch.is_main && (
                            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                                <Crown className="w-3 h-3" />
                                Main
                            </Badge>
                        )}
                    </div>
                )
            }
        },
        {
            header: "Address",
            accessorKey: "address",
            cell: ({ row }) => {
                const address = row.original.address
                return <span>{address ? address : "No address"}</span>
            }
        },
        {
            header: "Phone",
            accessorKey: "phone",
            cell: ({ row }) => {
                const phone = row.original.phone
                return <span>{phone ? phone : "No phone"}</span>
            }
        },
        {
            header: "Email",
            accessorKey: "email",
            cell: ({ row }) => {
                const email = row.original.email
                return <span>{email ? email : "No email"}</span>
            }
        },
        {
            header: "Actions",
            accessorKey: "actions",
            cell: ({ row }) => {
                const branch = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/stores/${slug}/branches/${branch.id}`} className="flex items-center gap-2 w-full">
                                    <Eye className="w-4 h-4" />
                                    View details
                                </Link>
                            </DropdownMenuItem>
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
                                    Cannot delete main branch
                                </DropdownMenuItem>
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
            topActions={<CreateBranchButton storeId={storeId} userId={userId} />}
        />
    )
}

export default BranchTable