"use server"

import MercadoPagoConfig, { PreApproval } from "mercadopago"

import { actionWrapper } from "@/features/global/utils"

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function cancelSuscriptionAction(suscriptionId: string) {
    return actionWrapper(async () => {

        console.log("🚀 ~ cancelSuscriptionAction ~ suscriptionId:", suscriptionId)

        const suscription = await new PreApproval(mercadopago).update({
            id: suscriptionId,
            body: {
                status: "cancelled"
            }
        })

        console.log("🚀 ~ cancelSuscriptionAction ~ suscription:", suscription)

        await cancelUserAccountData(suscriptionId)

        return {
            payload: null,
            hasError: false,
            message: "Suscripción cancelada exitosamente"
        }
    })
}