"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreContactsBySlugData(slug: string) {

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
                    emails: true,
                    phones: true,
                    social_media: true,
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