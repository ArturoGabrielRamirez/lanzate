"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
import { canUpdateStore } from "@/features/stores/access/can-update-store.access"
import { updateStoreBySlug } from "@/features/stores/data/updateStoreBySlug"

type UpdateStorePayload = {
    name: string
    description?: string
    subdomain: string
    contact_phone?: string
    contact_whatsapp?: string
    facebook_url?: string
    instagram_url?: string
    x_url?: string
}

export async function updateStoreAction(slug: string, data: UpdateStorePayload, userId: number) {
    return actionWrapper(async () => {

        //Check user owns store
        const canUpdate = await canUpdateStore(slug, userId)

        if (!canUpdate) throw new Error("You are not allowed to update this store")

        //Check slug/subdomain availability if changed
        //Update store fields
        const { error, payload, message } = await updateStoreBySlug(slug, data)

        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        // Create action log
        const { error: logError } = await insertLogEntry({
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
