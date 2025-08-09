"use server"

import { getDashboardStats as getDashboardStatsData } from "../data/getDashboardStats"

export async function getDashboardStats(userId: number) {
    try {
        const stats = await getDashboardStatsData(userId)
        
        return {
            payload: stats,
            error: false,
            message: "Dashboard stats retrieved successfully"
        }
    } catch (error) {
        console.error('Error in getDashboardStats action:', error)
        
        return {
            payload: null,
            error: true,
            message: "Failed to retrieve dashboard statistics"
        }
    }
} 