"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function insertCategory(storeId: number, payload: {
    name: string
    description?: string
    image?: string
    sort_order?: number
    is_default?: boolean
}) {
    return actionWrapper(async () => {
        // Generar slug único para la tienda
        const baseSlug = payload.name.toLowerCase()
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
                name: payload.name,
                description: payload.description,
                image: payload.image,
                slug: slug,
                store_id: storeId,
                sort_order: payload.sort_order || 0,
                is_default: payload.is_default || false,
                is_active: true
            }
        })

        return {
            payload: category,
            error: false,
            message: "Categoría creada exitosamente"
        }
    })
} 