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

                console.log("🚀 ~ updateProduct ~ payload:", payload)
                console.log("🚀 ~ updateProduct ~ error:", error)

                if (error && error.statusCode != 409) throw new Error(error.message)

                if (error && error.statusCode == 409) {

                    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(data.image.name)

                    console.log("🚀 ~ updateProduct ~ publicUrl:", publicUrl)

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