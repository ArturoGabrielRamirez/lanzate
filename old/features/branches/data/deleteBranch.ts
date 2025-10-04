"use server"

import { prisma } from "@/utils/prisma"

export async function deleteBranch(branchId: number) {

    const branch = await prisma.branch.findUnique({
        where: {
            id: branchId
        }
    })

    if (!branch) throw new Error("Branch not found")

    if (branch.is_main) {
        throw new Error("Cannot delete the main branch. You must designate another branch as main before deleting this one.")
    }

    const deletedBranch = await prisma.branch.delete({
        where: {
            id: branchId
        }
    })

    return {
        error: false,
        message: "Branch deleted successfully",
        payload: deletedBranch
    }
} 