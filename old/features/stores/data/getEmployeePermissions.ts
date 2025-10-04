"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

type EmployeePermissions = {
    isAdmin: boolean
    permissions?: {
        can_create_orders: boolean
        can_update_orders: boolean
        can_create_products: boolean
        can_update_products: boolean
        can_manage_stock: boolean
        can_process_refunds: boolean
        can_view_reports: boolean
        can_manage_employees: boolean
        can_manage_store: boolean
    }
}

type GetEmployeePermissionsReturn = {
    message: string
    payload: EmployeePermissions | null
    error: boolean
}

export async function getEmployeePermissions(userId: number, slug: string): Promise<GetEmployeePermissionsReturn> {
    return actionWrapper(async () => {
        // First, get the store by slug
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
    })
} 