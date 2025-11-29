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
                    emails: true,
                    phones: true,
                    social_media: true,
                    payment_configs: true,
                    
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
            customization: true,
        }
    })

    return {
        message: "Tienda recuperada con éxito desde la base de datos",
        payload: store,
        hasError: false
    }

}
