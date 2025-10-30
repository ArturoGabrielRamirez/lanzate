"use server"

import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function canDeleteBranch(branchId: number, userId: number) {
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
        const isMainBranch = branch.is_main
        const canDelete = isOwner && !isMainBranch

        return {
            hasError: false,
            message: canDelete ? "User can delete branch" : "User cannot delete branch",
            payload: canDelete
        }
    })
} 