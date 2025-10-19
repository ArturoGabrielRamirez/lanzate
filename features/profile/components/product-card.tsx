import { ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductCardProps } from '../types'
import { ProductImage } from './product-image'
import { ProductBadges } from './product-badges'
import { ProductInfo } from './product-info'
import { navigateToProduct } from '../utils/product-navigation'

export function ProductCard({ likedProduct }: ProductCardProps) {
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