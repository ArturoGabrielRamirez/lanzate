"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { selectStoreBySlug } from "./selectStoreBySlug"
import { prisma } from "@/utils/prisma"

export async function selectProductsFromStore(slug: string) {

    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const { payload: store, error } = await selectStoreBySlug(slug)

        if (error || !store) throw new Error("Error fetching store from db")

        const products = await prisma.product.findMany({
            where: {
                store_id: store.id,
                is_deleted: false
            }
        })

        return {
            message: "Products fetched successfully from store",
            payload: products,
            error: false
        }

    })

}
