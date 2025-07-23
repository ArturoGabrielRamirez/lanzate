"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function canDeleteBranch(branchId: number, userId: number) {
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

        // Check if it's the main branch (cannot be deleted)
        const isMainBranch = branch.is_main

        // User can delete if they are owner AND it's not the main branch
        const canDelete = isOwner && !isMainBranch

        return {
            error: false,
            message: canDelete ? "User can delete branch" : "User cannot delete branch",
            payload: canDelete
        }
    })
} 