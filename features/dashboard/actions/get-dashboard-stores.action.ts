"use server"

import { selectDashboardStores } from "@/features/dashboard/data/selectDashboardStores"
import { GetDashboardStoresReturn } from "@/features/dashboard/types/types"

export async function getDashboardStoresAction(userId: number, limit?: number): Promise<GetDashboardStoresReturn> {
    return await selectDashboardStores(userId, limit)
} 