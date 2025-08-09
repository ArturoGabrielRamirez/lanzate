'use server'

import { getTopCategories } from "../data/get-top-categories"

export async function getTopCategoriesAction(slug: string) {
    return await getTopCategories(slug)
} 