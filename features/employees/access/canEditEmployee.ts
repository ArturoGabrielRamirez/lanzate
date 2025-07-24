"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { PrismaClient } from "@/prisma/generated/prisma"

export async function canEditEmployee(employeeId: number, userId: number) {
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

        // Only store owner can edit employees
        if (employee.store.user_id !== userId) return false

        return true
    } catch (error) {
        return false
    }
} 