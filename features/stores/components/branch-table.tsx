"use client"

import CreateBranchButton from "@/features/branches/components/create-branch-button"
import { DataTable } from "@/features/layout/components/data-table"
import { Branch } from "@/prisma/generated/prisma"
import { ColumnDef } from "@tanstack/react-table"
type Props = {
    branches: Branch[]
    storeId: number
    userId: number
}

function BranchTable({ branches, storeId, userId }: Props) {

    const columns: ColumnDef<Branch>[] = [
        {
            header: "Name",
            accessorKey: "name",
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