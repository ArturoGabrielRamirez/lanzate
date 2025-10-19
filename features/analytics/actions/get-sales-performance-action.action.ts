/* 'use server'

import { getSalesPerformance } from "@/features/analytics/data/"

export async function getSalesPerformanceAction(slug: string, timeUnit: 'hourly' | 'daily' | 'monthly' = 'daily') {
    return await getSalesPerformance(slug, timeUnit)
}  */