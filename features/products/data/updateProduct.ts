"use server"

import { PrismaClient } from "@/prisma/generated/prisma"
import { formatErrorResponse } from "@/utils/lib"
import { createServerSideClient } from "@/utils/supabase/server"

export async function updateProduct(productId: number, data: any) {
    try {

        const prisma = new PrismaClient()
        const supabase = createServerSideClient()

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: data.name,
                price: data.price,
                stock: data.stock,
                description: data.description,
                categories: {
                    set: data.categories.map((category: any) => ({ id: category.value }))
                }

            }
        })

        if (data.image) {
            if (data.image !== updatedProduct.image) {

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
        }

        return {
            message: "Product updated successfully",
            payload: updatedProduct,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error updating product", error, null)
    }
} 