"use server"

import { prisma } from "@/utils/prisma"

export async function selectProductByIdAndSubdomainData(id: number, subdomain: string) {
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

    const product = await prisma.product.findFirst({
        where: {
            id: id,
          /*   is_active: true, */
       /*      is_published: true, */
           /*  is_deleted: false, */
            store: {
                subdomain: sanitizedSubdomain
            }
        },
        include: {
            categories: true,
            store: {
                select: {
                    id: true,
                    name: true,
                    subdomain: true,
                    customization: true
                }
            },
            primary_media: true,
            media: { orderBy: { sort_order: 'asc' }, take: 12 },
          /*   variants: {
                where: { is_deleted: false },
                include: {
                    color: true,
                    primary_media: true,
                    media: { orderBy: { sort_order: 'asc' }, take: 12 }
                },
                orderBy: { id: 'asc' }
            } */
        }
    })

    if (!product) throw new Error("Producto no encontrado o no disponible")

    return {
        payload: product,
        hasError: false,
        message: "Detalles del producto obtenidos correctamente"
    }
} 