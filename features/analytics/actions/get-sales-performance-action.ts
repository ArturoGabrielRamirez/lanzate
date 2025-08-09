'use server'

import { getSalesPerformance } from "../data/get-sales-performance"

export async function getSalesPerformanceAction(slug: string, timeUnit: 'hourly' | 'daily' | 'monthly' = 'daily') {
    return await getSalesPerformance(slug, timeUnit)
} 