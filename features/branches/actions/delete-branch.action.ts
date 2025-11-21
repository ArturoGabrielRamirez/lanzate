"use server"

import { revalidatePath } from "next/cache"

import { deleteBranchData } from "@/features/branches/data"
import { DeleteBranchAction } from "@/features/branches/types"
import { insertLogEntry } from "@/features/global/data"
import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function deleteBranchAction({ branchId, slug, userId }: DeleteBranchAction) {
    return actionWrapper(async () => {

        const branch = await prisma.branch.findUnique({
            where: { id: branchId },
            include: { store: true }
        })

        if (!branch) throw new Error("Sucursal no encontrada")
        if (branch.store.user_id !== userId) throw new Error("No tenés permiso para eliminar esta sucursal.")

        if (branch.is_main) {
            throw new Error("No se puede eliminar la sucursal principal. Debe designar otra sucursal como principal antes de eliminar esta.")
        }

        const { hasError, message, payload } = await deleteBranchData({ branchId })
        if (hasError) throw new Error(message)

        revalidatePath(`/stores/${slug}`)

        const { hasError: logError } = await insertLogEntry({
            action: "DELETE",
            entity_type: "BRANCH",
            entity_id: branchId,
            user_id: userId,
            action_initiator: "Botón de eliminar sucursal",
            details: "Sucursal eliminada usando el botón de eliminar sucursal. Las órdenes relacionadas mantienen sus datos pero las referencias a la sucursal se establecen en NULL."
        })

        if (logError) throw new Error("La acción se realizó pero hubo un error al crear una entrada de registro para esto.")
        return {
            hasError: false,
            message: "Sucursal eliminada con éxito",
            payload: payload
        }
    })
} 