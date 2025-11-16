"use server"

import { MercadoPagoConfig, PreApproval } from "mercadopago";

import { actionWrapper } from "@/features/global/utils"

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function getPlanHrefAction(planId: string, email: string) {
    
    console.log("🚀 ~ getPlanHrefAction ~ planId:", planId)
    console.log("🚀 ~ getPlanHrefAction ~ process.env.MP_ACCESS_TOKEN:", process.env.MP_ACCESS_TOKEN)
    console.log("🚀 ~ getPlanHrefAction ~ process.env.APP_URL:", process.env.APP_URL)

    return actionWrapper(async () => {

        const plans = {
            starter: 0,
            business: 10000,
            enterprise: 25000,
        }

        console.log("🚀 ~ getPlanHrefAction ~ plans[planId as keyof typeof plans]:", plans[planId as keyof typeof plans])

        const suscription = await new PreApproval(mercadopago).create({
            body: {
                back_url: process.env.APP_URL!,
                reason: "Suscripción a mensajes de muro",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: plans[planId as keyof typeof plans],
                    currency_id: "ARS",
                },
                payer_email: email,
                status: "pending",
            },
        });

        return {
            payload: suscription.init_point,
            hasError: false,
            message: "Plan href obtenido exitosamente"
        }
    })
}