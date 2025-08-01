"use server"


/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { createServerSideClient } from "@/utils/supabase/server"
import randomstring from "randomstring"
import { prisma } from "@/utils/prisma"

export async function insertProduct(payload: any, storeId: number, userId: number) {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */
        const supabase = createServerSideClient()

        // Usar transacción para asegurar consistencia
        const result = await prisma.$transaction(async (tx) => {

            const store = await tx.store.findUnique({
                where: {
                    id: storeId
                }
            })

            if (!store) throw new Error("Store not found")

            const mainBranch = await tx.branch.findFirst({
                where: {
                    store_id: store.id,
                }
            })

            if (!mainBranch) throw new Error("Main branch not found")

            // Si hay imagen, subirla primero antes de crear el producto
            let imageUrl: string | null = null
            if (payload.image) {

                const { data: { publicUrl } } = supabase.storage
                    .from("product-images")
                    .getPublicUrl(payload.image.name)

                if (publicUrl) {
                    imageUrl = publicUrl
                } else {

                    const { data, error } = await supabase.storage
                        .from("product-images")
                        .upload(payload.image.name, payload.image)

                    if (error) throw new Error(error.message)

                    const { data: { publicUrl } } = supabase.storage
                        .from("product-images")
                        .getPublicUrl(data.path)

                    imageUrl = publicUrl
                }
            }

            const product = await tx.product.create({
                data: {
                    name: payload.name,
                    price: payload.price,
                    stock: payload.stock,
                    store_id: store.id,
                    description: payload.description,
                    image: imageUrl,
                    stock_entries: {
                        create: {
                            branch_id: mainBranch.id,
                            quantity: payload.stock,
                        }
                    },
                    categories: {
                        connect: [
                            ...payload.categories.map((category: any) => ({ id: category.value }))
                        ]
                    },
                    owner_id: userId,
                    slug: randomstring.generate(8),
                    sku: randomstring.generate(8),
                    is_active: true,
                    is_published: true,
                    is_featured: false,
                }
            })

            return product
        })

        return {
            error: false,
            message: "Product created successfully",
            payload: result
        }

    })
}
