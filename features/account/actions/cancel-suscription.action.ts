"use server"

import MercadoPagoConfig, { PreApproval } from "mercadopago"
import { revalidatePath } from "next/cache";

import { cancelUserAccountData } from "@/features/account/data";
import { actionWrapper } from "@/features/global/utils"

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function cancelSuscriptionAction(suscriptionId: string) {
    return actionWrapper(async () => {

        const suscription = await new PreApproval(mercadopago).update({
            id: suscriptionId,
            body: {
                status: "cancelled"
            }
        })

        await cancelUserAccountData(suscription.id!)

        revalidatePath("/account")

        return {
            payload: null,
            hasError: false,
            message: "Suscripción cancelada exitosamente"
        }
    })
}