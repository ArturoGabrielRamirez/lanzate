"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreBasicsBySlug(slug: string) {

    const store = await prisma.store.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            logo: true,
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
        message: "Store basics fetched successfully from db",
        payload: store,
        hasError: false
    }
}