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
            throw new Error("Category not found or does not belong to this store")
        }

        // No permitir eliminar categorías por defecto
        if (existingCategory.is_default) {
            throw new Error("Cannot delete default categories")
        }

        // Verificar si hay productos en esta categoría
        if (existingCategory.products.length > 0) {
            throw new Error("Cannot delete category with products. Please move or delete the products first.")
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