"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function insertEmployee(userId: number, storeId: number, role: string = "EMPLOYEE") {
    return actionWrapper(async () => {
        /* const client = new PrismaClient() */
        
        // Check if user is already an employee in this store
        const existingEmployee = await prisma.employee.findUnique({
            where: {
                user_id_store_id: {
                    user_id: userId,
                    store_id: storeId
                }
            }
        })

        if (existingEmployee) {
            throw new Error("User is already an employee in this store")
        }

        // Create new employee
        const employee = await prisma.employee.create({
            data: {
                user_id: userId,
                store_id: storeId,
                role: role as any, // Cast to EmployeeRole enum
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
            message: "Employee created successfully",
            payload: employee,
            error: false
        }
    })
} 