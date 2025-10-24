"use server"

import { revalidatePath } from "next/cache"

import { updateBranchData } from "@/features/branches/data"
import { EditBranchAction } from "@/features/branches/types"
import { insertLogEntry } from "@/features/global/data/insertLogEntry"
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function editBranchAction({ branchId, data, slug, userId }: EditBranchAction) {
    return actionWrapper(async () => {

        const branch = await prisma.branch.findUnique({
            where: { id: branchId },
            include: { store: true }
        })

        if (!branch) throw new Error("Branch not found")
        if (branch.store.user_id !== userId) throw new Error("User does not have permission to edit this branch")

        const { error, payload, message } = await updateBranchData({ branchId, data })

        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

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