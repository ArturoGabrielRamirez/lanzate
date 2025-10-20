"use client"

import { Search, Loader2, Plus, AlertCircle, Package, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shadcn/components/ui/card'
import { Button } from '@/features/shadcn/components/ui/button'
import { Badge } from '@/features/shadcn/components/ui/badge'
import type { ScannedProduct, ProductSearchByNameResult, ProductSearchResult } from '../types'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

type ProductResultsProps = {
  searchResults: ProductSearchByNameResult
  barcodeResult: ProductSearchResult
  onAddToCart: (product: ScannedProduct) => void
  onClearResults?: () => void
}

function ProductResults({ searchResults, barcodeResult, onAddToCart, onClearResults }: ProductResultsProps) {
  const t = useTranslations('sale.product-results')

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
    <Card className={cn("lg:area-[results] lg:col-span-2 gap-2", !isLoading && !hasAnyResults && !searchResults.error && !barcodeResult.error && "hidden lg:block")}>
      <CardHeader className='gap-0'>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Package className="size-5" />
            {t('title')}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearResults}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
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
                  {t('scanned')}
                </Badge>
                <span className="text-sm font-medium">{t('barcode-found')}</span>
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
                      {t('units-remaining', {
                        count: barcodeResult.product!.totalStock,
                        units: barcodeResult.product!.totalStock > 1 ? t('units') : t('unit')
                      })}
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
                    {t('add')}
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
                  {t('search')}
                </Badge>
                <span className="text-sm font-medium">
                  {t('search-found', { count: searchResults.products.length })}
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
                          {t('units-remaining', {
                            count: product.totalStock,
                            units: product.totalStock > 1 ? t('units') : t('unit')
                          })}
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
                        {t('add')}
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
                  {t('try-again')}
                </p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !hasAnyResults && !searchResults.error && !barcodeResult.error && (
            <div className="hidden lg:flex items-center justify-center py-4 lg:py-0 lg:h-32 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm hidden lg:block">
                  {t('search-instruction')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('results-here')}
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