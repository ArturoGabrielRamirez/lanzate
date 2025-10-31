"use server"

import { revalidatePath } from "next/cache"

import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { actionWrapper } from "@/features/global/utils"
import { canUpdateStore } from "@/features/stores/access"
import { updateStoreBySlugData } from "@/features/stores/data"
import { UpdateStorePayload } from "@/features/stores/types"

export async function updateStoreAction(slug: string, data: UpdateStorePayload, userId: number) {
    return actionWrapper(async () => {

        //Check user owns store
        const canUpdate = await canUpdateStore(slug, userId)

        if (!canUpdate) throw new Error("You are not allowed to update this store")

        //Check slug/subdomain availability if changed
        //Update store fields
        const { hasError, payload, message } = await updateStoreBySlugData(slug, data)

        if (hasError || !payload) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { hasError: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "STORE",
            entity_id: payload.id,
            user_id: userId,
            action_initiator: "Edit store button",
            details: "User updated store using the edit store button"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")


        return {
            message: "Store updated successfully",
            payload: payload,
            hasError: false
        }
    })
}
