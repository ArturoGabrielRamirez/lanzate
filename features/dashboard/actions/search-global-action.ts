'use server'

import { searchGlobal } from "../data/search-global"

export async function searchGlobalAction(query: string, userId: number) {
    return await searchGlobal(query, userId)
} 