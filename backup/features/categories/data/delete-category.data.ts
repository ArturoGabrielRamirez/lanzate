"use server"

import { DeleteCategoryAction } from "@/features/categories/types"
import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function deleteCategoryData({ storeId, categoryId }: DeleteCategoryAction) {
    return actionWrapper(async () => {
        // Verificar que la categoría pertenece a la tienda
        const existingCategory = await prisma.category.findFirst({
            where: {
                id: categoryId,
                store_id: storeId
            },
            include: {
                products: true
            }
        })

        if (!existingCategory) {
            throw new Error("La categoría no existe o no pertenece a la tienda")
        }

        // No permitir eliminar categorías por defecto
        if (existingCategory.is_default) {
            throw new Error("No se pueden eliminar las categorías por defecto")
        }

        // Verificar si hay productos en esta categoría
        if (existingCategory.products.length > 0) {
            throw new Error("No se pueden eliminar categorías que contienen productos. Por favor, mueve o elimina los productos primero.")
        }

        // Soft delete - marcar como inactiva
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: {
                is_active: false
            }
        })

        return {
            payload: category,
            hasError: false,
            message: "Categoría eliminada exitosamente"
        }
    })
} 