'use server'

import { getTopProductsByBranch } from "../data/get-top-products-by-branch"

export async function getTopProductsByBranchAction(slug: string) {
    return await getTopProductsByBranch(slug)
} 