"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreHeaderBySlugData(slug: string) {
    const store = await prisma.store.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            banner: true,
            balance: {
                select: {
                    current_balance: true
                }
            }
        }
    })

    if (!store) {
        throw new Error("Tienda no encontrada")
    }

    return {
        message: "Banner de la tienda recuperado con éxito desde la base de datos",
        payload: store,
        hasError: false
    }
} 