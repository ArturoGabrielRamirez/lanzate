"use server"

import { PrismaClient } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"

export async function deleteBranch(branchId: number) {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        // First check if the branch exists and if it's the main branch
        const branch = await client.branch.findUnique({
            where: {
                id: branchId
            }
        })

        if (!branch) throw new Error("Branch not found")

        if (branch.is_main) {
            throw new Error("Cannot delete the main branch. You must designate another branch as main before deleting this one.")
        }

        // Delete the branch - orders will have their branch_id set to NULL due to foreign key constraint
        const deletedBranch = await client.branch.delete({
            where: {
                id: branchId
            }
        })

        return {
            error: false,
            message: "Branch deleted successfully",
            payload: deletedBranch
        }
    })
} 