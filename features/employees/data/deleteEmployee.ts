"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function deleteEmployee(employeeId: number) {
    try {
        const prisma = new PrismaClient()

        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true
                    }
                }
            }
        })

        if (!employee) throw new Error("Employee not found")

        // Delete employee - related orders will automatically have their employee fields set to NULL
        await prisma.employee.delete({
            where: {
                id: employeeId
            }
        })

        return {
            message: "Employee deleted successfully from db",
            payload: employee,
            error: false
        }
    } catch (error) {
        return formatErrorResponse("Error deleting employee", error, null)
    }
} 