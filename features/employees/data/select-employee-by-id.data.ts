"use server"

import { prisma } from "@/utils/prisma"

export async function selectEmployeeByIdData(id: number) {
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

    if (!employee) throw new Error("Empleado no encontrado")

    return {
        payload: employee,
        hasError: false,
        message: "Detalles del empleado recuperados exitosamente"
    }
}