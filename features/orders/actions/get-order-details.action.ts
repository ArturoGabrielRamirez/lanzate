"use server"

import { actionWrapper, formatSuccessResponse } from "@/features/global/utils"
import { selectOrderByIdData } from "@/features/orders/data/select-order-by-id.data"

export async function getOrderDetailsAction(id: string) {
    return actionWrapper(async () => {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Se requiere un ID de orden válido")

        const { payload: order, hasError: error, message } = await selectOrderByIdData(parsedId)

        if (error) throw new Error(message)

        return formatSuccessResponse("Detalles de la orden obtenidos con éxito", order)

    })
} 