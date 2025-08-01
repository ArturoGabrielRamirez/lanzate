"use server"

import { getUserById } from "@/features/layout/data/getUserById"
import { actionWrapper } from "@/utils/lib"
/* import { PrismaClient } from '@prisma/client' */
import { prisma } from "@/utils/prisma"

export async function canEditEmployee(employeeId: number, userId: number) {
    return actionWrapper(async () => {
        const { payload: user, error: userError } = await getUserById(userId)

        if (userError || !user) return false

        /* const client = new PrismaClient() */

        const employee = await prisma.employee.findUnique({
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
    })
} 