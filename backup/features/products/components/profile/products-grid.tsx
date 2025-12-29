import { ProductCard } from '@/features/products/components/profile/product-card'
import { ProductsGridProps } from '@/features/profile/types'

export function ProductsGrid({ products }: ProductsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((like) => (
                <ProductCard
                    key={`${like.product.id}-${like.created_at}`}
                    likedProduct={like}
                />
            ))}
        </div>
    )
}