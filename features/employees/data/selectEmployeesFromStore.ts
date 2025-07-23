"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"

export async function selectEmployeesFromStore(storeId: number) {
    return actionWrapper(async () => {
        const client = new PrismaClient()
        const employees = await client.employee.findMany({
            where: { store_id: storeId },
            include: { user: true }
        })
        return {
            message: "Employees fetched successfully",
            payload: employees,
            error: false
        }
    })
} 