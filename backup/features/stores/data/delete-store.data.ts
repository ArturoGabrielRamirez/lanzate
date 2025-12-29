"use server"

import { prisma } from "@/utils/prisma"

export async function deleteStoreData(storeId: number) {

    const store = await prisma.store.findUnique({
        where: {
            id: storeId
        }
    })

    if (!store) throw new Error("Tienda no encontrada")

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

    return {
        message: "Tienda eliminada con éxito",
        payload: null,
        hasError: false
    }

}
