"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"
import { revalidatePath } from "next/cache"

export async function createCategoryDynamic(storeId: number, categoryName: string) {
    return actionWrapper(async () => {
        // Generar slug único para la tienda
        const baseSlug = categoryName.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        let slug = baseSlug
        let counter = 1

        // Verificar que el slug sea único dentro de la tienda
        while (true) {
            const existingCategory = await prisma.category.findFirst({
                where: {
                    store_id: storeId,
                    slug: slug
                }
            })

            if (!existingCategory) break
            slug = `${baseSlug}-${counter}`
            counter++
        }

        const category = await prisma.category.create({
            data: {
                name: categoryName,
                slug: slug,
                store_id: storeId,
                is_default: false,
                sort_order: 999, // Colocar al final
                is_active: true
            }
        })

        revalidatePath(`/stores/${storeId}/categories`)
        revalidatePath(`/stores/${storeId}`)

        return category
    })
} 