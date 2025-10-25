"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { canDeleteStoreAccess } from "@/features/stores/access"
import { deleteStoreData } from "@/features/stores/data"

export async function deleteStoreAction(storeId: number, userId: number) {
    return actionWrapper(async () => {

        const canDelete = await canDeleteStoreAccess(storeId, userId)

        if (!canDelete) throw new Error("User does not own store")

        await deleteStoreData(storeId)

        revalidatePath("/stores")
        revalidatePath(`/dashboard`)

        const { error: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "STORE",
            entity_id: storeId,
            user_id: userId,
            action_initiator: "Delete store button",
            details: "User deleted store using the delete store button in danger zone"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")


        return {
            hasError: false,
            message: "Store deleted successfully",
            payload: null
        }

    })
}
