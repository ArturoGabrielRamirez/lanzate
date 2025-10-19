"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectProductById } from "../data/selectProductById"

export async function getProductDetails(id: string) {
    try {

        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid product id")

        const { payload: product, error, message } = await selectProductById(parsedId)

        if (error) throw new Error(message)

        return {
            payload: product,
            error: false,
            message: "Product details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching product details", error)
    }
}
