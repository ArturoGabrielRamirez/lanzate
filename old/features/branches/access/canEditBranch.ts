"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function canEditBranch(branchId: number, userId: number) {
    return actionWrapper(async () => {

        const branch = await prisma.branch.findUnique({
            where: {
                id: branchId
            },
            include: {
                store: true
            }
        })

        if (!branch) throw new Error("Branch not found")

        const isOwner = branch.store.user_id === userId

        return {
            error: false,
            message: isOwner ? "User can edit branch" : "User cannot edit branch",
            payload: isOwner
        }
    })
} 