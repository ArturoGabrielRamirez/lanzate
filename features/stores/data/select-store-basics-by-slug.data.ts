"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreBasicsBySlugData(slug: string) {

    const store = await prisma.store.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            logo: true,
            slug: true,
            subdomain: true,
            name: true,
            _count: {
                select: {
                    products: true
                }
            }
        }
    })

    return {
        message: "Datos básicos de la tienda recuperados con éxito desde la base de datos",
        payload: store,
        hasError: false
    }
}