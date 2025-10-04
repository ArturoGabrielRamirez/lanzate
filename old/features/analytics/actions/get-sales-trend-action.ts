'use server'

import { getSalesTrend } from "../data/get-sales-trend"

export async function getSalesTrendAction(slug: string, period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    return await getSalesTrend(slug, period)
} 