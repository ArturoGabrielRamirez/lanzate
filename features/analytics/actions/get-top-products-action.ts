'use server'

import { getTopProducts } from "../data/get-top-products"

export async function getTopProductsAction(slug: string) {
    return await getTopProducts(slug)
} 