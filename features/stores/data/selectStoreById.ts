"use server"

import { Branch/* , PrismaClient */, Store } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

type SelectStoreByIdReturn = {
    message: string
    payload: Store & { branches: Branch[] } | null
    error: boolean
}

export async function selectStoreById(storeId: number): Promise<SelectStoreByIdReturn> {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const store = await prisma.store.findUnique({
            where: {
                id: storeId
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

    })
}
