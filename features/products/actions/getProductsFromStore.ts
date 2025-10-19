"use server"

import { selectProductsFromStore } from "@/features/stores/data/seletProductsFromStore"
import { actionWrapper } from "@/utils/lib"

export async function getProductsFromStore(slug: string) {

    return actionWrapper(async () => {

        const { payload, error } = await selectProductsFromStore(slug)

        if (error || !payload) throw new Error("Error fetching products from store")

        return {
            message: "Products fetched successfully from store",
            payload,
            error: false
        }

    })

}
