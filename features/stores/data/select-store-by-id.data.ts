"use server"

import { prisma } from "@/utils/prisma"

export async function selectStoreByIdData(storeId: number) {

    const store = await prisma.store.findUnique({
        where: {
            id: storeId
        },
        include: {
            branches: true,
            products: {
                where: {
                    is_deleted: false
                },
                include: {
                    categories: true,
                    stock_entries: true
                }
            },
            balance: true,
        }
    })

    return {
        message: "Store fetched successfully from db",
        payload: store,
        hasError: false
    }

}
