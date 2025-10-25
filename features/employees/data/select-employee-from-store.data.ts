"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectEmployeesFromStore(storeId: number) {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const employees = await prisma.employee.findMany({
            where: {
                store_id: storeId
            },
            include: {
                user: true
            }
        })

        return {
            message: "Employees fetched successfully",
            payload: employees,
            error: false
        }

    })
} 