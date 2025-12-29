"use server"

import { selectBranchByIdData } from "@/features/branches/data"
import { actionWrapper } from "@/features/global/utils"

export async function getBranchDetailsAction(id: string) {
    return actionWrapper(async () => {
        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("ID de sucursal inválido")

        const { payload: branch, hasError, message } = await selectBranchByIdData({ id: parsedId })

        if (hasError) throw new Error(message)

        return {
            payload: branch,
            hasError: false,
            message: "Detalles de la sucursal obtenidos con éxito"
        }

    })
} 