/* 'use server'

import { getSalesTrend } from "@/features/analytics/data/"

export async function getSalesTrendAction(slug: string, period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    return await getSalesTrend(slug, period)
}  */