"use server"

/* import { revalidatePath } from "next/cache" */

/* import { insertLogEntry } from "@/features/global/data/insert-log-entry.data" */
import { actionWrapper } from "@/features/global/utils"
import { CreateStoreFormType } from "@/features/stores/schemas"
/* import { canCreateStore } from "@/features/stores/access"
import { insertStoreData } from "@/features/stores/data"
import { ProcessedCreateStoreData } from "@/features/stores/types" */

export async function createStoreAction(payload: CreateStoreFormType, userId: number) {
    console.log("🚀 ~ createStoreAction ~ payload:", payload)
    console.log("🚀 ~ createStoreAction ~ userId:", userId)
    return actionWrapper(async () => {

        //Check user is authenticated

        //Check user account type allows store creation
        /* const canCreate = await canCreateStore(userId) */

        //Throw error if user's account is not allowed
        /* if (!canCreate) throw new Error("Se alcanzó el límite del plan gratuito para esta cuenta. Actualizá tu plan para crear más tiendas.") */

        //Verify slug and subdomain availability
        //Create store record
        //Create default branch
        //Create store's initial balance
        /* const { payload: newStore, hasError, message } = await insertStoreData(payload, userId) */

        //Throw error if store was not able to be created
        /* if (hasError) throw new Error(message) */

        /* revalidatePath("/stores")
        revalidatePath("/dashboard")
 */
        // Create action log
        /* const { hasError: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "STORE",
            entity_id: newStore.id,
            user_id: userId,
            action_initiator: "Se creó una nueva tienda",
            details: "El usuario creó una nueva tienda usando el botón de creación de tienda."
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear un registro de esta.") */

        return {
            hasError: false,
            message: "Tienda creada exitosamente",
            payload: null
        }

    })
}
