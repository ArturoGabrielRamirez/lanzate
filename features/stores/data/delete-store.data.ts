"use server"

import { prisma } from "@/utils/prisma"

export async function deleteStoreData(storeId: number) {

    const store = await prisma.store.findUnique({
        where: {
            id: storeId
        }
    })

    if (!store) throw new Error("Store not found")

    await prisma.store.delete({
        where: {
            id: store.id
        },
        include: {
            branches: true,
            balance: true,
            transactions: true,
            orders: true,
            products: true,
        }
    })

}
