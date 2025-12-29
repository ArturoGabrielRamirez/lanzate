"use server"

import { prisma } from "@/utils/prisma"

export async function selectStorePaymentMethodsBySlugData(slug: string) {

    const store = await prisma.store.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            branches: {
                where: {
                    is_main: true,
                },
                select: {
                    payment_configs: true
                }
            }
        }
    })

    return {
        message: "Métodos de pago de la tienda recuperados con éxito desde la base de datos",
        payload: store,
        hasError: false
    }
}

