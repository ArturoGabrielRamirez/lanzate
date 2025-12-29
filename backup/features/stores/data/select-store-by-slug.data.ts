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
                    stock_items: true,
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
                    status : "ACTIVE"
                },
                include: {
                    categories: true,
                    variants: {
                        include: {
                            stock_items: true,
                        },
                        where: {
                            is_active: true
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
