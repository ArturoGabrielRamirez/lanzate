"use server"

import { CategoryValue, UpdateProductPayload } from "@/features/products/types"
import { prisma } from "@/utils/prisma"
import { createServerSideClient } from "@/utils/supabase/server"

export async function updateProductData(productId: number, data: UpdateProductPayload) {
    const supabase = createServerSideClient()

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            name: data.name,
            price: Number(data.price),
            stock: Number(data.stock),
            description: data.description,
            is_active: data.is_active,
            is_featured: data.is_featured,
            is_published: data.is_published,
            categories: {
                set: data.categories.map((category: CategoryValue) => ({ id: Number(category.value) }))
            }

        }
    })

    if (data.image) {
        // Always upload new image if provided
        const { data: payload, error } = await supabase.storage.from("product-images").upload(data.image.name, data.image)

        // Validar errores que no sean de archivo ya existente
        if (error && !error.message.includes("already exists") && !error.message.includes("Duplicate")) {
            throw new Error(error.message)
        }

        // Si el archivo ya existe (validar por mensaje de error)
        if (error && (error.message.includes("already exists") || error.message.includes("Duplicate"))) {

            const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(data.image.name)

            await prisma.product.update({
                where: { id: updatedProduct.id },
                data: {
                    image: publicUrl
                }
            })
        }

        if (payload) {

            const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(payload.path)

            await prisma.product.update({
                where: { id: updatedProduct.id },
                data: {
                    image: publicUrl
                }
            })
        }

    }

    return {
        message: "Product updated successfully",
        payload: updatedProduct,
        hasError: false
    }

} 