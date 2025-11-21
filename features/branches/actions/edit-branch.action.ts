"use server"

import { revalidatePath } from "next/cache"

import { updateBranchData } from "@/features/branches/data"
import { EditBranchAction } from "@/features/branches/types"
import { insertLogEntry } from "@/features/global/data"
import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function editBranchAction({ branchId, data, slug, userId }: EditBranchAction) {
    return actionWrapper(async () => {

        const branch = await prisma.branch.findUnique({
            where: { id: branchId },
            include: { store: true }
        })

        if (!branch) throw new Error("Sucursal no encontrada")
        if (branch.store.user_id !== userId) throw new Error("No tenés permiso para editar esta sucursal")

        const { error, payload, message } = await updateBranchData({ branchId, data })

        if (error) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        const { hasError: logError } = await insertLogEntry({
            action: "UPDATE",
            entity_type: "BRANCH",
            entity_id: branchId,
            user_id: userId,
            action_initiator: "Formulario de edición de sucursal",
            details: "Sucursal actualizada usando el formulario de edición de sucursal"
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear una entrada de registro para esto.")
        return {
            message: "Sucursal actualizada con éxito",
            payload: payload,
            hasError: false
        }

    })
} 