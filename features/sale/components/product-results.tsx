"use client"

import { Search, Loader2, Plus, AlertCircle, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ScannedProduct, ProductSearchByNameResult, ProductSearchResult } from '../types'

type ProductResultsProps = {
  searchResults: ProductSearchByNameResult
  barcodeResult: ProductSearchResult
  onAddToCart: (product: ScannedProduct) => void
}

function ProductResults({ searchResults, barcodeResult, onAddToCart }: ProductResultsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const hasSearchResults = searchResults.products.length > 0
  const hasBarcodeResult = barcodeResult.product !== null
  const isLoading = searchResults.isLoading || barcodeResult.isLoading
  const hasAnyResults = hasSearchResults || hasBarcodeResult

  return (
    <Card className="lg:area-[results] lg:col-span-2">
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Package className="size-5" />
          Resultados de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  {searchResults.isLoading ? searchResults.message : barcodeResult.message}
                </span>
              </div>
            </div>
          )}

          {/* Barcode result */}
          {!isLoading && hasBarcodeResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Escaneado
                </Badge>
                <span className="text-sm font-medium">Producto encontrado por código de barras</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{barcodeResult.product!.name}</h4>
                  {barcodeResult.product!.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {barcodeResult.product!.description}
                    </p>
                  )}
                  <div className="flex gap-2 mt-1">
                    <p className='text-xs'>
                      {barcodeResult.product!.totalStock} {barcodeResult.product!.totalStock > 1 ? 'units' : 'unit'} remaining
                    </p>
                    {barcodeResult.product!.categories.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {barcodeResult.product!.categories[0].name}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-col">
                  <p className='font-bold text-lg'>
                    {formatPrice(barcodeResult.product!.price)}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => onAddToCart(barcodeResult.product!)}
                    disabled={barcodeResult.product!.totalStock === 0}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Search results */}
          {!isLoading && hasSearchResults && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Búsqueda
                </Badge>
                <span className="text-sm font-medium">
                  Se encontraron {searchResults.products.length} productos
                </span>
              </div>
              <div className="overflow-y-auto space-y-3 max-h-96">
                {searchResults.products.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-muted rounded border hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{product.name}</h4>
                      {product.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {product.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-1">
                        <p className='text-xs'>
                          {product.totalStock} {product.totalStock > 1 ? 'units' : 'unit'} remaining
                        </p>
                        {product.categories.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.categories[0].name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-col">
                      <p className='font-bold text-lg'>
                        {formatPrice(product.price)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(product)}
                        disabled={product.totalStock === 0}
                        className="h-8"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error states */}
          {!isLoading && (searchResults.error || barcodeResult.error) && !hasAnyResults && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-red-300 rounded-lg">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
                <p className="text-red-600 text-sm font-medium">
                  {searchResults.error ? searchResults.message : barcodeResult.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Intenta nuevamente con otros términos de búsqueda
                </p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !hasAnyResults && !searchResults.error && !barcodeResult.error && (
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">
                  Busca productos por nombre o escanea un código de barras
                </p>
                <p className="text-xs text-muted-foreground">
                  Los resultados aparecerán aquí
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductResults 