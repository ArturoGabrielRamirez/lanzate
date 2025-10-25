"use server"

import { UpdateCategoryAction } from "@/features/categories/types"
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function updateCategory({ storeId, categoryId, payload }: UpdateCategoryAction) {
    return actionWrapper(async () => {
        // Verificar que la categoría pertenece a la tienda
        const existingCategory = await prisma.category.findFirst({
            where: {
                id: categoryId,
                store_id: storeId
            }
        })

        if (!existingCategory) {
            throw new Error("Category not found or does not belong to this store")
        }

        // Si se está cambiando el nombre, generar nuevo slug
        let slug = existingCategory.slug
        if (payload.name && payload.name !== existingCategory.name) {
            const baseSlug = payload.name.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()

            let newSlug = baseSlug
            let counter = 1

            while (true) {
                const duplicateCategory = await prisma.category.findFirst({
                    where: {
                        store_id: storeId,
                        slug: newSlug,
                        id: { not: categoryId }
                    }
                })

                if (!duplicateCategory) break
                newSlug = `${baseSlug}-${counter}`
                counter++
            }
            slug = newSlug
        }

        const category = await prisma.category.update({
            where: { id: categoryId },
            data: {
                ...payload,
                slug
            }
        })

        return {
            payload: category,
            error: false,
            message: "Categoría actualizada exitosamente"
        }
    })
} 