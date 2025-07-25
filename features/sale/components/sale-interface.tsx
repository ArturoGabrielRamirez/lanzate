"use client"

import { useState } from 'react'
import { Store, Package, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BarcodeScannerUSB from './barcode-scanner-usb'
import { searchProductByBarcode } from '../actions/search-product-by-barcode'
import type { ScannedProduct, ProductSearchResult } from '../types'

type SaleInterfaceProps = {
  storeName: string
  storeDescription?: string
  storeId: number
}

function SaleInterface({ storeName, storeDescription, storeId }: SaleInterfaceProps) {
  const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([])
  const [searchResult, setSearchResult] = useState<ProductSearchResult>({
    product: null,
    message: '',
    isLoading: false,
    error: false
  })

  const handleProductScanned = async (barcode: string) => {
    console.log('Producto escaneado:', barcode)
    
    // Establecer estado de carga
    setSearchResult({
      product: null,
      message: 'Buscando producto...',
      isLoading: true,
      error: false
    })

    try {
      // Buscar producto por código de barras
      const { error, payload, message } = await searchProductByBarcode(barcode, storeId)

      if (error || !payload) {
        setSearchResult({
          product: null,
          message: message || 'Producto no encontrado',
          isLoading: false,
          error: true
        })
      } else {
        // Producto encontrado
        setSearchResult({
          product: payload,
          message: 'Producto encontrado',
          isLoading: false,
          error: false
        })

        // Agregar a la lista de productos escaneados
        setScannedProducts(prev => [payload, ...prev])
      }
    } catch (error) {
      console.error('Error buscando producto:', error)
      setSearchResult({
        product: null,
        message: 'Error al buscar el producto',
        isLoading: false,
        error: true
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
      {/* Scanner de códigos de barras */}
      <div className="xl:col-span-1">
        <BarcodeScannerUSB 
          onProductScanned={handleProductScanned}
        />
      </div>
      
      {/* Área principal para productos escaneados y resultados */}
      <div className="xl:col-span-2 space-y-4">
        
        {/* Resultado de búsqueda actual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-4" />
              Resultado de Búsqueda
            </CardTitle>
            <CardDescription>
              Resultado del último código escaneado
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    <Badge variant="secondary">{formatPrice(searchResult.product.price)}</Badge>
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
          </CardContent>
        </Card>

        {/* Lista de productos escaneados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="size-4" />
              {storeName} - Productos Encontrados ({scannedProducts.length})
            </CardTitle>
            <CardDescription>
              {storeDescription || "Lista de productos escaneados exitosamente"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scannedProducts.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {scannedProducts.map((product, index) => (
                  <div 
                    key={`${product.id}-${index}`} 
                    className="flex items-center justify-between p-3 bg-muted rounded border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{product.name}</h4>
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
                    <div className="text-xs text-muted-foreground ml-2">
                      #{scannedProducts.length - index}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SaleInterface 