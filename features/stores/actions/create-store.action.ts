"use server"

import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { insertLogEntry } from "@/features/layout/data/insertLogEntry"
import { canCreateStore } from "@/features/stores/access"
import { insertStoreData } from "@/features/stores/data"
import { ProcessedCreateStoreData } from "@/features/stores/types"

export async function createStoreAction(payload: ProcessedCreateStoreData, userId: number) {
    return actionWrapper(async () => {

        //Check user is authenticated

        //Check user account type allows store creation
        const canCreate = await canCreateStore(userId)

        //Throw error if user's account is not allowed
        if (!canCreate) throw new Error("Free plan limit reached")

        //Verify slug and subdomain availability
        //Create store record
        //Create default branch
        //Create store's initial balance
        const { payload: newStore, hasError, message } = await insertStoreData(payload, userId)

        //Throw error if store was not able to be created
        if (hasError) throw new Error(message)

        revalidatePath("/stores")

        // Create action log
        const { error: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "STORE",
            entity_id: newStore.id,
            user_id: userId,
            action_initiator: "Create store button",
            details: "User created a new store using the button"
        })

        if (logError) throw new Error("The action went through but there was an error creating a log entry for this.")

        return {
            hasError: false,
            message: "Store created successfully",
            payload: newStore
        }

    })
}
