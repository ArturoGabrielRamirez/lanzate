'use client'

import { useLikedProducts } from '../hooks/use-liked-products'
import { UserLikedProductsProps } from '../types'
import { ProductSkeletonGrid } from './product-skeleton-grid'
import { ErrorState } from './error-state'
import { EmptyState } from './empty-state'
import { ProductsGrid } from './products-grid'

export function UserLikedProducts({ userId, isOwnProfile = false }: UserLikedProductsProps) {
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