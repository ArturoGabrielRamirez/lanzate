"use server"

import { prisma } from "@/utils/prisma"

export async function updateBranch(branchId: number, payload: any) {

    if (payload.is_main === true) {
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

    if (payload.is_main === false) {
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
            name: payload.name,
            description: payload.description,
            address: payload.address,
            phone: payload.phone,
            email: payload.email,
            is_main: payload.is_main
        }
    })

    return {
        error: false,
        message: "Branch updated successfully",
        payload: branch
    }
} 