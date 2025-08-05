"use server"

import { prisma } from "@/utils/prisma"

export async function canManageCategories(userId: number, storeId: number): Promise<boolean> {
    try {
        const store = await prisma.store.findFirst({
            where: {
                id: storeId,
                user_id: userId
            }
        })

        if (store) return true

        const employee = await prisma.employee.findFirst({
            where: {
                user_id: userId,
                store_id: storeId,
                is_active: true,
                OR: [
                    { can_create_products: true },
                    { can_update_products: true },
                    { can_manage_store: true },
                    { role: 'OWNER' },
                    { role: 'MANAGER' }
                ]
            }
        })

        return !!employee
    } catch (error) {
        console.error('Error checking category management permissions:', error)
        return false
    }
} 