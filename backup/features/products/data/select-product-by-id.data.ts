"use server"

/* import { ProductVariant } from "@prisma/client" */

import { prisma } from "@/utils/prisma"

export async function selectProductByIdData(id: number) {

    console.log("arreglar o depurar selectProductByIdData", id)
    
    const product = await prisma.product.findUnique({
        where: {
            id: id,
        },
        include: {
            categories: true,
            media: true,
            primary_media: true,
            variants: {
                where: {
                    is_active: true
                },
                include: {
                    stock_items: true,
                    media_items: true
                }
            }
        }
    })

     if (!product) throw new Error("Producto no encontrado")

    return {
        payload: product,
        hasError: false,
        message: "Detalles del producto obtenidos correctamente"
    }
}
