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
                branches: true,
                products: {
                    include: {
                        categories: true,
                        stock_entries: true
                    }
                },
                balance: true,
                operational_settings: true,
                customization: true
            }
        })

        const aggregate = await prisma.productStock.groupBy({
            by: ["branch_id"],
            _sum: {
                quantity: true
            },
            where: {
                product_id: {
                    in: store?.products.map((product) => product.id)
                }
            },
        })

        console.log(aggregate)

        return {
            message: "Store fetched successfully from db",
            payload: store,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching store from db", error, null)
    }
}
