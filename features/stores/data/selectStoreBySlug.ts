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
                        NOT: { id: { in: [1, 2,3, 5] } }
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

        /* const aggregate = await prisma.productStock.groupBy({
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

        console.log(aggregate) */

        // Derive product stock from variant stocks
        const enriched = store && {
            ...store,
            products: store.products.map((p: any) => {
                const total = (p.variants ?? [])
                    .flatMap((v: any) => (v.stocks ?? []))
                    .reduce((sum: number, s: any) => sum + (s.quantity ?? 0), 0)
                return { ...p, stock: total }
            })
        }

        return {
            message: "Store fetched successfully from db",
            payload: enriched as any,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching store from db", error, null)
    }
}
