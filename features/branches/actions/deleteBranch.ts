"use server"

import { actionWrapper } from "@/utils/lib"
import { deleteBranch as deleteBranchFromDb } from "@/features/branches/data"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data"

import { prisma } from "@/utils/prisma"

export async function deleteBranch(branchId: number, slug: string, userId: number) {
    return actionWrapper(async () => {

        
        const branch = await prisma.branch.findUnique({
            where: { id: branchId },
            include: { store: true }
        })

        if (!branch) throw new Error("Branch not found")
        if (branch.store.user_id !== userId) throw new Error("User does not have permission to delete this branch")

        if (branch.is_main) {
            throw new Error("Cannot delete the main branch. You must designate another branch as main before deleting this one.")
        }

        const { error, message, payload } = await deleteBranchFromDb(branchId)
        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        const { error: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "BRANCH",
            entity_id: branchId,
            user_id: userId,
            action_initiator: "Delete branch button",
            details: "Branch deleted using delete branch button. Related orders maintain their data but branch references are set to NULL."
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            error: false,
            message: "Branch deleted successfully",
            payload: payload
        }
    })
} 