"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function selectEmployeeById(id: number) {
    return actionWrapper(async () => {
        /* const prisma = new PrismaClient() */

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

    })
} 