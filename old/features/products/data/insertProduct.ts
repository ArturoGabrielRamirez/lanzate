"use server"


import { actionWrapper } from "@/utils/lib"
import { createServerSideClient } from "@/utils/supabase/server"
import randomstring from "randomstring"
import { prisma } from "@/utils/prisma"

type CategoryValue = { value: string; label: string }

type InsertProductPayload = {
    name: string
    price: number
    stock: number
    description?: string
    categories: CategoryValue[]
    image?: File
    is_active?: boolean
    is_featured?: boolean
    is_published?: boolean
}

export async function insertProduct(payload: InsertProductPayload, storeId: number, userId: number) {
    return actionWrapper(async () => {

        const supabase = createServerSideClient()

        const result = await prisma.$transaction(async (tx) => {
            console.log("1")
            const store = await tx.store.findUnique({
                where: {
                    id: storeId
                }
            })
            console.log("2")

            if (!store) throw new Error("Store not found")

            console.log("3")
            const mainBranch = await tx.branch.findFirst({
                where: {
                    store_id: store.id,
                }
            })
            console.log("4")

            if (!mainBranch) throw new Error("Main branch not found")

            console.log("5")
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
            console.log("6")
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
                            ...payload.categories.map((category: CategoryValue) => ({ id: Number(category.value) }))
                        ]
                    },
                    owner_id: userId,
                    slug: randomstring.generate(8),
                    sku: randomstring.generate(8),
                    is_active: payload.is_active ?? true,
                    is_published: payload.is_published ?? true,
                    is_featured: payload.is_featured ?? false,
                }
            })
            console.log("7")
            return product
        })

        return {
            error: false,
            message: "Product created successfully",
            payload: result
        }

    })
}
