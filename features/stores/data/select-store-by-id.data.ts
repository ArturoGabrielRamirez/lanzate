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
        message: "Tienda recuperada con éxito desde la base de datos",
        payload: store,
        hasError: false
    }

}
