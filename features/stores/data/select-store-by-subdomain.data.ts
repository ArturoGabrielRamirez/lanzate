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
            operational_settings: true
        }
    })

    return {
        message: "Store fetched successfully from db",
        payload: store,
        hasError: false
    }
}