"use server"

import { Branch, Store } from '@prisma/client'
import { formatErrorResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

type SelectStoreBySlugReturn = {
    message: string
    payload: Store & { branches: Branch[] } | null
    error: boolean
}

export async function selectStoreBySlug(slug: string): Promise<SelectStoreBySlugReturn> {
    try {

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
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching store from db", error, null)
    }
}
