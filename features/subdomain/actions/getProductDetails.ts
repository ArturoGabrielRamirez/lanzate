"use server"

import { formatErrorResponse } from "@/utils/lib"
import { selectProductByIdAndSubdomain } from "../data/selectProductByIdAndSubdomain"
import { GetProductDetailsReturn } from "../types/types"

export async function getProductDetails(id: string, subdomain: string): Promise<GetProductDetailsReturn> {
    try {
        const parsedId = parseInt(id)

        if (isNaN(parsedId)) throw new Error("Invalid product id")

        const { payload: product, error, message } = await selectProductByIdAndSubdomain(parsedId, subdomain)

        if (error) throw new Error(message)

        return {
            payload: product,
            error: false,
            message: "Product details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching product details", error, null)
    }
} 