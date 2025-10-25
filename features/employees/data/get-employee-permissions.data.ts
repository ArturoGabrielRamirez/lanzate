"use server"

import { GetEmployeePermissionsReturn } from "@/features/employees/types/types"
import { prisma } from "@/utils/prisma"

export async function getEmployeePermissionsData(userId: number, slug: string): Promise<GetEmployeePermissionsReturn> {
    const store = await prisma.store.findUnique({
        where: { slug },
        select: { id: true, user_id: true }
    })

    if (!store) {
        throw new Error("Store not found")
    }

    // Check if user is the store owner (admin)
    if (store.user_id === userId) {
        return {
            message: "User is admin of this store",
            payload: {
                isAdmin: true,
                permissions: undefined
            },
            error: false
        }
    }

    // Check if user is an employee in this store
    const employee = await prisma.employee.findFirst({
        where: {
            user_id: userId,
            store_id: store.id,
            is_active: true
        },
        select: {
            can_create_orders: true,
            can_update_orders: true,
            can_create_products: true,
            can_update_products: true,
            can_manage_stock: true,
            can_process_refunds: true,
            can_view_reports: true,
            can_manage_employees: true,
            can_manage_store: true
        }
    })

    if (!employee) {
        throw new Error("User is not an employee of this store")
    }

    return {
        message: "Employee permissions fetched successfully",
        payload: {
            isAdmin: false,
            permissions: employee
        },
        error: false
    }
} 