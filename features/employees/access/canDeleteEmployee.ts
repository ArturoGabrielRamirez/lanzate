"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { PrismaClient } from '@prisma/client'

export async function canDeleteEmployee(employeeId: number, userId: number) {
    try {
        const { payload: user, error: userError } = await getUserById(userId)

        if (userError || !user) return false

        const client = new PrismaClient()

        const employee = await client.employee.findUnique({
            where: {
                id: employeeId
            },
            include: {
                store: true
            }
        })

        if (!employee) return false

        // Only store owner can delete employees
        if (employee.store.user_id !== userId) return false

        return true
    } catch (error) {
        return false
    }
} 