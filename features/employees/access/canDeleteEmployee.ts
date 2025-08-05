"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { prisma } from "@/utils/prisma"

export async function canDeleteEmployee(employeeId: number, userId: number) {
    const { payload: user, error: userError } = await getUserById(userId)

    if (userError || !user) return false

    const employee = await prisma.employee.findUnique({
        where: {
            id: employeeId
        },
        include: {
            store: true
        }
    })

    if (!employee) return false

    if (employee.store.user_id !== userId) return false

    return true
} 