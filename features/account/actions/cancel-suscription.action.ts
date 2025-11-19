"use server"

import { actionWrapper } from "@/features/global/utils"

export async function cancelSuscriptionAction(suscriptionId: string) {
    return actionWrapper(async () => {

        console.log("🚀 ~ cancelSuscriptionAction ~ suscriptionId:", suscriptionId)

        return {
            payload: null,
            hasError: false,
            message: "Suscripción cancelada exitosamente"
        }
    })
}