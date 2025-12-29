"use server"

import { getUserById } from "@/features/global/data/getUserById"
import { prisma } from "@/utils/prisma"

export async function canEditEmployee(employeeId: number, userId: number) {
    const { payload: user, hasError: userError } = await getUserById(userId)

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