"use server"

import { prisma } from "@/utils/prisma";

export async function selectStoreBySubdomainData(subdomain: string) {
    const store = await prisma.store.findUnique({
        where: {
            subdomain: subdomain
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
           /*  operational_settings: true */
           // TODO: Arreglar aca, para Hori
        }
    })

    return {
        message: "Tienda recuperada con éxito desde la base de datos",
        payload: store,
        hasError: false
    }
}