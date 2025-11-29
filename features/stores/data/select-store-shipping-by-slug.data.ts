"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreShippingBySlugData(slug: string) {

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
                    id: true,
                    shipping_methods: true
                }
            }
        }
    })

    return {
        message: "Información de envíos recuperada con éxito",
        payload: store,
        hasError: false
    }
}

