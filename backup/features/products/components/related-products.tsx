

import { getRelatedProductsAction } from "@/features/products/actions/get-related-products.action"
import { ProductListContainer } from "@/features/products/components/product-list-container"
import { ProductsCard } from "@/features/products/components/products-card"
import type { RelatedProductsProps } from "@/features/products/types"

import type { Product } from "@prisma/client"


async function RelatedProducts({ productId }: RelatedProductsProps) {
  const { payload } = await getRelatedProductsAction(productId)
  const { sameProductVariants = [], categoryProducts = [] } = payload || {}
  const sameList = sameProductVariants as unknown as Product[]
  const catList = categoryProducts as unknown as Product[]

  if (sameProductVariants.length === 0 && categoryProducts.length === 0) return null

  return (
    <div className="space-y-8">
      {sameList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Otras variantes</h3>
          <ProductListContainer>
            {sameList.map((p) => (
              <ProductsCard key={`same-${p.id}`} product={p} href={`/item/${p.id}`} />
            ))}
          </ProductListContainer>
        </div>
      )}

      {catList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Relacionados</h3>
          <ProductListContainer>
            {catList.map((p) => (
              <ProductsCard key={`cat-${p.id}`} product={p} href={`/item/${p.id}`} />
            ))}
          </ProductListContainer>
        </div>
      )}
    </div>
  )
}

export { RelatedProducts }


