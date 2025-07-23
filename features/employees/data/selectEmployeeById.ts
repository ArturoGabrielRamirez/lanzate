"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"

export async function selectEmployeeById(id: number) {
    try {
        const prisma = new PrismaClient()

        const employee = await prisma.employee.findUnique({
            where: {
                id: id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        first_name: true,
                        last_name: true,
                        avatar: true,
                        created_at: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        })

        if (!employee) throw new Error("Employee not found")

        return {
            payload: employee,
            error: false,
            message: "Employee details fetched successfully"
        }

    } catch (error) {
        return formatErrorResponse("Error fetching employee details", error)
    }
} 