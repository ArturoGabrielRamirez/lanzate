import ProductListContainer from "@/features/store-landing/components/product-list-container"
import ProductCard from "@/features/store-landing/components/product-card"
import { prisma } from "@/utils/prisma"
import type { Product, ProductVariant } from "@prisma/client"

type Props = {
  productId: number
}

async function getRelated(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
      variants: { where: { is_deleted: false } },
      store: true
    }
  })
  if (!product) return { sameProductVariants: [] as (Product & { variants?: ProductVariant[] })[], categoryProducts: [] as Product[] }

  // Other visible variants of the same product (as standalone items)
  const sameProductVariants = [product]

  // Other products in at least one of the same categories
  const categoryIds = product.categories.map(c => c.id)
  const categoryProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      is_deleted: false,
      categories: { some: { id: { in: categoryIds } } },
      store_id: product.store_id,
      is_active: true,
      is_published: true
    },
    include: { variants: { where: { is_deleted: false } } },
    take: 12
  })

  return { sameProductVariants, categoryProducts }
}

export default async function RelatedProducts({ productId }: Props) {
  const { sameProductVariants, categoryProducts } = await getRelated(productId)

  if (sameProductVariants.length === 0 && categoryProducts.length === 0) return null

  return (
    <div className="space-y-8">
      {sameProductVariants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Otras variantes</h3>
          <ProductListContainer>
            {sameProductVariants.map((p) => (
              <ProductCard key={`same-${p.id}`} product={p} href={`/item/${p.id}`} />
            ))}
          </ProductListContainer>
        </div>
      )}

      {categoryProducts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Relacionados</h3>
          <ProductListContainer>
            {categoryProducts.map((p) => (
              <ProductCard key={`cat-${p.id}`} product={p} href={`/item/${p.id}`} />
            ))}
          </ProductListContainer>
        </div>
      )}
    </div>
  )
}


