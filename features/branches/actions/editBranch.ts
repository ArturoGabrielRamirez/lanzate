"use server"

import { actionWrapper } from "@/utils/lib"
import { updateBranch as updateBranchInDb } from "../data/updateBranch"
import { revalidatePath } from "next/cache"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
// import { canEditBranch } from "../access/canEditBranch"
import { PrismaClient } from "@/prisma/generated/prisma"

export async function editBranch(branchId: number, data: any, slug: string, userId: number) {
    return actionWrapper(async () => {

        // Check user can edit branch (must be store owner)
        const client = new PrismaClient()
        const branch = await client.branch.findUnique({
            where: { id: branchId },
            include: { store: true }
        })
        
        if (!branch) throw new Error("Branch not found")
        if (branch.store.user_id !== userId) throw new Error("User does not have permission to edit this branch")

        // Update branch in database
        const { error, payload, message } = await updateBranchInDb(branchId, data)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "BRANCH",
            entity_id: branchId,
            user_id: userId,
            action_initiator: "Edit branch form",
            details: "Branch updated using edit branch form"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            message: "Branch updated successfully",
            payload: payload,
            error: false
        }

    })
} 