"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreBySlugData(slug: string) {

    const store = await prisma.store.findUnique({
        where: {
            slug: slug
        },
        include: {
            branches: {
                include: {
                    stock: true,
                    shipping_methods: true,
                    operational_settings: true,
                    opening_hours: true,
                }
            },
            products: {
                where: {
                    is_deleted: false
                },
                include: {
                    categories: true,
                    variants: {
                        include: {
                            stocks: true,
                        },
                        where: {
                            is_deleted: false
                        }
                    }
                }
            },
            balance: true,
            operational_settings: true,
            customization: true
        }
    })

    return {
        message: "Store fetched successfully from db",
        payload: store,
        hasError: false
    }

}
