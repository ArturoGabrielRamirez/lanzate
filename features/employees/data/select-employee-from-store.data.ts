"use server"

import { prisma } from "@/utils/prisma"

export async function selectEmployeesFromStoreData(storeId: number) {
    const employees = await prisma.employee.findMany({
        where: {
            store_id: storeId
        },
        include: {
            user: true
        }
    })

    return {
        message: "Empleados recuperados exitosamente",
        payload: employees,
        hasError: false
    }
} 