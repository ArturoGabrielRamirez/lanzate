'use client'

import { ProductSkeletonGrid } from '@/features/products/components/profile/product-skeleton-grid'
import { ProductsGrid } from '@/features/products/components/profile/products-grid'
import { EmptyState } from '@/features/profile/components/empty-state'
import { ErrorState } from '@/features/profile/components/error-state'
import { useLikedProducts } from '@/features/profile/hooks/use-liked-products'
import { UserLikedProductsProps } from '@/features/profile/types'

function UserLikedProducts({ userId, isOwnProfile = false }: UserLikedProductsProps) {
  const { likedProducts, isLoading, error } = useLikedProducts(userId)

  if (isLoading) {
    return <ProductSkeletonGrid count={6} />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (likedProducts.length === 0) {
    return (
      <EmptyState
        title={isOwnProfile
          ? 'Aún no te gusta ningún producto'
          : 'Aún no le gusta ningún producto'
        }
        description="Los productos favoritos aparecerán aquí"
      />
    )
  }

  return <ProductsGrid products={likedProducts} />
}

export { UserLikedProducts }