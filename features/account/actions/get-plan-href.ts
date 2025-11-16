"use server"

import { actionWrapper } from "@/features/global/utils"

export async function getPlanHref(planId: string, email: string) {
    return actionWrapper(async () => {

        const suscription = await new PreApproval(mercadopago).create({
            body: {
                back_url: process.env.APP_URL!,
                reason: "Suscripción a mensajes de muro",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: 100,
                    currency_id: "ARS",
                },
                payer_email: email,
                status: "pending",
            },
        });

        return {
            payload: "",
            hasError: false,
            message: "Plan href obtenido exitosamente"
        }
    })
}