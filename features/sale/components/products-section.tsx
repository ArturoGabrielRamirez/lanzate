"use client"

import { Package, AlertCircle, CheckCircle, Loader2, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shadcn/components/ui/card'
import { Badge } from '@/features/shadcn/components/ui/badge'
import { Button } from '@/features/shadcn/components/ui/button'
import BarcodeScannerUSB from './barcode-scanner-usb'
import type { ScannedProduct, ProductSearchResult } from '../types'

type ProductsSectionProps = {
  storeName: string
  scannedProducts: ScannedProduct[]
  searchResult: ProductSearchResult
  onProductScanned: (barcode: string) => void
  onAddToCart: (product: ScannedProduct) => void
}

function ProductsSection({ 
  storeName,
  scannedProducts, 
  searchResult, 
  onProductScanned, 
  onAddToCart 
}: ProductsSectionProps) {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  return (
    <Card className='area-[products] h-fit'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Package />
          Productos Escaneados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Scanner de códigos de barras */}
          <BarcodeScannerUSB onProductScanned={onProductScanned} />

          {/* Resultado de búsqueda */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Package className="size-4" />
              Resultado de Búsqueda
            </h4>
            
            {searchResult.isLoading && (
              <div className="flex items-center gap-2 p-4 text-center">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm text-muted-foreground">{searchResult.message}</span>
              </div>
            )}

            {!searchResult.isLoading && searchResult.error && (
              <div className="border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-red-800 dark:text-red-200">
                    {searchResult.message}
                  </span>
                </div>
              </div>
            )}

            {!searchResult.isLoading && !searchResult.error && searchResult.product && (
              <div className="border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    {searchResult.message}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{searchResult.product.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{formatPrice(searchResult.product.price)}</Badge>
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(searchResult.product!)}
                        disabled={searchResult.product.totalStock === 0}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                  {searchResult.product.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {searchResult.product.description}
                    </p>
                  )}
                  <div className="flex gap-2 text-xs">
                    <Badge variant="outline">SKU: {searchResult.product.sku}</Badge>
                    <Badge variant="outline">Stock: {searchResult.product.totalStock}</Badge>
                    {searchResult.product.categories.length > 0 && (
                      <Badge variant="outline">
                        {searchResult.product.categories[0].name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {!searchResult.isLoading && !searchResult.error && !searchResult.product && searchResult.message === '' && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-muted-foreground text-sm">
                  Escanea un código de barras para buscar productos
                </p>
              </div>
            )}
          </div>

          {/* Lista de productos escaneados */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-sm mb-3">
              {storeName} - Productos Encontrados ({scannedProducts.length})
            </h4>
            
            {scannedProducts.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {scannedProducts.map((product, index) => (
                  <div 
                    key={`${product.id}-${index}`} 
                    className="flex items-center justify-between p-3 bg-muted rounded border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                        <Badge variant="secondary">{formatPrice(product.price)}</Badge>
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>SKU: {product.sku}</span>
                        <span>•</span>
                        <span>Stock: {product.totalStock}</span>
                        {product.barcode && (
                          <>
                            <span>•</span>
                            <span>Barcode: {product.barcode}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="text-xs text-muted-foreground">
                        #{scannedProducts.length - index}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(product)}
                        disabled={product.totalStock === 0}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    No hay productos escaneados aún
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Los productos encontrados aparecerán aquí
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductsSection 