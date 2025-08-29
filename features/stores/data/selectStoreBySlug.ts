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
                        stock: true
                    }
                },
                products: {
                    where: {
                        NOT: { id: { in: [1, 2, 3, 5] } }
                    },
                    include: {
                        categories: true,
                        variants: {
                            include: {
                                stocks: true
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
