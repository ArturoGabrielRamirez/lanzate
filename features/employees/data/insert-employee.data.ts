"use server"

import { EmployeeRole } from "@prisma/client"

import { prisma } from "@/utils/prisma"

export async function insertEmployeeData(userId: number, storeId: number, role: string = "EMPLOYEE") {
    const existingEmployee = await prisma.employee.findUnique({
        where: {
            user_id_store_id: {
                user_id: userId,
                store_id: storeId
            }
        }
    })

    if (existingEmployee) {
        throw new Error("El usuario ya es un empleado en esta tienda")
    }

    const employee = await prisma.employee.create({
        data: {
            user_id: userId,
            store_id: storeId,
            role: role as EmployeeRole, // Cast to EmployeeRole enum
            can_create_orders: false,
            can_update_orders: false,
            can_create_products: false,
            can_update_products: false,
            can_manage_stock: false,
            can_process_refunds: false,
            can_view_reports: false,
            can_manage_employees: false,
            can_manage_store: false,
            is_active: true,
        },
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

    return {
        message: "Empleado creado exitosamente",
        payload: employee,
        hasError: false
    }
} 