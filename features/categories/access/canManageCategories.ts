"use server"

import { prisma } from "@/utils/prisma"

export async function canManageCategories(userId: number, storeId: number): Promise<boolean> {
    try {
        // Verificar si el usuario es el dueño de la tienda
        const store = await prisma.store.findFirst({
            where: {
                id: storeId,
                user_id: userId
            }
        })

        if (store) return true

        // Verificar si el usuario es empleado con permisos de gestión de productos
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