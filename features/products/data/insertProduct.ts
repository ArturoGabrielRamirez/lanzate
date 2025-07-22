"use server"


import { PrismaClient } from "@/prisma/generated/prisma"
import { actionWrapper } from "@/utils/lib"
import { createServerSideClient } from "@/utils/supabase/server"
import randomstring from "randomstring"

export async function insertProduct(payload: any, storeId: number, userId: number) {
    return actionWrapper(async () => {

        const prisma = new PrismaClient()
        const supabase = createServerSideClient()

        const store = await prisma.store.findUnique({
            where: {
                id: storeId
            }
        })

        if (!store) throw new Error("Store not found")

        const mainBranch = await prisma.branch.findFirst({
            where: {
                store_id: store.id,
            }
        })

        if (!mainBranch) throw new Error("Main branch not found")

        const product = await prisma.product.create({
            data: {
                name: payload.name,
                price: payload.price,
                stock: payload.stock,
                store_id: store.id,
                description: payload.description,
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
            }
        })

        if (payload.image) {
            const { data, error } = await supabase.storage.from("product-images").upload(payload.image.name, payload.image)

            if (error) throw new Error(error.message)

            const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(data.path)

            await prisma.product.update({
                where: {
                    id: product.id
                },
                data: {
                    image: publicUrl
                }
            })

        }

        return {
            error: false,
            message: "Product created successfully",
            payload: product
        }

    })
}
