"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function canEditBranch(branchId: number, userId: number) {
    return actionWrapper(async () => {

        const client = new PrismaClient()

        // Get branch with store info
        const branch = await client.branch.findUnique({
            where: {
                id: branchId
            },
            include: {
                store: true
            }
        })

        if (!branch) throw new Error("Branch not found")

        // Check if user is the store owner
        const isOwner = branch.store.user_id === userId

        return {
            error: false,
            message: isOwner ? "User can edit branch" : "User cannot edit branch",
            payload: isOwner
        }
    })
} 