'use client'

import { useState, useEffect } from 'react'
import { Heart, Store, ExternalLink, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface LikedProduct {
  created_at: string
  product: {
    id: number
    name: string
    description?: string
    price: number
    image?: string
    slug: string
    is_active: boolean
    store: {
      id: number
      name: string
      logo?: string
      slug: string
    }
  }
}

interface UserLikedProductsProps {
  userId: number
  isOwnProfile?: boolean
}

export function UserLikedProducts({ userId, isOwnProfile = false }: UserLikedProductsProps) {
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
        setIsLoading(true)
        
        const response = await fetch(`/api/users/${userId}/liked-products?limit=20`)
        
        if (!response.ok) {
          throw new Error('Error al cargar los productos')
        }
        
        const data = await response.json()
        setLikedProducts(data.likedProducts || [])
        
      } catch (err) {
        console.error('Error fetching liked products:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLikedProducts()
  }, [userId])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Error al cargar los productos</p>
          <p className="text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (likedProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>
            {isOwnProfile 
              ? 'Aún no te gusta ningún producto'
              : 'Aún no le gusta ningún producto'
            }
          </p>
          <p className="text-sm">
            Los productos favoritos aparecerán aquí
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {likedProducts.map((like) => (
        <Card key={`${like.product.id}-${like.created_at}`} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            {/* Imagen del producto */}
            <div className="relative aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
              {like.product.image ? (
                <img
                  src={like.product.image}
                  alt={like.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-8 h-8" />
                </div>
              )}
              
              {/* Badge de corazón */}
              <div className="absolute top-2 right-2">
                <div className="bg-red-500 text-white p-1.5 rounded-full">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
              </div>

              {/* Badge si no está activo */}
              {!like.product.is_active && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    No disponible
                  </Badge>
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm leading-tight line-clamp-2">
                {like.product.name}
              </h4>
              
              {like.product.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {like.product.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">
                  ${like.product.price.toLocaleString()}
                </span>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Store className="w-3 h-3" />
                  <span className="truncate max-w-20">
                    {like.product.store.name}
                  </span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Le gustó {formatDistanceToNow(new Date(like.created_at), { 
                  addSuffix: true,
                  locale: es 
                })}
              </div>

              {/* Botón para ver producto */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  // Aquí puedes redirigir al producto
                  window.open(`/stores/${like.product.store.slug}/products/${like.product.slug}`, '_blank')
                }}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Ver producto
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}