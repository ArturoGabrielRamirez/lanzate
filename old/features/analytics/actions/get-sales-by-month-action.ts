'use server'

import { getSalesByMonth } from "../data/get-sales-by-month"

export async function getSalesByMonthAction(slug: string) {
    return await getSalesByMonth(slug)
} 