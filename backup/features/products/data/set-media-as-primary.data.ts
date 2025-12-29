// features/products/data/set-media-as-primary.data.ts
"use server"

import { prisma } from "@/utils/prisma"

export async function setMediaAsPrimaryData(
  productId: number,
  variantId: number | undefined,
  mediaId: number
): Promise<void> {
  if (variantId) {
    // ✅ Si hay variante, actualizar la variante
    // Primero quitar primary de todas las variantes del producto
   /*  await prisma.productVariant.updateMany({
      where: {
        product_id: productId,
      },
      data: {
        primary_media_id: null
      }
    })
 */
    // Luego marcar esta variante como primary
  /*   await prisma.productVariant.update({
      where: {
        id: variantId
      },
      data: {
        primary_media_id: mediaId
      }
    })
 */
    console.log(`✅ Media ${mediaId} set as primary for variant ${variantId}`)
  } else {
    // ✅ Si NO hay variante, actualizar el producto directamente
    await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        primary_media_id: mediaId
      }
    })

    console.log(`✅ Media ${mediaId} set as primary for product ${productId}`)
  }
}