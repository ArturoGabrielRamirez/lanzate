import ProductListContainer from "@/features/store-landing/components/product-list-container"
import ProductCard from "@/features/store-landing/components/product-card"
import { getRelatedProducts } from "@/features/subdomain/actions/getRelatedProducts"
import type { Product } from "@prisma/client"

type Props = {
  productId: number
}

export default async function RelatedProducts({ productId }: Props) {
  const { payload } = await getRelatedProducts(productId)
  const { sameProductVariants, categoryProducts } = payload
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
              <ProductCard key={`same-${p.id}`} product={p} href={`/item/${p.id}`} />
            ))}
          </ProductListContainer>
        </div>
      )}

      {catList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Relacionados</h3>
          <ProductListContainer>
            {catList.map((p) => (
              <ProductCard key={`cat-${p.id}`} product={p} href={`/item/${p.id}`} />
            ))}
          </ProductListContainer>
        </div>
      )}
    </div>
  )
}


