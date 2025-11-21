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

        if (!canUpdate) throw new Error("No tenés permiso para actualizar esta tienda.")

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
            action_initiator: "Se actualizó una tienda",
            details: "El usuario actualizó la tienda usando el botón de editar tienda"
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear una entrada de registro para esto.")

        return {
            message: "Información de la tienda actualizada con éxito",
            payload: payload,
            hasError: false
        }
    })
}
