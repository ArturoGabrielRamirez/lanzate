"use server"

import { MercadoPagoConfig, PreApproval } from "mercadopago";

import { actionWrapper } from "@/features/global/utils"

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function getPlanHrefAction(planId: string, email: string, userEmail: string) {

    return actionWrapper(async () => {

        const plans = {
            starter: 0,
            business: 10000,
            enterprise: 25000,
        }

        const suscription = await new PreApproval(mercadopago).create({
            body: {
                //back_url: process.env.APP_URL!,
                back_url: "https://4633a45df0f4.ngrok-free.app/en/account",
                reason: "Lanzate",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: plans[planId as keyof typeof plans],
                    currency_id: "ARS",
                },
                payer_email: email,
                status: "pending",
                external_reference: userEmail,
            },
        });

        return {
            payload: suscription.init_point,
            hasError: false,
            message: "Plan href obtenido exitosamente"
        }
    })
}