"use server"

import { revalidatePath } from "next/cache"

import { insertBranchData } from "@/features/branches/data"
import { CreateBranchAction } from "@/features/branches/types"
import { insertLogEntry } from "@/features/global/data"
import { actionWrapper } from "@/features/global/utils"

export async function createBranchAction({ payload, storeId, userId }: CreateBranchAction) {

    return actionWrapper(async () => {

        const { hasError, message, payload: branch } = await insertBranchData({ name: payload.name, address: "", email: "", phone: "", storeId })

        if (hasError) throw new Error(message)

        revalidatePath(`/stores/${storeId}`)

        const { hasError: logError } = await insertLogEntry({
            action: "CREATE",
            entity_type: "BRANCH",
            entity_id: branch.id,
            user_id: userId,
            action_initiator: "Formulario de creación de sucursal",
            details: "Sucursal creada usando el formulario de creación de sucursal"
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear una entrada de registro para esto.")


        return {
            hasError: false,
            message: "Sucursal creada con éxito",
            payload: branch
        }

    })
}
