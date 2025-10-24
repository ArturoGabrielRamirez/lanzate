"use server"

import { revalidatePath } from "next/cache"

import { insertBranchData } from "@/features/branches/data"
import { CreateBranchAction } from "@/features/branches/types"
import { insertLogEntry } from "@/features/global/data/insertLogEntry"
import { actionWrapper } from "@/features/global/utils"

export async function createBranchAction({ payload, storeId, userId }: CreateBranchAction) {

    return actionWrapper(async () => {

        const { hasError, message, payload: branch } = await insertBranchData({ name: payload.name, address: "", email: "", phone: "", storeId })

        if (hasError) throw new Error(message)

        revalidatePath(`/stores/${storeId}`)

        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "BRANCH",
            entity_id: branch.id,
            user_id: userId,
            action_initiator: "Branch creation form",
            details: "Branch created using branch creation form"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")


        return {
            hasError: false,
            message: "Branch created successfully",
            payload: branch
        }

    })
}
