"use server"

import { revalidatePath } from "next/cache"

import { insertLogEntry } from "@/features/global/data/insert-log-entry.data"
import { actionWrapper } from "@/features/global/utils"
import { canDeleteStoreAccess } from "@/features/stores/access"
import { deleteStoreData } from "@/features/stores/data"

export async function deleteStoreAction(storeId: number, userId: number) {
    return actionWrapper(async () => {

        const canDelete = await canDeleteStoreAccess(storeId, userId)

        if (!canDelete) throw new Error("No tenés permiso para eliminar esta tienda.")

        await deleteStoreData(storeId)

        revalidatePath("/stores")
        revalidatePath(`/dashboard`)

        const { hasError: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "STORE",
            entity_id: storeId,
            user_id: userId,
            action_initiator: "Se eliminó una tienda",
            details: "El usuario eliminó una tienda usando el botón de eliminación en la zona de peligro"
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear un registro de esta.")

        return {
            hasError: false,
            message: "Tienda eliminada exitosamente",
            payload: null
        }

    })
}
