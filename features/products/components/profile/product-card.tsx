import { ExternalLink } from 'lucide-react'

import { ProductBadges } from '@/features/products/components/profile/product-badges'
import { ProductImage } from '@/features/products/components/profile/product-image'
import { ProductInfo } from '@/features/products/components/profile/product-info'
import { ProductCardProps } from '@/features/profile/types'
import { navigateToProduct } from '@/features/profile/utils/product-navigation'
import { Button } from '@/features/shadcn/components/ui/button'
import { Card, CardContent } from '@/features/shadcn/components/ui/card'

function ProductCard({ likedProduct }: ProductCardProps) {
    const { product, created_at } = likedProduct

    return (
        <Card className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
                <div className="relative">
                    <ProductImage
                        src={product.image}
                        alt={product.name}
                    />
                    <ProductBadges isActive={product.is_active} />
                </div>

                <ProductInfo
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    storeName={product.store.name}
                    likedAt={created_at}
                />

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => navigateToProduct(product.store.slug, product.slug)}
                >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    Ver producto
                </Button>
            </CardContent>
        </Card>
    )
}

export { ProductCard }