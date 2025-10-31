"use server"

import { UpdateBranchProps } from "@/features/branches/types"
import { prisma } from "@/utils/prisma"

export async function updateBranchData({ branchId, data }: UpdateBranchProps) {

    if (data.is_main === true) {
        const currentBranch = await prisma.branch.findUnique({
            where: { id: branchId },
            include: { store: true }
        })

        if (!currentBranch) throw new Error("Branch not found")

        await prisma.branch.updateMany({
            where: {
                store_id: currentBranch.store_id,
                id: { not: branchId }
            },
            data: {
                is_main: false
            }
        })
    }

    if (data.is_main === false) {
        const currentBranch = await prisma.branch.findUnique({
            where: { id: branchId },
            include: { store: true }
        })

        if (!currentBranch) throw new Error("Branch not found")

        const otherMainBranches = await prisma.branch.count({
            where: {
                store_id: currentBranch.store_id,
                id: { not: branchId },
                is_main: true
            }
        })

        if (otherMainBranches === 0) {
            throw new Error("Cannot unset main branch. At least one branch must be designated as main.")
        }
    }

    const branch = await prisma.branch.update({
        where: {
            id: branchId
        },
        data: {
            name: data.name,
            description: data.description,
            address: data.address,
            phone: data.phone,
            email: data.email,
            is_main: data.is_main
        }
    })

    return {
        error: false,
        message: "Branch updated successfully",
        payload: branch
    }
} 