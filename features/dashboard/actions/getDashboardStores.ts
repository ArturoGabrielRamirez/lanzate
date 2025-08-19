"use server"

import { GetDashboardStoresReturn } from "../types/types"
import { selectDashboardStores } from "../data/selectDashboardStores"

export async function getDashboardStores(userId: number, limit?: number): Promise<GetDashboardStoresReturn> {
    return await selectDashboardStores(userId, limit)
} 