"use server"

import { prisma } from "@/utils/prisma"

export async function selectRelatedProductsData(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
    /*   variants: { where: { is_deleted: false } }, */
      store: true,
    },
  })

  if (!product) {
    return {
      message: "Producto no encontrado",
      payload: { sameProductVariants: [], categoryProducts: [] },
      error: false,
    }
  }

  // For now we expose the same product (with its variants) under the block of "otras variantes"
  const sameProductVariants = [product]

  const categoryIds = product.categories.map((c) => c.id)

  const categoryProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      /* is_deleted: false, */
      categories: { some: { id: { in: categoryIds } } },
      store_id: product.store_id,
     /*  is_active: true, */
 /*      is_published: true, */
    },
   /*  include: { variants: { where: { is_deleted: false } } }, */
    take: 12,
  })

  return {
    message: "Productos relacionados obtenidos correctamente",
    payload: { sameProductVariants, categoryProducts },
    hasError: false,
  }
}


